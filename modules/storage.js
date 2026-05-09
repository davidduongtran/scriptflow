/**
 * ScriptFlow - Storage Module
 * Chrome storage wrapper with async/await support
 * 
 * @module modules/storage
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // STORAGE KEYS
    // ═══════════════════════════════════════════════════════════════════════════════

    const STORAGE_KEYS = {
        SETTINGS: 'titan_settings',
        API_KEYS: 'titan_api_keys',
        PREFERENCES: 'titan_preferences',
        LAST_SESSION: 'titan_last_session',
        ASSESSMENT_HISTORY: 'titan_assessment_history'
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // CORE STORAGE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Get value from chrome.storage.local
     * @param {string|string[]} keys - Key(s) to retrieve
     * @returns {Promise<Object>} Stored values
     */
    async function get(keys) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.get(keys, (result) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(result);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Set value in chrome.storage.local
     * @param {Object} data - Key-value pairs to store
     * @returns {Promise<void>}
     */
    async function set(data) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.set(data, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Remove value(s) from chrome.storage.local
     * @param {string|string[]} keys - Key(s) to remove
     * @returns {Promise<void>}
     */
    async function remove(keys) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.remove(keys, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Clear all chrome.storage.local data
     * @returns {Promise<void>}
     */
    async function clear() {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.clear(() => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HIGH-LEVEL OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Load settings from storage and sync with state
     * @returns {Promise<Object>} Loaded settings
     */
    async function loadSettings() {
        try {
            const result = await get([STORAGE_KEYS.SETTINGS, STORAGE_KEYS.API_KEYS]);

            const settings = result[STORAGE_KEYS.SETTINGS] || {};
            const apiKeys = result[STORAGE_KEYS.API_KEYS] || {};

            // Merge with state
            if (TITAN.state) {
                TITAN.state.set('settings.claudeApiKey', apiKeys.claudeApiKey || '');
                TITAN.state.set('settings.geminiApiKey', apiKeys.geminiApiKey || '');
                TITAN.state.set('settings.aiModel', settings.aiModel || 'claude-sonnet-4-20250514');
                TITAN.state.set('settings.veoModel', settings.veoModel || 'gemini-2.5-flash');
            }

            console.log('[Storage] Settings loaded');
            return { settings, apiKeys };
        } catch (error) {
            console.error('[Storage] Failed to load settings:', error);
            return { settings: {}, apiKeys: {} };
        }
    }

    /**
     * Save current settings to storage
     * @returns {Promise<void>}
     */
    async function saveSettings() {
        try {
            const state = TITAN.state ? TITAN.state.get('settings') : {};

            await set({
                [STORAGE_KEYS.SETTINGS]: {
                    aiModel: state.aiModel,
                    veoModel: state.veoModel
                },
                [STORAGE_KEYS.API_KEYS]: {
                    claudeApiKey: state.claudeApiKey,
                    geminiApiKey: state.geminiApiKey
                }
            });

            console.log('[Storage] Settings saved');
        } catch (error) {
            console.error('[Storage] Failed to save settings:', error);
            throw error;
        }
    }

    /**
     * Save API keys securely
     * @param {Object} keys - { claudeApiKey, geminiApiKey }
     * @returns {Promise<void>}
     */
    async function saveApiKeys(keys) {
        try {
            await set({
                [STORAGE_KEYS.API_KEYS]: keys
            });

            // Update state
            if (TITAN.state) {
                if (keys.claudeApiKey !== undefined) {
                    TITAN.state.set('settings.claudeApiKey', keys.claudeApiKey);
                }
                if (keys.geminiApiKey !== undefined) {
                    TITAN.state.set('settings.geminiApiKey', keys.geminiApiKey);
                }
            }

            console.log('[Storage] API keys saved');
        } catch (error) {
            console.error('[Storage] Failed to save API keys:', error);
            throw error;
        }
    }

    /**
     * Load assessment history
     * @returns {Promise<Array>} Assessment history
     */
    async function loadAssessmentHistory() {
        try {
            const result = await get(STORAGE_KEYS.ASSESSMENT_HISTORY);
            const history = result[STORAGE_KEYS.ASSESSMENT_HISTORY] || [];

            if (TITAN.state) {
                TITAN.state.set('assessmentHistory', history);
            }

            return history;
        } catch (error) {
            console.error('[Storage] Failed to load assessment history:', error);
            return [];
        }
    }

    /**
     * Save assessment to history
     * @param {Object} assessment - Assessment data to save
     * @returns {Promise<void>}
     */
    async function saveAssessment(assessment) {
        try {
            const history = await loadAssessmentHistory();

            // Add timestamp if not present
            if (!assessment.timestamp) {
                assessment.timestamp = Date.now();
            }

            // Add to beginning of history (newest first)
            history.unshift(assessment);

            // Keep only last 50 assessments
            const trimmedHistory = history.slice(0, 50);

            await set({
                [STORAGE_KEYS.ASSESSMENT_HISTORY]: trimmedHistory
            });

            if (TITAN.state) {
                TITAN.state.set('assessmentHistory', trimmedHistory);
                TITAN.state.set('lastAssessment', assessment);
            }

            console.log('[Storage] Assessment saved');
        } catch (error) {
            console.error('[Storage] Failed to save assessment:', error);
            throw error;
        }
    }

    /**
     * Save last session state for recovery
     * @param {Object} sessionData - Session data to save
     * @returns {Promise<void>}
     */
    async function saveSession(sessionData) {
        try {
            await set({
                [STORAGE_KEYS.LAST_SESSION]: {
                    ...sessionData,
                    savedAt: Date.now()
                }
            });
            console.log('[Storage] Session saved');
        } catch (error) {
            console.error('[Storage] Failed to save session:', error);
        }
    }

    /**
     * Load last session state
     * @returns {Promise<Object|null>} Last session data or null
     */
    async function loadSession() {
        try {
            const result = await get(STORAGE_KEYS.LAST_SESSION);
            return result[STORAGE_KEYS.LAST_SESSION] || null;
        } catch (error) {
            console.error('[Storage] Failed to load session:', error);
            return null;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT TO TITAN NAMESPACE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.storage = {
        // Core operations
        get,
        set,
        remove,
        clear,

        // High-level operations
        loadSettings,
        saveSettings,
        saveApiKeys,
        loadAssessmentHistory,
        saveAssessment,
        saveSession,
        loadSession,

        // Storage keys reference
        KEYS: STORAGE_KEYS
    };

    console.log('✅ TITAN.storage loaded - chrome.storage wrapper');

})(window.TITAN = window.TITAN || {});
