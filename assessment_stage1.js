// ============================================
// VEO PROMPT ASSESSMENT SYSTEM - PHASE 1 MVP
// Accuracy-first quality control for VEO prompts
// ============================================

/**
 * Stage 1: Run Automated Technical Checks
 * Fast validation of technical consistency and coverage
 */
async function runTechnicalChecks(prompts) {
    console.log('🔧 Running technical checks...');

    const results = {
        coverage: checkContentCoverage(prompts),
        technical: checkTechnicalConsistency(prompts),
        continuity: checkCharacterContinuity(prompts),
        pacing: analyzePacing(prompts),
        redundancy: detectRedundancy(prompts),
        audio: checkAudioConsistency(prompts)
    };

    console.log('✅ Technical checks complete:', results);
    return results;
}

/**
 * 1. Content Coverage Detection
 * Checks for hook, CTA, and scene distribution
 */
function checkContentCoverage(prompts) {
    const issues = [];
    let score = 10;

    // Check for hook in Scene 01
    const firstPrompt = prompts[0] || '';
    const hasHook = firstPrompt.toLowerCase().includes('[hook');
    if (!hasHook) {
        issues.push({
            type: 'critical',
            message: 'Scene 01 missing [HOOK] tag - must grab viewer attention',
            scene: 1
        });
        score -= 3;
    }

    // Check for CTA in final scene
    const lastPrompt = prompts[prompts.length - 1] || '';
    console.log('🔍 CTA Detection Debug:');
    console.log('  Total prompts:', prompts.length);
    console.log('  Last prompt preview:', lastPrompt.substring(0, 200));
    console.log('  Contains [cta:', lastPrompt.toLowerCase().includes('[cta'));

    const hasCTATag = lastPrompt.toLowerCase().includes('[cta');

    // Check for social media handle
    const hasSocialHandle = lastPrompt.match(/@[\w]+/i);

    // Check for engagement request
    const hasEngagement = lastPrompt.match(/follow|subscribe|like|comment|share/i);

    console.log('  Has CTA tag:', hasCTATag);
    console.log('  Has social handle:', !!hasSocialHandle);
    console.log('  Has engagement:', !!hasEngagement);

    if (!hasCTATag) {
        issues.push({
            type: 'critical',
            message: 'Final scene missing [CTA] tag - must include call-to-action',
            scene: prompts.length
        });
        score -= 3;
    } else if (!hasSocialHandle) {
        issues.push({
            type: 'warning',
            message: 'CTA present but missing social media handle (e.g., @username)',
            scene: prompts.length,
            recommendation: 'Add social media handle to CTA for channel growth'
        });
        score -= 1;
    } else if (!hasEngagement) {
        issues.push({
            type: 'warning',
            message: 'CTA present but missing engagement request (follow, subscribe, etc.)',
            scene: prompts.length,
            recommendation: 'Add clear engagement request to drive viewer action'
        });
        score -= 0.5;
    }

    const hasCTA = hasCTATag && (hasSocialHandle || hasEngagement);

    // Check scene count appropriateness
    if (prompts.length < 3) {
        issues.push({
            type: 'warning',
            message: `Very short video (${prompts.length} scenes = ${prompts.length * 8}s). Consider adding more content.`
        });
        score -= 1;
    }

    return {
        score: Math.max(0, score),
        hasHook,
        hasCTA,
        sceneCount: prompts.length,
        issues
    };
}

/**
 * 2. Technical Consistency Validation
 * Checks frame rate, style, timing consistency
 */
function checkTechnicalConsistency(prompts) {
    const issues = [];
    let score = 10;

    // Extract frame rates
    const frameRates = new Set();
    const styles = [];
    let totalDuration = 0;
    let hasCorruption = false;

    prompts.forEach((prompt, idx) => {
        // Check for data corruption
        if (prompt.includes('[object Object]') || prompt.trim().length < 20) {
            hasCorruption = true;
            issues.push({
                type: 'critical',
                message: `Scene ${idx + 1}: Data corruption detected`,
                scene: idx + 1
            });
            score -= 2;
        }

        // Extract frame rate
        const fpsMatch = prompt.match(/(\d+)\s*fps/i);
        if (fpsMatch) {
            frameRates.add(fpsMatch[1]);
        }

        // Extract style
        const styleMatch = prompt.match(/\*\*STYLE:\*\*\s*([^\n]+)/i);
        if (styleMatch) {
            styles.push(styleMatch[1].trim());
        }

        // Calculate duration (assume 8s per scene)
        totalDuration += 8;
    });

    // Check frame rate consistency
    if (frameRates.size > 1) {
        issues.push({
            type: 'critical',
            message: `Inconsistent frame rates detected: ${Array.from(frameRates).join(', ')} fps`,
            recommendation: `Use single frame rate (recommend 24fps or 30fps)`
        });
        score -= 3;
    }

    // Check style consistency (first style should match others)
    if (styles.length > 0) {
        const firstStyle = styles[0];
        const differentStyles = styles.filter(s => !s.includes(firstStyle.split(',')[0]));
        if (differentStyles.length > styles.length * 0.3) { // More than 30% different
            issues.push({
                type: 'warning',
                message: 'Style descriptions vary significantly across scenes',
                recommendation: 'Maintain consistent visual style for professional look'
            });
            score -= 1;
        }
    }

    return {
        score: Math.max(0, score),
        frameRates: Array.from(frameRates),
        frameRateConsistent: frameRates.size <= 1,
        hasCorruption,
        totalDuration,
        issues
    };
}

