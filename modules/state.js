/**
 * ScriptFlow - State Management Module
 * Centralized state management with getter/setter API
 * 
 * @module modules/state
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // PRIVATE STATE OBJECT
    // ═══════════════════════════════════════════════════════════════════════════════

    const _state = {
        // API Settings
        settings: {
            claudeApiKey: '',
            geminiApiKey: '',
            aiModel: 'gemini-2.5-flash',
            veoModel: 'gemini-2.5-pro'
        },

        // Analyzer Data (from TITAN SCOPE)
        analyzerData: null,

        // Generated Content
        generatedScript: null,
        generatedPrompts: [],
        veoPromptsText: '',

        // UI State
        isGenerating: false,
        useAnalyzerData: true,
        styleManuallySet: false,

        // Batch Processing
        batchResults: {},
        totalBatches: 0,
        BATCH_SIZE: 10,

        // Assessment State
        lastAssessment: null,
        assessmentHistory: [],

        // Clone Mode (from YT Analyzer)
        cloneMode: '100', // Default: 100% Clone (verbatim transcript)

        // Parsed Analyzer Sections (14-section format)
        parsedSections: {
            verbatimTranscript: null,
            visualBreakdown: null,
            audioElements: null,
            onScreenGraphics: null,
            ctas: null,
            videoTechniques: null
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // STATE CHANGE LISTENERS
    // ═══════════════════════════════════════════════════════════════════════════════

    const _listeners = {};

    /**
     * Subscribe to state changes for a specific key
     * @param {string} key - State key to watch
     * @param {Function} callback - Function to call on change (receives newValue, oldValue)
     * @returns {Function} Unsubscribe function
     */
    function subscribe(key, callback) {
        if (!_listeners[key]) {
            _listeners[key] = [];
        }
        _listeners[key].push(callback);

        // Return unsubscribe function
        return function unsubscribe() {
            const index = _listeners[key].indexOf(callback);
            if (index > -1) {
                _listeners[key].splice(index, 1);
            }
        };
    }

    /**
     * Notify listeners of state change
     * @param {string} key - State key that changed
     * @param {*} newValue - New value
     * @param {*} oldValue - Previous value
     */
    function _notifyListeners(key, newValue, oldValue) {
        if (_listeners[key]) {
            _listeners[key].forEach(callback => {
                try {
                    callback(newValue, oldValue);
                } catch (error) {
                    console.error(`[State] Listener error for "${key}":`, error);
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Get a state value by key
     * @param {string} key - State key (supports dot notation: 'settings.apiKey')
     * @returns {*} State value
     */
    function getState(key) {
        if (!key) return { ..._state }; // Return shallow copy of entire state

        const keys = key.split('.');
        let value = _state;

        for (const k of keys) {
            if (value === undefined || value === null) return undefined;
            value = value[k];
        }

        return value;
    }

    /**
     * Set a state value
     * @param {string} key - State key (supports dot notation: 'settings.apiKey')
     * @param {*} value - New value
     */
    function setState(key, value) {
        if (!key) {
            console.warn('[State] Cannot set state without key');
            return;
        }

        const keys = key.split('.');
        const lastKey = keys.pop();
        let target = _state;

        // Navigate to nested object
        for (const k of keys) {
            if (target[k] === undefined) {
                target[k] = {};
            }
            target = target[k];
        }

        const oldValue = target[lastKey];
        target[lastKey] = value;

        // Notify listeners
        _notifyListeners(key, value, oldValue);

        // Also notify parent key listeners for nested changes
        if (keys.length > 0) {
            _notifyListeners(keys[0], getState(keys[0]), undefined);
        }
    }

    /**
     * Update multiple state values at once
     * @param {Object} updates - Object with key-value pairs to update
     */
    function updateState(updates) {
        if (typeof updates !== 'object') {
            console.warn('[State] updateState requires an object');
            return;
        }

        Object.entries(updates).forEach(([key, value]) => {
            setState(key, value);
        });
    }

    /**
     * Reset state to initial values
     * @param {string[]} [keys] - Optional array of keys to reset (resets all if not provided)
     */
    function resetState(keys) {
        const initialState = {
            analyzerData: null,
            generatedScript: null,
            generatedPrompts: [],
            veoPromptsText: '',
            isGenerating: false,
            styleManuallySet: false,
            batchResults: {},
            totalBatches: 0,
            lastAssessment: null,
            cloneMode: '100',
            parsedSections: {
                verbatimTranscript: null,
                visualBreakdown: null,
                audioElements: null,
                onScreenGraphics: null,
                ctas: null,
                videoTechniques: null
            }
        };

        if (keys && Array.isArray(keys)) {
            keys.forEach(key => {
                if (initialState.hasOwnProperty(key)) {
                    setState(key, initialState[key]);
                }
            });
        } else {
            Object.entries(initialState).forEach(([key, value]) => {
                setState(key, value);
            });
        }
    }

    /**
     * Get the raw state object (for debugging/legacy compatibility)
     * @returns {Object} Reference to state object
     */
    function getRawState() {
        return _state;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT TO TITAN NAMESPACE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.state = {
        get: getState,
        set: setState,
        update: updateState,
        reset: resetState,
        subscribe: subscribe,
        // Legacy compatibility - direct access to state object
        _raw: _state
    };

    // Also expose as TITAN.getState / TITAN.setState for convenience
    TITAN.getState = getState;
    TITAN.setState = setState;

    // Legacy global alias for backward compatibility
    window.state = _state;

    console.log('✅ TITAN.state loaded - centralized state management');

})(window.TITAN = window.TITAN || {});
