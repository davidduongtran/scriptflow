# 🚀 Visual Rendering System v2.0 - Integration Guide

## Step-by-Step Implementation for ScriptWriter Pro

---

## 📋 Pre-Integration Checklist

- [ ] Backup current `sidepanel.js`
- [ ] Backup current `sidepanel.html`
- [ ] Backup current `sidepanel.css`
- [ ] Test current extension works before changes

---

## 🔧 STEP 1: Update VISUAL_STYLE_SPECS (sidepanel.js)

### Location: Line ~2148 in sidepanel.js

### Action: Replace the entire VISUAL_STYLE_SPECS object

```javascript
// FIND THIS (old version):
const VISUAL_STYLE_SPECS = {
  '3D Animation': '3D CGI animation, Blender/Maya, ray-traced lighting, 24fps, realistic textures',
  '2D Animation': '2D animation, Toon Boom Harmony, cel-shaded, vibrant colors, 24fps',
  // ... etc
};

// REPLACE WITH: Copy entire contents from VISUAL_STYLE_CONFIG.js
```

### File to Copy From:
`VISUAL_STYLE_CONFIG.js` (lines 1-500+)

---

## 🔧 STEP 2: Update combineStyleDimensions() (sidepanel.js)

### Location: Line ~2173 in sidepanel.js

### Action: Replace the function with enhanced version

```javascript
// FIND THIS (old version):
function combineStyleDimensions() {
  const visual = document.getElementById('veoVisualStyle').value;
  const content = document.getElementById('veoContentGenre').value;
  const era = document.getElementById('veoEraAesthetic').value;
  const effects = document.getElementById('veoSpecialEffects').value;

  let combined = visual;
  if (content) combined += ` ${content.toLowerCase()} content`;
  if (era) combined += `, ${era.toLowerCase()} setting`;
  if (effects) combined += `, with ${effects.toLowerCase()} effects`;

  return combined;
}

// REPLACE WITH:
function combineStyleDimensions() {
  const visual = document.getElementById('veoVisualStyle')?.value || '3D Animation';
  const content = document.getElementById('veoContentGenre')?.value || '';
  const era = document.getElementById('veoEraAesthetic')?.value || '';
  const effects = document.getElementById('veoSpecialEffects')?.value || '';
  const niche = document.getElementById('contentNiche')?.value || 'finance';
  
  const spec = VISUAL_STYLE_SPECS[visual] || VISUAL_STYLE_SPECS['default'];
  
  let combined = spec.promptPrefix;
  if (content) combined += ` ${content.toLowerCase()} content,`;
  if (era) combined += ` ${era.toLowerCase()} setting,`;
  if (effects) combined += ` with ${effects.toLowerCase()} effects,`;
  combined += ` ${spec.fps}`;
  
  return combined;
}
```

---

## 🔧 STEP 3: Add Style Anchor Functions (sidepanel.js)

### Location: After VISUAL_STYLE_SPECS (around line ~2500)

### Action: Add new functions from STYLE_ANCHOR_FUNCTIONS.js

```javascript
// ADD THESE FUNCTIONS:
// - getStyleAnchor()
// - buildCompleteStyleConfig()
// - getSceneStyleInjection()
// - validateStyleConsistency()
// - getRecommendedStyles()
// - autoSuggestStyle()
```

### File to Copy From:
`STYLE_ANCHOR_FUNCTIONS.js` (all functions)

---

## 🔧 STEP 4: Update buildMasterPrompt() (sidepanel.js)

### Location: Line ~2912 in sidepanel.js

### Action: Add style anchor injection

```javascript
function buildMasterPrompt(topic, numPrompts, videoStyle, dialogueLanguage, subtitles, startSceneNum = 1) {
  // ... existing adaptive design code (keep this) ...
  
  // ===== ADD THIS SECTION =====
  // Style Anchor Integration
  const niche = document.getElementById('contentNiche')?.value || 'finance';
  const styleConfig = buildCompleteStyleConfig();
  const styleAnchor = getStyleAnchor(styleConfig.name, niche);
  
  console.log('🎨 Style Configuration:', {
    style: styleConfig.name,
    niche: niche,
    colorPalette: styleConfig.colorPalette
  });
  // ===== END ADDITION =====
  
  // ... rest of existing code ...
  
  // THEN: Include ${styleAnchor} in the returned prompt template
  // Add it after "## User's Request" section
  
  return `You are an elite scriptwriter...
  
## User's Request
- **Topic/Story:** ${topic}
...

${styleAnchor}

## ⚠️ CRITICAL: BATCH CONTENT SEGMENTATION
...
`;
}
```

---

## 🔧 STEP 5: Update HTML Dropdowns (sidepanel.html)

### Location: Lines ~325-470 in sidepanel.html (VEO Visual Style Options section)

### Action: Replace the entire "Visual Style Options" section

### File to Copy From:
`HTML_DROPDOWN_UPDATE.html` (entire content)

