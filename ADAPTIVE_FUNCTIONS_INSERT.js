// ============================================
// ADAPTIVE MASTER PROMPT DESIGN (Strategic Layer)
// Intelligently decides structure based on content type
// COPY THIS SECTION AND INSERT INTO sidepanel.js AFTER LINE 968
// ============================================

/**
 * Content Classification Engine
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
 */
function getCharacterStrategy(classification) {
    if (classification.category === 'shorts' && classification.isMetaphorical) {
        return {
            useCharacters: false,
            maxCharacters: 0,
            guidance: 'Use anonymous descriptions: "A person," "The figure," "silhouette"'
        };
    }

    if (classification.isEducational) {
        return {
            useCharacters: false,
            maxCharacters: 0,
            guidance: 'Use generic instructor: "The instructor," "Tutorial host"'
        };
    }

    if (['medium', 'long', 'very-long'].includes(classification.category) && classification.isNarrative) {
        return {
            useCharacters: true,
            maxCharacters: classification.category === 'very-long' ? 7 : 5,
            guidance: 'Use consistent character names with descriptions'
        };
    }

    return {
        useCharacters: false,
        maxCharacters: 0,
        guidance: 'Use generic descriptions without names'
    };
}
