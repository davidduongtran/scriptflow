---
title: Phase 4 - Architecture Cleanup + Privacy UX
status: todo
priority: medium
effort: 3h
items: [6, 7]
---

# Phase 4: Architecture Cleanup + Privacy UX

Shipping one clean runtime (legacy `sidepanel.js` stack), removing dev artifacts from the submission package, unifying branding across all files, and adding a privacy/data disclosure section to the settings UI.

## Overview

| Audit Item | Issue | Fix |
|------------|-------|-----|
| 6 | Two architectures exist: legacy `sidepanel.js` (shipped) and unused `src/dist` TypeScript build | Commit to legacy; exclude dev artifacts from extension package via `.extensionignore` / build script |
| 7 | No privacy disclosure for API key storage, AI data transmission, or history retention | Add a "Data & Privacy" section to the Settings tab |
| (9) | Branding mismatch: "FR Script-S v1.7.0" in `background.js`, "v9.0.0" in PONG responses, "v6.0" in `sidepanel.html`, "7.0.0" in `manifest.json` | Unify to `TITANSYS MIND v7.0.0` everywhere |

## Context Links

- Audit: `D:\SDLC\Chrome\Titan_Mind_Review.md` (Items 6, 7)
- Files: `manifest.json`, `background.js`, `sidepanel.html`, `sidepanel.js`, `package.json`, `src/`, `dist/`

---

## Key Insights

### Architecture decision
The shipped runtime is `sidepanel.html` → `sidepanel.js` (9,899 lines) + `modules/*.js`. The `src/` TypeScript + `dist/` compiled output is a **parallel refactor that was never wired into `manifest.json` or `sidepanel.html`**. Migrating to the TS build would be a major multi-day effort. The right call for Chrome Store submission is: **ship the working legacy stack, exclude the TS artifacts from the package**.

### What "exclude from package" means
Chrome Web Store submission is a `.zip` of the extension directory. `src/`, `dist/`, `node_modules/`, `tests/`, `*.md` docs, `*.config.*` files add review surface and package weight but serve no runtime function. A `.storeIgnore` file (or a `build-store-package.sh` script) defines what goes in the `.zip`.

### Branding inconsistencies found
| File | Current value | Should be |
|------|--------------|-----------|
| `manifest.json` | `"version": "7.0.0"` | ✅ correct |
| `manifest.json` | `"name": "TITANSYS MIND"` | ✅ correct |
| `background.js` line 1 | `FR Script-S v1.7.0` | `TITANSYS MIND v7.0.0` |
| `background.js` line 18 | `FR Script-S v1.7.0 installed` | `TITANSYS MIND v7.0.0` |
| `background.js` PONG response | `version: '9.0.0'` | `'7.0.0'` |
| `background.js` DISCOVER response | `version: '9.0.0'` | `'7.0.0'` |
| `sidepanel.html` line 26 | `<span class="version">v6.0</span>` | `v7.0.0` |
| `package.json` | verify `"version"` field | `7.0.0` |

### Privacy disclosure requirements
Chrome Web Store policy requires disclosure when an extension:
- Stores user data locally ✅ (API keys, analyzer data, history)
- Transmits user content to third parties ✅ (prompts sent to Anthropic/Gemini)
- Communicates with other extensions ✅ (TITAN companion extensions)

The disclosure must be **in the extension UI**, not just in the store listing description.

---

## Requirements

### Functional
- Extension submission `.zip` contains only runtime-necessary files
- Settings tab shows a "Data & Privacy" section with:
  - What data is stored locally (API keys, analyzer data, generation history)
  - What is sent to Anthropic (script prompts + API key)
  - What is sent to Google Gemini (VEO prompts + API key)
  - What is shared with TITAN companion extensions (analyzer data, generated scripts)
  - A "Clear All Local Data" button that calls `chrome.storage.local.clear()`

### Non-Functional
- All version strings reference `7.0.0`
- All product name references use `TITANSYS MIND`
- No `FR Script-S`, `FinRich`, `ScriptWriter`, `FR Script` in any shipped file

---

## Architecture

### 6a: Build Package Script

Create `build-store-package.sh` (or PowerShell equivalent) that zips only runtime files:

```bash
# Files/dirs to INCLUDE in store package
INCLUDE=(
  manifest.json
  background.js
  sidepanel.html
  sidepanel.js
  sidepanel-v2.css
  sidepanel.css
  modules/
  shared/
  data/
  icons/
  # assessment scripts
  assessment_stage2_3.js
)

# Everything else is excluded:
# src/, dist/, node_modules/, tests/, *.md, *.config.*, package*.json
# offscreen.html (deleted in Phase 2)
# sidepanel-old.css, sidepanel-v2.css backup
```

### 6b: Branding Fixes

All string replacements are surgical — single-line changes:

**`background.js`:**
```diff
-// Service Worker for FR Script-S v1.7.0
-console.log('🚀 FR Script-S v1.7.0 Service Worker Started');
+// Service Worker for TITANSYS MIND v7.0.0
+console.log('🚀 TITANSYS MIND v7.0.0 Service Worker Started');

-  console.log('✅ FR Script-S v1.7.0 installed');
+  console.log('✅ TITANSYS MIND v7.0.0 installed');

-  version: '9.0.0',   // in TITAN_PONG response
+  version: '7.0.0',

-  version: '9.0.0',   // in TITAN_DISCOVER_RESPONSE
+  version: '7.0.0',
```

**`sidepanel.html`:**
```diff
-<span class="version">v6.0</span>
+<span class="version">v7.0.0</span>
```

### 7: Privacy Disclosure UI

Add to the Settings tab in `sidepanel.html`, after the existing API key fields:

