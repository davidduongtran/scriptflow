/**
 * ScriptFlow - Voice Profiles Data v2.0
 * Multi-Voice Anchor System for VEO Consistency
 * 
 * Contains:
 * - VOICE_PROFILES: 20+ voice specifications (male, female, character, neutral)
 * - VOICE_ACCENT_OPTIONS: 7 regional accent configurations
 * - VIDEO_FORMAT_TEMPLATES: 9 video format presets with voice combinations
 * - NICHE_FORMAT_RECOMMENDATIONS: Default voice recommendations per content niche
 * 
 * @module data/voiceProfiles
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // VOICE ACCENT OPTIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.voiceAccentOptions = {
        'american_standard': {
            id: 'american_standard',
            name: 'American Standard',
            shortName: 'US',
            description: 'Clear American English, neutral midwest accent',
            spec: 'American English accent, clear neutral pronunciation',
            isDefault: true
        },
        'american_southern': {
            id: 'american_southern',
            name: 'American Southern',
            shortName: 'US South',
            description: 'Warm Southern American accent',
            spec: 'Southern American accent, warm drawl, friendly intonation'
        },
        'british_rp': {
            id: 'british_rp',
            name: 'British RP',
            shortName: 'UK RP',
            description: 'British Received Pronunciation (formal)',
            spec: 'British RP accent, formal refined pronunciation, authoritative'
        },
        'british_casual': {
            id: 'british_casual',
            name: 'British Casual',
            shortName: 'UK Casual',
            description: 'Modern British English, approachable',
            spec: 'British accent, modern casual pronunciation, approachable'
        },
        'australian': {
            id: 'australian',
            name: 'Australian',
            shortName: 'AU',
            description: 'Australian English accent',
            spec: 'Australian accent, relaxed friendly intonation'
        },
        'indian_english': {
            id: 'indian_english',
            name: 'Indian English',
            shortName: 'IN',
            description: 'Indian English accent',
            spec: 'Indian English accent, clear articulate pronunciation'
        },
        'international': {
            id: 'international',
            name: 'International/Neutral',
            shortName: 'Neutral',
            description: 'Neutral English for global audiences',
            spec: 'neutral international English, clear universal pronunciation'
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // VOICE PROFILES DATABASE
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.voiceProfiles = {
        // ═══════════════════════════════════════════════════════════════════════════════
        // MALE VOICES (7)
        // ═══════════════════════════════════════════════════════════════════════════════
        deep_authoritative_male: {
            id: 'deep_authoritative_male',
            name: 'Deep Authoritative Male',
            shortName: 'Deep Male',
            category: 'Male',
            gender: 'male',
            ageRange: '40-55',
            description: 'Deep, commanding voice with authority and gravitas',
            fullSpec: 'deep male voice, baritone register, age 45-50, slow deliberate pace, authoritative and commanding tone, serious gravitas, low controlled energy, confident measured delivery, slight resonance',
            compactSpec: 'deep male baritone 45yo, slow authoritative, serious commanding',
            negativePrompts: 'female voice, high pitch, fast speech, casual tone, cheerful energy, young voice',
            bestFor: ['Philosophy', 'Strategy', 'Dark Psychology', 'History', 'Machiavelli-style']
        },
        calm_therapist_male: {
            id: 'calm_therapist_male',
            name: 'Calm Therapist Male',
            shortName: 'Calm Male',
            category: 'Male',
            gender: 'male',
            ageRange: '35-50',
            description: 'Calm, reassuring voice like a wise therapist',
            fullSpec: 'male voice, age 40-45, calm and warm tone, deep but gentle register, slow meditative pace, empathetic and reassuring delivery, soft controlled energy, wise guide persona',
            compactSpec: 'calm male 40yo, warm gentle, slow reassuring therapist',
            negativePrompts: 'female voice, harsh tone, fast speech, aggressive energy, cold clinical',
            bestFor: ['Psychology', 'Mental Health', 'Self-Help', 'Meditation', 'Wellness']
        },
        energetic_educator_male: {
            id: 'energetic_educator_male',
            name: 'Energetic Educator Male',
            shortName: 'Energetic Male',
            category: 'Male',
            gender: 'male',
            ageRange: '30-40',
            description: 'Enthusiastic, clear voice for educational content',
            fullSpec: 'male voice, age 32-38, clear articulate tone, medium-high energy, enthusiastic but professional pace, engaging educator delivery, warm and approachable',
            compactSpec: 'energetic male 35yo, clear enthusiastic, engaging educator',
            negativePrompts: 'female voice, monotone, sleepy energy, mumbling, overly serious',
            bestFor: ['Education', 'Science', 'Technology', 'Finance Basics', 'How-To']
        },
        confident_finance_male: {
            id: 'confident_finance_male',
            name: 'Confident Finance Male',
            shortName: 'Finance Male',
            category: 'Male',
            gender: 'male',
            ageRange: '35-50',
            description: 'Professional, confident voice for finance content',
            fullSpec: 'male voice, age 38-45, confident professional tone, clear articulate delivery, medium pace with strategic pauses, authoritative but approachable, business gravitas',
            compactSpec: 'confident male 40yo, professional finance, clear authoritative',
            negativePrompts: 'female voice, casual slang, mumbling, uncertain tone, overly emotional',
            bestFor: ['Personal Finance', 'Investing', 'Business', 'Economics']
        },
        mysterious_narrator_male: {
            id: 'mysterious_narrator_male',
            name: 'Mysterious Narrator Male',
            shortName: 'Mysterious Male',
            category: 'Male',
            gender: 'male',
            ageRange: '40-55',
            description: 'Intriguing, slightly conspiratorial narrator',
            fullSpec: 'deep male voice, age 45-50, mysterious intriguing tone, slow deliberate pace, slightly conspiratorial whisper quality, dramatic pauses, secrets-sharing persona',
            compactSpec: 'mysterious male 45yo, slow intriguing, conspiratorial whisper',
            negativePrompts: 'female voice, bright cheerful tone, fast casual speech, loud volume',
            bestFor: ['Dark Psychology', 'Conspiracy', 'True Crime', 'Mystery', 'Hidden Knowledge']
        },
        wise_elder_male: {
            id: 'wise_elder_male',
            name: 'Wise Elder Male',
            shortName: 'Elder Male',
            category: 'Male',
            gender: 'male',
            ageRange: '65-80',
            description: 'Elderly wise voice sharing wisdom',
            fullSpec: 'elderly male voice, age 70-75, wise sage tone, slow thoughtful pace, warm gravelly texture, grandfather-like wisdom, gentle authority, slight weathered quality',
            compactSpec: 'elderly wise male 70yo, slow thoughtful, warm grandfatherly',
            negativePrompts: 'young voice, female voice, fast energetic pace, harsh aggressive',
            bestFor: ['Philosophy', 'Life Lessons', 'Wisdom', 'Stoicism', 'Ancient Knowledge']
        },
        young_male_relatable: {
            id: 'young_male_relatable',
            name: 'Young Relatable Male',
            shortName: 'Young Male',
            category: 'Male',
            gender: 'male',
            ageRange: '20-28',
            description: 'Young, relatable voice for Gen-Z/Millennial content',
            fullSpec: 'young male voice, age 23-27, relatable conversational tone, natural casual pace, genuine authentic delivery, peer-to-peer energy, slightly upbeat',
            compactSpec: 'young male 25yo, relatable casual, genuine peer-like',
            negativePrompts: 'elderly voice, female voice, formal stiff tone, robotic delivery',
            bestFor: ['Lifestyle', 'Gaming', 'College', 'Social Media', 'Young Adult']
        },

        // ═══════════════════════════════════════════════════════════════════════════════
        // FEMALE VOICES (5)
        // ═══════════════════════════════════════════════════════════════════════════════
        warm_narrator_female: {
            id: 'warm_narrator_female',
            name: 'Warm Narrator Female',
            shortName: 'Warm Female',
            category: 'Female',
            gender: 'female',
            ageRange: '30-45',
            description: 'Warm, friendly female narrator',
            fullSpec: 'female voice, age 35-40, warm friendly tone, medium pitch, calm steady pace, approachable and genuine delivery, conversational but professional',
            compactSpec: 'warm female 38yo, friendly calm, steady conversational',
            negativePrompts: 'male voice, cold clinical tone, overly dramatic, childish pitch',
            bestFor: ['Lifestyle', 'Wellness', 'Relationships', 'Self-Care', 'Psychology']
        },
        calm_soothing_female: {
            id: 'calm_soothing_female',
            name: 'Calm Soothing Female',
            shortName: 'Soothing Female',
            category: 'Female',
            gender: 'female',
            ageRange: '30-45',
            description: 'Soft, calming voice for sensitive content',
            fullSpec: 'female voice, age 35-42, soft soothing tone, gentle low-medium pitch, slow calming pace, therapeutic and reassuring delivery, nurturing energy',
            compactSpec: 'soft female 38yo, soothing gentle, slow calming therapeutic',
            negativePrompts: 'male voice, harsh tone, fast speech, loud volume, aggressive energy',
            bestFor: ['Mental Health', 'Meditation', 'Anxiety Relief', 'Healing', 'Sleep']
        },
        confident_professional_female: {
            id: 'confident_professional_female',
            name: 'Confident Professional Female',
            shortName: 'Professional Female',
            category: 'Female',
            gender: 'female',
            ageRange: '32-48',
            description: 'Professional, authoritative female voice',
            fullSpec: 'female voice, age 38-45, confident professional tone, clear articulate delivery, medium pace, authoritative but warm, expert persona, polished',
            compactSpec: 'confident female 40yo, professional authoritative, clear expert',
            negativePrompts: 'male voice, uncertain hesitant tone, casual slang, high squeaky pitch',
            bestFor: ['Business', 'Finance', 'Career', 'Education', 'News', 'Documentary']
        },
        youthful_relatable_female: {
            id: 'youthful_relatable_female',
            name: 'Youthful Relatable Female',
            shortName: 'Young Female',
            category: 'Female',
            gender: 'female',
            ageRange: '18-27',
            description: 'Young, relatable voice for Gen-Z content',
            fullSpec: 'young female voice, age 22-26, relatable friendly tone, conversational natural pace, warm and genuine delivery, peer-to-peer energy, slightly upbeat',
            compactSpec: 'young female 24yo, relatable conversational, warm genuine',
            negativePrompts: 'male voice, old formal tone, robotic delivery, overly serious',
            bestFor: ['Lifestyle', 'Relationships', 'College', 'Young Adult Psychology', 'Social']
        },
        expert_female: {
            id: 'expert_female',
            name: 'Expert Female (Interview Guest)',
            shortName: 'Expert Female',
            category: 'Female',
            gender: 'female',
            ageRange: '40-55',
            description: 'Knowledgeable expert voice for interviews',
            fullSpec: 'female voice, age 45-50, knowledgeable expert tone, thoughtful measured pace, intellectual delivery, confident with occasional contemplative pauses, credible authority',
            compactSpec: 'expert female 47yo, knowledgeable thoughtful, intellectual authority',
            negativePrompts: 'male voice, uncertain tone, fast rushed speech, casual slang',
            bestFor: ['Interview Guest', 'Expert Commentary', 'Academic Content', 'Documentary']
        },

        // ═══════════════════════════════════════════════════════════════════════════════
        // CHARACTER VOICES (6)
        // ═══════════════════════════════════════════════════════════════════════════════
        curious_student: {
            id: 'curious_student',
            name: 'Curious Student',
            shortName: 'Student',
            category: 'Character',
            gender: 'neutral',
            ageRange: '18-25',
            description: 'Inquisitive student asking questions',
            fullSpec: 'young voice, age 20-24, curious inquisitive tone, questioning upward inflection, eager to learn energy, slightly uncertain but engaged',
            compactSpec: 'young curious 22yo, inquisitive questioning, eager learner',
            negativePrompts: 'elderly voice, authoritative tone, confident expert delivery',
            bestFor: ['Q&A segments', 'Educational dialogues', 'Tutorial interruptions']
        },
        skeptical_questioner: {
            id: 'skeptical_questioner',
            name: 'Skeptical Questioner',
            shortName: 'Skeptic',
            category: 'Character',
            gender: 'neutral',
            ageRange: '30-45',
            description: 'Challenging voice that questions claims',
            fullSpec: 'mature voice, age 35-42, skeptical questioning tone, deliberate pace, slightly challenging delivery, rational and analytical, raised eyebrow energy',
            compactSpec: 'skeptical mature 38yo, questioning deliberate, challenging analytical',
            negativePrompts: 'agreeable tone, enthusiastic acceptance, naive questioning',
            bestFor: ['Debate counterpoints', 'Critical analysis', 'Devil\'s advocate']
        },
        anxious_patient: {
            id: 'anxious_patient',
            name: 'Anxious Patient/Client',
            shortName: 'Anxious',
            category: 'Character',
            gender: 'neutral',
            ageRange: '25-40',
            description: 'Vulnerable voice seeking help',
            fullSpec: 'voice with slight tremor, age 28-35, anxious vulnerable tone, hesitant pace with pauses, seeking reassurance, emotionally raw but trying to communicate',
            compactSpec: 'anxious vulnerable 30yo, hesitant trembling, seeking help',
            negativePrompts: 'confident tone, fast speech, cheerful energy, authoritative',
            bestFor: ['Therapy scenarios', 'Mental health examples', 'Before/after contrast']
        },
        inner_voice: {
            id: 'inner_voice',
            name: 'Inner Voice/Thoughts',
            shortName: 'Inner Voice',
            category: 'Character',
            gender: 'neutral',
            ageRange: 'varies',
            description: 'Internal monologue voice',
            fullSpec: 'slightly echoed voice, intimate whisper quality, introspective tone, slower contemplative pace, as if thinking aloud, vulnerable honesty',
            compactSpec: 'echoed intimate whisper, introspective contemplative, thinking aloud',
            negativePrompts: 'loud projecting voice, external addressing tone, fast speech',
            bestFor: ['Internal dialogue', 'Thought examples', 'Self-reflection moments']
        },
        historical_voice: {
            id: 'historical_voice',
            name: 'Historical Figure Quote',
            shortName: 'Historical',
            category: 'Character',
            gender: 'male',
            ageRange: '50-70',
            description: 'Voice for historical quotes',
            fullSpec: 'distinguished elderly male voice, age 55-65, formal oratorical tone, measured deliberate pace, gravitas and weight, as if speaking from history, slight theatrical quality',
            compactSpec: 'distinguished elderly 60yo, formal oratorical, historical gravitas',
            negativePrompts: 'casual modern tone, young voice, fast speech, informal delivery',
            bestFor: ['Historical quotes', 'Famous sayings', 'Philosophical references']
        },
        young_seeker: {
            id: 'young_seeker',
            name: 'Young Seeker',
            shortName: 'Seeker',
            category: 'Character',
            gender: 'neutral',
            ageRange: '18-28',
            description: 'Young person seeking wisdom/answers',
            fullSpec: 'young voice, age 22-26, earnest seeking tone, respectful but questioning, mix of hope and uncertainty, genuine desire to understand',
            compactSpec: 'young earnest 24yo, seeking respectful, hopeful uncertain',
            negativePrompts: 'cynical tone, elderly voice, dismissive attitude',
            bestFor: ['Wisdom dialogues', 'Mentor/student scenarios', 'Philosophical questions']
        },

        // ═══════════════════════════════════════════════════════════════════════════════
        // NEUTRAL/UTILITY VOICES (2)
        // ═══════════════════════════════════════════════════════════════════════════════
        neutral_documentary: {
            id: 'neutral_documentary',
            name: 'Neutral Documentary',
            shortName: 'Documentary',
            category: 'Neutral',
            gender: 'neutral',
            ageRange: '35-50',
            description: 'Professional documentary narration',
            fullSpec: 'professional narrator voice, age 40-48, neutral documentary tone, clear articulate delivery, measured informative pace, objective authoritative style',
            compactSpec: 'neutral documentary 45yo, clear objective, measured informative',
            negativePrompts: 'emotional dramatic tone, casual conversational, singing, heavy accent',
            bestFor: ['Documentary', 'History', 'Science', 'Nature', 'Factual']
        },
        announcer: {
            id: 'announcer',
            name: 'Announcer/Intro Voice',
            shortName: 'Announcer',
            category: 'Utility',
            gender: 'male',
            ageRange: '35-50',
            description: 'Bold announcer for intros/transitions',
            fullSpec: 'male announcer voice, age 40-45, bold energetic tone, clear projecting delivery, medium-fast pace, attention-grabbing, broadcast quality',
            compactSpec: 'bold announcer 42yo, energetic projecting, attention-grabbing',
            negativePrompts: 'soft quiet voice, mumbling, slow sleepy pace, uncertain tone',
            bestFor: ['Video intros', 'Segment transitions', 'Call-to-actions']
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // VIDEO FORMAT TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.videoFormatTemplates = {
        // Single Voice
        single_narrator: {
            id: 'single_narrator',
            name: 'Single Narrator',
            description: 'Standard single voice narration',
            voiceCount: 1,
            slots: [
                { role: 'NARRATOR', label: 'Main Narrator', required: true, defaultProfile: 'confident_finance_male' }
            ],
            instructions: 'All voiceover uses [NARRATOR] (V.O.) tag',
            bestFor: ['Standard explainers', 'Tutorials', 'Most content']
        },

        // Dual Voice Formats
        interview: {
            id: 'interview',
            name: 'Interview Format',
            description: 'Host interviewing a guest expert',
            voiceCount: 2,
            slots: [
                { role: 'HOST', label: 'Interview Host', required: true, defaultProfile: 'warm_narrator_female', responsibilities: 'Asks questions, introduces topics' },
                { role: 'GUEST', label: 'Expert Guest', required: true, defaultProfile: 'expert_female', responsibilities: 'Provides expert answers' }
            ],
            instructions: '[HOST] asks questions, [GUEST] provides expert answers. Maintain clear distinction.',
            exampleExchange: '[HOST]: "What\'s the biggest misconception?"\n[GUEST]: "The biggest misconception is..."',
            bestFor: ['Expert interviews', 'Podcast-style', 'Q&A content']
        },
        host_and_questioner: {
            id: 'host_and_questioner',
            name: 'Host + Audience Questions',
            description: 'Main host with student/audience questions',
            voiceCount: 2,
            slots: [
                { role: 'HOST', label: 'Main Host/Teacher', required: true, defaultProfile: 'energetic_educator_male', responsibilities: 'Teaches, explains, answers' },
                { role: 'STUDENT', label: 'Student/Audience', required: true, defaultProfile: 'curious_student', responsibilities: 'Asks clarifying questions' }
            ],
            instructions: '[HOST] provides main content, [STUDENT] interjects with viewer questions.',
            exampleExchange: '[HOST]: "Compound interest works by..."\n[STUDENT]: "But what if I can only invest $50?"\n[HOST]: "Great question!"',
            bestFor: ['Educational content', 'Tutorials', 'FAQ-style']
        },
        debate_two_sides: {
            id: 'debate_two_sides',
            name: 'Two-Sided Debate',
            description: 'Presenting two contrasting viewpoints',
            voiceCount: 2,
            slots: [
                { role: 'SIDE_A', label: 'Position A', required: true, defaultProfile: 'confident_finance_male', responsibilities: 'Argues for Position A' },
                { role: 'SIDE_B', label: 'Position B', required: true, defaultProfile: 'confident_professional_female', responsibilities: 'Argues for Position B' }
            ],
            instructions: 'Keep voices clearly distinct (different gender). Both should sound equally credible.',
            exampleExchange: '[SIDE_A]: "Introverts make better leaders because..."\n[SIDE_B]: "But extroverts build stronger connections..."',
            bestFor: ['Comparison videos', 'Pros vs Cons', 'Two perspectives']
        },
        narrator_with_quotes: {
            id: 'narrator_with_quotes',
            name: 'Narrator + Historical Quotes',
            description: 'Main narrator with distinguished quote voice',
            voiceCount: 2,
            slots: [
                { role: 'NARRATOR', label: 'Main Narrator', required: true, defaultProfile: 'deep_authoritative_male', responsibilities: 'Primary narration, context' },
                { role: 'QUOTE', label: 'Quote Voice', required: true, defaultProfile: 'historical_voice', responsibilities: 'Delivers historical quotes' }
            ],
            instructions: '[NARRATOR] provides context, [QUOTE] delivers quotes with gravitas. Use QUOTE sparingly.',
            exampleExchange: '[NARRATOR]: "Machiavelli understood this when he wrote..."\n[QUOTE]: "Everyone sees what you appear to be."',
            bestFor: ['Philosophy', 'History', 'Wisdom content', 'Documentary']
        },
        narrator_with_inner_voice: {
            id: 'narrator_with_inner_voice',
            name: 'Narrator + Inner Thoughts',
            description: 'Main voice with internal monologue moments',
            voiceCount: 2,
            slots: [
                { role: 'NARRATOR', label: 'Main Narrator', required: true, defaultProfile: 'calm_therapist_male', responsibilities: 'Primary narration' },
                { role: 'INNER', label: 'Inner Voice', required: true, defaultProfile: 'inner_voice', responsibilities: 'Internal thoughts, self-talk' }
            ],
            instructions: '[NARRATOR] provides external narration, [INNER] represents private thoughts (echoed, intimate).',
            exampleExchange: '[NARRATOR]: "When someone criticizes you..."\n[INNER]: "Did everyone just see that?"\n[NARRATOR]: "This is catastrophizing."',
            bestFor: ['Psychology', 'Mental health', 'Self-improvement']
        },

        // Multi-Voice Formats (3+)
        moderated_debate: {
            id: 'moderated_debate',
            name: 'Moderated Debate (3 voices)',
            description: 'Neutral moderator with two opposing sides',
            voiceCount: 3,
            slots: [
                { role: 'MODERATOR', label: 'Neutral Moderator', required: true, defaultProfile: 'neutral_documentary', responsibilities: 'Frames topics neutrally' },
                { role: 'PRO', label: 'Pro/Supporting View', required: true, defaultProfile: 'confident_finance_male', responsibilities: 'Argues in favor' },
                { role: 'CON', label: 'Con/Opposing View', required: true, defaultProfile: 'skeptical_questioner', responsibilities: 'Raises concerns' }
            ],
            instructions: '[MODERATOR] stays neutral, [PRO] supports, [CON] opposes. All voices distinct.',
            bestFor: ['Balanced analysis', 'Controversial topics', 'Educational debates']
        },
        story_with_characters: {
            id: 'story_with_characters',
            name: 'Story with Characters',
            description: 'Narrator telling a story with character voices',
            voiceCount: 3,
            slots: [
                { role: 'NARRATOR', label: 'Story Narrator', required: true, defaultProfile: 'mysterious_narrator_male', responsibilities: 'Narrates the story' },
                { role: 'CHAR_A', label: 'Character A', required: false, defaultProfile: 'young_male_relatable', responsibilities: 'Main character' },
                { role: 'CHAR_B', label: 'Character B', required: false, defaultProfile: 'wise_elder_male', responsibilities: 'Secondary character' }
            ],
            instructions: '[NARRATOR] drives story, [CHAR_A/B] speak dialogue. Keep character lines brief.',
            bestFor: ['Storytelling', 'Case studies', 'Parables']
        },
        panel_discussion: {
            id: 'panel_discussion',
            name: 'Panel Discussion (4 voices)',
            description: 'Multiple experts discussing a topic',
            voiceCount: 4,
            slots: [
                { role: 'HOST', label: 'Panel Host', required: true, defaultProfile: 'warm_narrator_female' },
                { role: 'EXPERT_1', label: 'Expert 1', required: true, defaultProfile: 'calm_therapist_male' },
                { role: 'EXPERT_2', label: 'Expert 2', required: true, defaultProfile: 'expert_female' },
                { role: 'EXPERT_3', label: 'Expert 3', required: false, defaultProfile: 'confident_finance_male' }
            ],
            instructions: '[HOST] moderates. Each expert brings different perspective. Use different genders/tones.',
            bestFor: ['Expert roundtables', 'Multi-perspective analysis']
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // NICHE-BASED FORMAT RECOMMENDATIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.nicheFormatRecommendations = {
        finance: { primary: 'single_narrator', primaryVoice: 'confident_finance_male' },
        psychology: { primary: 'narrator_with_inner_voice', primaryVoice: 'calm_therapist_male' },
        education: { primary: 'host_and_questioner', primaryVoice: 'energetic_educator_male' },
        history: { primary: 'narrator_with_quotes', primaryVoice: 'deep_authoritative_male' },
        motivation: { primary: 'single_narrator', primaryVoice: 'deep_authoritative_male' },
        spirituality: { primary: 'single_narrator', primaryVoice: 'calm_soothing_female' },
        lifestyle: { primary: 'single_narrator', primaryVoice: 'warm_narrator_female' }
    };

    // Legacy global aliases for backward compatibility
    window.VOICE_PROFILES = TITAN.voiceProfiles;
    window.VOICE_ACCENT_OPTIONS = TITAN.voiceAccentOptions;
    window.VIDEO_FORMAT_TEMPLATES = TITAN.videoFormatTemplates;
    window.NICHE_FORMAT_RECOMMENDATIONS = TITAN.nicheFormatRecommendations;

    console.log('✅ TITAN.voiceProfiles loaded - 20 profiles, 7 accents, 9 format templates');

})(window.TITAN = window.TITAN || {});
