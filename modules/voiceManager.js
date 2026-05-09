/**
 * ScriptFlow - Voice Manager Module
 * Multi-voice configuration and management for VEO consistency
 * 
 * @module modules/voiceManager
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // DEPENDENCIES
    // ═══════════════════════════════════════════════════════════════════════════════

    const getVoiceProfiles = () => TITAN.voiceProfiles || {};
    const getVoiceAccentOptions = () => TITAN.voiceAccentOptions || {};
    const getVideoFormatTemplates = () => TITAN.videoFormatTemplates || {};
    const getNicheFormatRecommendations = () => TITAN.nicheFormatRecommendations || {};

    // ═══════════════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════════════

    let currentVoiceConfig = null;

    // ═══════════════════════════════════════════════════════════════════════════════
    // ACCENT MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Get current accent selection
     * @returns {Object} Accent configuration
     */
    function getCurrentAccent() {
        const accentSelect = document.getElementById('voiceAccent');
        const accentId = accentSelect?.value || 'american_standard';
        const accents = getVoiceAccentOptions();
        return accents[accentId] || accents['american_standard'];
    }

    /**
     * Get all available accents
     * @returns {Object} All accent options
     */
    function getAllAccents() {
        return getVoiceAccentOptions();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // VOICE CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Create a voice configuration for a video
     * @param {string} formatId - Video format template ID
     * @param {Object} customSlots - Custom slot configurations
     * @returns {Object} Voice configuration
     */
    function createVoiceConfiguration(formatId, customSlots = {}) {
        const VIDEO_FORMAT_TEMPLATES = getVideoFormatTemplates();
        const VOICE_PROFILES = getVoiceProfiles();

        const template = VIDEO_FORMAT_TEMPLATES[formatId] || VIDEO_FORMAT_TEMPLATES.single_narrator;

        const config = {
            formatId: formatId,
            formatName: template.name,
            voiceCount: template.voiceCount,
            slots: {},
            globalInstructions: template.instructions,
            exampleExchange: template.exampleExchange || null
        };

        template.slots.forEach(slotTemplate => {
            const customConfig = customSlots[slotTemplate.role] || {};
            let profileId = customConfig.profile || slotTemplate.defaultProfile;
            const profile = VOICE_PROFILES[profileId];

            config.slots[slotTemplate.role] = {
                role: slotTemplate.role,
                label: slotTemplate.label,
                required: slotTemplate.required,
                profileId: profileId,
                profile: profile,
                customName: customConfig.name || slotTemplate.role,
                fullSpec: profile?.fullSpec || profileId,
                compactSpec: profile?.compactSpec || profileId,
                responsibilities: slotTemplate.responsibilities || ''
            };
        });

        return config;
    }

    /**
     * Generate Multi-Voice Anchor for injection into master prompt
     * @param {Object} voiceConfig - Voice configuration object
     * @returns {string} Formatted voice anchor markdown
     */
    function getMultiVoiceAnchor(voiceConfig) {
        const { formatName, voiceCount, slots, globalInstructions, exampleExchange } = voiceConfig;

        const accent = getCurrentAccent();
        const accentSpec = accent.spec;

        let slotSpecs = '';
        let voiceTagReference = '';

        Object.values(slots).forEach((slot, index) => {
            const fullVoiceSpec = slot.fullSpec || slot.compactSpec;
            const voiceWithAccent = `${fullVoiceSpec}, ${accentSpec}`;

            slotSpecs += `
### Voice ${index + 1}: ${slot.label} [${slot.role}]
- **Role:** ${slot.responsibilities || slot.label}
- **Profile:** ${slot.profile?.name || 'Custom'}
- **Full Voice Specification:**
\`\`\`
${voiceWithAccent}
\`\`\`
- **Per-Scene Tag:** \`[VOICE_${slot.role}: ${voiceWithAccent}]\`
- **Dialogue Format:** \`[${slot.customName || slot.role}]: "dialogue..."\`
`;
            voiceTagReference += `[VOICE_${slot.role}: ${voiceWithAccent}]\n`;
        });

        return `
## 🎙️ VOICE ANCHOR (${voiceCount} VOICE${voiceCount > 1 ? 'S' : ''})

**CRITICAL:** VEO 3 / Flow generates each clip INDEPENDENTLY with NO memory between scenes.
This Voice Anchor ensures ALL voices remain consistent across ALL scenes.

### Video Format: ${formatName}
${slotSpecs}

### Voice Differentiation Rules
${globalInstructions}

${exampleExchange ? `### Example Exchange\n\`\`\`\n${exampleExchange}\n\`\`\`\n` : ''}

### Consistency Rules
1. ✅ Include voice specification in EVERY voiceover line
2. ✅ MAINTAIN voice characteristics throughout - no drift
3. ❌ DO NOT switch voice profiles mid-video
4. ❌ DO NOT add new voice roles not defined here

---
`;
    }

    /**
     * Get current voice configuration
     * @returns {Object} Current configuration
     */
    function getCurrentVoiceConfig() {
        if (!currentVoiceConfig) {
            updateVoiceConfiguration();
        }
        return currentVoiceConfig;
    }

    /**
     * Update voice configuration from UI state
     * @returns {Object} Updated configuration
     */
    function updateVoiceConfiguration() {
        const formatSelect = document.getElementById('videoFormat');
        const formatId = formatSelect?.value || 'single_narrator';

        const customSlots = {};

        document.querySelectorAll('.voice-slot').forEach(slotEl => {
            const role = slotEl.dataset.role;
            const nameInput = slotEl.querySelector('.voice-name-input');
            const profileSelect = slotEl.querySelector('.voice-profile-select');

            customSlots[role] = {
                name: nameInput?.value || role,
                profile: profileSelect?.value || 'confident_finance_male'
            };
        });

        currentVoiceConfig = createVoiceConfiguration(formatId, customSlots);
        console.log('🎙️ Voice config updated:', currentVoiceConfig.formatName, '-', currentVoiceConfig.voiceCount, 'voices');
        return currentVoiceConfig;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // VOICE PARSING & MATCHING
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Parse voice direction from script header
     * @param {string} scriptText - Script text to parse
     * @returns {Object|null} Parsed voice direction
     */
    function parseScriptVoiceDirection(scriptText) {
        if (!scriptText) return null;

        const voiceMatch = scriptText.match(/\*?\*?Voice\*?\*?:?\s*([^\n\r]+)/i);
        if (!voiceMatch) return null;

        const rawText = voiceMatch[1].trim();
        const lowerText = rawText.toLowerCase();

        // Extract gender
        let gender = 'neutral';
        if (/\bmale\b|\bman\b|\bmasculine\b|\bbaritone\b/.test(lowerText)) gender = 'male';
        else if (/\bfemale\b|\bwoman\b|\bfeminine\b|\bsoprano\b/.test(lowerText)) gender = 'female';

        // Extract tone keywords
        const toneKeywords = [];
        const tonePatterns = [
            { pattern: /calm|soothing|peaceful|relaxed/i, tone: 'calm' },
            { pattern: /authoritative|commanding|powerful|serious/i, tone: 'authoritative' },
            { pattern: /warm|friendly|approachable|welcoming/i, tone: 'warm' },
            { pattern: /deep|low|baritone|bass/i, tone: 'deep' },
            { pattern: /energetic|upbeat|dynamic|lively/i, tone: 'energetic' },
            { pattern: /mysterious|intriguing|dark|conspiratorial/i, tone: 'mysterious' },
            { pattern: /professional|confident|business|corporate/i, tone: 'professional' },
            { pattern: /empathetic|reassuring|therapeutic|gentle/i, tone: 'empathetic' },
            { pattern: /wise|sagely|elder|thoughtful/i, tone: 'wise' }
        ];
        tonePatterns.forEach(({ pattern, tone }) => {
            if (pattern.test(lowerText)) toneKeywords.push(tone);
        });

        // Extract pace
        let pace = 'medium';
        if (/slow|deliberate|measured|unhurried/.test(lowerText)) pace = 'slow';
        else if (/fast|quick|rapid|energetic/.test(lowerText)) pace = 'fast';

        return { gender, tones: toneKeywords, pace, rawText };
    }

    /**
     * Match voice direction to best profile with scoring
     * @param {Object} voiceDirection - Parsed voice direction
     * @param {string} niche - Content niche
     * @returns {Object} Match result with profile, score, reasons
     */
    function matchVoiceToProfile(voiceDirection, niche = 'general') {
        if (!voiceDirection) return null;

        const VOICE_PROFILES = getVoiceProfiles();
        const NICHE_FORMAT_RECOMMENDATIONS = getNicheFormatRecommendations();

        const scores = {};
        const reasons = {};

        Object.entries(VOICE_PROFILES).forEach(([profileId, profile]) => {
            let score = 0;
            const matchReasons = [];

            // Gender match (40 points)
            if (voiceDirection.gender === profile.gender) {
                score += 40;
                matchReasons.push(`gender: ${profile.gender}`);
            } else if (voiceDirection.gender === 'neutral' || profile.gender === 'neutral') {
                score += 20;
            }

            // Tone match (30 points max)
            voiceDirection.tones.forEach(tone => {
                const profileDesc = (profile.fullSpec + ' ' + profile.description).toLowerCase();
                if (profileDesc.includes(tone)) {
                    score += 10;
                    matchReasons.push(`tone: ${tone}`);
                }
            });
            score = Math.min(score, 70);

            // Niche recommendation (20 points)
            const nicheRec = NICHE_FORMAT_RECOMMENDATIONS[niche];
            if (nicheRec && nicheRec.primaryVoice === profileId) {
                score += 20;
                matchReasons.push(`niche:${niche} recommended`);
            }

            // Pace match (10 points)
            const profileSpec = profile.fullSpec.toLowerCase();
            if ((voiceDirection.pace === 'slow' && /slow|deliberate|measured/.test(profileSpec)) ||
                (voiceDirection.pace === 'fast' && /fast|quick|energetic/.test(profileSpec))) {
                score += 10;
                matchReasons.push(`pace: ${voiceDirection.pace}`);
            }

            scores[profileId] = score;
            reasons[profileId] = matchReasons;
        });

        // Find best match
        const bestProfileId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
        const bestScore = scores[bestProfileId];
        const bestProfile = VOICE_PROFILES[bestProfileId];

        return {
            profileId: bestProfileId,
            profile: bestProfile,
            score: bestScore,
            confidence: Math.min(Math.round(bestScore / 100 * 100), 100),
            reasons: reasons[bestProfileId]
        };
    }

    /**
     * Get enhanced voice specification with accent
     * @param {string} profileId - Voice profile ID
     * @param {string} accentId - Accent ID
     * @returns {string} Complete voice spec
     */
    function getEnhancedVoiceSpec(profileId, accentId = 'american_standard') {
        const VOICE_PROFILES = getVoiceProfiles();
        const VOICE_ACCENT_OPTIONS = getVoiceAccentOptions();

        const profile = VOICE_PROFILES[profileId] || VOICE_PROFILES['deep_authoritative_male'];
        const accent = VOICE_ACCENT_OPTIONS[accentId] || VOICE_ACCENT_OPTIONS['american_standard'];

        return `${profile.compactSpec}, ${accent.spec}`;
    }

    /**
     * Get voice profile by ID
     * @param {string} profileId - Profile ID
     * @returns {Object|null} Voice profile
     */
    function getProfile(profileId) {
        const VOICE_PROFILES = getVoiceProfiles();
        return VOICE_PROFILES[profileId] || null;
    }

    /**
     * Get all voice profiles
     * @returns {Object} All profiles
     */
    function getAllProfiles() {
        return getVoiceProfiles();
    }

    /**
     * Get all format templates
     * @returns {Object} All format templates
     */
    function getAllFormats() {
        return getVideoFormatTemplates();
    }

    /**
     * Get recommended format for niche
     * @param {string} nicheKey - Niche identifier
     * @returns {Object|null} Recommended format and voice
     */
    function getRecommendedForNiche(nicheKey) {
        const recommendations = getNicheFormatRecommendations();
        return recommendations[nicheKey] || null;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORT TO TITAN NAMESPACE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.voiceManager = {
        // Accent
        getCurrentAccent,
        getAllAccents,

        // Configuration
        createVoiceConfiguration,
        getMultiVoiceAnchor,
        getCurrentVoiceConfig,
        updateVoiceConfiguration,

        // Parsing & Matching
        parseScriptVoiceDirection,
        matchVoiceToProfile,
        getEnhancedVoiceSpec,

        // Helpers
        getProfile,
        getAllProfiles,
        getAllFormats,
        getRecommendedForNiche
    };

    console.log('✅ TITAN.voiceManager loaded - multi-voice configuration');

})(window.TITAN = window.TITAN || {});
