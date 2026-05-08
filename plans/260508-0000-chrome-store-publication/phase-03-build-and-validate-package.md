---
title: Phase 3 - Build & Validate Package
status: todo
priority: high
effort: 30m
---

# Phase 3: Build & Validate Package

Build the submission zip, load it as unpacked, and verify all features work before uploading to the store. A broken package after submission wastes review queue time.

## Steps

### 3a. Run the build script

```powershell
cd D:\2026\TITANSYS\TITANSYS_MIND
.\build-store-package.ps1
```

Expected output: `titansys-mind-v7.0.0.zip` in the project root.
The script prints each included file — review the list for anything obviously missing or unexpected.

### 3b. Verify zip contents

Open the zip and confirm these are present and nothing else:
```
manifest.json
background.js
sidepanel.html
sidepanel.js
sidepanel-v2.css
sidepanel.css
assessment_stage2_3.js
modules/
shared/
data/
icons/
```

Confirm these are NOT in the zip:
- `src/`, `dist/`, `node_modules/`, `tests/`
- `*.md` files, `package.json`, `tsconfig.json`, `jest.config.cjs`
- `sidepanel-old.css`, any `*backup*` files
- `offscreen.html` (deleted in Phase 2 of previous plan)

### 3c. Load from zip as unpacked

1. Extract the zip to a temp folder (e.g. `D:\Temp\titansys-mind-test\`)
2. Chrome → `chrome://extensions` → Load unpacked → select the temp folder
3. **Do not** test from the original source folder — test from the extracted zip

### 3d. Smoke test checklist

Run through each feature with the extracted package:

| Test | Expected |
|------|----------|
| Click extension icon | Side panel opens |
| Settings tab → enter Claude API key → save | Key persists after panel close/reopen |
| Settings tab → enter Gemini API key → save | Key persists |
| Script tab → enter topic → Generate Script | Script generates (requires valid API key) |
| VEO Prompts tab → Generate All Prompts | Prompts generate |
| Assessment tab | Loads without errors |
| Settings tab → scroll down → Data & Privacy section | Privacy disclosure visible |
| Settings tab → Clear All Local Data | Confirm dialog appears; data clears |
| Companion extension sends data (if available) | Data appears in MIND side panel |

### 3e. Check browser console for errors

Open DevTools on the side panel (right-click → Inspect) and background SW (`chrome://extensions` → service worker link). Verify:
- No uncaught errors on load
- No `chrome.runtime.lastError` messages during normal use
- No `[Security] Rejected` warnings for legitimate companion messages

### 3f. Verify manifest in Chrome

Go to `chrome://extensions` → TITANSYS MIND → Details. Confirm:
- Version: `7.0.0`
- Permissions shown: Storage only (no alarming permissions like "Read your browsing history")

## Todo

- [ ] Run `build-store-package.ps1`
- [ ] Verify zip contents — included files correct, dev artifacts excluded
- [ ] Extract zip to temp folder
- [ ] Load extracted folder as unpacked extension
- [ ] Complete smoke test checklist
- [ ] Zero console errors in panel + SW
- [ ] Confirm permissions display in Chrome details page
- [ ] Keep the zip — this is the file to upload in Phase 5
