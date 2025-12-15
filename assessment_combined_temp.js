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
    const hasCTA = lastPrompt.toLowerCase().includes('[cta');
    if (!hasCTA) {
        issues.push({
            type: 'critical',
            message: 'Final scene missing [CTA] tag - must include call-to-action',
            scene: prompts.length
        });
        score -= 3;
    }

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
 */
function checkCharacterContinuity(prompts) {
    const issues = [];
    let score = 10;

    // Extract character names
    const characterNames = new Set();
    const characterDescriptions = {};

    prompts.forEach((prompt, idx) => {
        // Look for character patterns: "Character Name (description)"
        const nameMatches = prompt.match(/([A-Z][a-z]+ [A-Z][a-z]+|\b[A-Z][a-z]{2,})\s*\(/g);
        if (nameMatches) {
            nameMatches.forEach(match => {
                const name = match.replace(/\s*\($/, '').trim();
                characterNames.add(name);

                // Extract full description
                const descMatch = prompt.match(new RegExp(`${name}\\s*\\(([^)]+)\\)`, 'i'));
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
 */
function analyzePacing(prompts) {
    const issues = [];
    let score = 10;

    const sceneCount = prompts.length;
    const videoDuration = sceneCount * 8; // seconds

    // Check for appropriate scene count based on duration
    if (videoDuration < 30 && sceneCount > 5) {
        issues.push({
            type: 'warning',
            message: `Short video (${videoDuration}s) has many scenes (${sceneCount}) - may feel rushed`,
            recommendation: 'Consider consolidating scenes for better pacing'
        });
        score -= 1;
    }

    if (videoDuration > 120 && sceneCount < 10) {
        issues.push({
            type: 'warning',
            message: `Long video (${videoDuration}s) has few scenes (${sceneCount}) - may feel slow`,
            recommendation: 'Add more scenes for variety and engagement'
        });
        score -= 1;
    }

    return {
        score: Math.max(0, score),
        sceneCount,
        videoDuration,
        avgSceneLength: 8,
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
// ============================================
// VEO PROMPT ASSESSMENT SYSTEM - STAGE 2 & 3
// AI Assessment and Score Aggregation
// ============================================

/**
 * Stage 2: AI-Powered Quality Assessment
 * Uses Claude (default) or Gemini for creative evaluation
 */
async function runAIAssessment(prompts) {
    console.log('🤖 Running AI assessment...');

    // Get original script/topic if available
    const scriptText = state.generatedScript?.fullScript || '';
    const topicText = document.getElementById('veoTopic')?.value || '';

    // Build master assessment prompt
    const masterPrompt = buildAssessmentMasterPrompt(prompts, scriptText, topicText);

    // Use Claude by default, fallback to Gemini
    const assessmentModel = 'claude-sonnet-4-5-20250929'; // Default for accuracy

    try {
        let response;

        if (state.settings.claudeApiKey) {
            // Claude API Call
            response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': state.settings.claudeApiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: assessmentModel,
                    max_tokens: 4000,
                    temperature: 0.3, // Lower temp for more consistent assessment
                    messages: [{
                        role: 'user',
                        content: masterPrompt
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Claude API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponseText = data.content[0].text;

            // Parse JSON response
            const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid AI response format');
            }

            const aiResults = JSON.parse(jsonMatch[0]);
            console.log('✅ AI assessment complete:', aiResults);
            return aiResults;

        } else if (state.settings.geminiApiKey) {
            // Fallback to Gemini
            response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.settings.geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: masterPrompt }] }],
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 4000,
                            responseMimeType: "application/json"
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResults = JSON.parse(data.candidates[0].content.parts[0].text);
            console.log('✅ Gemini assessment complete:', aiResults);
            return aiResults;

        } else {
            throw new Error('No API key configured. Add Claude or Gemini API key in Settings.');
        }

    } catch (error) {
        console.error('❌ AI assessment failed:', error);
        // Return default scores if AI fails
        return {
            visualStorytelling: { score: 7, strengths: [], weaknesses: ['AI assessment unavailable'] },
            productionFeasibility: { score: 8, warnings: [] },
            contentFidelity: { score: 7, gaps: [] },
            overallFeedback: 'AI assessment failed. Using automated checks only.',
            criticalIssues: [],
            recommendations: ['Re-run assessment with valid API key for complete analysis']
        };
    }
}

/**
 * Build Master Prompt for AI Assessment
 * Comprehensive evaluation prompt for Claude/Gemini
 */
function buildAssessmentMasterPrompt(prompts, scriptText, topicText) {
    const promptsText = prompts.join('\n\n---\n\n');

    return `## ROLE
You are a Senior Video Director with 15+ years in video editing, production, and AI-generated content. You assess VEO prompts for quality, completeness, and production readiness.

## YOUR TASK
Evaluate these VEO 3 video prompts for a ${prompts.length}-scene video (${prompts.length * 8} seconds total).

## INPUTS

### Generated VEO Prompts (${prompts.length} scenes):
${promptsText}

${scriptText ? `### Original Script:\n${scriptText.substring(0, 2000)}...\n` : ''}
${topicText ? `### Topic/Summary:\n${topicText.substring(0, 1000)}\n` : ''}

## ASSESSMENT CRITERIA

Evaluate these 3 key areas (each scored 0-10):

### 1. Visual Storytelling Quality (0-10)
- **Show vs Tell**: Are concepts visualized (not just described)?
- **Visual Metaphors**: Are abstract ideas translated to concrete visuals?
- **Visual Variety**: Different angles, environments, colors across scenes?
- **Audience Clarity**: Are metaphors universally understandable?

**Consider:**
- Does each scene have distinct visual identity?
- Is there too much text/narration reliance?
- Are camera angles varied and intentional?

### 2. Production Feasibility (0-10)
- **VEO 3 Compatibility**: Can VEO actually generate these?
- **Complexity Level**: Appropriate detail (not too vague, not impossible)?
- **Technical Achievability**: Are requests realistic for AI video?

**Watch for:**
- Overly complex shots (multi-character interactions)
- Impossible physics or perspectives
- Unclear or contradictory descriptions

### 3. Content Fidelity (0-10)
${scriptText || topicText ?
            `- **Message Preservation**: Are key themes from script/topic visualized?
- **Emotional Beats**: Does visual tone match narrative intent?
- **Flow Integrity**: Does visual sequence follow logical progression?` :
            `- **Narrative Coherence**: Do scenes tell a clear story?
- **Message Clarity**: Is the video's purpose clear?
- **Flow Integrity**: Logical progression from hook to CTA?`}

**Consider:**
- Are important concepts given visual weight?
- Is the hook engaging enough?
- Does the CTA feel natural?

## OUTPUT FORMAT

Return ONLY valid JSON (no markdown, no commentary):

{
  "visualStorytelling": {
    "score": X,
    "strengths": ["specific positive observation 1", "positive 2"],
    "weaknesses": ["specific issue 1", "issue 2"]
  },
  "productionFeasibility": {
    "score": X,
    "warnings": ["production concern 1", "concern 2"]
  },
  "contentFidelity": {
    "score": X,
    "gaps": ["missing element 1", "gap 2"]
  },
  "overallFeedback": "2-3 sentence summary of prompt quality",
  "criticalIssues": ["blocking issue 1 (if any)"],
  "recommendations": ["actionable improvement 1", "improvement 2", "improvement 3"]
}

**Scoring Guide:**
- 9-10: Excellent, professional quality
- 7-8: Good, minor improvements needed
- 5-6: Acceptable, notable issues
- 3-4: Poor, major problems
- 0-2: Unusable, fundamental flaws

Be specific and actionable in feedback. Focus on what matters for production quality.`;
}

/**
 * Stage 3: Calculate Final Score
 * Weighted aggregation of all assessment criteria
 */
function calculateFinalScore(technicalResults, aiResults) {
    console.log('📊 Calculating final score...');

    // Scoring weights (total = 100%)
    const weights = {
        contentCoverage: 0.25,      // 25%
        visualStorytelling: 0.20,   // 20%
        technicalConsistency: 0.15, // 15%
        characterContinuity: 0.15,  // 15%
        pacing: 0.10,               // 10%
        redundancy: 0.10,           // 10%
        feasibility: 0.05           // 5%
    };

    // Extract scores from results
    const scores = {
        contentCoverage: technicalResults.coverage.score,
        visualStorytelling: aiResults.visualStorytelling.score,
        technicalConsistency: technicalResults.technical.score,
        characterContinuity: technicalResults.continuity.score,
        pacing: technicalResults.pacing.score,
        redundancy: technicalResults.redundancy.score,
        feasibility: aiResults.productionFeasibility.score
    };

    // Calculate weighted score (0-100 scale)
    const weightedScore = Object.entries(scores).reduce((total, [key, score]) => {
        return total + (score * weights[key] * 10); // Scale to 100
    }, 0);

    const overallScore = Math.round(weightedScore);

    // Determine pass/fail
    const passed = overallScore >= 75;
    const status = overallScore >= 90 ? 'Excellent' :
        overallScore >= 75 ? 'Good' :
            overallScore >= 60 ? 'Needs Improvement' :
                'Poor';

    // Aggregate all issues
    const allIssues = [
        ...technicalResults.coverage.issues,
        ...technicalResults.technical.issues,
        ...technicalResults.continuity.issues,
        ...technicalResults.pacing.issues,
        ...technicalResults.redundancy.issues,
        ...technicalResults.audio.issues
    ];

    const criticalIssues = allIssues.filter(i => i.type === 'critical');
    const warnings = allIssues.filter(i => i.type === 'warning');

    // Combine AI recommendations
    const recommendations = [
        ...aiResults.recommendations,
        ...allIssues
            .filter(i => i.recommendation)
            .map(i => i.recommendation)
    ].slice(0, 10); // Top 10 recommendations

    // Build final assessment object
    const assessment = {
        timestamp: Date.now(),
        overallScore,
        passed,
        status,
        promptCount: state.generatedPrompts.length,
        videoDuration: state.generatedPrompts.length * 8,

        // Score breakdown
        breakdown: {
            contentCoverage: { score: scores.contentCoverage, weight: weights.contentCoverage },
            visualStorytelling: { score: scores.visualStorytelling, weight: weights.visualStorytelling },
            technicalConsistency: { score: scores.technicalConsistency, weight: weights.technicalConsistency },
            characterContinuity: { score: scores.characterContinuity, weight: weights.characterContinuity },
            pacing: { score: scores.pacing, weight: weights.pacing },
            redundancy: { score: scores.redundancy, weight: weights.redundancy },
            feasibility: { score: scores.feasibility, weight: weights.feasibility }
        },

        // Issues
        issues: {
            critical: criticalIssues,
            warnings: warnings,
            total: allIssues.length
        },

        // Feedback
        aiF eedback: aiResults.overallFeedback,
        criticalIssues: [...aiResults.criticalIssues, ...criticalIssues.map(i => i.message)],
        recommendations: recommendations.filter((r, i, arr) => arr.indexOf(r) === i), // Unique only

        // Technical details
        technicalResults,
        aiResults
    };

    console.log('✅ Final assessment:', assessment);
    return assessment;
}

/**
 * Helper: Update assessment progress bar
 */
function updateAssessmentProgress(percent, message) {
    const progressBar = document.getElementById('assessmentProgressBar');
    const progressPercent = document.getElementById('assessmentProgressPercent');
    const progressText = document.getElementById('assessmentProgressText');

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;
    if (progressText) progressText.textContent = message;
}

/**
 * Display Assessment Results in UI
 */
function displayAssessmentResults(assessment) {
    console.log('📊 Displaying assessment results...');

    // Show results section
    document.getElementById('assessmentResults').style.display = 'block';
    document.getElementById('assessmentControl').querySelector('#assessPromptsBtn').disabled = false;

    // Update overall score
    const scoreValue = document.getElementById('scoreValue');
    const scoreStatus = document.getElementById('scoreStatus');

    if (scoreValue) scoreValue.textContent = assessment.overallScore;
    if (scoreStatus) {
        scoreStatus.textContent = assessment.status;
        scoreStatus.className = 'badge';

        if (assessment.overallScore >= 90) {
            scoreStatus.className += ' badge-excellent';
            scoreStatus.style.background = '#10b981';
        } else if (assessment.overallScore >= 75) {
            scoreStatus.className += ' badge-good';
            scoreStatus.style.background = '#3b82f6';
        } else {
            scoreStatus.className += ' badge-warning';
            scoreStatus.style.background = '#f59e0b';
        }
    }

    // Display detailed scores
    displayDetailedScores(assessment.breakdown);

    // Display issues and recommendations
    displayIssuesAndRecommendations(assessment);

    // Show appropriate action buttons
    updateActionButtons(assessment);

    veoLog(`Assessment complete: ${assessment.overallScore}/100 (${assessment.status})`, 'success');
}

/**
 * Display Detailed Score Breakdown
 */
function displayDetailedScores(breakdown) {
    const container = document.getElementById('detailedScores');
    if (!container) return;

    const criteriaNames = {
        contentCoverage: 'Content Coverage',
        visualStorytelling: 'Visual Storytelling',
        technicalConsistency: 'Technical Consistency',
        characterContinuity: 'Character Continuity',
        pacing: 'Pacing & Timing',
        redundancy: 'Redundancy Check',
        feasibility: 'Production Feasibility'
    };

    let html = '';
    Object.entries(breakdown).forEach(([key, data]) => {
        const percentage = Math.round(data.score * 10);
        const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#3b82f6' : '#f59e0b';

        html += `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-size: 13px; font-weight: 500;">${criteriaNames[key]}</span>
          <span style="font-size: 13px; color: ${color}; font-weight: 600;">${data.score}/10</span>
        </div>
        <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
          <div style="background: ${color}; height: 100%; width: ${percentage}%; transition: width 0.5s;"></div>
        </div>
        <div style="font-size: 11px; color: #666; margin-top: 2px;">Weight: ${Math.round(data.weight * 100)}%</div>
      </div>
    `;
    });

    container.innerHTML = html;
}

/**
 * Display Issues and Recommendations
 */
function displayIssuesAndRecommendations(assessment) {
    // Critical Issues
    const criticalContainer = document.getElementById('criticalIssuesContainer');
    const criticalIssues = document.getElementById('criticalIssues');

    if (assessment.criticalIssues && assessment.criticalIssues.length > 0) {
        criticalContainer.style.display = 'block';
        criticalIssues.innerHTML = assessment.criticalIssues
            .map(issue => `<div style="margin-bottom: 8px;">⚠️ ${issue}</div>`)
            .join('');
    } else {
        criticalContainer.style.display = 'none';
    }

    // Recommendations
    const recsContainer = document.getElementById('recommendationsContainer');
    const recommendations = document.getElementById('recommendations');

    if (assessment.recommendations && assessment.recommendations.length > 0) {
        recsContainer.style.display = 'block';
        recommendations.innerHTML = assessment.recommendations
            .slice(0, 5) // Top 5
            .map((rec, i) => `<div style="margin-bottom: 8px;">${i + 1}. ${rec}</div>`)
            .join('');
    } else {
        recsContainer.style.display = 'none';
    }
}

/**
 * Update Action Buttons Based on Score
 */
function updateActionButtons(assessment) {
    const sendBtn = document.getElementById('sendToFlowAutomateBtn');
    const fixBtn = document.getElementById('applyAutoFixesBtn');
    const regenBtn = document.getElementById('reGeneratePromptsBtn');

    if (assessment.passed) {
        // Score >= 75: Show send button
        if (sendBtn) {
            sendBtn.style.display = 'block';
            sendBtn.onclick = () => sendToFlowAutomate();
        }
        if (fixBtn) fixBtn.style.display = 'none';
        if (regenBtn) regenBtn.style.display = 'none';
    } else {
        // Score < 75: Show fix/regen buttons
        if (sendBtn) sendBtn.style.display = 'none';
        if (fixBtn) {
            fixBtn.style.display = 'block';
            // Auto-fix implementation in Phase 2
        }
        if (regenBtn) {
            regenBtn.style.display = 'block';
            regenBtn.onclick = () => {
                document.querySelector('[data-tab="veo-prompts"]').click();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
        }
    }
}
