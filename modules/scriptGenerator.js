/**
 * ScriptFlow - Script Generator Module
 * AI script generation for YouTube videos with clone mode support
 * 
 * @module modules/scriptGenerator
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // CLONE MODE CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════════

    const CLONE_MODE_CONFIG = {
        '100': {
            name: '100% Clone',
            temperature: 0.3,
            topP: 0.9,
            description: 'Verbatim reproduction - near-exact copy',
            instruction: 'Reproduce as close to original as possible'
        },
        '95': {
            name: '95% Clone',
            temperature: 0.6,
            topP: 0.95,
            description: 'Structure + creative - preserve formula, fresh words'
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // PROMPT BUILDING
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Build prompt for 100% Clone Mode (Hybrid Approach)
     * AI formats/merges reproduction data - NO new content creation
     * @param {string} title - Video title
     * @param {Object} parsedSections - Parsed reproduction sections
     * @param {string} rawAnalysis - Full raw analysis
     * @returns {string} Prompt for AI
     */
    function buildReproductionPrompt(title, parsedSections, rawAnalysis) {
        return `You are a professional video script formatter. Your ONLY job is to FORMAT and MERGE the provided reproduction data into a clean, organized script.

## CRITICAL RULES:
1. **USE ONLY THE PROVIDED DATA** - Do NOT create, invent, or add any new content
2. **PRESERVE EXACT SPOKEN WORDS** - The transcript must be used VERBATIM, word-for-word
3. **MERGE BY TIMESTAMP** - Align visual, audio, and spoken content by their timestamps
4. **NO PARAPHRASING** - Never rewrite or rephrase the spoken words
5. **FILL VISUAL GAPS** - If a segment lacks visual data, mark it as "[Visual not specified]"

## VIDEO TITLE:
${title}

## REPRODUCTION DATA TO FORMAT:

### SECTION 2: COMPLETE TRANSCRIPT (USE VERBATIM)
${parsedSections.verbatimTranscript || extractSection(rawAnalysis, '### 2. COMPLETE TRANSCRIPT') || 'Not available'}

### SECTION 3: VISUAL BREAKDOWN
${parsedSections.visualBreakdown || extractSection(rawAnalysis, '### 3. VISUAL BREAKDOWN') || 'Not available'}

### SECTION 4: AUDIO ELEMENTS
${parsedSections.audioElements || extractSection(rawAnalysis, '### 4. AUDIO ELEMENTS') || 'Not available'}

### SECTION 5: ON-SCREEN GRAPHICS
${parsedSections.onScreenGraphics || extractSection(rawAnalysis, '### 5. ON-SCREEN GRAPHICS') || 'Not available'}

### SECTION 6: CALLS TO ACTION
${parsedSections.ctas || extractSection(rawAnalysis, '### 6. CALLS TO ACTION') || 'Not available'}

## OUTPUT FORMAT:

Create a script with this structure:

\`\`\`
# ${title}

## 📺 100% CLONE MODE - Complete Reproduction Script

**AUDIO DIRECTION:**
- Voice: [Extract from Section 4]
- Background Music: [Extract from Section 4]
- Sound Effects: [Extract from Section 4]

---

**[0:00-0:XX - HOOK]**

**VISUAL:** [From Section 3 - exact description]
**CAMERA:** [From Section 3 - camera movement]
**ON-SCREEN TEXT:** [From Section 5 if applicable]

**SPOKEN:**
[EXACT words from Section 2 transcript - VERBATIM]

---

Continue for all segments...

**[END - X:XX]**
\`\`\`

## IMPORTANT:
- Group transcript into ~8-10 second segments
- Extract section titles from content
- First segment is always "HOOK"
- Last segment is always "CONCLUSION & CTA"
- Match visuals to spoken content by timestamp proximity

Now format the reproduction data into a clean script. Remember: VERBATIM spoken words only!`;
    }

    /**
     * Build prompt for 95% Clone Mode
     * @param {Object} options - Script options
     * @returns {string} AI prompt
     */
    function build95ClonePrompt(options) {
        const {
            topic,
            template,
            targetLength,
            wordCount,
            audience,
            angle,
            uniqueAngle,
            voiceProfile,
            channelName,
            context,
            structureReference
        } = options;

        return `Generate a professional YouTube script for a ${template} video:

Target Duration: ${targetLength}
Unique Angle: ${uniqueAngle || 'Standard'}
Voice Profile: ${voiceProfile || 'Professional'}
Channel Name: ${channelName || '[Your Channel]'}
Topic: ${topic}
Audience: ${audience || 'General'}
Hook: ${angle || 'Compelling opening'}
Additional Context: ${context || 'None'}

Create a ${wordCount}-word script.

${structureReference ? `
## STRUCTURE REFERENCE (95% Clone Mode)
Follow this structure closely but use creative wording:
${structureReference.substring(0, 2000)}...
` : ''}

## MANDATORY OUTPUT FORMAT:

# [VIDEO TITLE]

**Voice:** [voice direction for narrator]

---

**[0:00-0:XX - HOOK]**

**VISUAL:** [scene description]
**CAMERA:** [camera direction]

**SPOKEN:**
[dialogue/narration]

---

Continue with additional segments...`;
    }

    /**
     * Extract a section from raw analysis text
     * @param {string} text - Raw analysis text
     * @param {string} sectionHeader - Section header to find
     * @returns {string} Extracted section content
     */
    function extractSection(text, sectionHeader) {
        if (!text || !sectionHeader) return '';

        const headerIndex = text.indexOf(sectionHeader);
        if (headerIndex === -1) return '';

        const startIndex = headerIndex + sectionHeader.length;

        // Find next section header
        const nextHeaderMatch = text.slice(startIndex).match(/\n###\s+\d+\./);
        const endIndex = nextHeaderMatch
            ? startIndex + nextHeaderMatch.index
            : text.length;

        return text.slice(startIndex, endIndex).trim();
    }

    /**
     * Calculate word count from target length
     * @param {string} targetLength - Target length string or 'custom'
     * @param {Object} customTime - Custom time {hours, minutes, seconds}
     * @returns {Object} {wordCount, displayLength}
     */
    function calculateWordCount(targetLength, customTime = {}) {
        let wordCount = 2500;
        let displayLength = targetLength;

        if (targetLength === 'custom') {
            const { hours = 0, minutes = 0, seconds = 0 } = customTime;
            const totalMinutes = (hours * 60) + minutes + (seconds / 60);
            wordCount = Math.round(totalMinutes * 150); // ~150 words per minute

            if (hours > 0) {
                displayLength = `${hours}h ${minutes}m ${seconds}s (custom)`;
            } else if (minutes > 0) {
                displayLength = `${minutes}m ${seconds}s (custom)`;
            } else {
                displayLength = `${seconds}s (custom)`;
            }
        } else if (targetLength.includes('Under 1')) {
            wordCount = 150;
        } else if (targetLength.includes('1-3')) {
            wordCount = 400;
        } else if (targetLength.includes('3-5')) {
            wordCount = 600;
        } else if (targetLength.includes('5-10')) {
            wordCount = 1200;
        } else if (targetLength.includes('10-20')) {
            wordCount = 2500;
        } else if (targetLength.includes('20+')) {
            wordCount = 4000;
        }

        return { wordCount, displayLength };
    }

    /**
     * Format timestamp from seconds
     * @param {number} totalSeconds - Total seconds
     * @returns {string} M:SS format
     */
    function formatTimestamp(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SCRIPT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Generate script based on current mode and settings
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generated script object
     */
    async function generate(options) {
        const {
            topic,
            template,
            targetLength,
            cloneMode = '95',
            parsedSections = {},
            rawAnalysis = '',
            customTime = {}
        } = options;

        // Validate required fields
        if (!topic) {
            throw new Error('Topic is required');
        }

        // Calculate word count
        const { wordCount, displayLength } = calculateWordCount(targetLength, customTime);

        // Check for API availability
        const hasClaudeKey = !!TITAN.state?.get('settings.claudeApiKey');
        const hasGeminiKey = !!TITAN.state?.get('settings.geminiApiKey');

        if (!hasClaudeKey && !hasGeminiKey) {
            throw new Error('No API key configured. Please add Claude or Gemini API key in Settings.');
        }

        let generatedText;
        let scriptMode = cloneMode;

        // 100% Clone Mode - format reproduction data
        if (cloneMode === '100') {
            const hasReproductionData = parsedSections.verbatimTranscript || rawAnalysis;

            if (!hasReproductionData) {
                console.warn('⚠️ 100% Clone Mode: No reproduction data, falling back to 95%');
                scriptMode = '95';
            } else {
                const prompt = buildReproductionPrompt(topic, parsedSections, rawAnalysis);
                generatedText = await TITAN.api.call({
                    prompt,
                    temperature: CLONE_MODE_CONFIG['100'].temperature
                });
            }
        }

        // 95% Clone Mode - creative with structure
        if (scriptMode === '95') {
            const prompt = build95ClonePrompt({
                topic,
                template,
                targetLength: displayLength,
                wordCount,
                ...options,
                structureReference: parsedSections.verbatimTranscript
            });

            generatedText = await TITAN.api.call({
                prompt,
                temperature: CLONE_MODE_CONFIG['95'].temperature
            });
        }

        // Clean up markdown code blocks
        generatedText = generatedText.replace(/```markdown/g, '').replace(/```/g, '').trim();

        // Create script object
        const script = {
            fullScript: generatedText,
            title: topic,
            topic: topic,
            template: template || 'standard',
            targetLength: displayLength,
            cloneMode: `${scriptMode}%`,
            wordCount: generatedText.split(/\s+/).length,
            generatedAt: new Date().toLocaleString()
        };

        return script;
    }

    /**
     * Parse a generated script for scene segmentation
     * @param {string} scriptText - Raw script text
     * @returns {Array} Array of scene objects
     */
    function parseScriptScenes(scriptText) {
        if (!scriptText) return [];

        const scenes = [];
        // Match scene headers like **[0:00-0:30 - HOOK]** or [1:30-2:00 - TAKEAWAY 1]
        const sceneRegex = /\[(\d+:\d+(?:-\d+:\d+)?(?:\s*-\s*[^\]]+)?)\]/g;

        let match;
        let lastIndex = 0;

        while ((match = sceneRegex.exec(scriptText)) !== null) {
            if (scenes.length > 0) {
                scenes[scenes.length - 1].content = scriptText.slice(lastIndex, match.index).trim();
            }

            scenes.push({
                header: match[1],
                startIndex: match.index,
                content: ''
            });

            lastIndex = match.index + match[0].length;
        }

        // Add content to last scene
        if (scenes.length > 0) {
            scenes[scenes.length - 1].content = scriptText.slice(lastIndex).trim();
        }

        return scenes;
    }

    /**
     * Get clone mode configuration
     * @param {string} mode - Clone mode ('100' or '95')
     * @returns {Object} Mode configuration
     */
    function getCloneModeConfig(mode) {
        return CLONE_MODE_CONFIG[mode] || CLONE_MODE_CONFIG['95'];
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT TO TITAN NAMESPACE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.scriptGenerator = {
        // Main API
        generate,

        // Prompt building
        buildReproductionPrompt,
        build95ClonePrompt,

        // Utilities
        extractSection,
        calculateWordCount,
        formatTimestamp,
        parseScriptScenes,
        getCloneModeConfig,

        // Configuration
        CLONE_MODE_CONFIG
    };

    console.log('✅ TITAN.scriptGenerator loaded - AI script generation');

})(window.TITAN = window.TITAN || {});
