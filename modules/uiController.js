/**
 * ScriptFlow - UI Controller Module
 * DOM manipulation, event handling, and UI state management
 * 
 * @module modules/uiController
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // TAB MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Switch to a specific tab
     * @param {string} tabName - Tab identifier
     */
    function switchTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        // Activate selected tab
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(`${tabName}Tab`);

        if (selectedBtn) selectedBtn.classList.add('active');
        if (selectedContent) {
            selectedContent.classList.add('active');
            selectedContent.style.display = 'block';
        }

        console.log(`📑 Switched to tab: ${tabName}`);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Show notification message
     * @param {string} message - Notification text
     * @param {string} type - 'success' | 'error' | 'warning' | 'info' | 'loading'
     * @param {number} duration - Duration in ms (0 for no auto-hide)
     */
    function showNotification(message, type = 'info', duration = 3000) {
        const statusEl = document.getElementById('statusMessage');
        if (!statusEl) {
            console.log(`[${type.toUpperCase()}] ${message}`);
            return;
        }

        // Clear existing classes
        statusEl.className = 'status-message';
        statusEl.classList.add(`status-${type}`);
        statusEl.textContent = message;
        statusEl.style.display = 'block';

        // Auto-hide after duration (except for loading)
        if (duration > 0 && type !== 'loading') {
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, duration);
        }
    }

    /**
     * Hide notification
     */
    function hideNotification() {
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) {
            statusEl.style.display = 'none';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // VEO LOG
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Add entry to VEO log
     * @param {string} message - Log message
     * @param {string} type - 'info' | 'success' | 'warning' | 'error'
     */
    function veoLog(message, type = 'info') {
        const logEl = document.getElementById('veoLog');
        if (!logEl) {
            console.log(`[VEO ${type.toUpperCase()}] ${message}`);
            return;
        }

        const timestamp = new Date().toLocaleTimeString();
        const typeIcon = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        }[type] || 'ℹ️';

        const entry = document.createElement('div');
        entry.className = `veo-log-entry veo-log-${type}`;
        entry.innerHTML = `<span class="log-time">${timestamp}</span> ${typeIcon} ${message}`;

        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;
    }

    /**
     * Clear VEO log
     */
    function clearVeoLog() {
        const logEl = document.getElementById('veoLog');
        if (logEl) {
            logEl.innerHTML = '';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PROGRESS BAR
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Show progress bar
     * @param {string} containerId - Container element ID
     * @param {string} barId - Progress bar element ID
     * @param {string} percentId - Percentage text element ID
     */
    function showProgressBar(containerId, barId, percentId) {
        const container = document.getElementById(containerId);
        const bar = document.getElementById(barId);
        const percent = document.getElementById(percentId);

        if (container) container.style.display = 'block';
        if (bar) bar.style.width = '0%';
        if (percent) percent.textContent = '0%';
    }

    /**
     * Update progress bar
     * @param {string} barId - Progress bar element ID
     * @param {string} percentId - Percentage text element ID
     * @param {number} value - Progress value (0-100)
     */
    function updateProgressBar(barId, percentId, value) {
        const bar = document.getElementById(barId);
        const percent = document.getElementById(percentId);

        const clampedValue = Math.min(100, Math.max(0, value));

        if (bar) bar.style.width = `${clampedValue}%`;
        if (percent) percent.textContent = `${Math.round(clampedValue)}%`;
    }

    /**
     * Hide progress bar
     * @param {string} containerId - Container element ID
     */
    function hideProgressBar(containerId) {
        const container = document.getElementById(containerId);
        if (container) container.style.display = 'none';
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // DISPLAY HELPERS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Display generated script in UI
     * @param {Object} script - Script object
     */
    function displayScript(script) {
        const outputEl = document.getElementById('scriptOutput');
        if (!outputEl) {
            console.log('Script generated:', script.wordCount, 'words');
            return;
        }

        outputEl.innerHTML = `
      <div class="script-header">
        <h3>${script.title || 'Generated Script'}</h3>
        <div class="script-meta">
          <span>📝 ${script.wordCount} words</span>
          <span>🎬 ${script.targetLength}</span>
          <span>🔄 ${script.cloneMode}</span>
          <span>⏰ ${script.generatedAt}</span>
        </div>
      </div>
      <div class="script-content">${formatScriptForDisplay(script.fullScript)}</div>
    `;
    }

    /**
     * Format script text for HTML display
     * @param {string} scriptText - Raw script text
     * @returns {string} HTML formatted text
     */
    function formatScriptForDisplay(scriptText) {
        if (!scriptText) return '';

        return scriptText
            // Headers
            .replace(/^# (.+)$/gm, '<h2>$1</h2>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            // Bold
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Code blocks
            .replace(/```([^`]+)```/gs, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            // Wrap in paragraph
            .replace(/^(.+)$/, '<p>$1</p>');
    }

    /**
     * Display VEO prompts in UI
     * @param {Object} promptData - Generated prompt data
     */
    function displayVeoPrompts(promptData) {
        const outputEl = document.getElementById('veoPromptsOutput');
        if (!outputEl) {
            console.log('VEO prompts generated:', promptData.totalClips, 'clips');
            return;
        }

        const formattedOutput = TITAN.veoPrompts?.formatForDisplay(promptData) || '';
        outputEl.innerHTML = formatScriptForDisplay(formattedOutput);

        // Update state
        if (TITAN.state) {
            TITAN.state.set('veoPromptsText', formattedOutput);
            TITAN.state.set('generatedPrompts', promptData.scenes);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FORM HELPERS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Get form values as object
     * @param {string} formId - Form element ID
     * @returns {Object} Form values
     */
    function getFormValues(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};

        const values = {};
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.id) {
                if (input.type === 'checkbox') {
                    values[input.id] = input.checked;
                } else {
                    values[input.id] = input.value;
                }
            }
        });

        return values;
    }

    /**
     * Set form values from object
     * @param {string} formId - Form element ID
     * @param {Object} values - Values to set
     */
    function setFormValues(formId, values) {
        const form = document.getElementById(formId);
        if (!form) return;

        Object.entries(values).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = !!value;
                } else {
                    input.value = value;
                }
            }
        });
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('📋 Copied to clipboard!', 'success', 2000);
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            showNotification('❌ Copy failed', 'error');
            return false;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ELEMENT HELPERS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Show element
     * @param {string|Element} elementOrId - Element or ID
     */
    function showElement(elementOrId) {
        const el = typeof elementOrId === 'string'
            ? document.getElementById(elementOrId)
            : elementOrId;
        if (el) el.style.display = '';
    }

    /**
     * Hide element
     * @param {string|Element} elementOrId - Element or ID
     */
    function hideElement(elementOrId) {
        const el = typeof elementOrId === 'string'
            ? document.getElementById(elementOrId)
            : elementOrId;
        if (el) el.style.display = 'none';
    }

    /**
     * Toggle element visibility
     * @param {string|Element} elementOrId - Element or ID
     */
    function toggleElement(elementOrId) {
        const el = typeof elementOrId === 'string'
            ? document.getElementById(elementOrId)
            : elementOrId;
        if (el) {
            el.style.display = el.style.display === 'none' ? '' : 'none';
        }
    }

    /**
     * Enable/disable button
     * @param {string} buttonId - Button ID
     * @param {boolean} enabled - Enable state
     */
    function setButtonEnabled(buttonId, enabled) {
        const btn = document.getElementById(buttonId);
        if (btn) btn.disabled = !enabled;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Initialize UI event listeners
     */
    function initEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                if (tabName) switchTab(tabName);
            });
        });

        // Dropdown character counters
        document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
            const counter = textarea.parentElement?.querySelector('.char-count');
            if (counter) {
                const updateCount = () => {
                    counter.textContent = `${textarea.value.length}/${textarea.maxLength}`;
                };
                textarea.addEventListener('input', updateCount);
                updateCount();
            }
        });

        console.log('✅ UI event listeners initialized');
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT TO TITAN NAMESPACE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.ui = {
        // Tabs
        switchTab,

        // Notifications
        showNotification,
        hideNotification,
        veoLog,
        clearVeoLog,

        // Progress
        showProgressBar,
        updateProgressBar,
        hideProgressBar,

        // Display
        displayScript,
        displayVeoPrompts,
        formatScriptForDisplay,

        // Forms
        getFormValues,
        setFormValues,
        copyToClipboard,

        // Elements
        showElement,
        hideElement,
        toggleElement,
        setButtonEnabled,

        // Init
        initEventListeners
    };

    console.log('✅ TITAN.ui loaded - UI controller');

})(window.TITAN = window.TITAN || {});