### Key Changes:
1. ✅ Added Niche Selector dropdown
2. ✅ Updated Visual Rendering with all 22 styles
3. ✅ Added rank badges for each style
4. ✅ Added Style Preview box
5. ✅ Added niche-specific genre options
6. ✅ Added niche-specific world/era options

---

## 🔧 STEP 6: Add CSS Styles (sidepanel.css)

### Location: End of sidepanel.css

### Action: Add new CSS from HTML_DROPDOWN_UPDATE.html

```css
/* Add these styles */
.rank-badge { ... }
.rank-badge.top-3 { ... }
.rank-badge.top-1 { ... }
.style-preview { ... }
.form-hint { ... }
.style-reminder { ... }
@keyframes pulse-border { ... }
```

---

## 🔧 STEP 7: Add Event Listeners (sidepanel.js)

### Location: Inside DOMContentLoaded handler

### Action: Add style preview update listeners

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...
  
  // ADD: Style preview dynamic updates
  const styleSelect = document.getElementById('veoVisualStyle');
  const nicheSelect = document.getElementById('contentNiche');
  
  if (styleSelect) {
    styleSelect.addEventListener('change', updateStylePreview);
  }
  
  if (nicheSelect) {
    nicheSelect.addEventListener('change', updateStylePreview);
  }
  
  // Initial style preview update
  updateStylePreview();
});

// ADD: updateStylePreview function
function updateStylePreview() {
  const styleSelect = document.getElementById('veoVisualStyle');
  const nicheSelect = document.getElementById('contentNiche');
  const rankBadge = document.getElementById('styleRankBadge');
  const technicalDNA = document.getElementById('styleTechnicalDNA');
  const colorPalette = document.getElementById('styleColorPalette');
  const bestFor = document.getElementById('styleBestFor');
  
  if (!styleSelect || !nicheSelect) return;
  
  const styleName = styleSelect.value;
  const niche = nicheSelect.value;
  const spec = VISUAL_STYLE_SPECS[styleName] || VISUAL_STYLE_SPECS['default'];
  
  // Update rank badge
  const rank = niche === 'psychology' ? spec.psychologyRank : spec.financeRank;
  const nicheLabel = niche === 'psychology' ? 'Psychology' : 'Finance';
  
  if (rankBadge) {
    rankBadge.textContent = `${nicheLabel} #${rank}`;
    rankBadge.className = 'rank-badge';
    if (rank === 1) rankBadge.classList.add('top-1');
    else if (rank <= 3) rankBadge.classList.add('top-3');
  }
  
  if (technicalDNA) technicalDNA.textContent = spec.technicalDNA;
  if (colorPalette) colorPalette.textContent = spec.colorPalettes[niche];
  if (bestFor) bestFor.textContent = `Best for: ${spec.bestFor}`;
}
```

---

## ✅ STEP 8: Testing Checklist

After integration, test the following:

### UI Tests
- [ ] Niche dropdown shows Finance and Psychology
- [ ] Visual Rendering dropdown shows all 22 styles
- [ ] Style preview updates when changing style
- [ ] Style preview updates when changing niche
- [ ] Rank badge shows correct ranking for each niche
- [ ] Color palette changes based on niche

### Generation Tests
- [ ] Generate prompts with 3D Animation + Finance
- [ ] Generate prompts with Anime + Psychology
- [ ] Check if Style Anchor appears in master prompt
- [ ] Check if Technical DNA is in generated scenes
- [ ] Check if color palette is referenced

### Consistency Tests
- [ ] Generate 10+ scenes, check for style drift
- [ ] Verify lighting consistency keywords present
- [ ] Verify color palette keywords present

---

## 🔄 Rollback Plan

If something breaks:

1. Restore backup files:
   ```bash
   cp sidepanel.js.backup sidepanel.js
   cp sidepanel.html.backup sidepanel.html
   cp sidepanel.css.backup sidepanel.css
   ```

2. Reload extension in Chrome:
   - Go to `chrome://extensions`
   - Click "Reload" on ScriptWriter Pro

---

## 📊 Expected Results

### Before Integration
```
Style: "3D Animation"
Prompt: "3D CGI animation, Blender/Maya, ray-traced lighting, 24fps..."
```

### After Integration
```
Style: "3D Animation"
Niche: "Finance"
Rank: #1

Technical DNA: "ray-traced PBR rendering, subsurface scattering on skin, 
global illumination, ambient occlusion, soft shadows, 4K resolution, 
smooth 24fps motion, cinematic depth of field, anti-aliased edges"

Color Palette: "trust palette - navy #1A237E, green #2E7D32, gold #FFD700"

Style Anchor injected into every scene for consistency
```

---

## 🎉 Done!

After completing all steps:
1. Your extension now has 22 visual styles with full Technical DNA
2. Finance and Psychology niches are supported with ranked styles
3. Style Anchor system ensures consistency across scenes
4. Dynamic UI shows relevant info based on selections

**Test thoroughly before using for production videos!**
