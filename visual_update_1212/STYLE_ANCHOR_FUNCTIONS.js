// ═══════════════════════════════════════════════════════════════════════════════
// STYLE ANCHOR SYSTEM v2.0
// Ensures visual consistency across all VEO 3 / Flow scenes
// 
// INTEGRATION: Add these functions to sidepanel.js
//              Call getStyleAnchor() in buildMasterPrompt()
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build Style Anchor block for injection into every scene prompt
 * The anchor ensures VEO 3 generates consistent visuals across independent clips
 * 
 * @param {string} styleName - Visual style name from dropdown
 * @param {string} niche - 'finance' or 'psychology'
 * @returns {string} Formatted style anchor block
 */
function getStyleAnchor(styleName, niche = 'finance') {
  const spec = VISUAL_STYLE_SPECS[styleName] || VISUAL_STYLE_SPECS['default'];
  const colorPalette = spec.colorPalettes[niche] || spec.colorPalettes.finance;
  
  return `
## 🎨 GLOBAL STYLE ANCHOR (APPLY TO ALL SCENES)

**CRITICAL:** VEO 3 / Flow generates each clip INDEPENDENTLY with NO memory between scenes.
This Style Anchor MUST be applied to EVERY scene to maintain visual consistency.

### Visual Rendering
- **Style:** ${spec.name}
- **Category:** ${spec.category}

### Technical Specifications (COPY VERBATIM TO EACH SCENE)
\`\`\`
${spec.technicalDNA}
\`\`\`

### Frame Rate & Motion
- **FPS:** ${spec.fps}
- **Motion Quality:** Smooth, consistent pacing across all scenes

### Lighting Model (MAINTAIN EXACTLY)
\`\`\`
${spec.lighting}
\`\`\`

### Color Palette (${niche.charAt(0).toUpperCase() + niche.slice(1)} Niche)
\`\`\`
${colorPalette}
\`\`\`

### Style Injection Format
Every scene prompt should include this exact style block:
\`\`\`
**STYLE:** ${spec.promptPrefix} [additional scene-specific details]
**LIGHTING:** ${spec.lighting}
**COLOR PALETTE:** ${colorPalette}
\`\`\`

### Consistency Rules
1. ✅ COPY the exact style specifications to every scene
2. ✅ MAINTAIN the same color palette throughout
3. ✅ USE identical lighting descriptions
4. ✅ KEEP the same frame rate specification
5. ❌ DO NOT change style mid-video
6. ❌ DO NOT use different color temperatures between scenes
7. ❌ DO NOT vary the rendering quality

---
`;
}

/**
 * Build complete style string with all dimensions and Technical DNA
 * Enhanced version that includes full specifications
 * 
 * @returns {object} Complete style configuration object
 */
function buildCompleteStyleConfig() {
  const visual = document.getElementById('veoVisualStyle')?.value || '3D Animation';
  const content = document.getElementById('veoContentGenre')?.value || '';
  const era = document.getElementById('veoEraAesthetic')?.value || '';
  const effects = document.getElementById('veoSpecialEffects')?.value || '';
  const niche = document.getElementById('contentNiche')?.value || 'finance';
  
  const spec = VISUAL_STYLE_SPECS[visual] || VISUAL_STYLE_SPECS['default'];
  
  // Build combined style string
  let styleString = spec.promptPrefix;
  if (content) styleString += ` ${content.toLowerCase()} content,`;
  if (era) styleString += ` ${era.toLowerCase()} setting,`;
  if (effects) styleString += ` with ${effects.toLowerCase()} effects,`;
  styleString += ` ${spec.fps}`;
  
  return {
    name: visual,
    category: spec.category,
    niche: niche,
    styleString: styleString,
    technicalDNA: spec.technicalDNA,
    promptPrefix: spec.promptPrefix,
    fps: spec.fps,
    lighting: spec.lighting,
    colorPalette: spec.colorPalettes[niche] || spec.colorPalettes.finance,
    financeRank: spec.financeRank,
    psychologyRank: spec.psychologyRank,
    bestFor: spec.bestFor,
    // Modifiers
    contentGenre: content,
    eraWorld: era,
    specialEffects: effects
  };
}

/**
 * Generate per-scene style injection block
 * This is the compact version to inject into each scene prompt
 * 
 * @param {object} styleConfig - From buildCompleteStyleConfig()
 * @returns {string} Compact style injection for individual scenes
 */
function getSceneStyleInjection(styleConfig) {
  return `**STYLE:** ${styleConfig.styleString}
**LIGHTING:** ${styleConfig.lighting}
**COLOR PALETTE:** ${styleConfig.colorPalette}`;
}

