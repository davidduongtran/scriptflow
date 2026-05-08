// Service Worker for TITANSYS MIND v7.0.0
// DO NOT add keep-alive mechanisms (alarms, offscreen, setInterval) — Chrome Web Store
// MV3 policy forbids them. The side panel is persistent; the SW wakes on demand.

console.log('🚀 TITANSYS MIND v7.0.0 Service Worker Started');

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
  console.log('✅ TITANSYS MIND v7.0.0 installed');
});

// ──────────────────────────────────────────────────────────────────────────────
// INTERNAL MESSAGES (from sidepanel.js)
// ──────────────────────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Internal message received:', request.action);

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

console.log('📍 Extension ID:', chrome.runtime.id);
