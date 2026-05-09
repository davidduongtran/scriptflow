/**
 * ScriptFlow - Niche Detection Module
 * Weighted signal scoring for content niche identification
 * 
 * @module modules/nicheDetection
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // DEPENDENCIES
    // ═══════════════════════════════════════════════════════════════════════════════

    // Get niche signals from data module
    const getNicheSignals = () => TITAN.nicheSignals || {};
    const getContentCharacteristics = () => TITAN.contentCharacteristics || {};
    const getNicheDatabase = () => TITAN.nicheDatabase || {};

    // ═══════════════════════════════════════════════════════════════════════════════
    // NICHE DETECTION v2.0
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Detect niche from content using weighted signal scoring
     * Strong signals (×3), Medium (×2), Phrases (×4 bonus), Negative (-3 penalty)
     * 
     * @param {string} content - Text content to analyze
     * @returns {Object} Detection result with niche, confidence, scores, matchedSignals
     */
    function detectNiche(content) {
        if (!content || content.length < 10) {
            return { niche: null, confidence: 0, scores: {}, matchedSignals: {} };
        }

        const NICHE_SIGNALS = getNicheSignals();
        const lowerContent = content.toLowerCase();
        const scores = {};
        const matchedSignals = {};

        // Process each niche
        for (const [nicheKey, nicheData] of Object.entries(NICHE_SIGNALS)) {
            let score = 0;
            const matched = { phrases: [], strong: [], medium: [], negative: [] };

            // STEP 1: Check phrases FIRST (highest priority, weight 4)
            if (nicheData.phrases) {
                for (const phrase of nicheData.phrases) {
                    if (lowerContent.includes(phrase.toLowerCase())) {
                        score += 4;
                        matched.phrases.push(phrase);
                    }
                }
            }

            // STEP 2: Check strong signals (weight 3)
            if (nicheData.strongSignals) {
                for (const signal of nicheData.strongSignals) {
                    const regex = signal.includes(' ')
                        ? new RegExp(signal.toLowerCase(), 'gi')
                        : new RegExp(`\\b${signal.toLowerCase()}\\b`, 'gi');
                    const matches = lowerContent.match(regex);
                    if (matches) {
                        score += 3 * matches.length;
                        if (!matched.strong.includes(signal)) matched.strong.push(signal);
                    }
                }
            }

            // STEP 3: Check medium signals (weight 2)
            if (nicheData.mediumSignals) {
                for (const signal of nicheData.mediumSignals) {
                    const regex = signal.includes(' ')
                        ? new RegExp(signal.toLowerCase(), 'gi')
                        : new RegExp(`\\b${signal.toLowerCase()}\\b`, 'gi');
                    const matches = lowerContent.match(regex);
                    if (matches) {
                        score += 2 * matches.length;
                        if (!matched.medium.includes(signal)) matched.medium.push(signal);
                    }
                }
            }

            // STEP 4: Check negative signals (subtract weight)
            if (nicheData.negativeSignals) {
                for (const signal of nicheData.negativeSignals) {
                    const regex = signal.includes(' ')
                        ? new RegExp(signal.toLowerCase(), 'gi')
                        : new RegExp(`\\b${signal.toLowerCase()}\\b`, 'gi');
                    const matches = lowerContent.match(regex);
                    if (matches) {
                        score -= 3 * matches.length;
                        matched.negative.push(signal);
                    }
                }
            }

            scores[nicheKey] = Math.max(0, score);
            matchedSignals[nicheKey] = matched;
        }

        // Find highest scoring niche
        const sortedNiches = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        let bestNiche = null;
        let bestScore = 0;
        let secondBestScore = 0;

        if (sortedNiches.length > 0 && sortedNiches[0][1] > 0) {
            bestNiche = sortedNiches[0][0];
            bestScore = sortedNiches[0][1];
            secondBestScore = sortedNiches[1]?.[1] || 0;
        }

        // Calculate confidence
        let confidence = 0;
        if (bestScore > 0) {
            const scoreConfidence = Math.min(50, bestScore * 2);
            const gap = bestScore - secondBestScore;
            const gapRatio = bestScore > 0 ? gap / bestScore : 0;
            const gapConfidence = Math.min(50, gapRatio * 50);
            confidence = Math.round(scoreConfidence + gapConfidence);
            if (bestScore < 5) { bestNiche = null; confidence = 0; }
        }

        // Log detection result
        if (bestNiche) {
            const SIGNALS = getNicheSignals();
            console.log(`🔍 Niche Detection: ${SIGNALS[bestNiche]?.icon} ${bestNiche} (${confidence}% conf, score ${bestScore})`);
            console.log(`   Matched: ${matchedSignals[bestNiche].strong.slice(0, 5).join(', ')}`);
        }

        return {
            niche: bestNiche,
            confidence: Math.min(95, confidence),
            scores: scores,
            matchedSignals: bestNiche ? matchedSignals[bestNiche] : {},
            sortedNiches: sortedNiches.slice(0, 5)
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CONTENT ANALYSIS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Analyze content characteristics for style matching
     * @param {string} content - Text content to analyze
     * @returns {Object} Analysis result with type, confidence, styles, colorMood
     */
    function analyzeContentCharacteristics(content) {
        const CONTENT_CHARS = getContentCharacteristics();
        const typeScores = {};

        if (!CONTENT_CHARS.contentTypes) {
            return {
                primaryType: 'educational_explainer',
                confidence: 0,
                recommendedStyles: ['3D Animation'],
                colorMood: 'professional'
            };
        }

        for (const [typeName, typeConfig] of Object.entries(CONTENT_CHARS.contentTypes)) {
            const matches = typeConfig.signals.filter(signal => content.includes(signal));
            typeScores[typeName] = {
                score: matches.length,
                styles: typeConfig.styles,
                colorMood: typeConfig.colorMood
            };
        }

        let primaryType = 'educational_explainer';
        let primaryScore = 0;

        for (const [type, data] of Object.entries(typeScores)) {
            if (data.score > primaryScore) {
                primaryScore = data.score;
                primaryType = type;
            }
        }

        const primaryConfig = CONTENT_CHARS.contentTypes[primaryType];

        return {
            primaryType: primaryType,
            confidence: Math.min(90, primaryScore * 20),
            recommendedStyles: primaryConfig.styles,
            colorMood: primaryConfig.colorMood
        };
    }

    /**
     * Get niche info by key
     * @param {string} nicheKey - Niche identifier
     * @returns {Object|null} Niche configuration
     */
    function getNicheInfo(nicheKey) {
        const NICHE_DB = getNicheDatabase();
        return NICHE_DB[nicheKey] || null;
    }

    /**
     * Get recommended styles for a niche
     * @param {string} nicheKey - Niche identifier
     * @returns {string[]} Array of recommended style names
     */
    function getRecommendedStyles(nicheKey) {
        const nicheInfo = getNicheInfo(nicheKey);
        return nicheInfo?.topStyles || ['3D Animation', 'Whiteboard', '2D Minimal'];
    }

    /**
     * Get all available niches
     * @returns {Object} Niche database
     */
    function getAllNiches() {
        return getNicheDatabase();
    }

    /**
     * Get niche keywords for UI display
     * @param {string} nicheKey - Niche identifier
     * @returns {string[]} Keywords associated with niche
     */
    function getNicheKeywords(nicheKey) {
        const nicheInfo = getNicheInfo(nicheKey);
        return nicheInfo?.keywords || [];
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT TO TITAN NAMESPACE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.nicheDetection = {
        // Core detection
        detectNiche,
        analyzeContentCharacteristics,

        // Helpers
        getNicheInfo,
        getRecommendedStyles,
        getAllNiches,
        getNicheKeywords
    };

    console.log('✅ TITAN.nicheDetection loaded - weighted signal scoring');

})(window.TITAN = window.TITAN || {});
