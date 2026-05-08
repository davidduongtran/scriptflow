---
title: Phase 1 - Security Hardening
status: todo
priority: critical
effort: 2h
items: [1, 4, 5]
---

# Phase 1: Security Hardening

Addresses audit Items 1, 4, 5 — the three issues most likely to trigger an immediate rejection.

## Overview

| Audit Item | Issue | Risk |
|------------|-------|------|
| 1 | `externally_connectable.ids: ["*"]` allows any extension to send messages | HIGH |
| 4 | `validateReceivedData()` exists but is never called in the receive path | HIGH |
| 5 | `activeTab` unused; `web_accessible_resources` exposes internals to `<all_urls>` | MEDIUM |

## Context Links

- Audit: `D:\SDLC\Chrome\Titan_Mind_Review.md`
- Files: `manifest.json`, `background.js`, `shared/extensionRegistry.js`, `shared/extensionProtocol.js`, `modules/messaging.js`

---

## Key Insights

- Extension IDs of companion extensions are loaded from `chrome.storage.sync` at runtime (`scriptWriterExtensionId`, `flowAutomateExtensionId`, `titanMindId`, `titanCoreId`). The `manifest.json` allowlist must still be static — Chrome validates it at install time.
- `validateReceivedData()` is fully implemented at lines 301–373 of `background.js` but is **never called** — it is defined after `onMessageExternal` and never wired in.
- `activeTab` is declared in `permissions` array but no code calls any `activeTab`-dependent API (e.g., `chrome.tabs.captureVisibleTab`, content script injection via `scripting`).
- `web_accessible_resources` with `<all_urls>` means any webpage can load `data/*.js` and `modules/*.js` as scripts — exposes internal logic unnecessarily.

---

## Requirements

### Functional
- Only the known TITAN companion extensions may send external messages
- All external data payloads must pass `validateReceivedData()` before being stored
- Manifest declares no unused permissions
- Internal JS files are accessible to extension pages only, not to the open web

### Non-Functional
- No change to existing user-visible behavior
- Validation failures must be logged but must NOT crash the listener (return early with error response)

---

## Architecture

### externally_connectable Fix

`manifest.json` `externally_connectable.ids` must list production extension IDs explicitly.
Placeholder format during dev:
```json
"externally_connectable": {
  "ids": [
    "SCOPE_EXTENSION_ID_HERE",
    "TEXT_EXTENSION_ID_HERE",
    "RADAR_EXTENSION_ID_HERE",
    "CORE_EXTENSION_ID_HERE"
  ]
}
```

Runtime guard in `background.js` `onMessageExternal` handler:
```js
// Allowlist loaded once at worker start
const ALLOWED_SENDER_IDS = new Set([
  'SCOPE_EXTENSION_ID_HERE',
  'TEXT_EXTENSION_ID_HERE',
  'RADAR_EXTENSION_ID_HERE',
  'CORE_EXTENSION_ID_HERE'
]);

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (!ALLOWED_SENDER_IDS.has(sender.id)) {
    console.warn('[Security] Rejected message from unknown sender:', sender.id);
    sendResponse({ success: false, error: 'unauthorized' });
    return false;
  }
  // ... existing logic
});
```

### validateReceivedData() Wire-in

In the `analyzerDataReceived` branch of `onMessageExternal`, call validation BEFORE `chrome.storage.local.set`:
```js
const validation = validateReceivedData(request.data);
if (!validation.valid) {
  console.error('[Security] Invalid data rejected:', validation.errors);
  sendResponse({ success: false, error: 'invalid_data', details: validation.errors });
  return true;
}
// Now safe to store
chrome.storage.local.set({ analyzerData: request.data, ... });
```

### Manifest Cleanup

```diff
-  "activeTab",
-  "alarms",       // moved to Phase 2
-  "offscreen",    // moved to Phase 2

  "web_accessible_resources": [{
    "resources": ["data/*.js", "modules/*.js"],
-   "matches": ["<all_urls>"]
+   "matches": ["chrome-extension://*/*"]
  }]
```

---

## Related Code Files

### Modify
- `manifest.json` — replace `"*"` with allowlist IDs; remove `activeTab`; narrow `web_accessible_resources`
- `background.js` — add `ALLOWED_SENDER_IDS` constant; add sender check at top of `onMessageExternal`; wire `validateReceivedData()` into `analyzerDataReceived` branch

### No Change Needed (for this phase)
- `shared/extensionRegistry.js` — already handles per-ID discovery correctly
- `shared/extensionProtocol.js` — protocol layer is fine
- `modules/messaging.js` — handles internal messaging only, no changes needed

---

## Implementation Steps

1. **Collect companion extension IDs**
   - Open `chrome://extensions` in dev with all TITAN extensions loaded
   - Note the ID for: TITANSYS SCOPE, TITANSYS TEXT, TITANSYS RADAR, TITANSYS CORE
   - These are the values for `ALLOWED_SENDER_IDS` and `externally_connectable.ids`

2. **Update `manifest.json`**
   - Replace `"ids": ["*"]` with the four production IDs
   - Remove `"activeTab"` from `permissions`
   - Change `web_accessible_resources[0].matches` from `["<all_urls>"]` to `["chrome-extension://*/*"]`

3. **Update `background.js`**
   - At the top (after existing `const` declarations), add `ALLOWED_SENDER_IDS` Set with the four IDs
   - At the start of `onMessageExternal` listener body, add sender ID check — reject and return `false` if not in allowlist
   - In the `analyzerDataReceived` branch, call `validateReceivedData(request.data)` before `chrome.storage.local.set`; return error response if invalid

4. **Verify in Chrome**
   - Reload extension, send a test message from a TITAN companion — should succeed
   - Send a test message from a random extension or use `chrome.runtime.sendMessage` from DevTools console with a fake sender — should be rejected

---

## Todo List

- [ ] Collect all 4 companion extension IDs from `chrome://extensions`
- [ ] Update `manifest.json`: replace wildcard, remove `activeTab`, narrow `web_accessible_resources`
- [ ] Add `ALLOWED_SENDER_IDS` constant to `background.js`
- [ ] Add sender ID check at top of `onMessageExternal` handler
- [ ] Wire `validateReceivedData()` into `analyzerDataReceived` branch
- [ ] Reload extension and test accepted/rejected message flow
- [ ] Confirm no console errors for normal companion extension usage

---

## Success Criteria

- `externally_connectable.ids` in `manifest.json` contains no wildcards
- Sending a message from an unlisted extension ID returns `{ success: false, error: 'unauthorized' }`
- `analyzerData` is only stored when `validateReceivedData()` returns `{ valid: true }`
- `manifest.json` has no `activeTab` permission
- `web_accessible_resources` matches only `chrome-extension://*/*`

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Unknown companion extension IDs break the allowlist | Test with all companion extensions before submitting |
| Strict validation rejects slightly malformed but working data | `validateReceivedData()` already uses warnings (not errors) for optional fields — only truly missing `videoTitle` fails hard |
| `chrome-extension://*/*` breaks module loading | Extension's own pages have a `chrome-extension://` URL, so they can still load `modules/*.js` as before |

---

## Next Steps

→ Phase 2: Kill Keep-Alive (also modifies `manifest.json` and `background.js`)
