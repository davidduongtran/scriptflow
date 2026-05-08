---
title: Phase 1 - Replace Companion Extension IDs
status: todo
priority: critical
effort: 15m
---

# Phase 1: Replace Companion Extension IDs

Replace the 4 placeholder strings with real extension IDs. Without this the extension rejects all companion messages.

## Files to Edit

- `manifest.json` — `externally_connectable.ids` array
- `background.js` — `ALLOWED_SENDER_IDS` Set

## How to Get the IDs

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Load each TITAN companion extension if not already loaded
4. Copy the 32-character ID shown under each extension name

## The 4 IDs Needed

| Placeholder | Extension |
|-------------|-----------|
| `TITAN_SCOPE_EXT_ID_REPLACE_ME` | TITANSYS SCOPE |
| `TITAN_TEXT_EXT_ID_REPLACE_ME` | TITANSYS TEXT |
| `TITAN_RADAR_EXT_ID_REPLACE_ME` | TITANSYS RADAR |
| `TITAN_CORE_EXT_ID_REPLACE_ME` | TITANSYS CORE |

## Edits

**`manifest.json`** — replace each placeholder in `externally_connectable.ids`:
```json
"externally_connectable": {
  "ids": [
    "abcdefghijklmnopabcdefghijklmnop",
    "..."
  ]
}
```

**`background.js`** — replace each placeholder in `ALLOWED_SENDER_IDS`:
```js
const ALLOWED_SENDER_IDS = new Set([
  'abcdefghijklmnopabcdefghijklmnop',
  '...'
]);
```

Both files must have the **same 4 IDs**.

## Verification

- Reload extension → send a test message from TITANSYS SCOPE → data should appear in MIND side panel
- Check background SW console — no `[Security] Rejected external message` warnings for legitimate companions

## Todo

- [ ] Get all 4 production IDs from `chrome://extensions`
- [ ] Replace placeholders in `manifest.json`
- [ ] Replace placeholders in `background.js`
- [ ] Test cross-extension messaging works end-to-end

## Note on Published IDs

Once each companion extension is published to the Chrome Web Store, its ID becomes permanently fixed. Use the **published ID** (not the dev-mode unpacked ID) in the production `manifest.json` submitted to the store. If the companion extensions are not yet published, use their current unpacked IDs and update after their store submission.
