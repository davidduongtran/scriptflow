// ==================================================================
// UPDATE buildMasterPrompt() FUNCTION - LINES 1162-1168
// ADD THIS CODE AT THE VERY START (after line 1163)
// ==================================================================

function buildMasterPrompt(topic, numPrompts, videoStyle, dialogueLanguage, subtitles, startSceneNum = 1) {
    // ===== ADD THIS SECTION HERE =====
    // ADAPTIVE DESIGN INTEGRATION
    const scriptDuration = numPrompts * 8; // Estimate 8s per scene
    const template = document.getElementById('templateSelect')?.value || 'Standard';

    // Call adaptive functions
    const classification = classifyContent(scriptDuration, template, topic);
    const sceneCalc = calculateOptimalScenes(scriptDuration, classification.category);
    const charStrategy = getCharacterStrategy(classification);

    // Log adaptive decisions
    console.log('🎯 Adaptive Design Active:', {
        category: classification.category,
        recommendedScenes: sceneCalc.recommendedScenes,
        useCharacters: charStrategy.useCharacters,
        userRequested: numPrompts
    });

    // Validation warning if user's count doesn't match recommendation
    if (Math.abs(numPrompts - sceneCalc.recommendedScenes) > 5 && startSceneNum === 1) {
        console.warn(`⚠️ Scene count mismatch: User requested ${numPrompts}, Recommended ${sceneCalc.recommendedScenes} for ${scriptDuration}s video`);
        veoLog(`⚠️ Recommended: ${sceneCalc.recommendedScenes} scenes (${sc eneCalc.averageSceneDuration.toFixed(1)}s avg)`, 'warn');
  }
  // ===== END OF ADAPTIVE SECTION =====
  
  const isFirstBatch = startSceneNum === 1;
  const totalScenes = numPrompts + startSceneNum - 1;

  // ... rest of existing code continues normally
}

// ==================================================================
// THEN ADD CHARACTER GUIDANCE TO MASTER PROMPT TEMPLATE
// FIND LINE ~1245 (after "PROFESSIONAL QUALITY TECHNIQUES" section)
// ADD THIS BEFORE "📋 SCENE STRUCTURE REQUIREMENTS"
// ==================================================================

## 👤 CHARACTER STRATEGY (Adaptive)

${charStrategy.guidance}

${charStrategy.useCharacters ?
                `**IMPORTANT:** Use character names consistently. Re-state description on each appearance: "Character Name (as per Scene 01)"` :
                `**IMPORTANT:** AVOID character names. Use: "A person," "The figure," "Silhouette representation"`
            }

## 📋 SCENE STRUCTURE REQUIREMENTS