/**
 * Validate style consistency across scene prompts
 * Call this after generating prompts to check for drift
 * 
 * @param {Array} prompts - Array of generated scene prompts
 * @param {object} styleConfig - Expected style configuration
 * @returns {object} Validation result with warnings
 */
function validateStyleConsistency(prompts, styleConfig) {
  const warnings = [];
  const styleName = styleConfig.name.toLowerCase();
  
  prompts.forEach((prompt, index) => {
    const lowerPrompt = prompt.toLowerCase();
    const sceneNum = index + 1;
    
    // Check if style is mentioned
    if (!lowerPrompt.includes(styleName) && !lowerPrompt.includes('style:')) {
      warnings.push(`Scene ${sceneNum}: Missing style specification`);
    }
    
    // Check for conflicting styles
    const conflictingStyles = ['photorealistic', 'anime', 'cartoon', 'watercolor', 'oil painting'];
    conflictingStyles.forEach(conflict => {
      if (conflict !== styleName && lowerPrompt.includes(conflict)) {
        warnings.push(`Scene ${sceneNum}: Contains conflicting style "${conflict}"`);
      }
    });
    
    // Check for lighting consistency keywords
    if (!lowerPrompt.includes('lighting') && !lowerPrompt.includes('light')) {
      warnings.push(`Scene ${sceneNum}: No lighting specification`);
    }
  });
  
  return {
    isConsistent: warnings.length === 0,
    warningCount: warnings.length,
    warnings: warnings,
    recommendation: warnings.length > 0 
      ? 'Review and add style specifications to flagged scenes' 
      : 'All scenes have consistent style specifications'
  };
}

/**
 * Get recommended styles for current niche
 * Shows top 5 styles ranked for the selected niche
 * 
 * @param {string} niche - 'finance' or 'psychology'
 * @returns {Array} Top 5 recommended styles
 */
function getRecommendedStyles(niche = 'finance') {
  const rankKey = niche === 'psychology' ? 'psychologyRank' : 'financeRank';
  
  const recommendations = Object.entries(VISUAL_STYLE_SPECS)
    .filter(([name]) => name !== 'default')
    .sort((a, b) => a[1][rankKey] - b[1][rankKey])
    .slice(0, 5)
    .map(([name, spec], index) => ({
      rank: index + 1,
      name: name,
      category: spec.category,
      bestFor: spec.bestFor,
      reason: getRankingReason(name, niche)
    }));
  
  return recommendations;
}

/**
 * Get human-readable reason for style ranking
 * 
 * @param {string} styleName - Name of the style
 * @param {string} niche - 'finance' or 'psychology'
 * @returns {string} Reason for ranking
 */
function getRankingReason(styleName, niche) {
  const reasons = {
    finance: {
      '3D Animation': 'Professional trust + high engagement. Industry standard for educational content.',
      'Isometric 3D': 'Perfect for data visualization, money flows, and infographics.',
      'Whiteboard': 'Proven high retention for explaining complex financial concepts.',
      '2D Minimal': 'Clean, modern look ideal for quick tips and shorts.',
      'Cinematic': 'Authority positioning for premium, long-form content.'
    },
    psychology: {
      'Anime': 'Proven viral success (Psych2Go). Relatable, emotionally expressive characters.',
      '2D Minimal': 'School of Life style. Perfect for deep concepts and philosophy.',
      'Watercolor': 'Therapeutic, calming aesthetic for sensitive mental health topics.',
      'Silhouette': 'Universal representation. Non-judgmental for trauma content.',
      'Whiteboard': 'Educational credibility for psychology studies and research.'
    }
  };
  
  return reasons[niche]?.[styleName] || 'Versatile style suitable for various content types.';
}

/**
 * Auto-suggest style based on script content analysis
 * Enhanced version with niche awareness
 * 
 * @param {string} scriptContent - The script/topic text
 * @param {string} template - Video template selection
 * @param {string} niche - 'finance' or 'psychology'
 * @returns {object} Suggested style with confidence score
 */
