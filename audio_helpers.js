// ============================================
// AUDIO STRATEGY HELPER FUNCTIONS
// BGM excluded - SFX only for scene-specific sounds
// ============================================

// Sound effect libraries
const HOOK_SOUNDS = [
    "dramatic whoosh",
    "record scratch with sudden silence",
    "attention bell chime",
    "cinematic trailer hit",
    "news broadcast sting"
];

const TRANSITION_SOUNDS = [
    "page turn sound",
    "smooth swoosh transition",
    "camera shutter click",
    "digital glitch effect",
    "magic sparkle"
];

const ENDING_SOUNDS = [
    "success completion chime",
    "subscribe button pop sound",
    "notification ping",
    "triumphant fanfare (short 2s)",
    "achievement unlock sound"
];

const AMBIENT_SOUNDS = {
    office: "quiet keyboard typing, distant phone rings, subtle room tone",
    nature: "birds chirping, gentle breeze, rustling leaves",
    city: "distant traffic, urban ambience, pedestrian sounds",
    cafe: "coffee machine hum, light chatter, dishes clinking",
    home: "subtle room tone, clock ticking quietly",
    space: "low frequency hum, ethereal tones",
    forest: "forest ambience, bird calls, branch creaking",
    beach: "gentle waves, seagulls, wind",
    studio: "quiet studio ambience, subtle air conditioning"
};

/**
 * Generate audio specification for a scene
 * @param {number} sceneNumber - Current scene number (1-indexed)
 * @param {number} totalScenes - Total number of scenes
 * @param {string} environment - Scene environment/setting
 * @returns {string} Formatted audio specification
 */
function generateAudioSpec(sceneNumber, totalScenes, environment = 'studio') {
    const audioSpecs = [];

    // Hook sound for first scene
    if (sceneNumber === 1) {
        const hookSound = HOOK_SOUNDS[Math.floor(Math.random() * HOOK_SOUNDS.length)];
        audioSpecs.push(`[HOOK SFX] ${hookSound}`);
    }

    // Transition sounds for middle scenes
    if (sceneNumber > 1 && sceneNumber < totalScenes) {
        const transitionSound = TRANSITION_SOUNDS[Math.floor(Math.random() * TRANSITION_SOUNDS.length)];
        audioSpecs.push(`[TRANSITION SFX] ${transitionSound}`);
    }

    // Ending sound for last scene
    if (sceneNumber === totalScenes) {
        const endingSound = ENDING_SOUNDS[Math.floor(Math.random() * ENDING_SOUNDS.length)];
        audioSpecs.push(`[ENDING SFX] ${endingSound}`);
    }

    // Ambient sounds based on environment
    const ambientKey = Object.keys(AMBIENT_SOUNDS).find(key =>
        environment.toLowerCase().includes(key)
    ) || 'studio';
    audioSpecs.push(`[AMBIENT] ${AMBIENT_SOUNDS[ambientKey]}`);

    // Always exclude BGM with note
    audioSpecs.push(`[BGM] NONE - Continuous BGM will be added in post-production`);

    return audioSpecs.join('\\n');
}

/**
 * Get audio guidelines for the AI prompt
 * @returns {string} Audio guidelines text
 */
function getAudioGuidelines() {
    return `## AUDIO STRATEGY (CRITICAL)

**⚠️ NO BACKGROUND MUSIC (BGM) IN PROMPTS**
- VEO generates each scene independently = BGM will be inconsistent between scenes
- BGM creates jarring audio cuts when merging clips
- **Solution:** Add ONE continuous BGM track in post-production

**✅ INCLUDE: Scene-Specific Sound Effects**
1. **HOOK SFX** (Scene 01 only): Attention-grabbing sound (whoosh, record scratch, bell chime)
2. **TRANSITION SFX** (Middle scenes): Scene transition cues (page turn, swoosh, click)
3. **ENDING SFX** (Final scene): Completion sounds (success chime, subscribe pop, notification ping)
4. **AMBIENT**: Environmental sounds matching scene setting(office, nature, city, etc.)
5. **ACTION SFX**: Specific sounds for character actions (footsteps, typing, door opens)

**Format:**
[HOOK SFX] dramatic whoosh (Scene 01 only)
[TRANSITION SFX] page turn sound (Middle scenes)
[ENDING SFX] subscribe button pop (Final scene only)
[AMBIENT] quiet office sounds, keyboard typing
[ACTION SFX] footsteps on wooden floor, door creaking
[BGM] NONE - Post-production

**DO NOT include:**
❌ "Uplifting piano music"
❌ "Orchestral score"
❌ "Lo-fi hip-hop background"
❌ Any continuous music descriptions`;
}
