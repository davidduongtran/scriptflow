/**
 * ScriptFlow - API Client Module
 * Handles Gemini and Claude API calls with rate limiting and retry logic
 * 
 * @module modules/apiClient
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // API CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════════

    const API_CONFIG = {
        claude: {
            baseUrl: 'https://api.anthropic.com/v1/messages',
            version: '2023-06-01',
            models: {
                // Claude 4.5 (Latest)
                'claude-opus-4-5-20251101': { name: 'Claude Opus 4.5', maxTokens: 8192 },
                'claude-sonnet-4-5-20250929': { name: 'Claude Sonnet 4.5', maxTokens: 8192 },
                'claude-haiku-4-5-20251001': { name: 'Claude Haiku 4.5', maxTokens: 8192 },
                // Claude 4
                'claude-opus-4-20250514': { name: 'Claude Opus 4', maxTokens: 8192 },
                'claude-sonnet-4-20250514': { name: 'Claude Sonnet 4', maxTokens: 8192 },
                // Claude 3.5
                'claude-3-5-opus-20240620': { name: 'Claude Opus 3.5', maxTokens: 8192 },
                'claude-3-5-sonnet-20240620': { name: 'Claude Sonnet 3.5', maxTokens: 8192 },
                'claude-3-5-haiku-20241022': { name: 'Claude Haiku 3.5', maxTokens: 8192 }
            }
        },
        gemini: {
            baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
            models: {
                'gemini-exp-1206': { name: 'Gemini 3.0 Pro', maxTokens: 8192 },
                'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', maxTokens: 8192 },
                'gemini-2.5-flash-lite': { name: 'Gemini 2.5 Flash-Lite', maxTokens: 8192 },
                'gemini-2.5-pro': { name: 'Gemini 2.5 Pro', maxTokens: 8192 }
            }
        }
    };

    // Rate limiting
    const _requestQueue = [];
    let _isProcessingQueue = false;
    const MIN_REQUEST_INTERVAL_MS = 500; // Minimum time between requests

    // ═══════════════════════════════════════════════════════════════════════════════
    // REQUEST QUEUE & RATE LIMITING
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Add request to queue and process
     * @param {Function} requestFn - Async function that makes the request
     * @returns {Promise<*>} Request result
     */
    function queueRequest(requestFn) {
        return new Promise((resolve, reject) => {
            _requestQueue.push({ requestFn, resolve, reject });
            processQueue();
        });
    }

    /**
     * Process queued requests with rate limiting
     */
    async function processQueue() {
        if (_isProcessingQueue || _requestQueue.length === 0) return;

        _isProcessingQueue = true;

        while (_requestQueue.length > 0) {
            const { requestFn, resolve, reject } = _requestQueue.shift();

            try {
                const result = await requestFn();
                resolve(result);
            } catch (error) {
                reject(error);
            }

            // Rate limiting delay
            if (_requestQueue.length > 0) {
                await new Promise(r => setTimeout(r, MIN_REQUEST_INTERVAL_MS));
            }
        }

        _isProcessingQueue = false;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // RETRY LOGIC
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Retry a function with exponential backoff
     * @param {Function} fn - Async function to retry
     * @param {number} maxRetries - Maximum retry attempts
     * @param {number} baseDelay - Base delay in ms
     * @returns {Promise<*>} Function result
     */
    async function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                // Don't retry on client errors (4xx)
                if (error.status >= 400 && error.status < 500 && error.status !== 429) {
                    throw error;
                }

                // Retry on rate limit (429) or server errors (5xx)
                if (attempt < maxRetries) {
                    const delay = baseDelay * Math.pow(2, attempt);
                    console.log(`[API] Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }

        throw lastError;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CLAUDE API
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Call Claude API
     * @param {Object} options - Request options
     * @param {string} options.prompt - User prompt
     * @param {string} [options.system] - System prompt
     * @param {string} [options.model] - Model to use
     * @param {number} [options.maxTokens] - Max tokens in response
     * @param {number} [options.temperature] - Temperature (0-1)
     * @returns {Promise<string>} Response text
     */
    async function callClaude({ prompt, system, model, maxTokens, temperature = 0.7 }) {
        const apiKey = TITAN.state?.get('settings.claudeApiKey');
        if (!apiKey) {
            throw new Error('Claude API key not configured');
        }

        const selectedModel = model || TITAN.state?.get('settings.aiModel') || 'claude-sonnet-4-20250514';
        const modelConfig = API_CONFIG.claude.models[selectedModel] || API_CONFIG.claude.models['claude-sonnet-4-20250514'];

        return queueRequest(() => withRetry(async () => {
            const response = await fetch(API_CONFIG.claude.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': API_CONFIG.claude.version
                },
                body: JSON.stringify({
                    model: selectedModel,
                    max_tokens: maxTokens || modelConfig.maxTokens,
                    temperature,
                    system: system || undefined,
                    messages: [
                        { role: 'user', content: prompt }
                    ]
                })
            });

            if (!response.ok) {
                const error = new Error(`Claude API error: ${response.status}`);
                error.status = response.status;
                try {
                    error.details = await response.json();
                } catch { }
                throw error;
            }

            const data = await response.json();
            return data.content[0].text;
        }));
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GEMINI API
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Call Gemini API
     * @param {Object} options - Request options
     * @param {string} options.prompt - User prompt
     * @param {string} [options.system] - System instruction
     * @param {string} [options.model] - Model to use
     * @param {number} [options.maxTokens] - Max tokens in response
     * @param {number} [options.temperature] - Temperature (0-1)
     * @returns {Promise<string>} Response text
     */
    async function callGemini({ prompt, system, model, maxTokens, temperature = 0.7 }) {
        const apiKey = TITAN.state?.get('settings.geminiApiKey');
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }

        const selectedModel = model || TITAN.state?.get('settings.veoModel') || 'gemini-2.5-flash';
        const modelConfig = API_CONFIG.gemini.models[selectedModel] || API_CONFIG.gemini.models['gemini-2.5-flash'];

        return queueRequest(() => withRetry(async () => {
            // Google Gemini REST API only accepts the key as a URL query param — no header alternative exists
            const url = `${API_CONFIG.gemini.baseUrl}/${selectedModel}:generateContent?key=${apiKey}`;

            const requestBody = {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature,
                    maxOutputTokens: maxTokens || modelConfig.maxTokens
                }
            };

            // Add system instruction if provided
            if (system) {
                requestBody.systemInstruction = {
                    parts: [{ text: system }]
                };
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const error = new Error(`Gemini API error: ${response.status}`);
                error.status = response.status;
                try {
                    error.details = await response.json();
                } catch { }
                throw error;
            }

            const data = await response.json();

            // Extract text from Gemini response
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }

            throw new Error('Unexpected Gemini response format');
        }));
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // UNIFIED API
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Call the currently configured AI (auto-selects based on settings)
     * @param {Object} options - Request options
     * @param {string} options.prompt - User prompt
     * @param {string} [options.system] - System prompt
     * @param {string} [options.preferredApi] - 'claude' or 'gemini'
     * @param {number} [options.maxTokens] - Max tokens
     * @param {number} [options.temperature] - Temperature
     * @returns {Promise<string>} Response text
     */
    async function call(options) {
        const { preferredApi = 'claude', ...rest } = options;

        // Check which APIs are available
        const hasClaudeKey = !!TITAN.state?.get('settings.claudeApiKey');
        const hasGeminiKey = !!TITAN.state?.get('settings.geminiApiKey');

        if (!hasClaudeKey && !hasGeminiKey) {
            throw new Error('No API keys configured. Please add Claude or Gemini API key in Settings.');
        }

        // Use preferred API if available, otherwise fall back
        if (preferredApi === 'claude' && hasClaudeKey) {
            return callClaude(rest);
        } else if (preferredApi === 'gemini' && hasGeminiKey) {
            return callGemini(rest);
        } else if (hasClaudeKey) {
            return callClaude(rest);
        } else {
            return callGemini(rest);
        }
    }

    /**
     * Check API connectivity
     * @param {string} api - 'claude' or 'gemini'
     * @returns {Promise<boolean>} Whether API is reachable
     */
    async function testConnection(api) {
        try {
            if (api === 'claude') {
                await callClaude({ prompt: 'Say "OK"', maxTokens: 10 });
            } else {
                await callGemini({ prompt: 'Say "OK"', maxTokens: 10 });
            }
            return true;
        } catch (error) {
            console.error(`[API] ${api} connection test failed:`, error);
            return false;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT TO TITAN NAMESPACE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.api = {
        // Specific APIs
        claude: callClaude,
        gemini: callGemini,

        // Unified API
        call,

        // Utilities
        testConnection,
        queueRequest,

        // Configuration reference
        CONFIG: API_CONFIG
    };

    console.log('✅ TITAN.api loaded - Claude & Gemini API client');

})(window.TITAN = window.TITAN || {});
