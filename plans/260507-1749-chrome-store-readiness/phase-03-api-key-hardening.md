---
title: Phase 3 - API Key Hardening
status: todo
priority: critical
effort: 2h
items: [3]
---

# Phase 3: API Key Hardening

Removes the `anthropic-dangerous-direct-browser-access` dev-only header from all call sites and eliminates the duplicate fetch logic in `background.js`. The Gemini key-in-URL is acknowledged as an API constraint — mitigated by consolidation and documentation.

## Overview

| Issue | Location | Fix |
|-------|----------|-----|
| `anthropic-dangerous-direct-browser-access: true` header | `modules/apiClient.js:149`, `background.js:135` | Remove header; Anthropic supports direct browser calls without it in production |
| Duplicate Claude fetch logic in `background.js` | `background.js:116–158` (`callClaudeAPI` handler) | Route through `TITAN.api.claude()` in sidepanel instead — remove from background |
| Gemini API key in URL query string | `modules/apiClient.js:200` | Cannot move to header (Google REST API only accepts key as query param) — consolidate and document |

## Context Links

- Audit: `D:\SDLC\Chrome\Titan_Mind_Review.md` (Item 3)
- Files: `modules/apiClient.js`, `background.js`, `sidepanel.js` (caller of `callClaudeAPI`)

---

## Key Insights

### On `anthropic-dangerous-direct-browser-access`
Anthropic added this header to flag dev-only browser usage. Chrome reviewers will see it in network requests and reject the extension. **Removing it does not break API calls** — the header is a warning signal, not an auth mechanism. The `x-api-key` header is the actual auth.

### On the Gemini key in URL
`https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}` is the documented Google Gemini REST API pattern. There is no Bearer token alternative for the basic REST endpoint. This is a known architectural constraint of the Gemini API — not something we can fully eliminate. Mitigation:
- Consolidate to a single call site (`modules/apiClient.js` only)
- Add a code comment explaining the constraint so reviewers don't misread it as careless

### On duplicate fetch in background.js
`background.js` has its own `callClaudeAPI` action handler (lines 116–158) which duplicates `modules/apiClient.js`'s `callClaude()`. The sidepanel sends `chrome.runtime.sendMessage({ action: 'callClaudeAPI', ... })` for the suggestions feature. This should be removed from background and the suggestions feature should call `TITAN.api.claude()` directly from the sidepanel context, which already has access to the module.

---

## Requirements

### Functional
- Claude API calls from the suggestions feature continue to work
- Gemini API calls for VEO prompts continue to work
- No API key is duplicated across multiple code paths

### Non-Functional
- Zero occurrences of `anthropic-dangerous-direct-browser-access` in the codebase
- All Claude API calls go through `modules/apiClient.js:callClaude()`
- All Gemini API calls go through `modules/apiClient.js:callGemini()`
- Single source of truth for API configuration

---

## Architecture

### Step 1: Remove dangerous header from apiClient.js

In `modules/apiClient.js`, line ~148, remove the header:

```diff
 headers: {
   'Content-Type': 'application/json',
   'x-api-key': apiKey,
   'anthropic-version': API_CONFIG.claude.version,
-  'anthropic-dangerous-direct-browser-access': 'true'
 },
```

### Step 2: Remove callClaudeAPI handler from background.js

Remove the entire `callClaudeAPI` branch from `background.js` `onMessage` listener (lines 116–158):

```diff
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
-  if (request.action === 'callClaudeAPI') {
-    // ... entire fetch block
-    return true;
-  }
   if (request.action === 'getAnalyzerData') { ... }
   if (request.action === 'storeAnalyzerData') { ... }
 });
```

### Step 3: Update sidepanel.js callers

Find all `chrome.runtime.sendMessage({ action: 'callClaudeAPI', ... })` calls in `sidepanel.js` and replace with direct `TITAN.api.claude({ ... })` calls.

Grep pattern to find callers: `action: 'callClaudeAPI'`

Example replacement:
```js
// Before
chrome.runtime.sendMessage({
  action: 'callClaudeAPI',
  apiKey: settings.claudeApiKey,
  prompt: suggestionPrompt,
  model: settings.aiModel,
  maxTokens: 500
}, (response) => {
  if (response.success) handleSuggestion(response.text);
});

// After
TITAN.api.claude({
  prompt: suggestionPrompt,
  model: settings.aiModel,
  maxTokens: 500
}).then(text => handleSuggestion(text))
  .catch(err => console.error('[Suggestions] API error:', err));
```

