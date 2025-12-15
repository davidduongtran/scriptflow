// ============================================
// ADAPTIVE MASTER PROMPT TEST SUITE
// Test these functions before integration
// ============================================

/**
 * Content Classification Engine
 * TEST: Call this with different duration/template/topic combinations
 */
function classifyContent(durationSeconds, template, topic) {
    let category;
    if (durationSeconds < 60) category = 'shorts';
    else if (durationSeconds < 180) category = 'short-form';
    else if (durationSeconds < 600) category = 'medium';
    else if (durationSeconds < 1200) category = 'long';
    else category = 'very-long';

    const isMetaphorical = /metaphor|concept|symbol|abstract|parable/i.test(topic);
    const isNarrative = /story|tale|character|hero|protagonist|journey/i.test(topic) ||
        ['Story', 'Interview', 'VSL'].includes(template);
    const isEducational = ['Educational', 'Tutorial', 'Explainer', 'How-to'].includes(template);

    const useCharacters = !isMetaphorical && (isNarrative || durationSeconds > 180);

    console.log(`📊 Content Classification: ${category} | Characters: ${useCharacters}`);

    return {
        category,
        duration: durationSeconds,
        isMetaphorical,
        isNarrative,
        isEducational,
        useCharacters,
        maxCharacters: category === 'very-long' ? 7 : (useCharacters ? 5 : 0)
    };
}

/**
 * Scene Count Calculator with Quality Modifiers
 * TEST: Verify scene counts match expectations
 */
function calculateOptimalScenes(durationSeconds, contentType) {
    const VEO_CLIP_LENGTH = 8;
    const maxPossible = Math.ceil(durationSeconds / VEO_CLIP_LENGTH);

    const modifiers = {
        'shorts': 0.85,
        'short-form': 0.75,
        'medium': 0.65,
        'long': 0.65,
        'very-long': 0.70
    };

    const modifier = modifiers[contentType] || 0.65;
    const recommended = Math.round(maxPossible * modifier);
    const minimum = Math.max(6, Math.floor(durationSeconds / 12));
    const finalRecommended = Math.max(recommended, minimum);

    console.log(`🎬 Scene Calculation: ${durationSeconds}s → Recommended: ${finalRecommended} scenes`);

    return {
        maxScenes: maxPossible,
        recommendedScenes: finalRecommended,
        averageSceneDuration: durationSeconds / finalRecommended
    };
}

/**
 * Character Strategy Selector
 * TEST: Verify character decisions match expectations
 */
function getCharacterStrategy(classification) {
    // 1. Metaphorical shorts: NO characters
    if (classification.category === 'shorts' && classification.isMetaphorical) {
        return {
            useCharacters: false,
            maxCharacters: 0,
            guidance: 'Use anonymous descriptions: "A person," "The figure," "silhouette"'
        };
    }

    // 2. Educational/Tutorial: NO named characters (PRIORITY FIX)
    if (classification.isEducational) {
        return {
            useCharacters: false,
            maxCharacters: 0,
            guidance: 'Use generic instructor: "The instructor," "Tutorial host"'
        };
    }

    // 3. Medium/Long narrative: FULL character tracking
    if (['medium', 'long', 'very-long'].includes(classification.category) && classification.isNarrative) {
        return {
            useCharacters: true,
            maxCharacters: classification.category === 'very-long' ? 7 : 5,
            guidance: 'Use consistent character names with descriptions'
        };
    }

    // 4. Default fallback: NO characters
    return {
        useCharacters: false,
        maxCharacters: 0,
        guidance: 'Use generic descriptions without names'
    };
}

// ============================================
// TEST CASES - RUN THESE IN BROWSER CONSOLE
// ============================================

console.log('TEST 1: Wolf Metaphor Short (60s)');
const test1 = classifyContent(60, 'Shorts_Viral', 'Two wolves metaphor about choices');
console.log(test1);
const test1Scenes = calculateOptimalScenes(60, test1.category);
console.log(test1Scenes);
const test1Char = getCharacterStrategy(test1);
console.log(test1Char);
console.log('Expected: 6-8 scenes, NO characters');
console.log('Actual: ' + test1Scenes.recommendedScenes + ' scenes, Characters: ' + test1Char.useCharacters);
console.log('---');

console.log('TEST 2: Tutorial Medium (5 min)');
const test2 = classifyContent(300, 'Tutorial', 'How to use ChatGPT effectively');
console.log(test2);
const test2Scenes = calculateOptimalScenes(300, test2.category);
console.log(test2Scenes);
const test2Char = getCharacterStrategy(test2);
console.log(test2Char);
console.log('Expected: 24-30 scenes, 1 host character');
console.log('Actual: ' + test2Scenes.recommendedScenes + ' scenes, Characters: ' + test2Char.useCharacters);
console.log('---');

console.log('TEST 3: Narrative Story Long (15 min)');
const test3 = classifyContent(900, 'Story', 'Detective solves mysterious case');
console.log(test3);
const test3Scenes = calculateOptimalScenes(900, test3.category);
console.log(test3Scenes);
const test3Char = getCharacterStrategy(test3);
console.log(test3Char);
console.log('Expected: 73-90 scenes, 3-5 characters WITH tracking');
console.log('Actual: ' + test3Scenes.recommendedScenes + ' scenes, Max Characters: ' + test3Char.maxCharacters);
console.log('---');

console.log('TEST 4: Educational Medium (10 min)');
const test4 = classifyContent(600, 'Educational', 'History of Rome');
console.log(test4);
const test4Scenes = calculateOptimalScenes(600, test4.category);
console.log(test4Scenes);
const test4Char = getCharacterStrategy(test4);
console.log(test4Char);
console.log('Expected: 49-58 scenes, Minimal/no characters');
console.log('Actual: ' + test4Scenes.recommendedScenes + ' scenes, Characters: ' + test4Char.useCharacters);

// ============================================
// INTEGRATION INSTRUCTIONS
// ============================================

/*
AFTER TESTING, TO INTEGRATE:

1. Copy these 3 functions to sidepanel.js
2. Place them BEFORE the "ADVANCED PROMPTING TECHNIQUES" section
3. Modify buildMasterPrompt() to use them:

function buildMasterPrompt(topic, numPrompts, videoStyle, dialogueLanguage, subtitles, startSceneNum = 1) {
  // ADD THIS AT THE START:
  const scriptDuration = numPrompts * 8; // Estimate
  const template = document.getElementById('templateSelect')?.value || 'default';
  const classification = classifyContent(scriptDuration, template, topic);
  const sceneCalc = calculateOptimalScenes(scriptDuration, classification.category);
  const charStrategy = getCharacterStrategy(classification);
  
  console.log('🎯 Adaptive Design Active:', classification, sceneCalc, charStrategy);
  
  // Then use these values in the prompt template
  // ...rest of existing code
}

4. Add validation warnings if numPrompts doesn't match recommended
5. Update character guidance based on charStrategy
6. Test with real generation
*/