```html
<div class="section privacy-section">
  <h2>🔒 Data & Privacy</h2>
  <div class="privacy-info">
    <p><strong>Stored locally</strong> (Chrome storage, this device only):</p>
    <ul>
      <li>API keys (Claude, Gemini)</li>
      <li>Analyzer data received from companion extensions</li>
      <li>Generated scripts and VEO prompt history</li>
      <li>Your settings and preferences</li>
    </ul>
    <p><strong>Sent to Anthropic</strong> (script generation):</p>
    <ul>
      <li>Your script prompts and analyzer data you choose to include</li>
    </ul>
    <p><strong>Sent to Google Gemini</strong> (VEO prompt generation):</p>
    <ul>
      <li>Your script content used to generate video prompts</li>
    </ul>
    <p><strong>Shared with TITAN extensions</strong> (on your device only):</p>
    <ul>
      <li>Analyzer data and generated scripts, passed between TITANSYS SCOPE / TEXT / CORE</li>
    </ul>
    <p>No data is sent to TITANSYS servers. All AI calls go directly to Anthropic/Google using your own API keys.</p>
  </div>
  <button id="clearAllDataBtn" class="btn-danger">🗑️ Clear All Local Data</button>
  <div id="clearDataStatus" class="status-message" style="display:none;"></div>
</div>
```

Add handler in `sidepanel.js` (near other settings handlers):
```js
document.getElementById('clearAllDataBtn')?.addEventListener('click', async () => {
  if (!confirm('Clear all stored data? This removes API keys, history, and cached analyzer data.')) return;
  await chrome.storage.local.clear();
  const status = document.getElementById('clearDataStatus');
  status.textContent = '✅ All local data cleared. Please reload the extension.';
  status.style.display = 'block';
});
```

---

## Related Code Files

### Modify
- `background.js` — fix 4 branding strings
- `sidepanel.html` — fix version display; add privacy section HTML
- `sidepanel.js` — add `clearAllDataBtn` event handler
- `package.json` — verify version is `7.0.0`

### Create
- `build-store-package.ps1` (or `.sh`) — package script for store submission

### No Runtime Change
- `src/` — leave as-is, excluded from package
- `dist/` — leave as-is, excluded from package

---

## Implementation Steps

1. **Fix branding in `background.js`**
   - Line 1 comment: `FR Script-S v1.7.0` → `TITANSYS MIND v7.0.0`
   - Line 3 console.log: same
   - Line 18 onInstalled log: same
   - TITAN_PONG `version`: `9.0.0` → `7.0.0`
   - TITAN_DISCOVER_RESPONSE `version`: `9.0.0` → `7.0.0`
   - Grep for any remaining `FinRich`, `FR Script`, `ScriptWriter` strings

2. **Fix version in `sidepanel.html`**
   - Change `<span class="version">v6.0</span>` to `v7.0.0`

3. **Verify `package.json`**
   - Check `"version"` field is `"7.0.0"`

4. **Grep entire codebase for legacy names**
   ```
   grep -ri "finrich\|fr script\|scriptwriter\|fr-script" --include="*.js" --include="*.html" .
   ```
   Fix any remaining occurrences in files that will be included in the store package.

5. **Add privacy section to `sidepanel.html`**
   - Locate the Settings tab content (`<div id="settings" class="tab-content">`)
   - Append the privacy section HTML after the last settings field group

6. **Add clearAllDataBtn handler to `sidepanel.js`**
   - Find the settings initialization section
   - Add the click handler for `clearAllDataBtn`

7. **Create `build-store-package.ps1`**
   - Lists exact files/directories to include
   - Outputs `titansys-mind-v7.0.0.zip`
   - Excludes: `src/`, `dist/`, `node_modules/`, `tests/`, all `.md` files, `*.config.*`, `package*.json`, `tsconfig.json`, `jest.config.cjs`, `test-suite.js`, `sidepanel-old.css`, backup files

8. **Run the build script**, inspect the zip contents, verify only runtime files are present

---

## Todo List

- [ ] Fix all 5 branding strings in `background.js`
- [ ] Fix version display in `sidepanel.html`
- [ ] Verify `package.json` version is `7.0.0`
- [ ] Grep for `finrich`, `FR Script`, `ScriptWriter` in shipped files — fix any found
- [ ] Add privacy section HTML to Settings tab in `sidepanel.html`
- [ ] Add `clearAllDataBtn` click handler in `sidepanel.js`
- [ ] Create `build-store-package.ps1`
- [ ] Run build script and verify zip contents
- [ ] Open extension from the zip, confirm Settings tab shows privacy section
- [ ] Test "Clear All Local Data" button wipes storage

---

## Success Criteria

- Zero occurrences of `FR Script`, `FinRich`, `ScriptWriter` in any file included in the store package
- All `version` strings in shipped files show `7.0.0`
- Settings tab shows the "Data & Privacy" section with clear, accurate disclosure
- "Clear All Local Data" button works and shows confirmation
- Store submission `.zip` contains no `src/`, `dist/`, `node_modules/`, or test files

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| `sidepanel.js` (9,899 lines) is hard to search for branding strings | Use grep, not manual scan |
| Privacy section CSS not matching existing design | Reuse existing `.section`, `.form-group` classes already in `sidepanel-v2.css` |
| Build script misses a needed file | Test by loading the zip as unpacked extension and exercising all features |
| `clearAllDataBtn` confirm dialog blocked in extensions | `confirm()` works in side panel context; test manually |

---

## Open Questions

- Should history/generation log survive a "Clear All Data"? Consider adding two buttons: "Clear API Keys Only" vs "Clear Everything" — but YAGNI for now, one button is sufficient for store submission.
