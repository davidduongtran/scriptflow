# 🚀 Antigravity Integration Package
## Visual Rendering System v2.0 for ScriptWriter Pro

---

## 📦 FILES TO SEND TO ANTIGRAVITY (OPUS 4.5)

### PART 1: Your Current Extension Files (4 files)
These are needed so Opus understands your existing codebase:

| File | Purpose | Priority |
|------|---------|----------|
| `sidepanel.js` | Main logic - where VISUAL_STYLE_SPECS lives | ⚠️ REQUIRED |
| `sidepanel.html` | UI structure - dropdowns location | ⚠️ REQUIRED |
| `sidepanel.css` | Styling (for new CSS additions) | Optional |
| `manifest.json` | Extension config (for reference) | Optional |

---

### PART 2: New Upgrade Files (4 files)
These contain the new system to integrate:

| File | Purpose | Priority |
|------|---------|----------|
| `VISUAL_STYLE_CONFIG.js` | Enhanced 22 styles with Technical DNA | ⚠️ REQUIRED |
| `STYLE_ANCHOR_FUNCTIONS.js` | Style consistency system | ⚠️ REQUIRED |
| `UNIVERSAL_NICHE_SYSTEM.js` | 14 niches + auto-detection | ⚠️ REQUIRED |
| `INTEGRATION_GUIDE.md` | Step-by-step instructions | Recommended |

---

### PART 3: Reference Files (2 files)
HTML snippets showing the new UI structure:

| File | Purpose | Priority |
|------|---------|----------|
| `HTML_DROPDOWN_UPDATE.html` | Updated Visual Style dropdown | Reference |
| `EXPANDED_NICHE_DROPDOWN.html` | Full niche selector UI | Reference |

---

## 📋 RECOMMENDED PROMPT FOR ANTIGRAVITY

Copy and paste this prompt along with the files:

```
I need you to integrate a Visual Rendering System v2.0 upgrade into my ScriptWriter Pro Chrome extension.

## CURRENT FILES (attached)
- sidepanel.js - Main extension logic
- sidepanel.html - UI structure

## NEW SYSTEM FILES (attached)
- VISUAL_STYLE_CONFIG.js - Enhanced VISUAL_STYLE_SPECS with 22 styles + Technical DNA
- STYLE_ANCHOR_FUNCTIONS.js - Style Anchor system for VEO consistency
- UNIVERSAL_NICHE_SYSTEM.js - 14 niches + auto-detection engine

## INTEGRATION TASKS

### Task 1: Replace VISUAL_STYLE_SPECS
Location: sidepanel.js around line 2148
Action: Replace the existing simple VISUAL_STYLE_SPECS object with the enhanced version from VISUAL_STYLE_CONFIG.js

### Task 2: Update combineStyleDimensions()
Location: sidepanel.js around line 2173
Action: Replace with the enhanced version that uses Technical DNA

### Task 3: Add New Functions
Location: sidepanel.js after VISUAL_STYLE_SPECS
Action: Add all functions from:
- STYLE_ANCHOR_FUNCTIONS.js (getStyleAnchor, buildCompleteStyleConfig, etc.)
- UNIVERSAL_NICHE_SYSTEM.js (NICHE_DATABASE, suggestStyleUniversal, etc.)

### Task 4: Update buildMasterPrompt()
Location: sidepanel.js around line 2912
Action: Add Style Anchor injection at the beginning of the function

### Task 5: Update HTML Dropdowns
Location: sidepanel.html lines 325-470 (VEO Visual Style Options section)
Action: 
- Add Niche Selector dropdown
- Update Visual Rendering dropdown with all 22 styles
- Add Style Preview section
- Add niche-specific genre options

### Task 6: Add Event Listeners
Location: sidepanel.js in DOMContentLoaded
Action: Add listeners for:
- updateStylePreview() on style/niche change
- updateNicheInfoCard() on niche change
- autoApplyStyleSuggestion() on topic blur

### Task 7: Add CSS
Location: sidepanel.css (end of file)
Action: Add styles for:
- .rank-badge
- .style-preview
- .niche-info-card
- .color-swatch

## EXPECTED RESULT
- 22 visual styles with full Technical DNA specs
- 14 niches (2 core + 12 extended) with rankings
- Auto-detection of niche from content
- Auto-suggestion of visual style based on content analysis
- Style Anchor system for VEO 3 consistency
- Dynamic UI showing style preview and niche info

Please integrate these changes while maintaining all existing functionality.
```

---

## 📁 MINIMUM FILE SET (4 files)

If you want the simplest integration, send only these:

```
📂 To Antigravity:
├── sidepanel.js          (your current file)
├── sidepanel.html        (your current file)
├── VISUAL_STYLE_CONFIG.js    (new - styles)
└── UNIVERSAL_NICHE_SYSTEM.js (new - niches + auto-detect)
```

---

## 📁 COMPLETE FILE SET (8 files)

For the most thorough integration:

```
📂 To Antigravity:
├── 📁 Current Extension
│   ├── sidepanel.js
│   ├── sidepanel.html
│   ├── sidepanel.css
│   └── manifest.json
│
└── 📁 New Upgrade
    ├── VISUAL_STYLE_CONFIG.js
    ├── STYLE_ANCHOR_FUNCTIONS.js
    ├── UNIVERSAL_NICHE_SYSTEM.js
    └── INTEGRATION_GUIDE.md
```

---

## ⚠️ IMPORTANT NOTES FOR OPUS

Include these notes in your prompt:

1. **Don't break existing features** - The extension has many working features (script generation, analyzer integration, character consistency, etc.)

2. **Key locations in sidepanel.js:**
   - VISUAL_STYLE_SPECS: ~line 2148
   - combineStyleDimensions(): ~line 2173
   - buildMasterPrompt(): ~line 2912
   - DOMContentLoaded listeners: varies

3. **Key locations in sidepanel.html:**
   - VEO Prompts tab: starts ~line 302
   - Visual Style Options: ~lines 325-470

4. **State management:** The extension uses a `state` object - new settings should integrate with it:
   ```javascript
   state.styleManuallySet = false; // Already exists
   // May need to add: state.selectedNiche
   ```

5. **Testing priority:**
   - Style dropdown shows all 22 styles ✓
   - Niche dropdown shows all 14 options ✓
   - Style preview updates dynamically ✓
   - Auto-suggest works on topic blur ✓
   - Generated prompts include Style Anchor ✓

---

## 🎯 QUICK COPY-PASTE CHECKLIST

Before sending to Antigravity, verify you have:

- [ ] `sidepanel.js` - Your current version
- [ ] `sidepanel.html` - Your current version
- [ ] `VISUAL_STYLE_CONFIG.js` - From this package
- [ ] `UNIVERSAL_NICHE_SYSTEM.js` - From this package
- [ ] `STYLE_ANCHOR_FUNCTIONS.js` - From this package (optional but recommended)
- [ ] `INTEGRATION_GUIDE.md` - From this package (optional but helpful)

---

## 📝 ALTERNATIVE: Single Combined File

If Antigravity works better with fewer files, I can create a single `VISUAL_RENDERING_UPGRADE_COMPLETE.js` that combines all new code into one file.

Want me to create that consolidated version?
