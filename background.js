// Service Worker for FinRich Script v1.6.4

console.log('🚀 FinRich Script v1.6.4 Service Worker Started');

// Handle icon click - Open side panel
chrome.action.onClicked.addListener(async (tab) => {
  console.log('✅ Icon clicked - Opening side panel...');

  try {
    await chrome.sidePanel.open({ tabId: tab.id });
    console.log('✅ Side panel opened');
  } catch (error) {
    console.error('❌ Error opening side panel:', error);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ FinRich Script v1.6.4 installed');
});

// ──────────────────────────────────────────────────────────────────────────────
// KEEP-ALIVE SYSTEM v2.0 (Uses chrome.alarms - survives service worker restarts)
// chrome.alarms is the ONLY reliable way to keep MV3 service workers alive
// ──────────────────────────────────────────────────────────────────────────────

const KEEP_ALIVE_ALARM_NAME = 'finrich-keep-alive';
const KEEP_ALIVE_INTERVAL_MINUTES = 0.4; // ~24 seconds (minimum is 0.5 min in production)

// Create or update the keep-alive alarm
async function setupKeepAliveAlarm() {
  try {
    // Clear any existing alarm first
    await chrome.alarms.clear(KEEP_ALIVE_ALARM_NAME);

    // Create new alarm - periodInMinutes must be at least 0.5 in production
    // But for dev, Chrome allows smaller values
    await chrome.alarms.create(KEEP_ALIVE_ALARM_NAME, {
      periodInMinutes: KEEP_ALIVE_INTERVAL_MINUTES,
      delayInMinutes: 0.1 // Start quickly after install
    });

    console.log('✅ Keep-alive alarm created (every ~24s)');
  } catch (error) {
    console.error('❌ Failed to create keep-alive alarm:', error);
  }
}

// Listen for alarm events (this wakes up the service worker!)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === KEEP_ALIVE_ALARM_NAME) {
    const now = new Date().toLocaleTimeString('en-US', { hour12: true });
    console.log(`💗 Keep-alive ping at ${now} (alarm-based)`);

    // Perform a trivial chrome API call to ensure we're truly active
    chrome.storage.local.get('keepAliveCount', (result) => {
      const count = (result.keepAliveCount || 0) + 1;
      chrome.storage.local.set({
        keepAliveCount: count,
        lastKeepAlive: new Date().toISOString()
      });
    });
  }
});

// Also use offscreen document for additional persistence (Chrome 109+)
// This creates a hidden document that helps keep the service worker alive
async function setupOffscreenKeepAlive() {
  if (typeof chrome.offscreen === 'undefined') {
    console.log('ℹ️ Offscreen API not available (Chrome 109+ required)');
    return;
  }

  try {
    // Check if we already have an offscreen document
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });

    if (existingContexts.length === 0) {
      // Create offscreen document for keep-alive
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['BLOBS'], // Required reason
        justification: 'Keep service worker alive for background operations'
      });
      console.log('✅ Offscreen document created for keep-alive');
    }
  } catch (error) {
    // Offscreen document might already exist or not be supported
    console.log('ℹ️ Offscreen keep-alive:', error.message);
  }
}

// Initialize keep-alive systems
setupKeepAliveAlarm();
setupOffscreenKeepAlive();

// Also use a fallback setInterval for immediate responsiveness
// (runs only while service worker is already active)
setInterval(() => {
  const now = new Date().toLocaleTimeString('en-US', { hour12: true });
  console.log(`💓 Heartbeat at ${now}`);
}, 20000); // Every 20 seconds

console.log('✅ Keep-alive system v2.0 initialized (alarm + heartbeat)');


