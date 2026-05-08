---
title: Phase 2 - Kill Keep-Alive System
status: todo
priority: critical
effort: 1h
items: [2]
---

# Phase 2: Kill Keep-Alive System

Removes the alarm + offscreen + setInterval keep-alive pattern — an explicit Chrome Web Store review red flag for MV3 extensions.

## Overview

The current keep-alive system in `background.js` (lines 22–105) uses three layers:
1. `chrome.alarms` firing every ~24 seconds to write to `chrome.storage.local`
2. An offscreen document (`offscreen.html`) created purely for persistence
3. A `setInterval` heartbeat every 20 seconds

All three are documented MV3 policy violations. Chrome's own MV3 migration guide explicitly forbids keepalive workarounds.

## Context Links

- Audit: `D:\SDLC\Chrome\Titan_Mind_Review.md` (Item 2)
- Files: `background.js`, `offscreen.html`, `manifest.json`

---

## Key Insights

- The side panel (`sidepanel.html`) is the only runtime path users interact with. Side panels are **persistent** in Chrome — they don't go away when the service worker dies. The SW only needs to be alive for:
  1. Opening the side panel on icon click (`chrome.action.onClicked`)
  2. Receiving external messages from companion extensions (`onMessageExternal`)
  3. Handling internal `callClaudeAPI` messages from sidepanel (to be removed in Phase 3)
- Chrome wakes the SW automatically for all three of these events — keep-alive is unnecessary.
- The `keepAliveCount` and `lastKeepAlive` values written to `chrome.storage.local` are dev debug data only; no UI reads them.
- `offscreen.html` has no user-facing content; its only purpose is SW persistence.

---

## Requirements

### Functional
- Icon click still opens the side panel
- External messages from companion extensions still reach `onMessageExternal`
- No user-visible behavior changes

### Non-Functional
- Remove `alarms` and `offscreen` from manifest permissions
- Remove `offscreen.html` from the extension package
- `background.js` must not call `setInterval`, `chrome.alarms.create`, or `chrome.offscreen.createDocument`

---

## Architecture

### What to Delete

```
offscreen.html   ← delete entirely
```

### background.js Changes

Remove all of the following blocks:
- Lines 22–46: `KEEP_ALIVE_ALARM_NAME` constant + `setupKeepAliveAlarm()` function
- Lines 48–63: `chrome.alarms.onAlarm.addListener(...)` handler
- Lines 65–92: `setupOffscreenKeepAlive()` function
- Lines 94–103: `setupKeepAliveAlarm()` + `setupOffscreenKeepAlive()` calls + `setInterval` heartbeat
- Line 105: `console.log('✅ Keep-alive system v2.0 initialized...')`

After removal, `background.js` should have only:
1. `chrome.action.onClicked` handler (opens side panel)
2. `chrome.runtime.onInstalled` handler
3. `chrome.runtime.onMessage` handler (internal messages)
4. `chrome.runtime.onMessageExternal` handler (external messages)
5. `validateReceivedData()` function

### manifest.json Changes

```diff
 "permissions": [
   "storage",
   "sidePanel",
-  "alarms",
-  "offscreen"
 ],
```

Also remove the `background.js` reference to offscreen if any script tag loads it.

---

## Related Code Files

### Modify
- `background.js` — remove lines 22–105 (all keep-alive code)
- `manifest.json` — remove `"alarms"` and `"offscreen"` from `permissions`

### Delete
- `offscreen.html` — no longer needed

---

## Implementation Steps

1. **Delete `offscreen.html`**
   - Confirm it contains no user-facing content (it doesn't — it's an empty HTML shell)
   - Delete the file

2. **Edit `background.js`**
   - Remove `KEEP_ALIVE_ALARM_NAME` and `KEEP_ALIVE_INTERVAL_MINUTES` constants
   - Remove `setupKeepAliveAlarm()` function
   - Remove `chrome.alarms.onAlarm.addListener(...)` block
   - Remove `setupOffscreenKeepAlive()` function
   - Remove the three initialization calls at lines 94–105
   - Verify the remaining file is: onInstalled handler → onClicked handler → onMessage handler → onMessageExternal handler → validateReceivedData function

3. **Edit `manifest.json`**
   - Remove `"alarms"` from `permissions` array
   - Remove `"offscreen"` from `permissions` array

4. **Test SW lifecycle**
   - Load extension in Chrome, open side panel
   - Go to `chrome://serviceworker-internals/`, find the extension's SW
   - Let it go idle (wait 30 seconds)
   - Click extension icon — SW should wake and open panel
   - Send a test message from a companion extension — SW should wake and handle it

---

## Todo List

- [ ] Delete `offscreen.html`
- [ ] Remove keep-alive constants from `background.js`
- [ ] Remove `setupKeepAliveAlarm()` and alarm listener from `background.js`
- [ ] Remove `setupOffscreenKeepAlive()` from `background.js`
- [ ] Remove initialization calls and heartbeat `setInterval` from `background.js`
- [ ] Remove `"alarms"` and `"offscreen"` from `manifest.json` permissions
- [ ] Reload extension and verify side panel still opens on icon click
- [ ] Verify SW wakes correctly after going idle

---

## Success Criteria

- `background.js` contains zero references to `chrome.alarms`, `chrome.offscreen`, or `setInterval`
- `manifest.json` permissions array: `["storage", "sidePanel"]` only
- `offscreen.html` file does not exist in the extension directory
- Extension icon click opens side panel after SW has been idle for 30+ seconds
- No errors in background SW console after reload

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Some flow relied on SW staying alive during a long async operation | Review `callClaudeAPI` handler in background — it's async fetch; SW will stay alive for the duration of the fetch promise even without keep-alive |
| Future regression: someone re-adds keep-alive | Add a code comment at top of `background.js`: "Do not add keep-alive mechanisms — Chrome Store policy forbids them in MV3" |

---

## Next Steps

→ Phase 3: API Key Hardening (also modifies `background.js`)