/**
 * 3. Character Continuity Check
 * Detects name variations and appearance changes
 * FIXED: Now excludes generic terms like "Person", "The person", "They"
 */
function checkCharacterContinuity(prompts) {
    const issues = [];
    let score = 10;

    // GENERIC TERMS TO EXCLUDE (not character names)
    const GENERIC_TERMS = new Set([
        'person', 'the', 'their', 'they', 'figure', 'silhouette',
        'man', 'woman', 'character', 'subject', 'individual',
        'instructor', 'narrator', 'host', 'viewer', 'speaker',
        'people', 'someone', 'anyone', 'everyone', 'nobody'
    ]);

    // Extract character names
    const characterNames = new Set();
    const characterDescriptions = {};

    prompts.forEach((prompt, idx) => {
        // IMPROVED PATTERN: Look for character patterns with better filtering
        // Pattern matches: "Name (" or "First Last ("
        const nameMatches = prompt.match(/([A-Z][a-z]+ [A-Z][a-z]+|\b[A-Z][a-z]{2,})\s*\(/g);

        if (nameMatches) {
            nameMatches.forEach(match => {
                const name = match.replace(/\s*\($/, '').trim();
                const nameLower = name.toLowerCase().replace(/\s+/g, ' ');

                // SKIP if it's a generic term
                const nameWords = nameLower.split(' ');
                const isGeneric = nameWords.some(word => GENERIC_TERMS.has(word)) ||
                    GENERIC_TERMS.has(nameLower);

                if (isGeneric) {
                    // This is a generic reference, not a character name
                    return;
                }

                // This is a real character name
                characterNames.add(name);

                // Extract full description
                const descMatch = prompt.match(new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(([^)]+)\\)`, 'i'));
                if (descMatch) {
                    if (!characterDescriptions[name]) {
                        characterDescriptions[name] = [];
                    }
                    characterDescriptions[name].push({
                        scene: idx + 1,
                        description: descMatch[1]
                    });
                }
            });
        }
    });

    // Log what was found for debugging
    console.log(`🎭 Character detection: Found ${characterNames.size} actual character names:`,
        Array.from(characterNames));

    // Check for name variations (e.g., "Alex" vs "Alexander")
    const names = Array.from(characterNames);
    for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
            if (names[i].toLowerCase().includes(names[j].toLowerCase()) ||
                names[j].toLowerCase().includes(names[i].toLowerCase())) {
                issues.push({
                    type: 'warning',
                    message: `Possible name variation: "${names[i]}" and "${names[j]}"`,
                    recommendation: 'Use consistent character names throughout'
                });
                score -= 1;
            }
        }
    }

    // Check for appearance consistency
    Object.keys(characterDescriptions).forEach(name => {
        const descriptions = characterDescriptions[name];
        if (descriptions.length > 1) {
            const firstDesc = descriptions[0].description.toLowerCase();
            const differentDescs = descriptions.filter(d =>
                d.description.toLowerCase() !== firstDesc
            );

            if (differentDescs.length > 0) {
                issues.push({
                    type: 'warning',
                    message: `${name}: Appearance description varies across scenes`,
                    scenes: differentDescs.map(d => d.scene),
                    recommendation: 'Lock character appearance for consistency'
                });
                score -= 0.5;
            }
        }
    });

    return {
        score: Math.max(0, score),
        characterCount: characterNames.size,
        characters: names,
        issues
    };
}

/**
 * 4. Pacing Analysis
 * Checks scene distribution and flow
 * FIXED: Now counts only "Scene XX:" markers, not timestamps
 */
function analyzePacing(prompts) {
    const issues = [];
    let score = 10;

    // COUNT ACTUAL SCENES (not timestamps like [0-2s] which are within scenes)
    const sceneMarkersText = prompts.join('\n');
    const sceneMarkers = sceneMarkersText.match(/Scene \d+:/gi);
    const actualSceneCount = sceneMarkers ? sceneMarkers.length : prompts.length;

    const videoDuration = actualSceneCount * 8; // seconds (8s per scene for VEO 3.1)

    console.log(`📊 Pacing analysis: ${actualSceneCount} scenes × 8s = ${videoDuration}s video`);

    // VALIDATE: Check for severe over-segmentation
    if (actualSceneCount > 50) {
        issues.push({
            type: 'critical',
            message: `Severe over-segmentation: ${actualSceneCount} scenes for ${videoDuration}s video`,
            recommendation: `Consolidate to ${Math.ceil(videoDuration / 60) * 8}-${Math.ceil(videoDuration / 60) * 10} scenes maximum (8s clips for VEO 3.1)`
        });
        score -= 5;
    } else if (videoDuration < 60 && actualSceneCount > 12) {
        // Shorts should have 6-8 scenes maximum
        issues.push({
            type: 'warning',
            message: `Over-segmentation for shorts: ${actualSceneCount} scenes for ${videoDuration}s video (recommended: 6-8)`,
            recommendation: 'Reduce scene count for better pacing in YouTube Shorts'
        });
        score -= 2;
    } else if (videoDuration >= 60 && videoDuration < 180 && actualSceneCount > 25) {
        // 1-3 min videos
        issues.push({
            type: 'warning',
            message: `Possible over-segmentation: ${actualSceneCount} scenes for ${Math.floor(videoDuration / 60)}min video`,
            recommendation: 'Consider consolidating scenes for smoother flow'
        });
        score -= 1;
    }

    // Check for appropriate scene count based on duration
    if (videoDuration < 30 && actualSceneCount > 5) {
        issues.push({
            type: 'warning',
            message: `Very short video (${videoDuration}s) has many scenes (${actualSceneCount}) - may feel rushed`,
            recommendation: 'Consider consolidating scenes for better pacing'
        });
        score -= 1;
    }

    if (videoDuration > 120 && actualSceneCount < 10) {
        issues.push({
            type: 'warning',
            message: `Long video (${videoDuration}s) has few scenes (${actualSceneCount}) - may feel slow`,
            recommendation: 'Add more scenes for variety and engagement'
        });
        score -= 1;
    }

    return {
        score: Math.max(0, score),
        sceneCount: actualSceneCount,
        videoDuration,
        avgSceneLength: videoDuration / actualSceneCount,
        issues
    };
}

/**
 * 5. Redundancy Detection
 * Finds similar or duplicate scenes
 */
function detectRedundancy(prompts) {
    const issues = [];
    let score = 10;
    const duplicateGroups = [];

    // Simple similarity check based on text overlap
    for (let i = 0; i < prompts.length; i++) {
        for (let j = i + 1; j < prompts.length; j++) {
            const similarity = calculateTextSimilarity(prompts[i], prompts[j]);

            if (similarity > 0.7) { // 70% similar
                duplicateGroups.push({ scenes: [i + 1, j + 1], similarity });
                issues.push({
                    type: 'warning',
                    message: `Scenes ${i + 1} and ${j + 1} are ${Math.round(similarity * 100)}% similar`,
                    recommendation: 'Consider consolidating or differentiating these scenes'
                });
                score -= 1;
            }
        }
    }

    return {
        score: Math.max(0, score),
        duplicateCount: duplicateGroups.length,
        duplicateGroups,
        issues
    };
}

/**
 * 6. Audio Consistency Check
 * Verifies BGM exclusion strategy
 */
function checkAudioConsistency(prompts) {
    const issues = [];
    let score = 10;

    prompts.forEach((prompt, idx) => {
        // Check for continuous BGM (bad)
        const bgmMatches = prompt.match(/\[BGM\]\s*([^\n]+)/gi);
        if (bgmMatches) {
            bgmMatches.forEach(match => {
                const bgmContent = match.replace(/\[BGM\]\s*/i, '').trim();

                // Good: NONE or post-production note
                if (bgmContent.toLowerCase().includes('none') ||
                    bgmContent.toLowerCase().includes('post-production')) {
                    // Perfect!
                } else {
                    // Bad: Continuous music specified
                    issues.push({
                        type: 'critical',
                        message: `Scene ${idx + 1}: Continuous BGM detected - "${bgmContent}"`,
                        recommendation: 'Remove BGM. Add in post-production for consistency.',
                        scene: idx + 1
                    });
                    score -= 2;
                }
            });
        }
    });

    // Check for required SFX
    const firstPrompt = prompts[0] || '';
    if (!firstPrompt.match(/\[HOOK SFX\]/i)) {
        issues.push({
            type: 'warning',
            message: 'Scene 01 missing [HOOK SFX] for attention grab'
        });
        score -= 0.5;
    }

    const lastPrompt = prompts[prompts.length - 1] || '';
    if (!lastPrompt.match(/\[ENDING SFX\]/i)) {
        issues.push({
            type: 'warning',
            message: `Scene ${prompts.length} missing [ENDING SFX] for CTA reinforcement`
        });
        score -= 0.5;
    }

    return {
        score: Math.max(0, score),
        bgmCorrect: issues.filter(i => i.type === 'critical').length === 0,
        issues
    };
}

/**
 * Helper: Calculate text similarity (simple Jaccard index)
 */
function calculateTextSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
}
