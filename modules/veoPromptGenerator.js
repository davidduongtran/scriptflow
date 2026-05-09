/**
 * ScriptFlow - VEO Prompt Generator Module
 * VEO 3 prompt generation with scene splitting and DNA injection
 * 
 * @module modules/veoPromptGenerator
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // DEPENDENCIES
    // ═══════════════════════════════════════════════════════════════════════════════

    const getVisualStyleSpecs = () => TITAN.visualStyleSpecs || {};
    const getHexToColorName = () => TITAN.hexToColorName || {};

    // ═══════════════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════════

    const VEO_CONFIG = {
        DEFAULT_CLIP_DURATION: 8,  // seconds per clip
        MAX_CLIP_DURATION: 10,
        MIN_CLIP_DURATION: 5,
        BATCH_SIZE: 10,
        WORDS_PER_SECOND: 2.5  // Average speaking rate
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // COLOR CONVERSION
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Convert hex code to natural color name
     * @param {string} hexCode - Hex color code
     * @returns {string} Natural color name
     */
    function convertHexToColorName(hexCode) {
        const HEX_TO_COLOR_NAME = getHexToColorName();
        const normalized = hexCode.toUpperCase();
        const normalizedLower = hexCode.toLowerCase();

        if (HEX_TO_COLOR_NAME[normalized]) return HEX_TO_COLOR_NAME[normalized];
        if (HEX_TO_COLOR_NAME[normalizedLower]) return HEX_TO_COLOR_NAME[normalizedLower];
        if (HEX_TO_COLOR_NAME[hexCode]) return HEX_TO_COLOR_NAME[hexCode];

        // Fallback: analyze hex to describe color
        const r = parseInt(hexCode.slice(1, 3), 16);
        const g = parseInt(hexCode.slice(3, 5), 16);
        const b = parseInt(hexCode.slice(5, 7), 16);

        const brightness = (r + g + b) / 3;
        let colorName = '';

        if (brightness > 200) colorName = 'light ';
        else if (brightness < 80) colorName = 'dark ';

        if (r > g && r > b) colorName += 'red';
        else if (g > r && g > b) colorName += 'green';
        else if (b > r && b > g) colorName += 'blue';
        else if (r === g && r > b) colorName += 'yellow';
        else if (r === b && r > g) colorName += 'magenta';
        else if (g === b && g > r) colorName += 'cyan';
        else colorName += 'grey';

        return colorName.trim();
    }

    /**
     * Replace all hex codes in text with color names
     * @param {string} text - Text containing hex codes
     * @returns {string} Text with color names
     */
    function replaceHexWithColorNames(text) {
        if (!text) return text;
        return text.replace(/#[0-9A-Fa-f]{6}/g, (hex) => convertHexToColorName(hex));
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // STYLE ANCHOR GENERATION
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Get Style Anchor for injection into VEO prompts
     * @param {string} styleName - Visual style name
     * @param {string} niche - Content niche
     * @returns {string} Formatted style anchor
     */
    function getStyleAnchor(styleName, niche = 'finance') {
        const VISUAL_STYLE_SPECS = getVisualStyleSpecs();
        const spec = VISUAL_STYLE_SPECS[styleName] || VISUAL_STYLE_SPECS['default'];
        const colorPalette = spec.colorPalettes[niche] || spec.colorPalettes.finance;

        // Convert palette hex codes to color names
        const naturalPalette = replaceHexWithColorNames(colorPalette);

        return `
## 🎨 GLOBAL STYLE ANCHOR (APPLY TO ALL SCENES)

**CRITICAL:** VEO 3 generates each clip INDEPENDENTLY with NO memory between scenes.
This Style Anchor MUST be applied to EVERY scene for visual consistency.

### Visual Rendering
- **Style:** ${spec.name}
- **Technical DNA:** ${spec.technicalDNA}
- **Frame Rate:** ${spec.fps}
- **Lighting:** ${spec.lighting}

### Color Palette
${naturalPalette}

### Best For
${spec.bestFor}

---
`;
    }

    /**
     * Get style specification by name
     * @param {string} styleName - Style name
     * @returns {Object} Style specification
     */
    function getStyleSpec(styleName) {
        const VISUAL_STYLE_SPECS = getVisualStyleSpecs();
        return VISUAL_STYLE_SPECS[styleName] || VISUAL_STYLE_SPECS['default'];
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SCENE SPLITTING
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Split script into scenes/segments for VEO generation
     * @param {string} scriptText - Full script text
     * @param {number} clipDuration - Target clip duration in seconds
     * @returns {Array} Array of scene objects
     */
    function splitScriptIntoScenes(scriptText, clipDuration = VEO_CONFIG.DEFAULT_CLIP_DURATION) {
        if (!scriptText || scriptText.trim().length < 20) return [];

        const scenes = [];

        // Try multiple patterns for marked sections
        // Pattern 1: **[0:00-0:30 - HOOK]** or [0:00-0:30 - HOOK]
        // Pattern 2: **[0:00 - HOOK]**
        // Pattern 3: ## SCENE 1 or ### CLIP 1
        const sectionPatterns = [
            /\*{0,2}\[\d+:\d+(?:-\d+:\d+)?(?:\s*-\s*[^\]]+)?\]\*{0,2}/g,  // Timestamp with brackets
            /^##?\s*(?:SCENE|CLIP|SECTION)\s*\d+/gim,  // Markdown headers
            /---+/g  // Horizontal rules as dividers
        ];

        let sections = null;
        let usedPattern = null;

        // Try each pattern
        for (const pattern of sectionPatterns) {
            const matches = scriptText.match(pattern);
            if (matches && matches.length >= 2) {
                sections = scriptText.split(pattern).filter(s => s.trim().length > 10);
                usedPattern = pattern;
                break;
            }
        }

        if (sections && sections.length > 1) {
            // Script has marked sections
            sections.forEach((section, index) => {
                const trimmed = section.trim();
                if (trimmed.length > 20) {
                    scenes.push({
                        id: index + 1,
                        content: trimmed,
                        estimatedDuration: Math.ceil(trimmed.split(/\s+/).length / VEO_CONFIG.WORDS_PER_SECOND)
                    });
                }
            });
        } else {
            // Fallback: Split by word count for target duration
            const cleanText = scriptText.trim();
            const words = cleanText.split(/\s+/).filter(w => w.length > 0);

            if (words.length < 5) return [];

            const wordsPerClip = Math.round(clipDuration * VEO_CONFIG.WORDS_PER_SECOND);

            for (let i = 0; i < words.length; i += wordsPerClip) {
                const chunk = words.slice(i, i + wordsPerClip).join(' ');
                if (chunk.length > 10) {
                    scenes.push({
                        id: scenes.length + 1,
                        content: chunk,
                        estimatedDuration: clipDuration
                    });
                }
            }
        }

        return scenes;
    }

    /**
     * Organize scenes into batches
     * @param {Array} scenes - Array of scene objects
     * @param {number} batchSize - Scenes per batch
     * @returns {Array} Array of batch objects
     */
    function organizeIntoBatches(scenes, batchSize = VEO_CONFIG.BATCH_SIZE) {
        const batches = [];

        for (let i = 0; i < scenes.length; i += batchSize) {
            batches.push({
                batchNumber: Math.floor(i / batchSize) + 1,
                scenes: scenes.slice(i, i + batchSize),
                totalScenes: Math.min(batchSize, scenes.length - i)
            });
        }

        return batches;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // DNA INJECTION
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Extract visual DNA from script for consistency
     * @param {string} scriptText - Script text
     * @returns {Object} Extracted DNA elements
     */
    function extractScriptDNA(scriptText) {
        const dna = {
            characters: [],
            locations: [],
            props: [],
            colorReferences: [],
            audioElements: []
        };

        // Extract character references
        const characterMatch = scriptText.match(/character(?:s)?[:\s]+([^.\n]+)/gi);
        if (characterMatch) {
            dna.characters = characterMatch.map(m => m.replace(/characters?[:\s]+/i, '').trim());
        }

        // Extract location references
        const locationMatch = scriptText.match(/(?:location|setting|scene)[:\s]+([^.\n]+)/gi);
        if (locationMatch) {
            dna.locations = locationMatch.map(m => m.replace(/(?:location|setting|scene)[:\s]+/i, '').trim());
        }

        // Extract color references (hex codes)
        const colorMatch = scriptText.match(/#[0-9A-Fa-f]{6}/g);
        if (colorMatch) {
            dna.colorReferences = [...new Set(colorMatch)];
        }

        return dna;
    }

    /**
     * Build DNA injection block for prompts
     * @param {Object} dna - Extracted DNA
     * @param {Object} styleSpec - Visual style specification
     * @param {Object} voiceConfig - Voice configuration
     * @returns {string} DNA injection markdown
     */
    function buildDNAInjectionBlock(dna, styleSpec, voiceConfig) {
        let block = `
## 🧬 SCENE DNA (CONSISTENCY ANCHORS)

### Visual Style
- **Rendering:** ${styleSpec?.promptPrefix || 'professional quality'}
- **Lighting:** ${styleSpec?.lighting || 'balanced 3-point lighting'}
- **Frame Rate:** ${styleSpec?.fps || '24fps'}

`;

        if (dna.characters.length > 0) {
            block += `### Characters\n${dna.characters.map(c => `- ${c}`).join('\n')}\n\n`;
        }

        if (dna.locations.length > 0) {
            block += `### Locations\n${dna.locations.map(l => `- ${l}`).join('\n')}\n\n`;
        }

        if (voiceConfig) {
            block += `### Voice Anchor\n- **Format:** ${voiceConfig.formatName || 'Single Narrator'}\n`;
        }

        block += '---\n';
        return block;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // VEO PROMPT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Generate VEO prompt for a single scene
     * @param {Object} scene - Scene object
     * @param {Object} options - Generation options
     * @returns {string} VEO-ready prompt
     */
    function generateScenePrompt(scene, options = {}) {
        const {
            styleName = '3D Animation',
            niche = 'finance',
            voiceConfig = null,
            characterBible = null,
            includeAudio = true
        } = options;

        const spec = getStyleSpec(styleName);

        // Build the prompt
        let prompt = '';

        // Style prefix
        prompt += spec.promptPrefix + ' ';

        // Scene content (cleaned)
        const sceneContent = scene.content
            .replace(/\*\*VISUAL:\*\*/gi, '')
            .replace(/\*\*CAMERA:\*\*/gi, '')
            .replace(/\*\*SPOKEN:\*\*/gi, 'Audio: ')
            .replace(/\*\*/g, '')
            .trim();

        prompt += sceneContent;

        // Add negative prompts if available
        if (spec.negativePrompts) {
            prompt += ` ${spec.negativePrompts}`;
        }

        // Add (no subtitles) if audio included
        if (includeAudio) {
            prompt += ' (no subtitles)';
        }

        return prompt.trim();
    }

    /**
     * Generate VEO prompts for entire script
     * @param {string} scriptText - Full script
     * @param {Object} options - Generation options
     * @returns {Object} Generated prompts with batches
     */
    function generate(scriptText, options = {}) {
        const {
            styleName = '3D Animation',
            niche = 'finance',
            clipDuration = VEO_CONFIG.DEFAULT_CLIP_DURATION,
            voiceConfig = null
        } = options;

        // Split into scenes
        const scenes = splitScriptIntoScenes(scriptText, clipDuration);

        if (scenes.length === 0) {
            return { scenes: [], batches: [], totalClips: 0, styleAnchor: '' };
        }

        // Extract DNA
        const dna = extractScriptDNA(scriptText);
        const styleSpec = getStyleSpec(styleName);

        // Generate prompts for each scene
        const promptedScenes = scenes.map((scene, index) => ({
            ...scene,
            prompt: generateScenePrompt(scene, { styleName, niche, voiceConfig }),
            clipNumber: index + 1
        }));

        // Organize into batches
        const batches = organizeIntoBatches(promptedScenes);

        // Get style anchor
        const styleAnchor = getStyleAnchor(styleName, niche);

        // Build DNA block
        const dnaBlock = buildDNAInjectionBlock(dna, styleSpec, voiceConfig);

        return {
            scenes: promptedScenes,
            batches,
            totalClips: promptedScenes.length,
            styleAnchor,
            dnaBlock,
            estimatedTotalDuration: promptedScenes.reduce((acc, s) => acc + (s.estimatedDuration || clipDuration), 0)
        };
    }

    /**
     * Format prompts for display/export
     * @param {Object} generatedData - Output from generate()
     * @returns {string} Formatted text output
     */
    function formatForDisplay(generatedData) {
        const { scenes, batches, totalClips, styleAnchor } = generatedData;

        let output = `# VEO 3 PROMPTS - ${totalClips} Clips\n\n`;
        output += styleAnchor + '\n';

        batches.forEach(batch => {
            output += `\n## BATCH ${batch.batchNumber} (${batch.totalScenes} clips)\n\n`;

            batch.scenes.forEach(scene => {
                output += `### Clip ${scene.clipNumber}\n`;
                output += `**Duration:** ~${scene.estimatedDuration || 8}s\n\n`;
                output += '```\n' + scene.prompt + '\n```\n\n';
                output += '---\n\n';
            });
        });

        return output;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT TO TITAN NAMESPACE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.veoPrompts = {
        // Main API
        generate,
        generateScenePrompt,
        formatForDisplay,

        // Scene management
        splitScriptIntoScenes,
        organizeIntoBatches,

        // Style & DNA
        getStyleAnchor,
        getStyleSpec,
        extractScriptDNA,
        buildDNAInjectionBlock,

        // Color utilities
        convertHexToColorName,
        replaceHexWithColorNames,

        // Configuration
        CONFIG: VEO_CONFIG
    };

    console.log('✅ TITAN.veoPrompts loaded - VEO 3 prompt generation');

})(window.TITAN = window.TITAN || {});