Note: `TITAN.api.claude()` reads the API key from `TITAN.state` internally — no need to pass `apiKey` explicitly.

### Step 4: Document Gemini key constraint

In `modules/apiClient.js`, add a one-line comment above the Gemini URL construction:

```js
// Google Gemini REST API requires key as query param — no header alternative exists
const url = `${API_CONFIG.gemini.baseUrl}/${selectedModel}:generateContent?key=${apiKey}`;
```

---

## Related Code Files

### Modify
- `modules/apiClient.js` — remove `anthropic-dangerous-direct-browser-access` header (line ~149); add Gemini constraint comment (line ~200)
- `background.js` — remove entire `callClaudeAPI` action handler block (lines 116–158)
- `sidepanel.js` — replace `chrome.runtime.sendMessage({ action: 'callClaudeAPI' })` calls with `TITAN.api.claude()` direct calls

### No Change
- `modules/state.js` — `TITAN.api.claude()` already reads from state correctly
- `assessment_stage2_3.js` — verify it doesn't use the `callClaudeAPI` pattern (grep first)

---

## Implementation Steps

1. **Grep for all `callClaudeAPI` and `dangerous-direct-browser-access` occurrences**
   ```
   grep -r "callClaudeAPI\|dangerous-direct-browser-access" --include="*.js" .
   ```
   Document every file and line number before editing.

2. **Edit `modules/apiClient.js`**
   - Remove `'anthropic-dangerous-direct-browser-access': 'true'` from Claude fetch headers
   - Add Gemini constraint comment

3. **Edit `background.js`**
   - Remove the `callClaudeAPI` if-block from `onMessage` listener
   - Verify the remaining `onMessage` handler only handles `getAnalyzerData` and `storeAnalyzerData`

4. **Edit `sidepanel.js`**
   - Search for all `action: 'callClaudeAPI'` patterns
   - Replace each with `TITAN.api.claude({...})` call
   - Verify `TITAN.api` is loaded before first use (check script load order in `sidepanel.html`)

5. **Verify `assessment_stage2_3.js`** doesn't duplicate API calls
   - Grep for `fetch.*anthropic` — if found, consolidate into `TITAN.api.claude()`

6. **Test**
   - Open side panel, use the suggestions feature — should work
   - Check Network tab in DevTools — confirm no `anthropic-dangerous-direct-browser-access` header
   - Generate a VEO prompt — should work

---

## Todo List

- [ ] Grep for all `callClaudeAPI` call sites in `sidepanel.js`
- [ ] Grep for `dangerous-direct-browser-access` across entire codebase
- [ ] Grep for `fetch.*anthropic` in `assessment_stage2_3.js`
- [ ] Remove dangerous header from `modules/apiClient.js`
- [ ] Add Gemini constraint comment in `modules/apiClient.js`
- [ ] Remove `callClaudeAPI` handler from `background.js`
- [ ] Replace all `sendMessage({ action: 'callClaudeAPI' })` in `sidepanel.js` with `TITAN.api.claude()`
- [ ] Test suggestions feature works end-to-end
- [ ] Confirm no `anthropic-dangerous-direct-browser-access` in Network tab

---

## Success Criteria

- `grep -r "dangerous-direct-browser-access" .` returns zero results
- `grep -r "callClaudeAPI" .` returns zero results
- Suggestions feature works without routing through background SW
- All Claude calls originate from `modules/apiClient.js:callClaude()` only
- Network requests to Anthropic show only `x-api-key` and `anthropic-version` headers

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| `sidepanel.js` callers pass raw `apiKey` which `TITAN.api.claude()` doesn't accept | `TITAN.api.claude()` reads key from `TITAN.state` — ensure settings are loaded before calling |
| `assessment_stage2_3.js` has its own fetch logic | Grep first; if it does, wrap in `TITAN.api.claude()` call |
| Removing dangerous header causes auth failures | It won't — the header is cosmetic, `x-api-key` is the auth |

---

## Next Steps

→ Phase 4: Architecture Cleanup + Privacy UX
