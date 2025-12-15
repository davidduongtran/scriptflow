// CLEAN VERSION - Replace lines 1162-1218 with this:

function buildMasterPrompt(topic, numPrompts, videoStyle, dialogueLanguage, subtitles, startSceneNum = 1) {
    // ===== ADAPTIVE DESIGN INTEGRATION =====
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
        veoLog(`⚠️ Recommended: ${sceneCalc.recommendedScenes} scenes (${sceneCalc.averageSceneDuration.toFixed(1)}s avg)`, 'warn');
    }
    // ===== END ADAPTIVE SECTION =====

    const isFirstBatch = startSceneNum === 1;
    const totalScenes = numPrompts + startSceneNum - 1;

    return `You are an elite scriptwriter specializing in Flow Extend format for Google VEO 3 video generation.

## User's Request
- **Topic/Story:** ${topic}
- **Number of Scenes:** ${numPrompts} (starting from Scene ${String(startSceneNum).padStart(2, '0')})
- **Video Style:** ${videoStyle}
- **Dialogue Language:** ${dialogueLanguage}
- **Subtitles:** ${subtitles}

## 👤 CHARACTER STRATEGY (Adaptive)

${charStrategy.guidance}

${charStrategy.useCharacters ?
            `**IMPORTANT:** Use character names consistently. Re-state description on each appearance: "Character Name (as per Scene 01)"` :
            `**IMPORTANT:** AVOID character names. Use: "A person," "The figure," "Silhouette representation"`
        }

// ... rest of the template continues as normal
`;
}