// ──────────────────────────────────────────────────────────────────────────────
// INTERNAL MESSAGES (from sidepanel.js)
// ──────────────────────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Internal message received:', request.action);

  // ✅ HANDLE CLAUDE API CALLS (from suggestions feature)
  if (request.action === 'callClaudeAPI') {
    console.log('🧠 Processing Claude API request...');

    if (!request.apiKey) {
      sendResponse({ success: false, error: 'No Claude API key provided.' });
      return true;
    }

    if (!request.apiKey.startsWith('sk-ant-')) {
      sendResponse({ success: false, error: 'Invalid API key format.' });
      return true;
    }

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': request.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: request.model || 'claude-sonnet-4-20250514',
        max_tokens: request.maxTokens || 500,
        messages: [{ role: 'user', content: request.prompt }]
      })
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown'}`);
        }
        return response.json();
      })
      .then(data => {
        sendResponse({ success: true, text: data.content[0].text });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }

  if (request.action === 'getAnalyzerData') {
    chrome.storage.local.get('analyzerData', (result) => {
      sendResponse({ data: result.analyzerData });
    });
    return true;
  }

  if (request.action === 'storeAnalyzerData') {
    chrome.storage.local.set({ analyzerData: request.data }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// EXTERNAL MESSAGES (from FinRich Scan)
// ──────────────────────────────────────────────────────────────────────────────

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.log('📨 EXTERNAL message from:', sender.id, '| Type:', request.type);

    // ✅ HANDLE FINRICH SCAN / YOUTUBE ANALYZER FORMAT
    if (request.type === 'analyzerDataReceived' || request.source === 'YouTube Analyzer' || request.source?.includes('FinRich Scan')) {
      console.log('✅ FinRich Scan data received!');

      chrome.storage.local.set(
        {
          analyzerData: request.data,
          analyzerDataReceivedAt: new Date().toLocaleString(),
          analyzerDataSourceExtension: sender.id,
          analyzerDataSource: request.source || 'FinRich Scan',
          analyzerDataTimestamp: request.timestamp || Date.now()
        },
        () => {
          console.log('✅ Data stored');
          sendResponse({
            received: true,
            success: true,
            message: 'Data received successfully',
            timestamp: Date.now()
          });

          // Notify sidepanel - broadcast to all extension contexts
          setTimeout(() => {
            console.log('📢 Broadcasting analyzerDataReceived to sidepanel...');

            // Try to send message to all extension views (including sidepanel)
            chrome.runtime.sendMessage(
              {
                action: 'analyzerDataReceived',
                data: request.data
              },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.log('ℹ️ Message not delivered (sidepanel may not be open):', chrome.runtime.lastError.message);
                } else {
                  console.log('✅ Message delivered to sidepanel');
                }
              }
            );
          }, 100);
        }
      );
      return true;
    }

    // ✅ HANDLE SCRIPT FROM SCRIPT WRITER (for FlowAutomate compatibility)
    if (request.type === 'scriptFromScriptWriter' || request.action === 'sendScript') {
      console.log('✅ Script data received!');

      chrome.storage.local.set(
        {
          scriptFromScriptWriter: request.data,
          scriptReceivedAt: new Date().toLocaleString()
        },
        () => {
          sendResponse({ success: true, received: true });
        }
      );
      return true;
    }

    // ✅ HANDLE PING
    if (request.type === 'ping' || request.action === 'ping') {
      sendResponse({
        success: true,
        received: true,
        message: 'FinRich Script v1.6.4 is running',
        extensionId: chrome.runtime.id,
        version: '1.6.4'
      });
      return;
    }

    // Unknown
    sendResponse({ success: false, message: 'Unknown message type' });
  }
);

console.log('✅ External message listener registered');
console.log('📍 Extension ID:', chrome.runtime.id);

// ──────────────────────────────────────────────────────────────────────────────
// DATA VALIDATION (Data Contract v1.0)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Validate received analyzer data from YT Analyzer
 * Ensures compliance with SHARED_DATA_CONTRACT.md v1.0
 * @param {object} data - Received analyzer data
 * @returns {object} { valid: boolean, errors: string[], warnings: string[], fieldCount: number }
 */
function validateReceivedData(data) {
  const errors = [];
  const warnings = [];

  if (!data) {
    console.error('❌ No data received');
    return { valid: false, errors: ['No data received'], warnings, fieldCount: 0 };
  }

  const fieldCount = Object.keys(data).length;

  // Check for metadata
  const hasMetadata = data.metadata && typeof data.metadata === 'object';
  const hasMetadataTitle = hasMetadata && data.metadata.videoTitle;

  // Check for direct title field (backward compatibility)
  const hasDirectTitle = data.videoTitle;

  // Check for raw analysis
  const hasRawAnalysis = data.rawAnalysis && data.rawAnalysis.length > 0;

  // Validate required fields
  if (!hasMetadataTitle && !hasDirectTitle) {
    errors.push('Missing videoTitle (checked both metadata.videoTitle and direct videoTitle)');
  }

  if (!hasRawAnalysis) {
    warnings.push('Missing rawAnalysis field');
  }

  // Check for recommended fields
  const recommendedFields = [
    'audience',
    'openingHook',
    'contentStructure',
    'curiosityGaps',
    'videoOutline',
    'titleAnalysis'
  ];

  const presentRecommended = recommendedFields.filter(field => data[field]);
  const missingRecommended = recommendedFields.filter(field => !data[field]);

  if (missingRecommended.length > 0) {
    warnings.push(`Missing ${missingRecommended.length}/${recommendedFields.length} recommended fields`);
    warnings.push(`⚠️ Script quality may be reduced. Missing: ${missingRecommended.join(', ')}`);
  }

  // Data quality assessment
  if (fieldCount < 5) {
    warnings.push(`Low field count: ${fieldCount} (expected 10+ for optimal quality)`);
  }

  const valid = errors.length === 0;

  // Log results
  if (valid) {
    console.log('✅ Received data is valid');
    console.log(`📊 Field count: ${fieldCount}`);
    console.log(`📋 Recommended fields: ${presentRecommended.length}/${recommendedFields.length} present`);

    if (warnings.length > 0) {
      console.warn('⚠️ Data quality warnings:', warnings);
    }
  } else {
    console.error('❌ Received data validation failed:', errors);
    if (warnings.length > 0) {
      console.warn('⚠️ Additional warnings:', warnings);
    }
  }

  return { valid, errors, warnings, fieldCount };
}