function autoSuggestStyle(scriptContent, template, niche = 'finance') {
  const lowerScript = scriptContent.toLowerCase();
  const lowerTemplate = (template || '').toLowerCase();
  
  // Content signal keywords for each style
  const styleSignals = {
    // Finance-leaning
    '3D Animation': ['money', 'budget', 'invest', 'wealth', 'financial', 'savings', 'income'],
    'Isometric 3D': ['data', 'chart', 'graph', 'flow', 'process', 'system', 'breakdown'],
    'Whiteboard': ['explain', 'concept', 'strategy', 'step', 'method', 'technique'],
    'Cinematic': ['story', 'journey', 'transformation', 'life', 'success', 'failure'],
    
    // Psychology-leaning  
    'Anime': ['emotion', 'feel', 'relationship', 'personality', 'type', 'trait', 'social'],
    'Watercolor': ['anxiety', 'calm', 'peace', 'heal', 'meditation', 'stress', 'relax'],
    'Silhouette': ['trauma', 'abuse', 'recovery', 'anonymous', 'sensitive', 'private'],
    '2D Minimal': ['philosophy', 'meaning', 'purpose', 'deep', 'think', 'reflect', 'understand']
  };
  
  // Score each style
  const scores = {};
  for (const [style, keywords] of Object.entries(styleSignals)) {
    const matches = keywords.filter(kw => lowerScript.includes(kw) || lowerTemplate.includes(kw));
    scores[style] = matches.length;
  }
  
  // Get niche bonus
  const nicheBonus = {
    finance: ['3D Animation', 'Isometric 3D', 'Whiteboard', 'Cinematic'],
    psychology: ['Anime', 'Watercolor', 'Silhouette', '2D Minimal']
  };
  
  // Apply niche bonus
  (nicheBonus[niche] || []).forEach(style => {
    if (scores[style] !== undefined) {
      scores[style] += 2;
    }
  });
  
  // Find best match
  let bestStyle = niche === 'psychology' ? 'Anime' : '3D Animation';
  let bestScore = 0;
  
  for (const [style, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestStyle = style;
    }
  }
  
  // Calculate confidence
  const confidence = Math.min(100, Math.round((bestScore / 5) * 100));
  
  return {
    suggestedStyle: bestStyle,
    confidence: confidence,
    reason: getRankingReason(bestStyle, niche),
    alternativeStyles: Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(1, 4)
      .map(([style]) => style)
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTEGRATION INTO buildMasterPrompt()
// 
// Add this at the beginning of buildMasterPrompt() function:
// ═══════════════════════════════════════════════════════════════════════════════

/*
function buildMasterPrompt(topic, numPrompts, videoStyle, dialogueLanguage, subtitles, startSceneNum = 1) {
  // ... existing adaptive design code ...
  
  // ===== NEW: STYLE ANCHOR INTEGRATION =====
  const niche = document.getElementById('contentNiche')?.value || 'finance';
  const styleConfig = buildCompleteStyleConfig();
  const styleAnchor = getStyleAnchor(styleConfig.name, niche);
  
  // Log style configuration
  console.log('🎨 Style Configuration:', {
    style: styleConfig.name,
    niche: niche,
    rank: niche === 'psychology' ? styleConfig.psychologyRank : styleConfig.financeRank,
    colorPalette: styleConfig.colorPalette
  });
  // ===== END STYLE ANCHOR INTEGRATION =====
  
  // ... rest of existing code ...
  
  // Then include ${styleAnchor} in the returned prompt template
  // AND update the scene example to use ${getSceneStyleInjection(styleConfig)}
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE OUTPUT
// ═══════════════════════════════════════════════════════════════════════════════

/*
## 🎨 GLOBAL STYLE ANCHOR (APPLY TO ALL SCENES)

**CRITICAL:** VEO 3 / Flow generates each clip INDEPENDENTLY with NO memory between scenes.
This Style Anchor MUST be applied to EVERY scene to maintain visual consistency.

### Visual Rendering
- **Style:** 3D Animation
- **Category:** Animation

### Technical Specifications (COPY VERBATIM TO EACH SCENE)
```
ray-traced PBR rendering, subsurface scattering on skin, global illumination, ambient occlusion, soft shadows, 4K resolution, smooth 24fps motion, cinematic depth of field, anti-aliased edges
```

### Frame Rate & Motion
- **FPS:** 24fps
- **Motion Quality:** Smooth, consistent pacing across all scenes

### Lighting Model (MAINTAIN EXACTLY)
```
3-point studio lighting with soft HDRI environment fill
```

### Color Palette (Finance Niche)
```
trust palette - navy #1A237E, green #2E7D32, gold #FFD700, white #FFFFFF
```

### Style Injection Format
Every scene prompt should include this exact style block:
```
**STYLE:** 3D animated, Pixar-quality rendering, ray-traced lighting, subsurface scattering, global illumination, [additional scene-specific details]
**LIGHTING:** 3-point studio lighting with soft HDRI environment fill
**COLOR PALETTE:** trust palette - navy #1A237E, green #2E7D32, gold #FFD700, white #FFFFFF
```

### Consistency Rules
1. ✅ COPY the exact style specifications to every scene
2. ✅ MAINTAIN the same color palette throughout
3. ✅ USE identical lighting descriptions
4. ✅ KEEP the same frame rate specification
5. ❌ DO NOT change style mid-video
6. ❌ DO NOT use different color temperatures between scenes
7. ❌ DO NOT vary the rendering quality

---
*/
