/**
 * ScriptFlow - Messaging Module
 * Cross-extension communication using Chrome messaging
 * 
 * @module modules/messaging
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // TITAN EXTENSION IDs (Discovery Protocol Ready)
    // ═══════════════════════════════════════════════════════════════════════════════

    const EXTENSION_IDS = {
        TITAN_SCOPE: null,   // Will be discovered or configured
        TITAN_INTEL: null,   // VidIQ Exporter
        TITAN_TEXT: null,    // Text extension
        TITAN_CORE: null     // Core extension
    };

    // Message types
    const MESSAGE_TYPES = {
        // Discovery
        PING: 'TITAN_PING',
        PONG: 'TITAN_PONG',
        DISCOVER: 'TITAN_DISCOVER',

        // Data transfer
        ANALYZER_DATA: 'ANALYZER_DATA',
        SCRIPT_GENERATED: 'SCRIPT_GENERATED',
        VEO_PROMPTS_READY: 'VEO_PROMPTS_READY',

        // Commands
        REQUEST_ANALYSIS: 'REQUEST_ANALYSIS',
        EXPORT_DATA: 'EXPORT_DATA'
    };

    // Message listeners
    const _listeners = new Map();

    // ═══════════════════════════════════════════════════════════════════════════════
    // INTERNAL MESSAGING (Same Extension)
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Send message to background script
     * @param {Object} message - Message to send
     * @returns {Promise<*>} Response from background
     */
    async function sendToBackground(message) {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(message, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Listen for messages from background or other parts of extension
     * @param {string} type - Message type to listen for
     * @param {Function} handler - Handler function (receives message, sender)
     * @returns {Function} Unsubscribe function
     */
    function onMessage(type, handler) {
        if (!_listeners.has(type)) {
            _listeners.set(type, []);
        }
        _listeners.get(type).push(handler);

        return function unsubscribe() {
            const handlers = _listeners.get(type);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        };
    }

    // Set up global message listener (wrapped for safety)
    try {
        if (chrome?.runtime?.onMessage) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message && message.type) {
                    const handlers = _listeners.get(message.type);
                    if (handlers && handlers.length > 0) {
                        // Call all handlers
                        let asyncResponse = false;
                        handlers.forEach(handler => {
                            const result = handler(message, sender);
                            if (result instanceof Promise) {
                                asyncResponse = true;
                                result.then(sendResponse).catch(err => {
                                    console.error('[Messaging] Handler error:', err);
                                    sendResponse({ error: err.message });
                                });
                            }
                        });
                        return asyncResponse; // Return true if async
                    }
                }
                return false;
            });
        }
    } catch (e) {
        console.warn('[Messaging] chrome.runtime.onMessage not available:', e.message);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXTERNAL MESSAGING (Cross-Extension)
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Send message to another TITAN extension
     * @param {string} extensionId - Target extension ID
     * @param {Object} message - Message to send
     * @returns {Promise<*>} Response from target extension
     */
    async function sendToExtension(extensionId, message) {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(extensionId, message, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Discover other TITAN extensions
     * @returns {Promise<Object>} Discovered extension IDs
     */
    async function discoverExtensions() {
        // This will be called to find other TITAN extensions
        // For now, return stored IDs
        console.log('[Messaging] Extension discovery not yet implemented');
        return EXTENSION_IDS;
    }

    /**
     * Register this extension for discovery
     * @param {Object} info - Extension info to broadcast
     */
    function registerForDiscovery(info) {
        // Listen for discovery pings
        onMessage(MESSAGE_TYPES.PING, (message, sender) => {
            return {
                type: MESSAGE_TYPES.PONG,
                extensionId: chrome.runtime.id,
                extensionName: 'TITAN_MIND',
                ...info
            };
        });

        console.log('[Messaging] Registered for discovery');
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // TITAN SCOPE INTEGRATION
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Handle analyzer data received from TITAN SCOPE
     * @param {Object} data - Analyzer data
     */
    function handleAnalyzerData(data) {
        if (!data) return;

        console.log('[Messaging] Received analyzer data');

        // Update state
        if (TITAN.state) {
            TITAN.state.set('analyzerData', data);
            TITAN.state.set('useAnalyzerData', true);

            // Parse sections if available
            if (data.sections) {
                TITAN.state.set('parsedSections', data.sections);
            }
        }

        // Trigger any registered handlers
        const handlers = _listeners.get(MESSAGE_TYPES.ANALYZER_DATA);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    // Listen for analyzer data from window messages (legacy support)
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'ANALYZER_DATA') {
            handleAnalyzerData(event.data.payload);
        }
    });

    // Also listen via chrome runtime
    onMessage(MESSAGE_TYPES.ANALYZER_DATA, (message) => {
        handleAnalyzerData(message.payload || message.data);
        return { received: true };
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // BROADCAST UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Broadcast message to all known TITAN extensions
     * @param {Object} message - Message to broadcast
     */
    async function broadcast(message) {
        const extensions = Object.values(EXTENSION_IDS).filter(Boolean);

        const results = await Promise.allSettled(
            extensions.map(id => sendToExtension(id, message))
        );

        return results;
    }

    /**
     * Notify that script generation is complete
     * @param {string} script - Generated script
     */
    function notifyScriptGenerated(script) {
        broadcast({
            type: MESSAGE_TYPES.SCRIPT_GENERATED,
            payload: script,
            timestamp: Date.now()
        });
    }

    /**
     * Notify that VEO prompts are ready
     * @param {string} prompts - Generated VEO prompts
     */
    function notifyVeoPromptsReady(prompts) {
        broadcast({
            type: MESSAGE_TYPES.VEO_PROMPTS_READY,
            payload: prompts,
            timestamp: Date.now()
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT TO TITAN NAMESPACE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.messaging = {
        // Internal messaging
        sendToBackground,
        onMessage,

        // External messaging
        sendToExtension,
        discoverExtensions,
        registerForDiscovery,
        broadcast,

        // TITAN integrations
        handleAnalyzerData,
        notifyScriptGenerated,
        notifyVeoPromptsReady,

        // Constants
        TYPES: MESSAGE_TYPES,
        EXTENSIONS: EXTENSION_IDS
    };

    console.log('✅ TITAN.messaging loaded - cross-extension communication');

})(window.TITAN = window.TITAN || {});
