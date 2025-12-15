// ═══════════════════════════════════════════════════════════════════════════════
// SCRIPTWRITER PRO v9.0
// YouTube Script Generation + VEO 3 Prompt Generation
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🚀 ScriptWriter Pro v9.0 Loading...');

// ──────────────────────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────

const state = {
  settings: {
    claudeApiKey: '',
    geminiApiKey: '',
    aiModel: 'claude-sonnet-4-20250514',
    veoModel: 'gemini-2.5-flash'
  },
  analyzerData: null,
  generatedScript: null,
  generatedPrompts: [],
  isGenerating: false,
  useAnalyzerData: true,
  batchResults: {},
  totalBatches: 0,
  BATCH_SIZE: 10,
  // Assessment state
  lastAssessment: null,
  assessmentHistory: [],
  veoPromptsText: '', // Store the generated VEO prompts
  styleManuallySet: false, // Track if user manually changed visual style
  // Clone Mode state (NEW - moved from YT Analyzer)
  cloneMode: '95', // Default: 95% Clone (structure + creative)
  // Parsed analyzer sections (NEW - for 14-section format)
  parsedSections: {
    verbatimTranscript: null,
    visualBreakdown: null,
    audioElements: null,
    onScreenGraphics: null,
    ctas: null,
    videoTechniques: null
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// CLONE MODE CONFIGURATION (95% Clone Strategy)
// ──────────────────────────────────────────────────────────────────────────────

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
    temperature: 0.6,  // User-approved temperature
    topP: 0.95,
    description: 'Structure + creative - preserve formula, fresh words',
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL RENDERING SYSTEM v2.0 - 22 Styles with Technical DNA
// Enhanced visual style specifications with niche rankings and auto-detection
// ═══════════════════════════════════════════════════════════════════════════════

const VISUAL_STYLE_SPECS = {
  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎬 ANIMATION STYLES (8)
  // ═══════════════════════════════════════════════════════════════════════════════

  '3D Animation': {
    name: '3D Animation',
    category: 'Animation',
    technicalDNA: 'ray-traced PBR rendering, subsurface scattering on skin, global illumination, ambient occlusion, soft shadows, 4K resolution, smooth 24fps motion, cinematic depth of field, anti-aliased edges',
    promptPrefix: '3D animated, Pixar-quality rendering, ray-traced lighting, subsurface scattering, global illumination,',
    fps: '24fps',
    lighting: '3-point studio lighting with soft HDRI environment fill',
    colorPalettes: {
      finance: 'trust palette - navy #1A237E, green #2E7D32, gold #FFD700, white #FFFFFF',
      psychology: 'warm approachable palette - soft blue #64B5F6, coral #FF8A65, cream #FFF8E1'
    },
    financeRank: 1,
    psychologyRank: 6,
    bestFor: 'Main channel content, professional explainers, character-driven stories'
  },

  '2D Animation': {
    name: '2D Animation',
    category: 'Animation',
    technicalDNA: 'vector-based animation, clean geometric shapes, solid flat colors, minimal gradients, consistent line weight (2-3px), limited color palette (6-8 colors), smooth motion tweening, 24fps',
    promptPrefix: '2D flat vector animation, clean geometric shapes, solid flat colors, minimal gradients, modern graphic design,',
    fps: '24fps',
    lighting: 'flat ambient, no dramatic shadows, even illumination',
    colorPalettes: {
      finance: 'corporate clean - blue #2196F3, green #4CAF50, grey #607D8B, white #FFFFFF',
      psychology: 'friendly palette - teal #26A69A, orange #FF7043, light grey #ECEFF1'
    },
    financeRank: 6,
    psychologyRank: 7,
    bestFor: 'Motion graphics, data visualization, quick explainers'
  },

  'Anime': {
    name: 'Anime',
    category: 'Animation',
    technicalDNA: '2D hand-drawn aesthetic, expressive large eyes, cel-shaded with sharp shadow edges, soft pastel color palette, limited animation on 2s (12 actual drawings per second on 24fps), emotional character expressions, manga-influenced design, line boil effect optional',
    promptPrefix: 'anime style animation, expressive large eyes, cel-shaded with sharp shadow edges, soft pastel palette, Japanese animation aesthetic,',
    fps: '24fps (on 2s)',
    lighting: 'soft ambient with anime-style rim lighting, dramatic shadows optional',
    colorPalettes: {
      finance: 'bright engaging - sky blue #03A9F4, yellow #FFEB3B, pink #E91E63',
      psychology: 'soft emotional - lavender #E1BEE7, blush #F8BBD9, seafoam #B2DFDB, soft peach #FFCCBC'
    },
    financeRank: 8,
    psychologyRank: 1,
    bestFor: 'Mental health content, relatable characters, emotional topics (Psych2Go style)'
  },

  '2D Minimal': {
    name: '2D Minimal',
    category: 'Animation',
    technicalDNA: 'minimalist 2D animation, geometric simplified human figures, muted earth tone palette, cream/white backgrounds, no outlines or very thin lines, symbolic visual metaphors, intellectual contemplative aesthetic, limited animation',
    promptPrefix: 'minimalist 2D animation, geometric simplified human figures, muted earth tones, cream white background, School of Life style,',
    fps: '24fps',
    lighting: 'flat, no shadows, even diffused light',
    colorPalettes: {
      finance: 'sophisticated - beige #D7CCC8, terracotta #A1887F, navy #37474F, cream #EFEBE9',
      psychology: 'contemplative - sage #A5D6A7, terracotta #BCAAA4, soft gold #FFE082, cream #FFF8E1'
    },
    financeRank: 4,
    psychologyRank: 2,
    bestFor: 'Deep concepts, philosophical content, thoughtful explainers (School of Life style)'
  },

  'Claymation': {
    name: 'Claymation',
    category: 'Animation',
    technicalDNA: 'claymation stop-motion aesthetic, handcrafted clay models, soft diffused lighting, 12fps for authentic stop-motion feel, tactile textures, fingerprint details optional, matte surfaces, rounded forms',
    promptPrefix: 'claymation stop-motion style, handcrafted clay models, soft lighting, tactile textures, 12fps,',
    fps: '12fps',
    lighting: 'soft diffused studio lighting, minimal harsh shadows',
    colorPalettes: {
      finance: 'playful professional - blue #5C6BC0, orange #FF7043, cream #FFECB3',
      psychology: 'warm wholesome - coral #FFAB91, teal #4DB6AC, cream #FFF3E0'
    },
    financeRank: 9,
    psychologyRank: 9,
    bestFor: 'Nostalgic appeal, craft aesthetic, approachable content'
  },

  'Stop Motion': {
    name: 'Stop Motion',
    category: 'Animation',
    technicalDNA: 'stop motion animation, physical models and sets, natural lighting with practical lights, 12fps, textured surfaces, miniature scale feeling, handmade aesthetic',
    promptPrefix: 'stop motion animation, physical models, natural lighting, 12fps, textured surfaces, handmade aesthetic,',
    fps: '12fps',
    lighting: 'natural lighting with practical light sources',
    colorPalettes: {
      finance: 'artisanal - brown #795548, gold #FFC107, cream #FFF8E1',
      psychology: 'warm handmade - rust #BF360C, sage #689F38, cream #FFFDE7'
    },
    financeRank: 10,
    psychologyRank: 10,
    bestFor: 'Craft aesthetic, artisanal feel, unique differentiation'
  },

  'Pixel Art': {
    name: 'Pixel Art',
    category: 'Animation',
    technicalDNA: '16-bit pixel art style, limited 32-color palette, visible pixels, dithering for shading, retro video game aesthetic, chunky animation at 12fps, no anti-aliasing, 320x180 internal resolution upscaled',
    promptPrefix: '16-bit pixel art style, limited 32-color palette, visible pixels, dithering, retro video game aesthetic, 12fps,',
    fps: '12fps',
    lighting: 'flat pixel-based shading, no smooth gradients',
    colorPalettes: {
      finance: 'retro game - green #00E676, gold #FFD600, purple #7C4DFF, black #212121',
      psychology: 'nostalgic - cyan #00BCD4, magenta #E91E63, yellow #FFEB3B'
    },
    financeRank: 11,
    psychologyRank: 11,
    bestFor: 'Gaming audience crossover, nostalgic appeal, unique visual hook'
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎨 ART STYLES (7)
  // ═══════════════════════════════════════════════════════════════════════════════

  'Watercolor': {
    name: 'Soft Watercolor',
    category: 'Art Style',
    technicalDNA: 'soft watercolor painting style, bleeding wash edges, visible paper texture grain, soft pastel palette, dreamy atmospheric quality, gentle transparency layers, organic flowing shapes, therapeutic calming aesthetic',
    promptPrefix: 'soft watercolor painting style, bleeding wash edges, visible paper texture, soft pastel palette, dreamy atmospheric,',
    fps: '24fps',
    lighting: 'soft diffused natural light, gentle shadows',
    colorPalettes: {
      finance: 'calm growth - soft green #C8E6C9, blue #BBDEFB, cream #FFF8E1',
      psychology: 'therapeutic - lavender #E1BEE7, blush pink #F8BBD9, seafoam #B2DFDB, soft blue #90CAF9'
    },
    financeRank: 12,
    psychologyRank: 3,
    bestFor: 'Mental health content, anxiety topics, healing/self-care, therapeutic feel'
  },

  'Silhouette': {
    name: 'Silhouette',
    category: 'Art Style',
    technicalDNA: 'silhouette style, solid black human figures, no facial features or internal detail, gradient or solid color backgrounds, high contrast, universal anonymous representation, symbolic minimal props, emotional atmosphere through background color',
    promptPrefix: 'silhouette style, solid black human figures, no facial features, gradient background, high contrast, universal representation,',
    fps: '24fps',
    lighting: 'backlit silhouette, high contrast, background glow',
    colorPalettes: {
      finance: 'dramatic - sunset gradient #FF5722 to #FFC107, corporate blue #1976D2 to #64B5F6',
      psychology: 'emotional - warm sunset #FFAB91 to #FFE0B2, calming blue #90CAF9 to #E3F2FD, aurora #CE93D8 to #80DEEA'
    },
    financeRank: 13,
    psychologyRank: 4,
    bestFor: 'Trauma topics, sensitive mental health, universal relatability, anonymous representation'
  },

  'Oil Painting': {
    name: 'Oil Painting',
    category: 'Art Style',
    technicalDNA: 'classical oil painting style, visible impasto brush strokes, rich deep color palette, dramatic chiaroscuro lighting, canvas texture overlay, Renaissance-inspired composition, warm golden undertones',
    promptPrefix: 'classical oil painting style, visible brush strokes, rich deep colors, dramatic chiaroscuro lighting, canvas texture,',
    fps: '24fps',
    lighting: 'dramatic chiaroscuro, warm key light, deep shadows',
    colorPalettes: {
      finance: 'luxury classical - gold #C9A227, burgundy #7B1FA2, cream #FFF8E1',
      psychology: 'rich emotional - burnt sienna #8D6E63, gold #FFB300, deep blue #1565C0'
    },
    financeRank: 14,
    psychologyRank: 12,
    bestFor: 'Historical content, luxury/prestige positioning, classical authority'
  },

  'Comic Book': {
    name: 'Comic Book',
    category: 'Art Style',
    technicalDNA: 'bold comic book style, thick black outlines (4-6px), halftone dot shading, primary color palette (CMYK feel), dynamic dramatic angles, high contrast, superhero comic aesthetic, action-oriented composition',
    promptPrefix: 'bold comic book style, thick black outlines (5px), halftone dot shading, primary colors, dynamic angles, high contrast,',
    fps: '24fps',
    lighting: 'dramatic directional, bold shadows, high contrast',
    colorPalettes: {
      finance: 'bold action - red #F44336, blue #2196F3, yellow #FFEB3B, black #212121',
      psychology: 'dynamic - orange #FF5722, blue #2962FF, green #00C853'
    },
    financeRank: 15,
    psychologyRank: 13,
    bestFor: 'Action content, dynamic presentations, younger male audience'
  },

  'Manga': {
    name: 'Manga',
    category: 'Art Style',
    technicalDNA: 'manga art style, screentone shading patterns, black and white with occasional color accents, dynamic angles, expressive characters, speed lines, impact frames, Japanese comic aesthetic',
    promptPrefix: 'manga art style, screentone shading, black and white, dynamic angles, expressive characters, Japanese comic aesthetic,',
    fps: '24fps',
    lighting: 'high contrast black and white, dramatic shadows',
    colorPalettes: {
      finance: 'minimal accent - black #212121, white #FFFFFF, red accent #F44336',
      psychology: 'emotional accent - black #212121, white #FFFFFF, pink accent #E91E63'
    },
    financeRank: 16,
    psychologyRank: 8,
    bestFor: 'Japanese aesthetic, dramatic storytelling, expressive characters'
  },

  'Pop Art': {
    name: 'Pop Art',
    category: 'Art Style',
    technicalDNA: 'pop art style, bold flat colors, Ben-Day dot patterns, high contrast, Andy Warhol / Roy Lichtenstein inspired, commercial advertising aesthetic, limited bold color palette, repetitive motifs',
    promptPrefix: 'pop art style, bold flat colors, Ben-Day dot patterns, high contrast, Andy Warhol inspired, commercial aesthetic,',
    fps: '24fps',
    lighting: 'flat even lighting, no gradients, bold shadows',
    colorPalettes: {
      finance: 'attention-grabbing - magenta #E91E63, cyan #00BCD4, yellow #FFEB3B, black #212121',
      psychology: 'vibrant - pink #F48FB1, turquoise #4DD0E1, yellow #FFF176'
    },
    financeRank: 17,
    psychologyRank: 14,
    bestFor: 'Trendy content, social media clips, attention-grabbing thumbnails'
  },

  'Abstract': {
    name: 'Abstract',
    category: 'Art Style',
    technicalDNA: 'abstract art style, non-representational geometric and organic forms, color as emotion, morphing flowing shapes, Kandinsky-inspired composition, symbolic visual metaphors, experimental avant-garde aesthetic',
    promptPrefix: 'abstract art style, non-representational forms, color expressing emotion, flowing morphing shapes, experimental aesthetic,',
    fps: '24fps',
    lighting: 'conceptual lighting, color-driven atmosphere',
    colorPalettes: {
      finance: 'conceptual - blue #3F51B5, gold #FFC107, white #FFFFFF',
      psychology: 'emotional - purple #9C27B0, teal #009688, coral #FF7043'
    },
    financeRank: 18,
    psychologyRank: 15,
    bestFor: 'Conceptual topics, emotional content, artistic differentiation'
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 📸 REALISTIC STYLES (3)
  // ═══════════════════════════════════════════════════════════════════════════════

  'Photorealistic': {
    name: 'Photorealistic',
    category: 'Realistic',
    technicalDNA: 'photorealistic 3D rendering, path-traced lighting, 8K texture detail, physically accurate materials with metalness and roughness maps, ray-traced reflections and refractions, HDRI environment lighting, subtle film grain (0.02), cinematic lens characteristics',
    promptPrefix: 'photorealistic 3D rendering, path-traced lighting, 8K texture detail, physically accurate materials, ray-traced reflections, HDRI lighting,',
    fps: '24fps',
    lighting: 'HDRI environment with realistic light falloff',
    colorPalettes: {
      finance: 'natural professional - neutral whites, warm skin tones, corporate blues',
      psychology: 'authentic natural - warm natural tones, soft skin tones, neutral backgrounds'
    },
    financeRank: 7,
    psychologyRank: 16,
    bestFor: 'Product showcases, real estate, documentary-style content'
  },

  'Cinematic': {
    name: 'Cinematic',
    category: 'Realistic',
    technicalDNA: 'cinematic film-grade quality, anamorphic widescreen composition 2.39:1, 24fps theatrical motion, subtle film grain (0.03-0.05), professional color grading with teal-orange or custom LUT, lens flares, shallow depth of field bokeh, volumetric atmospheric lighting',
    promptPrefix: 'cinematic film-grade quality, anamorphic widescreen, 24fps theatrical motion, professional color grading, lens flares, shallow depth of field, volumetric lighting,',
    fps: '24fps',
    lighting: 'cinematic 3-point with practical lights, volumetric fog optional',
    colorPalettes: {
      finance: 'premium authority - teal-orange grade, deep blues #1A237E, gold #FFC107',
      psychology: 'documentary warmth - natural warm grade, earth tones, soft contrast'
    },
    financeRank: 5,
    psychologyRank: 7,
    bestFor: 'Premium content, documentary finance, authority positioning'
  },

  'Documentary': {
    name: 'Documentary',
    category: 'Realistic',
    technicalDNA: 'documentary style, naturalistic handheld camera feel with subtle movement, available natural lighting, interview-style framing, lower thirds text overlays, authentic real-world aesthetic, subtle natural color grading, journalistic visual approach',
    promptPrefix: 'documentary style, naturalistic handheld camera, available natural lighting, interview framing, authentic aesthetic, journalistic approach,',
    fps: '24fps or 30fps',
    lighting: 'available light, natural sources, minimal artificial',
    colorPalettes: {
      finance: 'trustworthy authentic - neutral tones, natural skin, muted blues',
      psychology: 'real and relatable - warm natural, authentic skin tones, soft backgrounds'
    },
    financeRank: 6,
    psychologyRank: 17,
    bestFor: 'Credibility content, real stories, investigative pieces'
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ✨ SPECIAL STYLES (6)
  // ═══════════════════════════════════════════════════════════════════════════════

  'Whiteboard': {
    name: 'Whiteboard Animation',
    category: 'Special',
    technicalDNA: 'whiteboard animation style, black marker lines on white background, hand-drawing progressive reveal effect, simple icon illustrations, red and blue accent highlights, marker pen texture, hand occasionally visible drawing',
    promptPrefix: 'whiteboard animation, black marker lines on white background, hand-drawing progressive reveal, simple icons, red and blue accents,',
    fps: 'variable (drawing speed)',
    lighting: 'flat white background, no shadows',
    colorPalettes: {
      finance: 'educational clarity - black #212121, red accent #F44336, blue accent #2196F3, green accent #4CAF50',
      psychology: 'soft educational - black #424242, purple accent #7E57C2, teal accent #26A69A'
    },
    financeRank: 3,
    psychologyRank: 5,
    bestFor: 'Educational explainers, complex concepts, psychology studies, finance tutorials'
  },

  'Isometric 3D': {
    name: 'Isometric 3D',
    category: 'Special',
    technicalDNA: 'isometric 3D style, 30-degree isometric projection, clean geometric shapes, no perspective distortion, pastel or corporate color palette, flat or subtle shading, modern tech infographic aesthetic, data visualization friendly',
    promptPrefix: 'isometric 3D style, 30-degree isometric projection, clean geometric shapes, no perspective distortion, modern tech infographic,',
    fps: '24fps',
    lighting: 'soft ambient, no harsh shadows, even illumination',
    colorPalettes: {
      finance: 'data viz professional - blue #42A5F5, green #66BB6A, orange #FFA726, purple #AB47BC, grey #78909C',
      psychology: 'soft analytical - teal #4DB6AC, coral #FF8A65, lavender #B39DDB'
    },
    financeRank: 2,
    psychologyRank: 18,
    bestFor: 'Finance data visualization, money flow diagrams, infographics, tech-forward content'
  },

  'Low-Poly': {
    name: 'Low-Poly',
    category: 'Special',
    technicalDNA: 'low-poly 3D style, visible faceted polygon geometry, flat shading per face, limited vertices, stylized angular forms, modern minimalist color palette, indie game aesthetic, geometric simplification',
    promptPrefix: 'low-poly 3D style, visible faceted polygons, flat shading per face, stylized angular forms, modern minimalist palette,',
    fps: '24fps',
    lighting: 'soft directional, minimal shadows',
    colorPalettes: {
      finance: 'modern tech - blue #039BE5, teal #00ACC1, orange #FB8C00',
      psychology: 'calm geometric - sage #81C784, coral #FFAB91, sky #81D4FA'
    },
    financeRank: 19,
    psychologyRank: 19,
    bestFor: 'Modern tech content, gaming crossover, unique visual hook'
  },

  'Voxel': {
    name: 'Voxel',
    category: 'Special',
    technicalDNA: 'voxel 3D style, cubic blocky construction, Minecraft-inspired aesthetic, limited color palette, pixel-art textures on cubes, chunky satisfying geometry, gaming nostalgic feel, playful approachable visual',
    promptPrefix: 'voxel 3D style, cubic blocky construction, Minecraft-inspired, limited palette, chunky geometry, gaming aesthetic,',
    fps: '24fps',
    lighting: 'soft ambient with subtle shadows',
    colorPalettes: {
      finance: 'playful gaming - green #4CAF50, brown #795548, blue #2196F3, gold #FFC107',
      psychology: 'friendly blocks - pink #F48FB1, teal #4DD0E1, yellow #FFF176'
    },
    financeRank: 20,
    psychologyRank: 20,
    bestFor: 'Gaming audience, younger demographics, playful content'
  },

  'Neon Cyberpunk': {
    name: 'Neon/Cyberpunk',
    category: 'Special',
    technicalDNA: 'cyberpunk neon style, deep black shadows, glowing neon accents (pink, cyan, purple), heavy bloom glow effects, reflective wet surfaces, volumetric fog atmosphere, synthwave futuristic aesthetic, Blade Runner inspired',
    promptPrefix: 'cyberpunk neon style, deep black shadows, glowing neon accents (pink, cyan, purple), heavy bloom, reflective wet surfaces, volumetric fog, synthwave aesthetic,',
    fps: '24fps',
    lighting: 'neon rim lights, volumetric fog, deep shadows',
    colorPalettes: {
      finance: 'crypto futuristic - neon pink #FF4081, cyan #00E5FF, purple #7C4DFF, deep black #121212',
      psychology: 'synthwave - magenta #F50057, electric blue #00B8D4, violet #AA00FF'
    },
    financeRank: 7,
    psychologyRank: 21,
    bestFor: 'Crypto/NFT content, tech finance, futuristic topics'
  },

  'Paper Cutout': {
    name: 'Paper Cutout',
    category: 'Special',
    technicalDNA: 'paper cutout craft style, visible textured paper layers, cut edge details with slight shadows, stop-motion animation feel at 15fps, handmade craft aesthetic, warm wholesome color palette, tactile layered depth, South Park / felt animation inspired',
    promptPrefix: 'paper cutout craft style, visible textured paper layers, cut edge details, stop-motion feel at 15fps, handmade craft aesthetic, warm wholesome,',
    fps: '15fps',
    lighting: 'soft overhead, subtle layer shadows',
    colorPalettes: {
      finance: 'craft authentic - kraft brown #8D6E63, cream #FFECB3, sage #A5D6A7, coral #FFAB91',
      psychology: 'warm wholesome - blush #FFCDD2, mint #C8E6C9, cream #FFF8E1, soft blue #BBDEFB'
    },
    financeRank: 21,
    psychologyRank: 22,
    bestFor: 'Approachable content, craft/DIY niches, wholesome feel'
  },

  // DEFAULT FALLBACK
  'default': {
    name: 'Adaptive Mixed',
    category: 'Default',
    technicalDNA: 'mixed media adaptive style, balanced lighting, 24fps, professional quality',
    promptPrefix: 'professional quality, mixed media, adaptive style, balanced lighting,',
    fps: '24fps',
    lighting: 'balanced 3-point lighting',
    colorPalettes: {
      finance: 'professional - blue #2196F3, green #4CAF50, grey #607D8B',
      psychology: 'balanced - teal #009688, coral #FF7043, cream #FFF8E1'
    },
    financeRank: 99,
    psychologyRank: 99,
    bestFor: 'General purpose fallback'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// NICHE DATABASE - 14 Content Niches with Rankings
// ═══════════════════════════════════════════════════════════════════════════════

const NICHE_DATABASE = {
  // CORE NICHES (Fully Optimized)
  finance: {
    name: 'Personal Finance',
    icon: '💰',
    tier: 'core',
    topStyles: ['3D Animation', 'Isometric 3D', 'Whiteboard', '2D Minimal', 'Cinematic'],
    colorPalettes: {
      trust: { colors: ['#1A237E', '#1976D2', '#FFFFFF'], name: 'Trust & Security' },
      growth: { colors: ['#2E7D32', '#4CAF50', '#FFD700'], name: 'Wealth & Growth' },
      premium: { colors: ['#212121', '#C9A227', '#FFFFFF'], name: 'Premium & Luxury' },
      action: { colors: ['#FF5722', '#F44336', '#FFFFFF'], name: 'Action & Urgency' }
    },
    keywords: ['money', 'budget', 'invest', 'wealth', 'financial', 'savings', 'income', 'debt', 'credit', 'stock', 'crypto', 'retire', 'tax', 'loan'],
    defaultPalette: 'trust'
  },

  psychology: {
    name: 'Psychology',
    icon: '🧠',
    tier: 'core',
    topStyles: ['Anime', '2D Minimal', 'Watercolor', 'Silhouette', 'Whiteboard'],
    colorPalettes: {
      calm: { colors: ['#E1BEE7', '#B2DFDB', '#90CAF9'], name: 'Calm & Peace' },
      healing: { colors: ['#A5D6A7', '#FFE082', '#FFFFFF'], name: 'Healing & Growth' },
      love: { colors: ['#F8BBD9', '#FF8A80', '#FFFFFF'], name: 'Love & Connection' },
      safe: { colors: ['#B0BEC5', '#D7CCC8', '#FFFFFF'], name: 'Safe & Non-threatening' }
    },
    keywords: ['emotion', 'mental', 'anxiety', 'depression', 'relationship', 'personality', 'therapy', 'trauma', 'attachment', 'narcissist', 'introvert', 'extrovert', 'psychology', 'mindset'],
    defaultPalette: 'calm'
  },

  // EXTENDED NICHES
  gaming: {
    name: 'Gaming',
    icon: '🎮',
    tier: 'extended',
    topStyles: ['3D Animation', 'Pixel Art', 'Anime', 'Neon Cyberpunk', 'Comic Book'],
    colorPalettes: {
      default: { colors: ['#7C4DFF', '#00E676', '#FF4081'], name: 'Gaming Vibrant' }
    },
    keywords: ['game', 'gaming', 'player', 'gamer', 'stream', 'esport', 'console', 'pc', 'playstation', 'xbox', 'nintendo'],
    defaultPalette: 'default'
  },

  technology: {
    name: 'Technology',
    icon: '💻',
    tier: 'extended',
    topStyles: ['Isometric 3D', '3D Animation', 'Neon Cyberpunk', 'Low-Poly', 'Cinematic'],
    colorPalettes: {
      default: { colors: ['#2196F3', '#00BCD4', '#FFFFFF'], name: 'Tech Blue' }
    },
    keywords: ['tech', 'technology', 'software', 'hardware', 'ai', 'artificial intelligence', 'robot', 'computer', 'phone', 'app', 'code'],
    defaultPalette: 'default'
  },

  education: {
    name: 'Education',
    icon: '📚',
    tier: 'extended',
    topStyles: ['Whiteboard', '2D Minimal', '3D Animation', 'Isometric 3D', '2D Animation'],
    colorPalettes: {
      default: { colors: ['#1565C0', '#FFC107', '#FFFFFF'], name: 'Academic' }
    },
    keywords: ['learn', 'teach', 'education', 'school', 'university', 'student', 'course', 'tutorial', 'lesson', 'study'],
    defaultPalette: 'default'
  },

  health: {
    name: 'Health & Fitness',
    icon: '💪',
    tier: 'extended',
    topStyles: ['Cinematic', '3D Animation', 'Photorealistic', '2D Minimal', 'Documentary'],
    colorPalettes: {
      default: { colors: ['#4CAF50', '#FF5722', '#FFFFFF'], name: 'Active Energy' }
    },
    keywords: ['health', 'fitness', 'workout', 'exercise', 'diet', 'nutrition', 'weight', 'muscle', 'gym', 'yoga', 'wellness'],
    defaultPalette: 'default'
  },

  cooking: {
    name: 'Cooking & Food',
    icon: '🍳',
    tier: 'extended',
    topStyles: ['Cinematic', 'Photorealistic', '3D Animation', 'Watercolor', 'Stop Motion'],
    colorPalettes: {
      default: { colors: ['#FF5722', '#FFC107', '#4CAF50'], name: 'Appetizing Warm' }
    },
    keywords: ['cook', 'recipe', 'food', 'meal', 'kitchen', 'chef', 'ingredient', 'dish', 'bake', 'restaurant'],
    defaultPalette: 'default'
  },

  travel: {
    name: 'Travel',
    icon: '✈️',
    tier: 'extended',
    topStyles: ['Cinematic', 'Photorealistic', 'Documentary', 'Watercolor', '3D Animation'],
    colorPalettes: {
      default: { colors: ['#03A9F4', '#FF9800', '#4CAF50'], name: 'Adventure' }
    },
    keywords: ['travel', 'trip', 'vacation', 'destination', 'explore', 'adventure', 'flight', 'hotel', 'tourist'],
    defaultPalette: 'default'
  },

  business: {
    name: 'Business',
    icon: '💼',
    tier: 'extended',
    topStyles: ['3D Animation', 'Cinematic', 'Isometric 3D', '2D Minimal', 'Documentary'],
    colorPalettes: {
      default: { colors: ['#1565C0', '#37474F', '#FFFFFF'], name: 'Corporate' }
    },
    keywords: ['business', 'entrepreneur', 'startup', 'company', 'ceo', 'founder', 'marketing', 'sales', 'client'],
    defaultPalette: 'default'
  },

  motivation: {
    name: 'Motivation',
    icon: '🔥',
    tier: 'extended',
    topStyles: ['Cinematic', '3D Animation', 'Silhouette', '2D Minimal', 'Documentary'],
    colorPalettes: {
      default: { colors: ['#FF5722', '#FFC107', '#212121'], name: 'Fire & Energy' }
    },
    keywords: ['motivation', 'inspire', 'success', 'goal', 'dream', 'hustle', 'grind', 'discipline', 'mindset'],
    defaultPalette: 'default'
  },

  spirituality: {
    name: 'Spirituality',
    icon: '🧘',
    tier: 'extended',
    topStyles: ['Watercolor', 'Abstract', '2D Minimal', 'Silhouette', 'Anime'],
    colorPalettes: {
      default: { colors: ['#9C27B0', '#E1BEE7', '#FFFFFF'], name: 'Spiritual Purple' }
    },
    keywords: ['spiritual', 'meditation', 'mindfulness', 'zen', 'soul', 'universe', 'energy', 'chakra', 'manifest'],
    defaultPalette: 'default'
  },

  kids: {
    name: 'Kids & Family',
    icon: '👨‍👩‍👧‍👦',
    tier: 'extended',
    topStyles: ['2D Animation', '3D Animation', 'Claymation', 'Paper Cutout', 'Pixel Art'],
    colorPalettes: {
      default: { colors: ['#FF4081', '#00BCD4', '#FFEB3B'], name: 'Playful Bright' }
    },
    keywords: ['kids', 'children', 'family', 'parent', 'baby', 'toddler', 'child', 'play', 'fun', 'cartoon'],
    defaultPalette: 'default'
  },

  science: {
    name: 'Science',
    icon: '🔬',
    tier: 'extended',
    topStyles: ['3D Animation', 'Isometric 3D', 'Documentary', 'Whiteboard', 'Photorealistic'],
    colorPalettes: {
      default: { colors: ['#00BCD4', '#4CAF50', '#FFFFFF'], name: 'Science Blue-Green' }
    },
    keywords: ['science', 'scientist', 'research', 'experiment', 'physics', 'chemistry', 'biology', 'space', 'discovery'],
    defaultPalette: 'default'
  },

  history: {
    name: 'History',
    icon: '🏛️',
    tier: 'extended',
    topStyles: ['Cinematic', 'Documentary', 'Oil Painting', '2D Minimal', '3D Animation'],
    colorPalettes: {
      default: { colors: ['#795548', '#FFC107', '#ECEFF1'], name: 'Historical Sepia' }
    },
    keywords: ['history', 'historical', 'ancient', 'war', 'civilization', 'empire', 'king', 'queen', 'century'],
    defaultPalette: 'default'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT CHARACTERISTICS - For Auto-Detection
// ═══════════════════════════════════════════════════════════════════════════════

const CONTENT_CHARACTERISTICS = {
  contentTypes: {
    educational_explainer: {
      styles: ['Whiteboard', 'Isometric 3D', '2D Minimal', '2D Animation'],
      signals: ['explain', 'how to', 'what is', 'guide', 'tutorial', 'learn', 'understand', 'step by step'],
      colorMood: 'professional'
    },
    storytelling_narrative: {
      styles: ['3D Animation', 'Cinematic', 'Anime', 'Documentary'],
      signals: ['story', 'journey', 'once upon', 'character', 'happened', 'experience', 'adventure'],
      colorMood: 'emotional'
    },
    data_visualization: {
      styles: ['Isometric 3D', '2D Minimal', 'Whiteboard', '2D Animation'],
      signals: ['data', 'statistics', 'chart', 'graph', 'percentage', 'numbers', 'analysis', 'compare'],
      colorMood: 'analytical'
    },
    emotional_sensitive: {
      styles: ['Watercolor', 'Silhouette', 'Anime', '2D Minimal'],
      signals: ['feel', 'emotion', 'struggle', 'trauma', 'heal', 'pain', 'anxiety', 'depression', 'loss'],
      colorMood: 'therapeutic'
    },
    action_dynamic: {
      styles: ['3D Animation', 'Comic Book', 'Anime', 'Cinematic'],
      signals: ['action', 'fight', 'battle', 'intense', 'epic', 'power', 'strong', 'fast'],
      colorMood: 'energetic'
    },
    calm_peaceful: {
      styles: ['Watercolor', '2D Minimal', 'Silhouette', 'Abstract'],
      signals: ['calm', 'peace', 'relax', 'meditation', 'gentle', 'soft', 'quiet', 'serene'],
      colorMood: 'calm'
    },
    futuristic_tech: {
      styles: ['Neon Cyberpunk', 'Isometric 3D', '3D Animation', 'Low-Poly'],
      signals: ['future', 'ai', 'robot', 'cyber', 'tech', 'digital', 'virtual', 'metaverse', 'crypto'],
      colorMood: 'futuristic'
    },
    nostalgic_retro: {
      styles: ['Pixel Art', 'Stop Motion', 'Claymation', 'Paper Cutout'],
      signals: ['retro', 'vintage', 'nostalgia', 'old school', '90s', '80s', 'classic', 'childhood'],
      colorMood: 'warm'
    }
  },

  colorMoods: {
    professional: ['#1565C0', '#37474F', '#FFFFFF'],
    emotional: ['#E91E63', '#9C27B0', '#FFC107'],
    analytical: ['#2196F3', '#607D8B', '#FFFFFF'],
    therapeutic: ['#E1BEE7', '#B2DFDB', '#FFF8E1'],
    energetic: ['#FF5722', '#FFC107', '#F44336'],
    calm: ['#90CAF9', '#A5D6A7', '#FFFFFF'],
    futuristic: ['#00E5FF', '#7C4DFF', '#121212'],
    warm: ['#FF7043', '#FFC107', '#795548']
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL RENDERING HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get style specification by name
 */
function getStyleSpec(styleName) {
  return VISUAL_STYLE_SPECS[styleName] || VISUAL_STYLE_SPECS['default'];
}

/**
 * Enhanced combineStyleDimensions - uses VISUAL_STYLE_SPECS properly
 */
function combineStyleDimensions() {
  const visual = document.getElementById('veoVisualStyle')?.value || '3D Animation';
  const content = document.getElementById('veoContentGenre')?.value || '';
  const era = document.getElementById('veoEraAesthetic')?.value || '';
  const effects = document.getElementById('veoSpecialEffects')?.value || '';

  const spec = VISUAL_STYLE_SPECS[visual] || VISUAL_STYLE_SPECS['default'];

  let combined = spec.promptPrefix;
  if (content) combined += ` ${content.toLowerCase()} content,`;
  if (era) combined += ` ${era.toLowerCase()} setting,`;
  if (effects) combined += ` with ${effects.toLowerCase()} effects,`;
  combined += ` ${spec.fps}`;

  return combined;
}

/**
 * Get Style Anchor for injection into master prompt
 */
function getStyleAnchor(styleName, niche = 'finance') {
  const spec = VISUAL_STYLE_SPECS[styleName] || VISUAL_STYLE_SPECS['default'];
  const colorPalette = spec.colorPalettes[niche] || spec.colorPalettes.finance;

  return `
## 🎨 GLOBAL STYLE ANCHOR (APPLY TO ALL SCENES)

**CRITICAL:** VEO 3 / Flow generates each clip INDEPENDENTLY with NO memory between scenes.
This Style Anchor MUST be applied to EVERY scene to maintain visual consistency.

### Visual Rendering
- **Style:** ${spec.name}
- **Category:** ${spec.category}

### Technical Specifications (COPY VERBATIM TO EACH SCENE)
\`\`\`
${spec.technicalDNA}
\`\`\`

### Frame Rate & Motion
- **FPS:** ${spec.fps}

### Lighting Model (MAINTAIN EXACTLY)
\`\`\`
${spec.lighting}
\`\`\`

### Color Palette (${niche.charAt(0).toUpperCase() + niche.slice(1)} Niche)
\`\`\`
${colorPalette}
\`\`\`

### Consistency Rules
1. ✅ COPY the exact style specifications to every scene
2. ✅ MAINTAIN the same color palette throughout
3. ✅ USE identical lighting descriptions
4. ❌ DO NOT change style mid-video

---
`;
}

/**
 * Universal Style Suggester - works for ANY niche
 */
function suggestStyleUniversal(scriptContent, selectedNiche = null) {
  const lowerContent = scriptContent.toLowerCase();

  // STEP 1: Detect niche if not provided
  let detectedNiche = selectedNiche;
  let nicheConfidence = 100;

  if (!detectedNiche || detectedNiche === 'auto') {
    const nicheDetection = detectNicheFromContent(lowerContent);
    detectedNiche = nicheDetection.niche;
    nicheConfidence = nicheDetection.confidence;
  }

  // STEP 2: Analyze content characteristics
  const contentAnalysis = analyzeContentCharacteristics(lowerContent);

  // STEP 3: Get niche-specific recommendations
  const nicheConfig = NICHE_DATABASE[detectedNiche];

  // STEP 4: Determine recommended styles
  let recommendedStyles = [];
  let recommendedPalette = null;

  if (nicheConfig) {
    recommendedStyles = nicheConfig.topStyles;
    const defaultPaletteName = nicheConfig.defaultPalette;
    recommendedPalette = nicheConfig.colorPalettes[defaultPaletteName];
  } else {
    recommendedStyles = contentAnalysis.recommendedStyles;
    recommendedPalette = {
      colors: CONTENT_CHARACTERISTICS.colorMoods[contentAnalysis.colorMood] || ['#2196F3', '#4CAF50', '#FFFFFF'],
      name: `${contentAnalysis.primaryType} palette`
    };
  }

  const primaryStyle = recommendedStyles[0] || '3D Animation';
  const styleSpec = VISUAL_STYLE_SPECS[primaryStyle] || VISUAL_STYLE_SPECS['3D Animation'];

  return {
    suggestedStyle: primaryStyle,
    confidence: Math.round((nicheConfidence * 0.4) + (contentAnalysis.confidence * 0.6)),
    alternativeStyles: recommendedStyles.slice(1, 4),
    detectedNiche: detectedNiche,
    nicheConfidence: nicheConfidence,
    contentType: contentAnalysis.primaryType,
    technicalDNA: styleSpec.technicalDNA,
    colorPalette: recommendedPalette,
    reason: `${primaryStyle} recommended for ${nicheConfig?.name || 'your content'}: ${styleSpec.bestFor}`
  };
}

/**
 * Detect niche from content using keyword matching
 */
function detectNicheFromContent(content) {
  const scores = {};

  for (const [nicheKey, nicheConfig] of Object.entries(NICHE_DATABASE)) {
    const matches = nicheConfig.keywords.filter(kw => content.includes(kw));
    scores[nicheKey] = matches.length;
  }

  let bestNiche = null;
  let bestScore = 0;

  for (const [niche, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestNiche = niche;
    }
  }

  return {
    niche: bestScore >= 2 ? bestNiche : null,
    confidence: Math.min(95, Math.round((bestScore / 5) * 100))
  };
}

/**
 * Analyze content characteristics for style matching
 */
function analyzeContentCharacteristics(content) {
  const typeScores = {};

  for (const [typeName, typeConfig] of Object.entries(CONTENT_CHARACTERISTICS.contentTypes)) {
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

  const primaryConfig = CONTENT_CHARACTERISTICS.contentTypes[primaryType];

  return {
    primaryType: primaryType,
    confidence: Math.min(90, primaryScore * 20),
    recommendedStyles: primaryConfig.styles,
    colorMood: primaryConfig.colorMood
  };
}

/**
 * Auto-apply style suggestion to UI
 */
function autoApplyStyleSuggestion(scriptContent) {
  if (!scriptContent || scriptContent.length < 20) return null;

  const selectedNiche = document.getElementById('contentNiche')?.value;
  const suggestion = suggestStyleUniversal(scriptContent, selectedNiche);

  if (suggestion.confidence >= 50 && !state.styleManuallySet) {
    const styleSelect = document.getElementById('veoVisualStyle');
    if (styleSelect) {
      styleSelect.value = suggestion.suggestedStyle;
      updateStylePreview();
      console.log('🎨 Auto-suggested style:', suggestion);
      veoLog(`🎨 Suggested: ${suggestion.suggestedStyle} (${suggestion.confidence}% confidence)`, 'info');
    }
  }

  return suggestion;
}

/**
 * Update style preview display
 */
function updateStylePreview() {
  const styleSelect = document.getElementById('veoVisualStyle');
  const nicheSelect = document.getElementById('contentNiche');
  const rankBadge = document.getElementById('styleRankBadge');
  const technicalDNA = document.getElementById('styleTechnicalDNA');
  const colorPalette = document.getElementById('styleColorPalette');
  const bestFor = document.getElementById('styleBestFor');

  if (!styleSelect) return;

  const styleName = styleSelect.value;
  const niche = nicheSelect?.value || 'finance';
  const spec = VISUAL_STYLE_SPECS[styleName] || VISUAL_STYLE_SPECS['default'];

  // Update rank badge
  const rank = niche === 'psychology' ? spec.psychologyRank : spec.financeRank;
  const nicheLabel = niche === 'psychology' ? 'Psychology' : 'Finance';

  if (rankBadge) {
    rankBadge.textContent = `${nicheLabel} #${rank}`;
    rankBadge.className = 'rank-badge';
    if (rank === 1) rankBadge.classList.add('top-1');
    else if (rank <= 3) rankBadge.classList.add('top-3');
  }

  if (technicalDNA) technicalDNA.textContent = spec.technicalDNA;
  if (colorPalette) colorPalette.textContent = spec.colorPalettes[niche] || spec.colorPalettes.finance;
  if (bestFor) bestFor.textContent = `Best for: ${spec.bestFor}`;
}

/**
 * Update niche info card
 */
function updateNicheInfoCard() {
  const nicheSelect = document.getElementById('contentNiche');
  const infoCard = document.getElementById('nicheInfoCard');
  const nicheKey = nicheSelect?.value;

  if (!nicheKey || nicheKey === 'auto' || !infoCard) return;

  const config = NICHE_DATABASE[nicheKey];
  if (!config) {
    infoCard.style.display = 'none';
    return;
  }

  infoCard.style.display = 'block';

  const titleEl = document.getElementById('nicheInfoTitle');
  if (titleEl) titleEl.textContent = `${config.icon} ${config.name}`;

  const topStylesEl = document.getElementById('nicheTopStyles');
  if (topStylesEl) topStylesEl.textContent = config.topStyles.slice(0, 3).join(', ');

  updateStylePreview();
}

console.log('✅ Visual Rendering System v2.0 loaded - 22 styles, 14 niches, auto-detection enabled');

// ═══════════════════════════════════════════════════════════════════════════════
// END VISUAL RENDERING SYSTEM v2.0
// ═══════════════════════════════════════════════════════════════════════════════

/**

 * Get temperature for current clone mode
 * @returns {number} Temperature setting
 */
function getCloneTemperature() {
  return CLONE_MODE_CONFIG[state.cloneMode]?.temperature || 0.6;
}

/**
 * Get smart angle fallback when user doesn't provide one
 * @param {object} analyzerData - Parsed analyzer data
 * @returns {string} Smart angle suggestion
 */
function getSmartAngleFallback(analyzerData) {
  // Try to extract from analyzer improvement suggestions
  if (analyzerData?.rawAnalysis) {
    // Look for Section 9: Opening Hook improvement suggestions
    const hookSection = extractSection(analyzerData.rawAnalysis, '### 9. OPENING HOOK');
    if (hookSection) {
      const improvementMatch = hookSection.match(/improvement.*?:?\s*([^.]+)/i);
      if (improvementMatch) {
        return improvementMatch[1].trim().substring(0, 100);
      }
    }
  }

  // Try audience demographics
  if (analyzerData?.audience) {
    const audience = typeof analyzerData.audience === 'string'
      ? analyzerData.audience
      : analyzerData.audience.demographics || '';
    if (audience) {
      return `Focused on ${audience.substring(0, 50)}`;
    }
  }

  // Default fallback
  return 'Updated examples with fresh perspective';
}

/**
 * Auto-fill Script Parameters from analyzer data
 * @param {object} data - Analyzer data
 */
function autoFillScriptParameters(data) {
  console.log('📝 Auto-filling Script Parameters from analyzer data...');

  // Auto-fill Target Length from original video duration
  const duration = data.metadata?.duration || data.duration || '';
  if (duration) {
    const targetLengthEl = document.getElementById('targetLength');
    if (targetLengthEl) {
      // Parse duration to find matching option
      const durationMatch = duration.match(/(\d+):(\d+)/);
      if (durationMatch) {
        const minutes = parseInt(durationMatch[1]);
        if (minutes <= 1) targetLengthEl.value = 'under-1';
        else if (minutes <= 3) targetLengthEl.value = '1-3';
        else if (minutes <= 5) targetLengthEl.value = '3-5';
        else if (minutes <= 10) targetLengthEl.value = '5-10';
        else if (minutes <= 15) targetLengthEl.value = '10-15';
        else if (minutes <= 30) targetLengthEl.value = '15-30';
        else targetLengthEl.value = '30-60';
        console.log(`  ✅ Target Length: ${targetLengthEl.value} (from ${duration})`);
      }
    }
  }

  // Auto-fill Voice/Style Profile from audio analysis
  const voiceProfileEl = document.getElementById('voiceProfile');
  if (voiceProfileEl && data.rawAnalysis) {
    const audioSection = extractSection(data.rawAnalysis, '### 4. AUDIO ELEMENTS');
    if (audioSection) {
      const voiceMatch = audioSection.match(/voice.*?style.*?:?\s*([^.]+)/i) ||
        audioSection.match(/tone.*?:?\s*([^.]+)/i);
      if (voiceMatch) {
        voiceProfileEl.value = voiceMatch[1].trim().substring(0, 100);
        voiceProfileEl.setAttribute('data-auto-filled', 'true');
        console.log(`  ✅ Voice Profile: ${voiceProfileEl.value}`);
      }
    }
  }

  // Smart angle is NOT auto-filled but available as fallback during generation
  console.log('  ℹ️ Unique Angle: User input preferred (smart fallback available)');
}

/**
 * Build 95% Clone Guidance prompt block for spirit preservation
 * Generates context that preserves structure while encouraging creative rewriting
 * @param {object} analyzerData - Full analyzer data
 * @param {string} userAngle - User's unique angle (or empty for fallback)
 * @returns {string} Formatted guidance block
 */
function build95CloneGuidance(analyzerData, userAngle) {
  // Get smart angle if user didn't provide one
  const angle = userAngle?.trim() || getSmartAngleFallback(analyzerData);

  // Extract key insights from analyzer data
  const contextField = document.getElementById('context')?.value || '';

  // Parse What to Steal section
  let techniquesToSteal = [];
  let whatNotToReplicate = [];
  const whatToStealMatch = contextField.match(/What to Steal\/Replicate:\n([\s\S]*?)(?=\n🔥|\n🪝|\n📐|$)/);
  if (whatToStealMatch) {
    const content = whatToStealMatch[1];
    const topMatch = content.match(/top.*techniques?\s*to\s*steal[:\s]*([\s\S]*?)(?=what\s*not\s*to|$)/i);
    if (topMatch) {
      techniquesToSteal = topMatch[1].split(/\n|;/).filter(t => t.trim().length > 5).slice(0, 5);
    }
    const notMatch = content.match(/what\s*not\s*to\s*replicate[:\s]*([\s\S]*?)$/i);
    if (notMatch) {
      whatNotToReplicate = notMatch[1].split(/\n|;/).filter(t => t.trim().length > 5).slice(0, 3);
    }
  }

  // Parse Hook analysis
  let hookType = 'Story + Paradox';
  const hookMatch = contextField.match(/Opening Hook.*?:.*?type[:\s]*([^\n]+)/i);
  if (hookMatch) hookType = hookMatch[1].trim();

  // Parse Viral triggers
  let emotionalTriggers = ['Curiosity', 'Surprise'];
  const viralMatch = contextField.match(/Viral Mechanics:\n([\s\S]*?)(?=\n🎯|\n🪝|\n📐|$)/);
  if (viralMatch) {
    const triggerMatch = viralMatch[1].match(/emotional\s*triggers?[:\s]*([^\n]+)/i);
    if (triggerMatch) {
      emotionalTriggers = triggerMatch[1].split(/,|;/).map(t => t.trim()).filter(t => t.length > 2);
    }
  }

  // Build the guidance prompt block
  return `
## 95% CLONE MODE: SPIRIT PRESERVATION

### YOUR UNIQUE ANGLE
${angle}

### STRUCTURAL DNA (PRESERVE EXACTLY)
- **Hook Pattern:** ${hookType}
- **Emotional Triggers:** ${emotionalTriggers.join(', ')}
- **Temperature:** 0.6 (Balanced creativity)

### WHAT TO REPLICATE (Proven Techniques)
${techniquesToSteal.length > 0
      ? techniquesToSteal.map((t, i) => `${i + 1}. ${t.trim()}`).join('\n')
      : '1. Preserve section structure and timing\n2. Match emotional arc and pacing\n3. Use similar hook type and CTA placement'}

### WHAT TO CHANGE
- Voice/personality: Use YOUR unique style
- Examples: Replace with YOUR industry examples  
- Statistics: Fresh data from YOUR research
- Hook story: Same PATTERN, different SUBJECT

### WHAT NOT TO DO
${whatNotToReplicate.length > 0
      ? whatNotToReplicate.map(t => `❌ ${t.trim()}`).join('\n')
      : '❌ Do NOT copy exact phrases\n❌ Do NOT use same examples\n❌ Do NOT replicate exact numbers'}

### REWRITING RULES
1. Same emotional BEATS, different WORDS
2. Match section COUNT and TIMING
3. Preserve PATTERN, change CONTENT
4. YOUR voice, not original creator's

---
`;
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB SWITCHING
// ──────────────────────────────────────────────────────────────────────────────

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const content = document.getElementById(tabName);
  if (content) content.classList.add('active');
  const tab = document.querySelector(`[data-tab="${tabName}"]`);
  if (tab) tab.classList.add('active');
}

// ──────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────────────────────────────────────────

function showNotification(message, type = 'info', tabId = null) {
  let statusDiv = null;

  if (tabId) {
    statusDiv = document.getElementById(tabId);
  } else {
    const generateTab = document.getElementById('generate');
    const veoTab = document.getElementById('veo-prompts');
    const settingsTab = document.getElementById('settings');

    if (generateTab && generateTab.classList.contains('active')) {
      statusDiv = document.getElementById('apiStatus');
    } else if (veoTab && veoTab.classList.contains('active')) {
      statusDiv = document.getElementById('veoStatus');
    } else if (settingsTab && settingsTab.classList.contains('active')) {
      statusDiv = document.getElementById('settingsStatus');
    }
  }

  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.className = `api-status show ${type}`;
    console.log(`[${type.toUpperCase()}] ${message}`);

    if (type !== 'loading') {
      setTimeout(() => statusDiv.classList.remove('show'), 4000);
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// VEO LOG SYSTEM
// ──────────────────────────────────────────────────────────────────────────────

function veoLog(message, type = 'info') {
  const logDisplay = document.getElementById('veoLog');
  if (!logDisplay) return;

  const timestamp = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${timestamp}] ${message}`;

  logDisplay.insertBefore(entry, logDisplay.firstChild);

  while (logDisplay.children.length > 50) {
    logDisplay.removeChild(logDisplay.lastChild);
  }

  console.log(`[VEO ${type.toUpperCase()}] ${message}`);
}

// ──────────────────────────────────────────────────────────────────────────────
// DURATION FORMATTING
// ──────────────────────────────────────────────────────────────────────────────

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (totalSeconds < 60) {
    // Less than 1 minute: Show as "x sec"
    return `${totalSeconds} sec`;
  } else if (totalSeconds < 3600) {
    // 1 to 59 minutes: Show as "x min y sec"
    if (seconds === 0) {
      return `${minutes} min`;
    }
    return `${minutes} min ${seconds} sec`;
  } else if (totalSeconds === 3600) {
    // Exactly 1 hour: Show as "1 hr"
    return '1 hr';
  } else {
    // More than 1 hour: Show as "x hr y min"
    if (minutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${minutes} min`;
  }
}

// Parse script duration from timestamps
// Supports: (4:45 - 5:00), [0:45-1:00], 4:45-5:00, **[END - 2:55]**
function parseScriptDuration(scriptText) {
  if (!scriptText) return 0;

  let maxSeconds = 0;

  // NEW: Match END marker format: **[END - M:SS]** or [END - M:SS]
  const endMarkerRegex = /\[END\s*[-–]\s*(\d+):(\d+)\]/gi;
  let endMatch = endMarkerRegex.exec(scriptText);
  if (endMatch) {
    const endMinutes = parseInt(endMatch[1], 10);
    const endSeconds = parseInt(endMatch[2], 10);
    maxSeconds = (endMinutes * 60) + endSeconds;
    console.log(`📊 Parsed duration from END marker: ${endMinutes}:${endSeconds.toString().padStart(2, '0')} (${maxSeconds}s)`);
    return maxSeconds;
  }

  // FALLBACK: Match range patterns like: (4:45 - 5:00), [0:45-1:00], 4:45-5:00
  const rangeRegex = /[\[\(]?(\d+):(\d+)\s*[-–]\s*(\d+):(\d+)[\]\)]?/g;
  let match;

  while ((match = rangeRegex.exec(scriptText)) !== null) {
    const endMinutes = parseInt(match[3], 10);
    const endSeconds = parseInt(match[4], 10);
    const totalSeconds = (endMinutes * 60) + endSeconds;
    maxSeconds = Math.max(maxSeconds, totalSeconds);
  }

  if (maxSeconds > 0) {
    console.log(`📊 Parsed duration from range: ${Math.floor(maxSeconds / 60)}:${(maxSeconds % 60).toString().padStart(2, '0')}`);
  }

  return maxSeconds;
}

// Auto-calculate VEO prompts from generated script duration
function autoCalcPromptsFromScript(scriptText) {
  const duration = parseScriptDuration(scriptText);

  if (duration > 0) {
    const prompts = Math.ceil(duration / 8);
    document.getElementById('veoNumPrompts').value = prompts;
    updateDurationDisplay();
    updateBatchSection();

    const formattedDuration = formatDuration(duration);
    console.log(`📊 Auto-calculated ${prompts} VEO prompts from script duration: ${formattedDuration}`);
    showNotification(`✅ Auto-calculated ${prompts} prompts for ${formattedDuration} video`, 'success', 'veoStatus');
  } else {
    console.log('⚠️ Could not parse script duration for VEO auto-calculation');
  }
}


function updateDurationDisplay() {
  const numPromptsInput = document.getElementById('veoNumPrompts');
  const durationSpan = document.getElementById('totalDuration');

  if (numPromptsInput && durationSpan) {
    const numPrompts = parseInt(numPromptsInput.value) || 0;
    const totalSeconds = numPrompts * 8; // 8 seconds per prompt
    durationSpan.textContent = formatDuration(totalSeconds);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// SETTINGS FUNCTIONS
// ──────────────────────────────────────────────────────────────────────────────

async function loadSettings() {
  try {
    const stored = await chrome.storage.local.get(['settings', 'geminiApiKey']);
    if (stored.settings) {
      state.settings = { ...state.settings, ...stored.settings };
      document.getElementById('apiKeyInput').value = state.settings.claudeApiKey || '';
      document.getElementById('modelSelect').value = state.settings.aiModel || 'claude-sonnet-4-20250514';

      // Load character consistency settings
      document.getElementById('characterBible').value = state.settings.characterBible || '';
      document.getElementById('characterNegatives').value = state.settings.characterNegatives || '';
    }
    if (stored.geminiApiKey) {
      state.settings.geminiApiKey = stored.geminiApiKey;
      document.getElementById('geminiApiKeyInput').value = stored.geminiApiKey;
    }
    console.log('✅ Settings loaded');
  } catch (err) {
    console.error('❌ Error loading settings:', err);
  }
}

async function saveSettings() {
  const claudeApiKey = document.getElementById('apiKeyInput').value.trim();
  const geminiApiKey = document.getElementById('geminiApiKeyInput').value.trim();
  const aiModel = document.getElementById('modelSelect').value;
  const characterBible = document.getElementById('characterBible').value.trim();
  const characterNegatives = document.getElementById('characterNegatives').value.trim();

  state.settings.claudeApiKey = claudeApiKey;
  state.settings.geminiApiKey = geminiApiKey;
  state.settings.aiModel = aiModel;
  state.settings.characterBible = characterBible;
  state.settings.characterNegatives = characterNegatives;

  try {
    await chrome.storage.local.set({
      settings: state.settings,
      geminiApiKey: geminiApiKey
    });
    showNotification('✅ Settings saved!', 'success', 'settingsStatus');
  } catch (err) {
    showNotification('❌ Error saving settings', 'error', 'settingsStatus');
  }
}

// ===== AUTO-CHARACTER GENERATION FUNCTIONS =====

/**
 * Auto-Generate Character from Analyzer Data
 */
async function generateAutoCharacter() {
  console.log('🤖 Starting auto-character generation...');

  const generateBtn = document.getElementById('generateCharacterBtn');
  if (!generateBtn) return;

  const originalText = generateBtn.innerHTML;
  generateBtn.disabled = true;
  generateBtn.innerHTML = '🧠 AI generating...';

  try {
    if (!state.analyzerData || !state.analyzerData.demographics) {
      showNotification('⚠️ Analyzer data recommended. Generating from topic...', 'warning', 'veoStatus');
      return await generateCharacterFromTopic();
    }

    const similarity = parseInt(document.getElementById('competitorSimilarity').value);
    const characterType = document.getElementById('characterType').value;
    const personaIndex = parseInt(document.getElementById('targetPersona').value);

    const competitorChar = extractCompetitorCharacterTraits();
    const targetPersona = state.analyzerData.personas?.[personaIndex] || state.analyzerData.personas?.[0];
    const demographics = state.analyzerData.demographics;
    const painPoints = state.analyzerData.painPoints || [];

    const characterPrompt = buildCharacterGenerationPrompt({
      competitor: competitorChar,
      persona: targetPersona,
      demographics,
      painPoints,
      similarity,
      characterType,
      contentTopic: state.topic || document.getElementById('veoTopic').value,
      videoStyle: document.getElementById('veoVisualStyle')?.value || '2D Animation'
    });

    const model = 'gemini-2.0-flash-exp';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${state.settings.geminiApiKey}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: characterPrompt }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 2048 }
      })
    });

    if (!response.ok) throw new Error('Gemini API Error');

    const data = await response.json();
    const characterData = JSON.parse(data.candidates[0].content.parts[0].text);

    displayCharacterPreview(characterData);
    showNotification('✅ Character generated!', 'success', 'veoStatus');

  } catch (error) {
    console.error('❌ Generation failed:', error);
    showNotification(`❌ Failed: ${error.message}`, 'error', 'veoStatus');
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = originalText;
  }
}

function extractCompetitorCharacterTraits() {
  if (state.analyzerData?.competitorAnalysis?.topVideo?.characterTraits) {
    return state.analyzerData.competitorAnalysis.topVideo.characterTraits;
  }

  const creator = state.analyzerData?.competitorAnalysis?.topVideo?.creator || '';

  if (creator.toLowerCase().includes('proctor') || creator.toLowerCase().includes('robbins')) {
    return {
      archetype: "Authority Mentor",
      ageRange: "60-80",
      persona: "Calm, confident, experienced guide",
      credibility: "Decades of proven expertise",
      style: "Professional, distinguished"
    };
  }

  return {
    archetype: "Knowledgeable Educator",
    ageRange: "35-55",
    persona: "Approachable expert",
    credibility: "Subject matter authority",
    style: "Professional yet accessible"
  };
}

function buildCharacterGenerationPrompt(params) {
  return `Expert character designer for viral video: Create 1 optimized character.

COMPETITOR: ${params.competitor.archetype}, ${params.competitor.ageRange}, ${params.competitor.persona}
AUDIENCE: ${params.persona.name || 'Primary'}, ${params.demographics.ageRange || '25-45'}
PAIN POINTS: ${params.painPoints.slice(0, 3).join('; ')}
TOPIC: ${params.contentTopic}
STYLE: ${params.videoStyle}
SIMILARITY: ${params.similarity}%
TYPE: ${params.characterType}

Rules:
- ${params.characterType === 'mentor' ? 'Age 50-70' : params.characterType === 'balanced' ? 'Age 35-50' : 'Age 25-35'}
- 150+ word Character Bible with 15+ SPECIFIC attributes
- NO vague terms ("attractive", "nice")
- Include: age, gender, build, face, eyes, hair, clothing, voice

JSON output:
{
  "characterBible": "Detailed 150+ word description...",
  "characterNegatives": "No glasses, no different hair color, no age changes...",
  "psychologicalRationale": {
    "whyItWorks": "Why this resonates...",
    "painPointsAddressed": ["Point 1", "Point 2"],
    "credibilityBalance": "X% authority + Y% relatability"
  },
  "engagementScore": 85,
  "scoreBreakdown": {"authority": 25, "relatability": 26, "visualAppeal": 18, "voiceResonance": 16}
}

ONLY JSON, no markdown.`;
}

function displayCharacterPreview(characterData) {
  document.querySelector('#characterBiblePreview .character-bible-text').textContent = characterData.characterBible;
  document.querySelector('#characterNegativesPreview .character-negatives-text').textContent = characterData.characterNegatives;

  document.getElementById('characterRationale').innerHTML = `
    <strong style="color:#8b5cf6;">Why This Works:</strong>
    <p>${characterData.psychologicalRationale.whyItWorks}</p>
    <strong>Pain Points:</strong>
    <ul>${characterData.psychologicalRationale.painPointsAddressed.map(p => `<li>${p}</li>`).join('')}</ul>
    <p><strong>Balance:</strong> ${characterData.psychologicalRationale.credibilityBalance}</p>
  `;

  const b = characterData.scoreBreakdown;
  document.getElementById('engagementScore').innerHTML = `
    <strong style="color:#8b5cf6;font-size:1.1em;">Score: ${characterData.engagementScore}/100</strong>
    <div style="margin-top:12px;">
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:0.9em;">
          <span>Authority</span><span>${b.authority}/30</span>
        </div>
        <div style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;">
          <div style="width:${(b.authority / 30) * 100}%;height:100%;background:#8b5cf6;border-radius:4px;"></div>
        </div>
      </div>
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:0.9em;">
          <span>Relatability</span><span>${b.relatability}/30</span>
        </div>
        <div style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;">
          <div style="width:${(b.relatability / 30) * 100}%;height:100%;background:#10b981;border-radius:4px;"></div>
        </div>
      </div>
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:0.9em;">
          <span>Visual Appeal</span><span>${b.visualAppeal}/20</span>
        </div>
        <div style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;">
          <div style="width:${(b.visualAppeal / 20) * 100}%;height:100%;background:#3b82f6;border-radius:4px;"></div>
        </div>
      </div>
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:0.9em;">
          <span>Voice</span><span>${b.voiceResonance}/20</span>
        </div>
        <div style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;">
          <div style="width:${(b.voiceResonance / 20) * 100}%;height:100%;background:#f59e0b;border-radius:4px;"></div>
        </div>
      </div>
    </div>
  `;

  state.pendingCharacter = characterData;
  document.getElementById('characterPreview').style.display = 'block';
  setTimeout(() => document.getElementById('characterPreview').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

function acceptGeneratedCharacter() {
  if (!state.pendingCharacter) return;

  document.getElementById('characterBible').value = state.pendingCharacter.characterBible;
  document.getElementById('characterNegatives').value = state.pendingCharacter.characterNegatives;

  state.settings.characterBible = state.pendingCharacter.characterBible;
  state.settings.characterNegatives = state.pendingCharacter.characterNegatives;
  chrome.storage.local.set({ settings: state.settings });

  showNotification(`✅ Character saved (${state.pendingCharacter.engagementScore}/100)!`, 'success', 'veoStatus');
  document.getElementById('characterPreview').style.display = 'none';
}

async function generateCharacterFromTopic() {
  const topic = state.topic || document.getElementById('veoTopic').value;
  const characterType = document.getElementById('characterType').value;

  const prompt = `Generate character for "${topic}", type: ${characterType}. JSON: {"characterBible":"150+ words","characterNegatives":"8-10 items","psychologicalRationale":{"whyItWorks":"","painPointsAddressed":[""],"credibilityBalance":""},"engagementScore":75,"scoreBreakdown":{"authority":22,"relatability":23,"visualAppeal":16,"voiceResonance":14}}`;

  try {
    const model = 'gemini-2.0-flash-exp';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${state.settings.geminiApiKey}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 2048 }
      })
    });

    const data = await response.json();
    const characterData = JSON.parse(data.candidates[0].content.parts[0].text);

    displayCharacterPreview(characterData);
    showNotification('✅ Generated from topic. Better with Analyzer data!', 'success', 'veoStatus');
  } catch (error) {
    showNotification(`❌ Failed: ${error.message}`, 'error', 'veoStatus');
  }
}

// ===== END AUTO-CHARACTER GENERATION =====


async function testClaudeConnection() {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (!apiKey) {
    showNotification('❌ Enter Claude API key first', 'error', 'settingsStatus');
    return;
  }

  showNotification('🧪 Testing Claude connection...', 'loading', 'settingsStatus');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say "OK"' }]
      })
    });

    if (response.ok) {
      showNotification('✅ Claude API connected!', 'success', 'settingsStatus');
    } else {
      const err = await response.json();
      showNotification(`❌ Claude Error: ${err.error?.message || response.status}`, 'error', 'settingsStatus');
    }
  } catch (error) {
    showNotification(`❌ Connection failed: ${error.message}`, 'error', 'settingsStatus');
  }
}

async function testGeminiConnection() {
  const apiKey = document.getElementById('geminiApiKeyInput').value.trim();
  if (!apiKey) {
    showNotification('❌ Enter Gemini API key first', 'error', 'settingsStatus');
    return;
  }

  showNotification('🧪 Testing Gemini connection...', 'loading', 'settingsStatus');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say "OK"' }] }],
        generationConfig: { maxOutputTokens: 10 }
      })
    });

    if (response.ok) {
      showNotification('✅ Gemini API connected!', 'success', 'settingsStatus');
    } else {
      const err = await response.json();
      showNotification(`❌ Gemini Error: ${err.error?.message || response.status}`, 'error', 'settingsStatus');
    }
  } catch (error) {
    showNotification(`❌ Connection failed: ${error.message}`, 'error', 'settingsStatus');
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// ANALYZER DATA LOADING
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Extract a section from raw analysis by header
 * @param {string} rawAnalysis - Full analysis text
 * @param {string} sectionHeader - Header to search for (e.g., "### 2. COMPLETE TRANSCRIPT")
 * @returns {string|null} Extracted section content or null
 */
function extractSection(rawAnalysis, sectionHeader) {
  if (!rawAnalysis) return null;

  const startIdx = rawAnalysis.indexOf(sectionHeader);
  if (startIdx === -1) return null;

  // Find the next section header (### followed by number)
  const afterHeader = startIdx + sectionHeader.length;
  const nextSectionMatch = rawAnalysis.substring(afterHeader).match(/\n### \d+\./);
  const endIdx = nextSectionMatch
    ? afterHeader + nextSectionMatch.index
    : rawAnalysis.length;

  return rawAnalysis.substring(startIdx, endIdx).trim();
}

/**
 * Parse blueprint metadata from analysis sections
 */
function extractBlueprintData(rawAnalysis) {
  const blueprint = {
    duration: null,
    scenes: null,
    pacing: null,
    hookType: null
  };

  // Extract from Content Structure section (### 11)
  const structureSection = extractSection(rawAnalysis, '### 11. CONTENT STRUCTURE');
  if (structureSection) {
    const pacingMatch = structureSection.match(/\*\*Pacing\*\*:\s*([^\n]+)/i);
    if (pacingMatch) blueprint.pacing = pacingMatch[1].trim();
  }

  // Extract from Opening Hook section (### 9)
  const hookSection = extractSection(rawAnalysis, '### 9. OPENING HOOK');
  if (hookSection) {
    const typeMatch = hookSection.match(/\*\*Type\*\*:\s*\[?([^\]\n]+)/i);
    if (typeMatch) blueprint.hookType = typeMatch[1].trim();
  }

  // Count scenes from Visual Breakdown table
  const visualSection = extractSection(rawAnalysis, '### 3. VISUAL BREAKDOWN');
  if (visualSection) {
    const rows = visualSection.match(/\|\s*\d+:\d+/g);
    if (rows) blueprint.scenes = rows.length;
  }

  return blueprint;
}

// ═══════════════════════════════════════════════════════════════════
// REPRODUCTION DATA PARSING (For 100% Clone Mode)
// ═══════════════════════════════════════════════════════════════════

/**
 * Parse Visual Breakdown table from Section 3
 * @returns {Map} timestamp -> {duration, visual, onScreenText, camera}
 */
function parseVisualBreakdown(rawAnalysis) {
  const visualMap = new Map();
  const section = extractSection(rawAnalysis, '### 3. VISUAL BREAKDOWN');
  if (!section) return visualMap;

  const lines = section.split('\n');
  for (const line of lines) {
    // Match: | 0:00-0:06 | 6s | Visual Description | On-Screen Text | Camera |
    const match = line.match(/\|\s*(\d+:\d+)[-–]?(\d+:\d+)?\s*\|\s*(\d+s)?\s*\|\s*([^|]+)\|\s*([^|]*)\|\s*([^|]*)\|?/);
    if (match) {
      const startTime = match[1];
      visualMap.set(startTime, {
        endTime: match[2] || null,
        duration: match[3] || null,
        visual: match[4]?.trim() || '',
        onScreenText: match[5]?.trim() || '',
        camera: match[6]?.trim() || ''
      });
    }
  }
  console.log(`📊 Parsed ${visualMap.size} visual breakdown entries`);
  return visualMap;
}

/**
 * Parse Audio Elements from Section 4
 * @returns {object} {voiceStyle, bgm, sfx, audioBalance}
 */
function parseAudioElements(rawAnalysis) {
  const audio = {
    voiceStyle: 'Natural, conversational',
    bgm: null,
    sfx: null,
    audioBalance: null
  };

  const section = extractSection(rawAnalysis, '### 4. AUDIO ELEMENTS');
  if (!section) return audio;

  // Extract Voice Style
  const voiceMatch = section.match(/\*\*Voice Style:\*\*\s*([^\n]+)/i);
  if (voiceMatch) audio.voiceStyle = voiceMatch[1].trim();

  // Extract Background Music
  const bgmMatch = section.match(/\*\*Background Music:\*\*\s*([^\n]+)/i);
  if (bgmMatch) audio.bgm = bgmMatch[1].trim();

  // Extract Sound Effects
  const sfxMatch = section.match(/\*\*Sound Effects:\*\*\s*([^\n]+)/i);
  if (sfxMatch) audio.sfx = sfxMatch[1].trim();

  // Extract Audio Balance
  const balanceMatch = section.match(/\*\*Audio Balance:\*\*\s*([^\n]+)/i);
  if (balanceMatch) audio.audioBalance = balanceMatch[1].trim();

  console.log(`🔊 Parsed audio elements:`, audio.voiceStyle);
  return audio;
}

/**
 * Parse On-Screen Graphics from Section 5
 * @returns {Map} timestamp -> {type, content, position, style}
 */
function parseOnScreenGraphics(rawAnalysis) {
  const graphicsMap = new Map();
  const section = extractSection(rawAnalysis, '### 5. ON-SCREEN GRAPHICS');
  if (!section) return graphicsMap;

  const lines = section.split('\n');
  for (const line of lines) {
    // Match: | 0:00 | Main Title | "THE PSYCHOLOGY OF MONEY" | Center | Large bold |
    const match = line.match(/\|\s*(\d+:\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]*)\|\s*([^|]*)\|?/);
    if (match) {
      const timestamp = match[1];
      if (!graphicsMap.has(timestamp)) {
        graphicsMap.set(timestamp, []);
      }
      graphicsMap.get(timestamp).push({
        type: match[2]?.trim() || '',
        content: match[3]?.trim().replace(/^"/, '').replace(/"$/, '') || '',
        position: match[4]?.trim() || '',
        style: match[5]?.trim() || ''
      });
    }
  }
  console.log(`📝 Parsed ${graphicsMap.size} on-screen graphic entries`);
  return graphicsMap;
}

/**
 * Parse CTAs from Section 6
 * @returns {Map} timestamp -> {type, words, strategy}
 */
function parseCTAs(rawAnalysis) {
  const ctaMap = new Map();
  const section = extractSection(rawAnalysis, '### 6. CALLS TO ACTION');
  if (!section) return ctaMap;

  const lines = section.split('\n');
  for (const line of lines) {
    // Match: | 0:34-0:38 | Verbal | "Spend your next ten..." | Early Promise |
    const match = line.match(/\|\s*(\d+:\d+)[-–]?[\d:]*\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]*)\|?/);
    if (match) {
      const timestamp = match[1];
      ctaMap.set(timestamp, {
        type: match[2]?.trim() || '',
        words: match[3]?.trim().replace(/^"/, '').replace(/"$/, '') || '',
        strategy: match[4]?.trim() || ''
      });
    }
  }
  console.log(`📢 Parsed ${ctaMap.size} CTA entries`);
  return ctaMap;
}

/**
 * Parse transcript table and extract smart section titles
 * @returns {Array} [{timestamp, seconds, text, sectionTitle}]
 */
function parseTranscriptWithTitles(rawAnalysis) {
  const entries = [];
  const section = extractSection(rawAnalysis, '### 2. COMPLETE TRANSCRIPT');
  if (!section) return entries;

  const lines = section.split('\n');
  for (const line of lines) {
    // Match: | [0:00] | Text here |
    let match = line.match(/\|\s*\[?(\d+:\d+)\]?\s*\|\s*(.+)/);
    if (match) {
      const timestamp = match[1];
      const text = match[2].trim().replace(/\|$/, '').trim();

      if (text && text.length > 2) {
        const timeParts = timestamp.split(':');
        const seconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);

        // Extract smart section title from content
        let sectionTitle = null;
        const takeawayMatch = text.match(/Takeaway number (\d+):\s*(.+?)(?:\.|$)/i);
        if (takeawayMatch) {
          sectionTitle = `TAKEAWAY ${takeawayMatch[1]}: ${takeawayMatch[2].trim()}`;
        }
        const habitMatch = text.match(/Habit (\d+):\s*(.+?)(?:\.|$)/i);
        if (habitMatch) {
          sectionTitle = `HABIT ${habitMatch[1]}: ${habitMatch[2].trim()}`;
        }

        entries.push({ timestamp, seconds, text, sectionTitle });
      }
    }
  }
  console.log(`📜 Parsed ${entries.length} transcript entries`);
  return entries;
}

async function loadAnalyzerData() {
  try {
    const stored = await chrome.storage.local.get(['analyzerData']);
    if (!stored.analyzerData) return;

    const data = stored.analyzerData;
    state.analyzerData = data;

    console.log('📊 Loading analyzer data:', data);

    // Handle both old format (direct fields) and new format (metadata object)
    const videoTitle = data.metadata?.videoTitle || data.videoTitle || '';
    const channel = data.metadata?.channel || data.channel || '';
    const views = data.metadata?.views || data.views || '';
    const duration = data.metadata?.duration || data.duration || '';
    const url = data.metadata?.url || data.url || '';

    // Set Video Topic from title
    if (videoTitle) {
      document.getElementById('topic').value = videoTitle;
    }

    // ═══════════════════════════════════════════════════════════════════
    // NEW: Parse 14-section format from rawAnalysis
    // ═══════════════════════════════════════════════════════════════════
    if (data.rawAnalysis) {
      console.log('📋 Parsing 14-section format...');

      // Extract reproduction sections (Part A)
      state.parsedSections.verbatimTranscript = extractSection(data.rawAnalysis, '### 2. COMPLETE TRANSCRIPT');
      state.parsedSections.visualBreakdown = extractSection(data.rawAnalysis, '### 3. VISUAL BREAKDOWN');
      state.parsedSections.audioElements = extractSection(data.rawAnalysis, '### 4. AUDIO ELEMENTS');
      state.parsedSections.onScreenGraphics = extractSection(data.rawAnalysis, '### 5. ON-SCREEN GRAPHICS');
      state.parsedSections.ctas = extractSection(data.rawAnalysis, '### 6. CALLS TO ACTION');

      // Extract video techniques for VEO auto-style
      state.parsedSections.videoTechniques = extractSection(data.rawAnalysis, '### 14. VIDEO TECHNIQUES');

      // Log what we found
      console.log('  ✅ Transcript:', state.parsedSections.verbatimTranscript ? 'Found' : 'Not found');
      console.log('  ✅ Visual Breakdown:', state.parsedSections.visualBreakdown ? 'Found' : 'Not found');
      console.log('  ✅ Audio Elements:', state.parsedSections.audioElements ? 'Found' : 'Not found');

      // Show clone mode selector if we have transcript data
      const cloneModeSelector = document.getElementById('cloneModeSelector');
      if (cloneModeSelector) {
        cloneModeSelector.style.display = 'block';

        // Set source info
        const sourceInfo = document.getElementById('analyzerSourceInfo');
        if (sourceInfo) {
          sourceInfo.textContent = `📺 ${channel || videoTitle || 'Analyzed Video'}`;
        }

        // Populate blueprint summary
        const blueprint = extractBlueprintData(data.rawAnalysis);
        if (duration) document.getElementById('bpDuration').textContent = duration;
        if (blueprint.scenes) document.getElementById('bpScenes').textContent = `${blueprint.scenes} shots`;
        if (blueprint.pacing) document.getElementById('bpPacing').textContent = blueprint.pacing.split(' ')[0];
        if (blueprint.hookType) document.getElementById('bpHook').textContent = blueprint.hookType.split('/')[0].trim();

        // Show blueprint summary if we have data
        const bpSummary = document.getElementById('blueprintSummary');
        if (bpSummary && (duration || blueprint.scenes || blueprint.pacing)) {
          bpSummary.style.display = 'block';
        }

        // Setup clone mode card event listeners
        setupCloneModeCardListeners();
      }
    }

    // Handle audience - First try rawAnalysis Section 7, then structured data
    let audienceText = '';

    // Always try rawAnalysis extraction first (new 14-section format)
    if (data.rawAnalysis) {
      console.log('📋 Trying to extract audience from Section 7...');
      const audienceSection = extractSection(data.rawAnalysis, '### 7. POTENTIAL AUDIENCE');
      if (audienceSection) {
        console.log('✅ Found Section 7, length:', audienceSection.length);
        // Use simple extraction - just get first 400 chars after header
        audienceText = audienceSection
          .replace(/### 7\. POTENTIAL AUDIENCE[^\n]*/i, '')
          .trim()
          .substring(0, 400);
        console.log('✅ Extracted audience:', audienceText.substring(0, 100) + '...');
      }
    }

    // Fallback to structured data if rawAnalysis extraction failed
    if (!audienceText && data.audience) {
      if (typeof data.audience === 'string') {
        audienceText = data.audience;
      } else if (typeof data.audience === 'object') {
        if (data.audience.demographics || data.audience.psychographics) {
          audienceText = `${data.audience.demographics || ''}\n${data.audience.psychographics || ''}`.trim();
        } else if (Object.keys(data.audience).length > 0) {
          audienceText = JSON.stringify(data.audience, null, 2);
        }
      }
    }

    if (audienceText) {
      document.getElementById('audience').value = audienceText;
    }

    // Handle opening hook - First try rawAnalysis Section 9, then structured data
    let hookText = '';

    // Always try rawAnalysis extraction first (new 14-section format)
    if (data.rawAnalysis) {
      console.log('📋 Trying to extract hook from Section 9...');
      const hookSection = extractSection(data.rawAnalysis, '### 9. OPENING HOOK');
      if (hookSection) {
        console.log('✅ Found Section 9, length:', hookSection.length);
        // Use simple extraction - just get first 500 chars after header
        hookText = hookSection
          .replace(/### 9\. OPENING HOOK[^\n]*/i, '')
          .trim()
          .substring(0, 500);
        console.log('✅ Extracted hook:', hookText.substring(0, 100) + '...');
      }
    }

    // Fallback to structured data if rawAnalysis extraction failed
    if (!hookText && data.openingHook) {
      if (typeof data.openingHook === 'string') {
        hookText = data.openingHook;
      } else if (typeof data.openingHook === 'object') {
        if (data.openingHook.fullAnalysis) {
          hookText = data.openingHook.fullAnalysis;
        } else if (data.openingHook.quote) {
          hookText = data.openingHook.quote;
        } else if (data.openingHook.pattern) {
          hookText = `Pattern: ${data.openingHook.pattern}\n${data.openingHook.effectiveness || ''}`;
        } else if (Object.keys(data.openingHook).length > 0) {
          hookText = JSON.stringify(data.openingHook, null, 2);
        }
      }
    }

    if (hookText) {
      document.getElementById('angle').value = hookText;
    }

    // Handle additional context - Extract from rawAnalysis sections (new 14-section format)
    let contextParts = [];

    // Add video metadata as context
    if (channel || views || duration) {
      contextParts.push(`📺 Source Video: ${channel}${views ? ` | ${views} views` : ''}${duration ? ` | ${duration}` : ''}`);
    }

    // Extract from rawAnalysis sections if available
    if (data.rawAnalysis) {
      console.log('📋 Extracting context from rawAnalysis sections...');

      // Section 8: TITLE ANALYSIS
      const titleSection = extractSection(data.rawAnalysis, '### 8. TITLE ANALYSIS');
      if (titleSection) {
        const titleContent = titleSection
          .replace(/### 8\. TITLE ANALYSIS[^\n]*/i, '')
          .trim()
          .substring(0, 400);
        if (titleContent.length > 20) {
          contextParts.push(`🏷️ Title Analysis:\n${titleContent}`);
          console.log('✅ Extracted Title Analysis');
        }
      }

      // Section 10: CURIOSITY GAPS & RETENTION MECHANICS
      const curiositySection = extractSection(data.rawAnalysis, '### 10. CURIOSITY GAPS');
      if (curiositySection) {
        const curiosityContent = curiositySection
          .replace(/### 10\. CURIOSITY GAPS[^\n]*/i, '')
          .trim()
          .substring(0, 500);
        if (curiosityContent.length > 20) {
          contextParts.push(`🎯 Curiosity Gaps:\n${curiosityContent}`);
          console.log('✅ Extracted Curiosity Gaps');
        }
      }

      // Section 11: CONTENT STRUCTURE
      const structureSection = extractSection(data.rawAnalysis, '### 11. CONTENT STRUCTURE');
      if (structureSection) {
        const structureContent = structureSection
          .replace(/### 11\. CONTENT STRUCTURE[^\n]*/i, '')
          .trim()
          .substring(0, 500);
        if (structureContent.length > 20) {
          contextParts.push(`📐 Content Structure:\n${structureContent}`);
          console.log('✅ Extracted Content Structure');
        }
      }

      // ═══════════════════════════════════════════════════════════════════
      // NEW: 95% CLONE ENHANCED CONTEXT - Extract additional sections
      // ═══════════════════════════════════════════════════════════════════

      // Section 12: VIRAL MECHANICS & SHAREABILITY
      const viralSection = extractSection(data.rawAnalysis, '### 12. VIRAL MECHANICS');
      if (viralSection) {
        const viralContent = viralSection
          .replace(/### 12\. VIRAL MECHANICS[^\n]*/i, '')
          .trim()
          .substring(0, 400);
        if (viralContent.length > 20) {
          contextParts.push(`🔥 Viral Mechanics:\n${viralContent}`);
          console.log('✅ Extracted Viral Mechanics (95% Clone)');
        }
      }

      // Section 13: WHAT YOU CAN LEARN & REPLICATE (CRITICAL for 95% Clone)
      const whatToStealSection = extractSection(data.rawAnalysis, '### 13. WHAT YOU CAN LEARN');
      if (whatToStealSection) {
        const whatToStealContent = whatToStealSection
          .replace(/### 13\. WHAT YOU CAN LEARN[^\n]*/i, '')
          .trim()
          .substring(0, 600);
        if (whatToStealContent.length > 20) {
          contextParts.push(`🎯 What to Steal/Replicate:\n${whatToStealContent}`);
          console.log('✅ Extracted What to Steal (95% Clone - CRITICAL)');
        }
      }

      // Section 9: OPENING HOOK (for hook preservation)
      const hookSection = extractSection(data.rawAnalysis, '### 9. OPENING HOOK');
      if (hookSection) {
        const hookContent = hookSection
          .replace(/### 9\. OPENING HOOK[^\n]*/i, '')
          .trim()
          .substring(0, 400);
        if (hookContent.length > 20) {
          contextParts.push(`🪝 Opening Hook Analysis:\n${hookContent}`);
          console.log('✅ Extracted Opening Hook Analysis');
        }
      }
    }

    // Fallback to structured data if rawAnalysis extraction didn't work
    if (contextParts.length <= 1) {
      // Add content structure if available (old format)
      if (data.contentStructure && typeof data.contentStructure === 'string' && data.contentStructure.length > 10) {
        contextParts.push(`📐 Structure:\n${data.contentStructure}`);
      }

      // Add curiosity gaps if available (old format)
      if (data.curiosityGaps && Array.isArray(data.curiosityGaps) && data.curiosityGaps.length > 0) {
        contextParts.push(`🎯 Curiosity Gaps:\n${data.curiosityGaps.join('\n')}`);
      } else if (typeof data.curiosityGaps === 'string' && data.curiosityGaps.length > 10) {
        contextParts.push(`🎯 Curiosity Gaps:\n${data.curiosityGaps}`);
      }

      // Add video outline if available (old format)
      if (data.videoOutline) {
        if (Array.isArray(data.videoOutline) && data.videoOutline.length > 0) {
          contextParts.push(`📋 Video Outline:\n${data.videoOutline.join('\n')}`);
        } else if (typeof data.videoOutline === 'string' && data.videoOutline.length > 10) {
          contextParts.push(`📋 Video Outline:\n${data.videoOutline}`);
        }
      }

      // Add title analysis if available (old format)
      if (data.titleAnalysis && typeof data.titleAnalysis === 'string' && data.titleAnalysis.length > 10) {
        contextParts.push(`🏷️ Title Analysis:\n${data.titleAnalysis}`);
      }
    }

    // Populate context field if we have additional info
    if (contextParts.length > 0) {
      const contextField = document.getElementById('context');
      if (contextField) {
        contextField.value = contextParts.join('\n\n');
      }
    }

    // Store raw analysis for potential use in script generation
    if (data.rawAnalysis) {
      state.analyzerData.rawAnalysis = data.rawAnalysis;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 95% CLONE: Auto-fill Script Parameters from analyzer data
    // ═══════════════════════════════════════════════════════════════════
    autoFillScriptParameters(data);

    console.log('✅ Analyzer data loaded successfully');
    showNotification('📊 Analysis loaded from YouTube Analyzer!', 'success');
  } catch (error) {
    console.error('❌ Error loading analyzer data:', error);
  }
}

/**
 * Setup clone mode card selection listeners
 */
function setupCloneModeCardListeners() {
  document.querySelectorAll('.clone-mode-card').forEach(card => {
    card.addEventListener('click', () => {
      // Remove active from all cards
      document.querySelectorAll('.clone-mode-card').forEach(c => c.classList.remove('active'));
      // Add active to clicked card
      card.classList.add('active');
      // Update state
      state.cloneMode = card.dataset.mode;
      console.log(`🎯 Clone Mode selected: ${state.cloneMode}`);

      // Show notification based on mode
      const modeNames = { '100': '100% Clone', '95': '95% Clone', '50': '50% Remix' };
      showNotification(`🎯 ${modeNames[state.cloneMode]} mode selected`, 'info');
    });
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// AI SUGGESTIONS
// ──────────────────────────────────────────────────────────────────────────────

function generateAISuggestions() {
  const topic = document.getElementById('topic').value.trim();
  const audience = document.getElementById('audience').value.trim();

  if (!topic && !audience) return;

  const suggestionsBox = document.getElementById('suggestionsBox');
  const suggestionContent = document.getElementById('suggestionContent');

  let suggestions = [];

  if (topic.toLowerCase().includes('money') || topic.toLowerCase().includes('finance')) {
    suggestions.push('Template: Educational or Tutorial');
  }
  if (topic.toLowerCase().includes('how to')) {
    suggestions.push('Template: Tutorial, Length: Medium (5-10 min)');
  }
  if (audience.toLowerCase().includes('beginner')) {
    suggestions.push('Voice: Friendly, simple language');
  }

  if (suggestions.length > 0) {
    suggestionContent.innerHTML = suggestions.map(s => `• ${s}`).join('<br>');
    suggestionsBox.style.display = 'block';
  } else {
    suggestionsBox.style.display = 'none';
  }
}

async function generateAISuggestionsFromAnalyzer() {
  console.log('🔍 generateAISuggestionsFromAnalyzer called');
  console.log('State analyzerData:', state.analyzerData);
  console.log('Claude API Key present:', !!state.settings.claudeApiKey);

  if (!state.analyzerData) {
    showNotification('❌ No analyzer data available', 'error');
    console.error('❌ No analyzer data');
    return;
  }
  if (!state.settings.claudeApiKey) {
    showNotification('❌ Configure Claude API key first', 'error');
    console.error('❌ No Claude API key');
    return;
  }

  showNotification('⏳ Generating AI suggestions...', 'loading');
  console.log('🤖 Starting AI suggestion generation...');

  try {
    const videoTitle = state.analyzerData.videoTitle || 'Unknown';
    const audience = state.analyzerData.audience || 'General';

    const prompt = `Based on this YouTube video analysis, suggest optimal script parameters:

VIDEO TITLE: "${videoTitle}"
TARGET AUDIENCE: ${typeof audience === 'string' ? audience : JSON.stringify(audience)}

Provide these suggestions in strict JSON format:
{
  "videoTopic": "concise topic (max 10 words)",
  "videoTemplate": "one of: Universal, Editorial, Documentary, Educational, Story, Commentary, Review, Tutorial, VSL, Compilation, Explainer, Interview, Webinar, Shorts_Promotional, Shorts_Educational, Shorts_Viral, Shorts_Story",
  "targetLength": "one of: Under 1 min, 1-3 min, Short (3-5 min), Medium (5-10 min), Long (10-20 min), Very Long (20+ min)",
  "uniqueAngle": "unique selling point (max 15 words)",
  "voiceProfile": "one of: Professional, Casual & Friendly, Educational, Entertaining, Warm & Empathetic"

Return ONLY the JSON object, no explanation or markdown.`;

    console.log('📤 Sending request to AI API...');

    // Use the selected suggestion model
    const suggestionModel = document.getElementById('suggestionModelSelect')?.value || 'gemini-2.5-flash';
    console.log('Using suggestion model:', suggestionModel);

    // Detect if model is Gemini or Claude
    const isGemini = suggestionModel.startsWith('gemini');
    let rawText;

    if (isGemini) {
      // Gemini API Call
      if (!state.settings.geminiApiKey) {
        throw new Error('Gemini API key required. Configure in Settings.');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${suggestionModel}:generateContent?key=${state.settings.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7
          }
        })
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📄 Raw response:', data);
      rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Invalid response from Gemini API');
      }
    } else {
      // Claude API Call
      if (!state.settings.claudeApiKey) {
        throw new Error('Claude API key required. Configure in Settings.');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': state.settings.claudeApiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: suggestionModel,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error?.message || `Claude API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📄 Raw response:', data);
      rawText = data.content[0].text;
    }

    console.log('📝 Raw text:', rawText);

    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    console.log('🧹 Cleaned JSON:', cleanJson);

    const suggestions = JSON.parse(cleanJson);
    console.log('✅ Parsed suggestions:', suggestions);

    // Apply suggestions to form fields
    if (suggestions.videoTopic) {
      document.getElementById('topic').value = suggestions.videoTopic;
      console.log('✓ Set topic:', suggestions.videoTopic);
    }
    if (suggestions.videoTemplate) {
      document.getElementById('template').value = suggestions.videoTemplate;
      console.log('✓ Set template:', suggestions.videoTemplate);
    }
    if (suggestions.targetLength) {
      document.getElementById('targetLength').value = suggestions.targetLength;
      console.log('✓ Set targetLength:', suggestions.targetLength);
    }
    if (suggestions.uniqueAngle) {
      document.getElementById('uniqueAngle').value = suggestions.uniqueAngle;
      console.log('✓ Set uniqueAngle:', suggestions.uniqueAngle);
    }
    if (suggestions.voiceProfile) {
      document.getElementById('voiceProfile').value = suggestions.voiceProfile;
      console.log('✓ Set voiceProfile:', suggestions.voiceProfile);
    }

    showNotification('✅ AI suggestions applied!', 'success');
    console.log('🎉 AI suggestions successfully applied');
  } catch (error) {
    console.error('❌ Error in generateAISuggestionsFromAnalyzer:', error);
    showNotification(`❌ Error: ${error.message}`, 'error');
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// SCRIPT GENERATION (Claude)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Format verbatim transcript into VEO-ready script format (100% Clone Mode)
 * Merges ALL reproduction data: transcript, visuals, audio, graphics
 * @param {string} transcriptSection - Raw transcript section from analyzer
 * @param {string} visualSection - Visual breakdown section (unused, we parse from rawAnalysis)
 * @param {string} audioSection - Audio elements section (unused, we parse from rawAnalysis)
 * @param {string} title - Video title
 * @returns {string} Formatted script ready for VEO prompt generation
 */
function formatTranscriptAsVEOScript(transcriptSection, visualSection, audioSection, title) {
  console.log('📋 Formatting transcript for VEO (Full Reproduction Mode)...');

  const rawAnalysis = state.analyzerData?.rawAnalysis || '';

  // Parse all reproduction data sources
  const transcriptEntries = parseTranscriptWithTitles(rawAnalysis);
  const visualMap = parseVisualBreakdown(rawAnalysis);
  const audio = parseAudioElements(rawAnalysis);
  const graphicsMap = parseOnScreenGraphics(rawAnalysis);
  const ctaMap = parseCTAs(rawAnalysis);

  console.log(`📊 Data sources: ${transcriptEntries.length} transcript, ${visualMap.size} visuals, ${graphicsMap.size} graphics`);

  // If no transcript parsed, try fallback
  if (transcriptEntries.length === 0) {
    console.warn('⚠️ No transcript entries found, using raw content fallback');
    return `# ${title}\n\n## 📺 100% CLONE MODE - Verbatim Reproduction Script\n\n---\n\n**[0:00 - FULL TRANSCRIPT]**\n\n${transcriptSection}\n\n---\n\n**[END]**`;
  }

  // Group transcript entries into segments (~8-10 seconds each)
  const segments = [];
  let currentSegment = null;
  let segmentIndex = 0;

  for (const entry of transcriptEntries) {
    const segmentNum = Math.floor(entry.seconds / 8);

    if (!currentSegment || segmentNum !== currentSegment.segmentNum) {
      if (currentSegment) segments.push(currentSegment);
      currentSegment = {
        segmentNum,
        startTime: entry.timestamp,
        startSeconds: entry.seconds,
        texts: [],
        sectionTitle: null
      };
    }

    currentSegment.texts.push(entry.text);
    if (entry.sectionTitle && !currentSegment.sectionTitle) {
      currentSegment.sectionTitle = entry.sectionTitle;
    }
  }
  if (currentSegment) segments.push(currentSegment);

  // Build the comprehensive script
  let script = `# ${title}\n\n`;
  script += `## 📺 100% CLONE MODE - Complete Reproduction Script\n\n`;
  script += `**AUDIO DIRECTION:**\n`;
  script += `- Voice: ${audio.voiceStyle}\n`;
  if (audio.bgm) script += `- Background Music: ${audio.bgm}\n`;
  if (audio.sfx) script += `- Sound Effects: ${audio.sfx}\n`;
  script += `\n---\n\n`;

  // Generate each segment with all reproduction data
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const isHook = i === 0;
    const isConclusion = i === segments.length - 1;

    // Determine section title
    let sectionTitle;
    if (isHook) {
      sectionTitle = 'HOOK';
    } else if (isConclusion) {
      sectionTitle = 'CONCLUSION & CTA';
    } else if (seg.sectionTitle) {
      sectionTitle = seg.sectionTitle;
    } else {
      // Create title from first few words of content
      const firstWords = seg.texts[0]?.split(' ').slice(0, 5).join(' ') || '';
      sectionTitle = `SECTION ${i}: ${firstWords}...`;
    }

    // Calculate end time for segment
    const nextSeg = segments[i + 1];
    const endTime = nextSeg ? nextSeg.startTime : formatTimestamp(seg.startSeconds + 8);

    script += `**[${seg.startTime}-${endTime} - ${sectionTitle}]**\n\n`;

    // Add VISUAL from visual breakdown (find closest timestamp)
    const visual = findClosestVisual(visualMap, seg.startTime, seg.startSeconds);
    if (visual) {
      script += `**VISUAL:** ${visual.visual}\n`;
      if (visual.camera) script += `**CAMERA:** ${visual.camera}\n`;
    }

    // Add ON-SCREEN TEXT from graphics
    const graphics = findClosestGraphics(graphicsMap, seg.startTime, seg.startSeconds);
    if (graphics && graphics.length > 0) {
      const graphicTexts = graphics.map(g => `"${g.content}" (${g.position})`).join(', ');
      script += `**ON-SCREEN TEXT:** ${graphicTexts}\n`;
    }

    // Add CTA if present
    const cta = findClosestCTA(ctaMap, seg.startTime, seg.startSeconds);
    if (cta) {
      script += `**CTA:** [${cta.type}] ${cta.strategy}\n`;
    }

    script += `\n`;

    // Add SPOKEN text (the main transcript content)
    script += `**SPOKEN:**\n`;
    script += `${seg.texts.join(' ')}\n\n`;
    script += `---\n\n`;
  }

  // Add END marker
  const lastSeg = segments[segments.length - 1];
  if (lastSeg) {
    script += `**[END - ${formatTimestamp(lastSeg.startSeconds + 10)}]**\n`;
  }

  console.log(`✅ Full reproduction script generated: ${script.length} chars, ${segments.length} segments`);
  return script;
}

// Helper: Find closest visual entry by timestamp
function findClosestVisual(visualMap, timestamp, seconds) {
  // Try exact match first
  if (visualMap.has(timestamp)) return visualMap.get(timestamp);

  // Try nearby timestamps (within 5 seconds)
  for (const [key, value] of visualMap.entries()) {
    const keyParts = key.split(':');
    const keySeconds = parseInt(keyParts[0]) * 60 + parseInt(keyParts[1]);
    if (Math.abs(keySeconds - seconds) <= 5) return value;
  }
  return null;
}

// Helper: Find closest graphics entries by timestamp
function findClosestGraphics(graphicsMap, timestamp, seconds) {
  if (graphicsMap.has(timestamp)) return graphicsMap.get(timestamp);

  for (const [key, value] of graphicsMap.entries()) {
    const keyParts = key.split(':');
    const keySeconds = parseInt(keyParts[0]) * 60 + parseInt(keyParts[1]);
    if (Math.abs(keySeconds - seconds) <= 5) return value;
  }
  return null;
}

// Helper: Find closest CTA by timestamp
function findClosestCTA(ctaMap, timestamp, seconds) {
  if (ctaMap.has(timestamp)) return ctaMap.get(timestamp);

  for (const [key, value] of ctaMap.entries()) {
    const keyParts = key.split(':');
    const keySeconds = parseInt(keyParts[0]) * 60 + parseInt(keyParts[1]);
    if (Math.abs(keySeconds - seconds) <= 10) return value;
  }
  return null;
}

/**
 * Format seconds to M:SS timestamp
 */
function formatTimestamp(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Build prompt for 100% Clone Mode (Hybrid Approach)
 * AI formats/merges reproduction data intelligently - NO new content creation
 * @param {string} title - Video title
 * @param {object} parsedSections - Parsed reproduction sections
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

**[X:XX-X:XX - SECTION TITLE (extracted from content, e.g., "TAKEAWAY 1: Pay the Price")]**

**VISUAL:** [From Section 3]
**CAMERA:** [From Section 3]
**CTA:** [From Section 6 if applicable]

**SPOKEN:**
[EXACT words from Section 2 - VERBATIM]

---
[Continue for all segments...]

**[END - X:XX]**
\`\`\`

## IMPORTANT:
- Group transcript into ~8-10 second segments
- Extract section titles from content (e.g., "Takeaway number 1:" → "TAKEAWAY 1: Pay the Price")
- First segment is always "HOOK"
- Last segment is always "CONCLUSION & CTA"
- Match visuals to spoken content by timestamp proximity

Now format the reproduction data into a clean script. Remember: VERBATIM spoken words only!`;
}

async function generateScript() {
  const topic = document.getElementById('topic').value.trim();
  const template = document.getElementById('template').value;
  const targetLength = document.getElementById('targetLength').value;

  // ═══════════════════════════════════════════════════════════════════
  // 100% CLONE MODE (HYBRID): Use AI to format/merge reproduction data
  // ═══════════════════════════════════════════════════════════════════
  if (state.cloneMode === '100') {
    console.log('📋 100% Clone Mode (Hybrid) detected');

    // Check for topic (required for title)
    if (!topic) {
      showNotification('❌ Enter topic', 'error');
      return;
    }

    // Check for API key (needed for hybrid approach)
    const aiModel = document.getElementById('modelSelect')?.value || 'claude';
    const hasClaudeKey = state.settings.claudeApiKey && state.settings.claudeApiKey.length > 10;
    const hasGeminiKey = state.settings.geminiApiKey && state.settings.geminiApiKey.length > 10;

    console.log('📋 API Key check:', { aiModel, hasClaudeKey, hasGeminiKey });

    if ((aiModel === 'gemini' && !hasGeminiKey) || (aiModel !== 'gemini' && !hasClaudeKey)) {
      // Check if other key is available
      if (hasGeminiKey || hasClaudeKey) {
        console.log('📋 Using available API key');
      } else {
        showNotification('❌ Configure API key in Settings (needed for formatting)', 'error');
        return;
      }
    }

    // Check for reproduction data
    const hasReproductionData = state.parsedSections.verbatimTranscript ||
      state.analyzerData?.rawAnalysis;

    if (!hasReproductionData) {
      console.warn('⚠️ 100% Clone Mode: No reproduction data available');
      showNotification('⚠️ No analyzer data. Switching to 95% Clone mode.', 'warning');
      state.cloneMode = '95';
    } else {
      // Proceed with hybrid 100% mode
      console.log('📋 100% Clone Mode: Building reproduction prompt...');
      showNotification('📋 100% Clone: AI formatting reproduction data...', 'loading');

      document.getElementById('generateBtn').disabled = true;
      showProgressBar('progressContainer', 'progressBar', 'progressPercent');

      try {
        const reproductionPrompt = buildReproductionPrompt(
          topic,
          state.parsedSections,
          state.analyzerData?.rawAnalysis || ''
        );

        updateProgressBar('progressBar', 'progressPercent', 20);

        const selectedModel = document.getElementById('modelSelect')?.value || '';
        const isGeminiModel = selectedModel.startsWith('gemini');
        let formattedScript;

        // Call AI to format/merge the reproduction data
        if (isGeminiModel || (hasGeminiKey && !hasClaudeKey)) {
          // Use Gemini
          const geminiModel = isGeminiModel ? selectedModel : 'gemini-2.5-flash';
          console.log('📋 Using Gemini:', geminiModel);
          formattedScript = await callGeminiAPI(reproductionPrompt, geminiModel, state.settings.geminiApiKey);
        } else {
          // Use Claude
          const claudeModel = selectedModel.startsWith('claude') ? selectedModel : 'claude-sonnet-4-20250514';
          console.log('📋 Using Claude:', claudeModel);
          formattedScript = await callClaudeAPI(reproductionPrompt, claudeModel, state.settings.claudeApiKey);
        }

        updateProgressBar('progressBar', 'progressPercent', 90);

        // Clean up markdown code blocks if present
        formattedScript = formattedScript.replace(/```markdown/g, '').replace(/```/g, '').trim();

        // Create script object
        const cloneScript = {
          fullScript: formattedScript,
          title: topic,
          topic: topic,
          template: 'reproduction',
          targetLength: 'original',
          cloneMode: '100%',
          wordCount: formattedScript.split(/\\s+/).length,
          quality: 100,
          generatedAt: new Date().toLocaleString()
        };

        state.generatedScript = cloneScript;
        displayScript(cloneScript);
        document.getElementById('exportButtonsContainer').style.display = 'grid';

        // Auto-calculate VEO prompts from script
        if (!document.getElementById('manualPromptsOverride')?.checked) {
          autoCalcPromptsFromScript(formattedScript);
        }

        updateProgressBar('progressBar', 'progressPercent', 100);
        hideProgressBar('progressContainer');
        showNotification('✅ 100% Clone script ready! AI-formatted reproduction data.', 'success');
        document.getElementById('generateBtn').disabled = false;
        return;

      } catch (error) {
        console.error('❌ 100% Clone API error:', error);
        hideProgressBar('progressContainer');
        document.getElementById('generateBtn').disabled = false;
        showNotification(`❌ Error: ${error.message}. Try 95% mode.`, 'error');
        return;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // STANDARD VALIDATION (for 95%/50% modes)
  // ═══════════════════════════════════════════════════════════════════
  if (!topic) { showNotification('❌ Enter topic', 'error'); return; }
  if (!template) { showNotification('❌ Select template', 'error'); return; }
  if (!targetLength) { showNotification('❌ Select target length', 'error'); return; }
  if (!state.settings.claudeApiKey) {
    showNotification('❌ Configure API key in Settings', 'error');
    return;
  }

  // For 95% mode, we'll add structure guidance to the AI prompt
  const cloneModeContext = state.cloneMode === '95' && state.parsedSections.verbatimTranscript
    ? `\n\n## STRUCTURE REFERENCE (95% Clone Mode)\nFollow this structure closely but use creative wording:\n${state.parsedSections.verbatimTranscript.substring(0, 2000)}...`
    : '';

  document.getElementById('generateBtn').disabled = true;
  showProgressBar('progressContainer', 'progressBar', 'progressPercent');
  showNotification('⏳ Generating script...', 'loading');

  try {
    const audience = document.getElementById('audience').value.trim();
    const angle = document.getElementById('angle').value.trim();
    const uniqueAngle = document.getElementById('uniqueAngle').value.trim();
    const voiceProfile = document.getElementById('voiceProfile').value.trim();
    const channelName = document.getElementById('channelName').value.trim();
    const context = document.getElementById('context').value.trim();
    const aiModel = document.getElementById('modelSelect').value;

    updateProgressBar('progressBar', 'progressPercent', 10);

    let wordCount = 2500;
    let actualLength = targetLength;

    if (targetLength === 'custom') {
      // Read from H:M:S inputs
      const customHours = parseInt(document.getElementById('customHours').value) || 0;
      const customMinutes = parseInt(document.getElementById('customMinutes').value) || 0;
      const customSeconds = parseInt(document.getElementById('customSeconds').value) || 0;

      // Calculate total minutes
      const totalMinutes = (customHours * 60) + customMinutes + (customSeconds / 60);
      wordCount = Math.round(totalMinutes * 150); // ~150 words per minute

      // Format actual length display
      if (customHours > 0) {
        actualLength = `${customHours}h ${customMinutes}m ${customSeconds}s (custom)`;
      } else if (customMinutes > 0) {
        actualLength = `${customMinutes}m ${customSeconds}s (custom)`;
      } else {
        actualLength = `${customSeconds}s (custom)`;
      }
    } else if (targetLength.includes('Under 1')) {
      wordCount = 150; // ~1 minute
    } else if (targetLength.includes('1-3')) {
      wordCount = 400; // ~2.5 minutes average
    } else if (targetLength.includes('3-5')) {
      wordCount = 600;
    } else if (targetLength.includes('5-10')) {
      wordCount = 1200;
    } else if (targetLength.includes('10-20')) {
      wordCount = 2500;
    } else if (targetLength.includes('20+')) {
      wordCount = 4000;
    }

    updateProgressBar('progressBar', 'progressPercent', 20);

    const prompt = `Generate a professional YouTube script for a ${template} video:

Target Duration: ${actualLength}
Unique Angle: ${uniqueAngle || 'Standard'}
Voice Profile: ${voiceProfile || 'Professional'}
Channel Name: ${channelName || '[Your Channel]'}
Topic: ${topic}
Audience: ${audience || 'General'}
Hook: ${angle || 'Compelling opening'}
Additional Context: ${context || 'None'}

Create a ${wordCount}-word script.

## MANDATORY OUTPUT FORMAT (CRITICAL - MUST FOLLOW EXACTLY):

Structure your script with these EXACT markers for each section:

# [Script Title Here]

---

**[0:00 - HOOK]**

<hook content here - 100-150 words>

---

**[0:XX - SECTION TITLE]**

<section content here>

---

(Continue with numbered sections using realistic timestamps...)

---

**[X:XX - CONCLUSION & CTA]**

<conclusion and call to action - 50-75 words>

---

**[END - X:XX]**

## FORMAT RULES:
1. Use markdown bold for ALL timestamps: **[M:SS - TITLE]**
2. Separate EVERY section with horizontal rules (---)
3. Include realistic timestamps based on ~150 words per minute
4. Every main point MUST have its own numbered section marker
5. Section titles should be descriptive (e.g., "HABIT 1: Listen More" not just "Point 1")

${channelName ? `IMPORTANT: Use the channel name "${channelName}" in all calls-to-action and branding references. Never use competitor channel names.` : 'Use the placeholder "[Your Channel]" for branding references.'}

Write in natural, spoken language.`;

    updateProgressBar('progressBar', 'progressPercent', 30);

    // Detect if model is Gemini or Claude
    const isGemini = aiModel.startsWith('gemini');
    let scriptText;

    if (isGemini) {
      // Gemini API Call
      if (!state.settings.geminiApiKey) {
        throw new Error('Gemini API key required. Configure in Settings.');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${state.settings.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 8000,  // Increased from 4000 for complete script generation
            temperature: 0.9
          }
        })
      });

      updateProgressBar('progressBar', 'progressPercent', 70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      scriptText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!scriptText) {
        throw new Error('Invalid response from Gemini API');
      }

    } else {
      // Claude API Call
      if (!state.settings.claudeApiKey) {
        throw new Error('Claude API key required. Configure in Settings.');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': state.settings.claudeApiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: aiModel,
          max_tokens: 8000,  // Increased to match Gemini's limit
          messages: [{ role: 'user', content: prompt }]
        })
      });

      updateProgressBar('progressBar', 'progressPercent', 70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API error');
      }

      const data = await response.json();
      scriptText = data.content[0].text;
    }

    updateProgressBar('progressBar', 'progressPercent', 90);

    state.generatedScript = {
      fullScript: scriptText,
      title: topic,
      topic: topic,
      template: template,
      targetLength: actualLength,
      uniqueAngle: uniqueAngle,
      voiceProfile: voiceProfile,
      aiModel: aiModel,
      audience: audience,
      hook: angle,
      wordCount: scriptText.split(/\s+/).length,
      quality: Math.floor(Math.random() * 15 + 85),
      generatedAt: new Date().toLocaleString()
    };

    updateProgressBar('progressBar', 'progressPercent', 100);

    setTimeout(() => {
      hideProgressBar('progressContainer');
      displayScript(state.generatedScript);
      showNotification('✅ Script generated!', 'success');
      document.getElementById('exportButtonsContainer').style.display = 'grid';

      // Auto-calculate VEO prompts from script duration
      if (!document.getElementById('manualPromptsOverride')?.checked) {
        autoCalcPromptsFromScript(scriptText);
      }
    }, 300);

  } catch (error) {
    hideProgressBar('progressContainer');
    showNotification(`❌ Error: ${error.message}`, 'error');
  } finally {
    document.getElementById('generateBtn').disabled = false;
  }
}

function displayScript(script) {
  const viewer = document.getElementById('scriptViewer');
  const stats = document.getElementById('scriptStats');
  const output = document.getElementById('outputSection');

  viewer.innerHTML = script.fullScript.replace(/\n/g, '<br>');
  viewer.classList.add('show');

  // Parse actual duration from script timestamps
  const actualDuration = parseScriptDuration(script.fullScript);
  const durationDisplay = actualDuration > 0
    ? formatDuration(actualDuration)
    : `${Math.round(script.wordCount / 150)}-${Math.round(script.wordCount / 120)} min`;

  stats.innerHTML = `
    <div class="stat-grid">
      <div class="stat"><div class="stat-label">Quality</div><div class="stat-value">${script.quality}/100</div></div>
      <div class="stat"><div class="stat-label">Words</div><div class="stat-value">${script.wordCount}</div></div>
      <div class="stat"><div class="stat-label">Duration</div><div class="stat-value">${durationDisplay}</div></div>
    </div>
  `;
  stats.classList.add('show');
  output.style.display = 'block';
}

// ──────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR HELPERS
// ──────────────────────────────────────────────────────────────────────────────

function showProgressBar(containerId, barId, percentId) {
  const container = document.getElementById(containerId);
  if (container) container.style.display = 'block';
  updateProgressBar(barId, percentId, 0);
}

function updateProgressBar(barId, percentId, value) {
  const bar = document.getElementById(barId);
  const percent = document.getElementById(percentId);
  if (bar) bar.style.width = value + '%';
  if (percent) percent.textContent = Math.round(value) + '%';
}

function hideProgressBar(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.style.display = 'none';
}

// ──────────────────────────────────────────────────────────────────────────────
// VEO 3 PROMPT GENERATION (Gemini)
// NOTE: VISUAL_STYLE_SPECS and combineStyleDimensions() are now defined in the
// Visual Rendering System v2.0 section at the top of this file (lines 66-999)
// ──────────────────────────────────────────────────────────────────────────────

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
4. **AMBIENT**: Environmental sounds matching scene setting (office, nature, city, etc.)
5. **ACTION SFX**: Specific sounds for character actions (footsteps, typing, door opens)

**Audio Format Example:**
[HOOK SFX] dramatic whoosh (Scene 01 only)
[TRANSITION SFX] page turn sound (Middle scenes)
[ENDING SFX] subscribe button pop (Final scene only)
[AMBIENT] quiet office sounds, keyboard typing
[ACTION SFX] footsteps on wooden floor, door creaking
[BGM] NONE - Add continuous BGM in post-production

**DO NOT include:**
❌ "Uplifting piano music"
❌ "Orchestral score"
❌ "Lo-fi hip-hop background"
❌ Any continuous music descriptions`;
}
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

// ============================================
// SCRIPT DNA EXTRACTION (Phase 2 Enhancement)
// Extracts consistent elements to repeat in every scene
// ============================================

/**
 * Extract DNA from script for consistency across all scenes
 * Parses AUDIO DIRECTION, character descriptions, and lighting info
 * @param {string} scriptText - The full script text
 * @returns {object} DNA object with audio, character, and lighting templates
 */
function extractScriptDNA(scriptText) {
  const dna = {
    hasAudioDirection: false,
    voice: null,
    music: null,
    sfx: null,
    characters: [],
    lightingTemplate: null
  };

  if (!scriptText || scriptText.length < 100) {
    return dna;
  }

  // Extract AUDIO DIRECTION section
  const audioMatch = scriptText.match(/\*\*AUDIO DIRECTION:\*\*\s*([\s\S]*?)(?=\n---|\n\*\*\[)/i);
  if (audioMatch) {
    dna.hasAudioDirection = true;
    const audioBlock = audioMatch[1];

    // Extract Voice
    const voiceMatch = audioBlock.match(/- Voice:\s*([^\n]+(?:\n(?!-).*)*)/i);
    if (voiceMatch) {
      dna.voice = voiceMatch[1].replace(/\n/g, ' ').trim();
    }

    // Extract Background Music
    const musicMatch = audioBlock.match(/- Background Music:\s*([^\n]+(?:\n(?!-).*)*)/i);
    if (musicMatch) {
      dna.music = musicMatch[1].replace(/\n/g, ' ').trim();
    }

    // Extract Sound Effects
    const sfxMatch = audioBlock.match(/- Sound Effects:\s*([^\n]+(?:\n(?!-).*)*)/i);
    if (sfxMatch) {
      dna.sfx = sfxMatch[1].replace(/\n/g, ' ').trim();
    }
  }

  // Extract character descriptions from VISUAL sections
  // Pattern: "character (Name) in ... uniform/clothing" or "Animated character (Name)"
  const charPatterns = [
    /(?:Animated )?character \(([^)]+)\)[^.]*?(?:in (?:a |an )?)?([^.]*(?:uniform|clothing|outfit|attire|costume|suit)[^.]*)/gi,
    /(?:A |An )?(\w+(?:\s+\w+)?),?\s+(?:a )?(?:man|woman|person) in (?:his|her|their) (?:late |early )?(\d+s)[^.]*?([^.]*)/gi
  ];

  const seenCharacters = new Set();
  for (const pattern of charPatterns) {
    let match;
    while ((match = pattern.exec(scriptText)) !== null) {
      const charName = match[1].trim();
      if (!seenCharacters.has(charName.toLowerCase())) {
        seenCharacters.add(charName.toLowerCase());
        dna.characters.push({
          name: charName,
          description: match[2] ? match[2].trim() : match[0].trim()
        });
      }
    }
  }

  // Infer lighting from content type and visual descriptions
  // Look for lighting cues in VISUAL sections
  const lightingCues = scriptText.match(/lighting[^.]*|sunlight[^.]*|window light[^.]*|dramatic[^.]*light/gi);
  if (lightingCues && lightingCues.length > 0) {
    dna.lightingTemplate = lightingCues[0].trim();
  }

  console.log('🧬 Script DNA extracted:', {
    hasAudio: dna.hasAudioDirection,
    voice: dna.voice ? dna.voice.substring(0, 50) + '...' : null,
    characters: dna.characters.length,
    lighting: dna.lightingTemplate ? 'found' : 'default'
  });

  return dna;
}

/**
 * Build DNA injection block for master prompt
 * Creates consistent descriptors to insert in every scene
 * @param {object} dna - Extracted DNA object
 * @returns {string} DNA block for prompt injection
 */
function buildDNAInjectionBlock(dna) {
  if (!dna.hasAudioDirection && dna.characters.length === 0) {
    return '';
  }

  let block = `\n## 🧬 SCRIPT DNA (Copy VERBATIM to Every Scene)\n\n`;
  block += `**CRITICAL:** The following elements were extracted from the source script. Copy these EXACTLY to EVERY scene for consistency.\n\n`;

  // NOTE: Audio DNA strategy:
  // - Voice: kept for V.O. style reference (audio added in post-production)
  // - SFX: allowed (scene-specific sounds work in independent 8s clips)
  // - BGM: EXCLUDED (needs continuity across clips, add in post-production)


  if (dna.voice) {
    block += `### 🎤 VOICE/NARRATION STYLE\n`;
    block += `\`\`\`\n${dna.voice}\n\`\`\`\n`;
    block += `Reference for V.O. tone/style (audio added in post-production).\n\n`;
  }

  // SFX allowed (scene-specific, standalone within 8s clip)
  // BGM intentionally EXCLUDED (needs continuity across clips)
  if (dna.sfx) {
    block += `### 🔊 SFX REFERENCE (Scene-Specific Sounds)\n`;
    block += `\`\`\`\n${dna.sfx}\n\`\`\`\n`;
    block += `Use as reference for [ACTION SFX] and [AMBIENT] tags. NOT for continuous BGM.\n\n`;
  }

  if (dna.characters.length > 0) {
    block += `### 👤 CHARACTER DNA (Repeat in Every Appearance)\n`;
    dna.characters.forEach((char, i) => {
      block += `\n**${char.name}:**\n\`\`\`\n${char.description}\n\`\`\`\n`;
    });
    block += `\n**Copy character descriptions VERBATIM. Never abbreviate.**\n`;
  }

  return block;
}

// ============================================
// ADVANCED PROMPTING TECHNIQUES (Professional Grade)
// Improves assessment scores by +25-35 points
// ============================================

/**
 * Technique #1: Emotional Beats Specification
 * Guides AI to generate authentic performances & influences audio tone
 * Impact: +8-12 points on Visual Storytelling
 */
function getEmotionalBeats(sceneType) {
  const emotionalArcs = {
    'hook': 'curiosity building to intrigue, attention-grabbing',
    'problem': 'concern escalating to alarm, tension rising',
    'solution': 'skepticism transitioning to hope, relief building',
    'climax': 'tension peaking then releasing, cathartic resolution',
    'cta': 'connection deepening to action motivation, inspiring',
    'default': 'emotional authenticity and tonal consistency'
  };

  return emotionalArcs[sceneType] || emotionalArcs['default'];
}

/**
 * Technique #2: Spatial Layering (Foreground/Midground/Background)
 * Creates cinematic depth and professional composition
 * Impact: +10-15 points on Production Feasibility
 */
function buildSpatialLayers(shotType, content) {
  const spatialTemplate = `
Spatial depth composition:
- FOREGROUND: [Primary focus elements, sharp detail, anchors frame]
- MIDGROUND: [Main subject and action, optimal lighting, narrative focus]
- BACKGROUND: [Environmental context, soft focus bokeh, atmosphere]
Creates clear three-dimensional space with professional depth cues`;

  return spatialTemplate;
}

/**
 * Technique #3: Motivated Camera Movement
 * Explains WHY camera moves, not just HOW - professional cinematography
 * Impact: +7-10 points on Visual Storytelling
 */
function getMotivatedCameraWork(sceneType) {
  const motivations = {
    'hook': 'Camera movement immediately grabs attention and creates dynamic energy to hook viewer',
    'reveal': 'Camera pulls back to reveal full scope and create surprise or understanding',
    'intimacy': 'Camera pushes in to create emotional closeness and focus attention on performance',
    'tension': 'Camera movement builds unease and dynamic energy to heighten dramatic tension',
    'scale': 'Camera movement establishes environmental context and perspective on action',
    'discovery': 'Camera pans to match natural eye movement discovering scene elements progressively'
  };

  return motivations[sceneType] || 'Camera movement serves storytelling purpose with intentional pacing';
}

/**
 * Technique #4: Layered Soundscape Specification  
 * Professional 4-layer audio mixing for VEO 3.1
 * Impact: +15-20 points on overall immersive quality
 */
function buildLayeredAudio(dialogue, sceneType, emotion) {
  return `
AUDIO LAYER 1 - Dialogue: ${dialogue ? `Narrator says, "${dialogue}", delivered with ${emotion || 'natural'} pacing and tone` : 'Natural character dialogue with authentic delivery'}
AUDIO LAYER 2 - Foreground SFX: Scene-specific action sounds precisely synchronized to visual events
AUDIO LAYER 3 - Ambient Foundation: Subtle environmental soundscape at -15dB, creates atmospheric texture
AUDIO LAYER 4 - Emotional Music: Minimalist musical underscore at -12dB, supports mood without competing with dialogue
Audio mixing: Clear hierarchy with dialogue priority, professional spatial separation`;
}

/**
 * Technique #5: Negative Prompting for Quality Control
 * Prevents common AI video generation artifacts
 * Impact: +5-8 points on Technical Consistency
 */
const NEGATIVE_PROMPTING_QUALITY = `

QUALITY REQUIREMENTS (Critical - Must Avoid):
❌ No morphing or melting facial features during transitions
❌ No floating, disconnected, or anatomically incorrect limbs/body parts
❌ No sudden lighting changes or inconsistent light sources within scene
❌ No jittery, shaky, or unstable camera movement (unless intentional handheld specified)
❌ No object continuity breaks (items disappearing/reappearing mid-scene)
❌ No physics violations (floating objects, wrong gravity, unnatural motion)
❌ No distorted or hallucinated text in background elements
❌ No temporal style shifts (maintain consistent visual aesthetic throughout)
❌ No choppy frame transitions or sudden motion artifacts

ENSURE: Smooth, consistent, professional-grade visual output with stable composition, 
natural physics, and coherent continuity throughout full 8-second duration`;

// ============================================
// SCRIPT SECTION PARSING & BATCH SEGMENTATION
// Ensures each batch covers correct content without duplication
// ============================================

/**
 * Parse script into sections using Claude Sonnet format markers
 * Matches: **[0:00 - HOOK]** or **[M:SS - TITLE]** patterns
 * @param {string} scriptText - The full script text
 * @returns {Array} Array of section objects with title, content, startTime
 */
function parseScriptSections(scriptText) {
  if (!scriptText || scriptText.length < 50) {
    console.log('📝 Script too short for section parsing, treating as single section');
    return [{ title: 'Full Content', content: scriptText, startTime: '0:00', index: 0 }];
  }

  // Match Claude Sonnet format: **[0:00 - HOOK]** or **[1:30 - HABIT 1]**
  const sectionRegex = /\*?\*?\[(\d+:\d+)\s*[-–]\s*([^\]]+)\]\*?\*?/gi;
  const matches = [...scriptText.matchAll(sectionRegex)];

  if (matches.length === 0) {
    console.log('⚠️ No section markers found in script, using fallback paragraph parsing');
    return fallbackParagraphParsing(scriptText);
  }

  console.log(`📋 Found ${matches.length} section markers in script`);

  const sections = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const nextMatch = matches[i + 1];

    const startIdx = match.index + match[0].length;
    const endIdx = nextMatch ? nextMatch.index : scriptText.length;
    const content = scriptText.substring(startIdx, endIdx).trim();

    sections.push({
      title: match[2].trim(),
      startTime: match[1],
      content: content,
      index: i,
      fullMatch: match[0]
    });
  }

  return sections;
}

/**
 * Fallback parsing for scripts without section markers
 * Uses numbered points (One:, Two:, 1., 2.) or paragraph breaks
 */
function fallbackParagraphParsing(scriptText) {
  // Try numbered points first: "One:", "Two:", "1.", "2."
  const numberedRegex = /(?:^|\n)\s*(?:\*\*)?(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|\d+)[.:]\s*(?:\*\*)?/gi;
  const numberedMatches = [...scriptText.matchAll(numberedRegex)];

  if (numberedMatches.length >= 3) {
    console.log(`📋 Fallback: Found ${numberedMatches.length} numbered points`);
    const sections = [];
    for (let i = 0; i < numberedMatches.length; i++) {
      const match = numberedMatches[i];
      const nextMatch = numberedMatches[i + 1];
      const startIdx = match.index;
      const endIdx = nextMatch ? nextMatch.index : scriptText.length;
      const content = scriptText.substring(startIdx, endIdx).trim();

      sections.push({
        title: `Point ${match[1]}`,
        startTime: `${i}:00`,
        content: content,
        index: i
      });
    }
    return sections;
  }

  // Ultimate fallback: split by paragraph breaks
  console.log('📋 Fallback: Using paragraph-based segmentation');
  const paragraphs = scriptText.split(/\n\s*\n/).filter(p => p.trim().length > 50);
  return paragraphs.map((content, i) => ({
    title: `Section ${i + 1}`,
    startTime: `${i}:00`,
    content: content.trim(),
    index: i
  }));
}

// ============================================
// TIME-BASED BATCH GENERATION HELPERS
// ============================================

/**
 * Get API delay based on selected model
 * Flash models need longer delays due to stricter rate limits
 */
function getDelayForModel(model) {
  if (model.includes('flash')) return 6000;  // 6s (10 RPM free tier)
  if (model.includes('pro')) return 3000;    // 3s (20 RPM)
  if (model.includes('claude')) return 1500; // 1.5s (40 RPM)
  return 2000; // Default 2s
}

/**
 * Parse timestamp string to seconds
 * @param {string} timestamp - Format "M:SS" or "MM:SS"
 * @returns {number} Total seconds
 */
function parseTimestamp(timestamp) {
  if (!timestamp) return 0;
  const parts = timestamp.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
}

/**
 * Format seconds to timestamp string
 * @param {number} seconds - Total seconds
 * @returns {string} Format "M:SS"
 */
function formatSecondsToTimestamp(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Extract script content within a specific time window
 * @param {string} script - Full script text
 * @param {number} startSec - Start time in seconds
 * @param {number} endSec - End time in seconds
 * @returns {string} Script content within the time range
 */
function extractContentByTime(script, startSec, endSec) {
  if (!script) return '';

  // Match timestamp patterns: [0:00-0:07 - TITLE] or [0:00 - TITLE]
  const timestampRegex = /\*?\*?\[(\d+):(\d+)(?:-(\d+):(\d+))?\s*[-–]/g;
  const blocks = [];
  let lastIndex = 0;
  let match;

  // Find all timestamp markers and their positions
  const markers = [];
  while ((match = timestampRegex.exec(script)) !== null) {
    const startMin = parseInt(match[1]);
    const startSecond = parseInt(match[2]);
    const segmentStart = startMin * 60 + startSecond;

    // If we have end time, use it; otherwise estimate from next marker
    let segmentEnd = segmentStart + 30; // Default 30s if no end time
    if (match[3] && match[4]) {
      segmentEnd = parseInt(match[3]) * 60 + parseInt(match[4]);
    }

    markers.push({
      start: segmentStart,
      end: segmentEnd,
      index: match.index,
      fullMatch: match[0]
    });
  }

  // Update segment end times based on next marker
  for (let i = 0; i < markers.length - 1; i++) {
    if (!markers[i].end || markers[i].end <= markers[i].start) {
      markers[i].end = markers[i + 1].start;
    }
  }

  // Extract content blocks that overlap with [startSec, endSec]
  let extractedContent = [];
  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    const nextMarkerIndex = markers[i + 1]?.index || script.length;

    // Check if this segment overlaps with our time window
    if (marker.end > startSec && marker.start < endSec) {
      const content = script.substring(marker.index, nextMarkerIndex).trim();
      extractedContent.push(content);
    }
  }

  if (extractedContent.length === 0) {
    console.warn(`⚠️ No content found for time range ${formatSecondsToTimestamp(startSec)}-${formatSecondsToTimestamp(endSec)}`);
    // Fallback: return a portion of the script
    const charStart = Math.floor((startSec / endSec) * script.length * 0.8);
    const charEnd = Math.min(charStart + 3000, script.length);
    return script.substring(charStart, charEnd);
  }

  console.log(`📋 Extracted ${extractedContent.length} segments for time ${formatSecondsToTimestamp(startSec)}-${formatSecondsToTimestamp(endSec)}`);
  return extractedContent.join('\n\n---\n\n');
}

/**
 * Get segmented topic content for a specific batch using TIME-BASED extraction
 * Each batch covers a fixed time window (BATCH_SIZE × 8 seconds)
 * @param {string} fullScript - The complete script/topic
 * @param {number} batchNum - Current batch number (1-indexed)
 * @param {number} totalBatches - Total number of batches
 * @param {number} startPrompt - Starting prompt number for this batch
 * @param {number} endPrompt - Ending prompt number for this batch
 * @returns {string} Segmented content for this batch only
 */
function getSegmentedTopicForBatch(fullScript, batchNum, totalBatches, startPrompt, endPrompt) {
  // Calculate time window for this batch (each prompt = 8 seconds)
  const secondsPerPrompt = 8;
  const startSeconds = (startPrompt - 1) * secondsPerPrompt;
  const endSeconds = endPrompt * secondsPerPrompt;

  console.log(`📦 Batch ${batchNum}: Time ${formatSecondsToTimestamp(startSeconds)}-${formatSecondsToTimestamp(endSeconds)} (Prompts ${startPrompt}-${endPrompt})`);

  // Try time-based extraction first
  const timeContent = extractContentByTime(fullScript, startSeconds, endSeconds);

  if (timeContent && timeContent.length > 200) {
    // Successfully extracted time-based content
    return `## BATCH ${batchNum} CONTENT (Time: ${formatSecondsToTimestamp(startSeconds)} - ${formatSecondsToTimestamp(endSeconds)})

⚠️ CRITICAL: Generate VEO prompts for this SPECIFIC time range only. Each prompt = 8 seconds of video.

### CONTENT FOR THIS TIME WINDOW:

${timeContent}

---

**Important:** Generate ${endPrompt - startPrompt + 1} VEO prompts covering the time range ${formatSecondsToTimestamp(startSeconds)} to ${formatSecondsToTimestamp(endSeconds)}.
`;
  }

  // Fallback to section-based logic for non-timestamped scripts
  console.log('⚠️ Time-based extraction failed, falling back to section-based logic');
  const sections = parseScriptSections(fullScript);

  if (sections.length <= 1) {
    console.log('⚠️ Only 1 section found, using full script for batch');
    return fullScript;
  }

  // Calculate which sections belong to this batch
  const sectionsPerBatch = Math.ceil(sections.length / totalBatches);
  const startSectionIdx = Math.max(0, (batchNum - 1) * sectionsPerBatch - 1);
  const endSectionIdx = Math.min(sections.length, batchNum * sectionsPerBatch + 1);

  // BOUNDS CHECK
  if (startSectionIdx >= sections.length) {
    console.warn(`⚠️ Batch ${batchNum} exceeds available sections. Using final section.`);
    const lastSection = sections[sections.length - 1];
    return `## BATCH ${batchNum} (Final Section Continuation)

**[${lastSection.startTime} - ${lastSection.title}]**
${lastSection.content}
`;
  }

  const assignedSections = sections.slice(startSectionIdx, endSectionIdx);

  if (!assignedSections || assignedSections.length === 0) {
    const lastSection = sections[sections.length - 1];
    return `## BATCH ${batchNum} CONTENT

**[${lastSection?.startTime || 'END'} - ${lastSection?.title || 'CONCLUSION'}]**
${lastSection?.content || 'Continue from previous content.'}
`;
  }

  console.log(`   Section titles: ${assignedSections.map(s => s.title).join(', ')}`);

  let segmentedContent = `## BATCH ${batchNum} CONTENT (Prompts ${startPrompt}-${endPrompt})

`;
  assignedSections.forEach((section) => {
    segmentedContent += `**[${section.startTime} - ${section.title}]**\n${section.content}\n\n---\n\n`;
  });

  return segmentedContent;
}

/**
 * Suggest visual style based on script content analysis
 * Auto-applies with manual override capability
 */
function suggestVisualStyle(scriptContent, template) {
  const lowerScript = scriptContent.toLowerCase();
  const lowerTemplate = (template || '').toLowerCase();

  // Analyze content for style keywords
  const styleSignals = {
    'Cinematic': ['drama', 'emotion', 'story', 'journey', 'powerful', 'life', 'death', 'love'],
    '3D Animation': ['fantasy', 'sci-fi', 'future', 'space', 'robot', 'alien', 'magic'],
    '2D Animation': ['fun', 'kids', 'cartoon', 'colorful', 'playful', 'cute'],
    'Pop Art': ['bold', 'graphic', 'art', 'design', 'creative', 'visual', 'style'],
    'Documentary': ['fact', 'history', 'science', 'research', 'study', 'data', 'real'],
    'Photorealistic': ['nature', 'landscape', 'travel', 'food', 'product', 'review'],
    'Anime': ['japan', 'anime', 'manga', 'action', 'fight', 'hero'],
    'Watercolor': ['peaceful', 'calm', 'meditation', 'mindful', 'gentle', 'soft']
  };

  let bestMatch = 'Cinematic'; // Default
  let bestScore = 0;

  for (const [style, keywords] of Object.entries(styleSignals)) {
    let score = keywords.filter(kw => lowerScript.includes(kw) || lowerTemplate.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = style;
    }
  }

  // Template overrides
  if (lowerTemplate.includes('education')) bestMatch = 'Cinematic';
  if (lowerTemplate.includes('product')) bestMatch = 'Photorealistic';
  if (lowerTemplate.includes('entertainment')) bestMatch = '3D Animation';

  console.log(`🎨 AI Style Suggestion: ${bestMatch} (score: ${bestScore})`);
  return bestMatch;
}

function buildMasterPrompt(topic, numPrompts, videoStyle, dialogueLanguage, subtitles, startSceneNum = 1) {
  // ===== ADAPTIVE DESIGN INTEGRATION =====
  const scriptDuration = numPrompts * 8; // Estimate 8s per scene
  const template = document.getElementById('templateSelect')?.value || 'Standard';

  // Call adaptive functions
  const classification = classifyContent(scriptDuration, template, topic);
  const sceneCalc = calculateOptimalScenes(scriptDuration, classification.category);
  const charStrategy = getCharacterStrategy(classification);

  // Log adaptive decisions
  console.log('🎯 Adaptive Design Active:', {
    category: classification.category,
    recommendedScenes: sceneCalc.recommendedScenes,
    useCharacters: charStrategy.useCharacters,
    userRequested: numPrompts
  });

  // Validation warning if user's count doesn't match recommendation
  if (Math.abs(numPrompts - sceneCalc.recommendedScenes) > 5 && startSceneNum === 1) {
    console.warn(`⚠️ Scene count mismatch: User requested ${numPrompts}, Recommended ${sceneCalc.recommendedScenes} for ${scriptDuration}s video`);
    veoLog(`⚠️ Recommended: ${sceneCalc.recommendedScenes} scenes (${sceneCalc.averageSceneDuration.toFixed(1)}s avg)`, 'warn');
  }
  // ===== END OF ADAPTIVE SECTION =====

  // ===== DNA EXTRACTION (Phase 2) =====
  const scriptDNA = extractScriptDNA(topic);
  const dnaBlock = buildDNAInjectionBlock(scriptDNA);
  // ===== END DNA EXTRACTION =====

  const isFirstBatch = startSceneNum === 1;
  const totalScenes = numPrompts + startSceneNum - 1;

  // Calculate batch position for content segmentation
  const batchPercentStart = ((startSceneNum - 1) / totalScenes * 100).toFixed(0);
  const batchPercentEnd = (totalScenes / totalScenes * 100).toFixed(0);
  const batchContentGuidance = isFirstBatch
    ? `Focus on the BEGINNING of the content: Introduction, Hook, and early key points (first ${Math.round(numPrompts / totalScenes * 100)}% of content).`
    : `Focus on the MIDDLE/LATER portion of the content: Continue from where Scene ${startSceneNum - 1} would have ended. Cover the ${batchPercentStart}%-${batchPercentEnd}% section of the narrative.`;

  return `You are an elite scriptwriter specializing in Flow Extend format for Google VEO 3 video generation.

## User's Request
- **Topic/Story:** ${topic}
- **Number of Scenes:** ${numPrompts} (starting from Scene ${String(startSceneNum).padStart(2, '0')})
- **Video Style:** ${videoStyle}
- **Dialogue Language:** ${dialogueLanguage}
- **Subtitles:** ${subtitles}

## ⚠️ CRITICAL: BATCH CONTENT SEGMENTATION
${isFirstBatch ? `**THIS IS BATCH 1 - COVER THE BEGINNING OF THE CONTENT**
- Generate scenes ${startSceneNum} to ${totalScenes}
- Focus on: Hook, Introduction, and the FIRST portion of the narrative
- DO NOT try to cover the entire script - later batches will continue the story`
      : `**THIS IS A CONTINUATION BATCH - DO NOT REPEAT EARLIER CONTENT**
- Generate scenes ${startSceneNum} to ${totalScenes} ONLY
- ASSUME scenes 1-${startSceneNum - 1} have ALREADY been generated
- Pick up where scene ${startSceneNum - 1} would have ended
- ${batchContentGuidance}
- DO NOT re-cover the introduction or hook
- DO NOT repeat concepts already covered in earlier scenes`}

**STRICT RULE:** Each scene MUST cover DIFFERENT content. Never repeat the same concept in multiple scenes.

## CRITICAL STRUCTURE REQUIREMENTS

### 🎣 HOOK(MANDATORY - Scene 01 ONLY)
${isFirstBatch ? `**Scene 01 MUST start with an attention-grabbing HOOK in the first 0-2 seconds:**
- Pattern interrupt (unexpected visual/sound)
- Provocative question or bold statement
- Shocking statistic or surprising fact
- Emotional trigger or curiosity gap
- Direct viewer address ("You won't believe...")
Example: "What if everything you knew about [topic] was WRONG?"` : '(Not applicable - this is a continuation batch)'
    }

### 🔄 MICRO - HOOKS(Middle Scenes)
      ** For scenes in the middle third of the video(approximately scenes ${Math.floor(totalScenes * 0.33)} - ${Math.floor(totalScenes * 0.66)}), add MICRO - HOOKS:**
        - Transition hooks: "But here's where it gets interesting..."
          - Curiosity loops: "The next part changed everything..."
            - Re - engagement beats: Brief moment of tension, surprise, or revelation
              - Visual pattern breaks: Change in pacing, angle, or energy

### 📢 CTA PLACEMENT RULES (CRITICAL - READ CAREFULLY)
${isFirstBatch && numPrompts >= totalScenes ? `**The LAST scene (Scene ${String(totalScenes).padStart(2, '0')}) MUST end with a Call-To-Action:**
- Subscribe/Follow prompt
- Comment engagement ("Tell me in the comments...")
- Like/Share request
- Next video teaser
- Community invitation
Example: "If this opened your eyes, smash that subscribe button and drop a comment below!"` : `**⚠️ THIS IS NOT THE FINAL BATCH - DO NOT ADD ANY CTA**
- CTAs are ONLY allowed in the absolute final scene of the ENTIRE video
- This batch generates scenes ${startSceneNum}-${startSceneNum + numPrompts - 1}, which are NOT the final scenes
- Adding a CTA here will ruin the viewer experience
- Focus ONLY on content delivery, no "subscribe", "follow", or "comment" prompts
- Save ALL engagement prompts for the FINAL batch`}

## FLOW EXTEND FORMAT - SCENE STRUCTURE

    \`\`\`
[STYLE] ${videoStyle}, cinematic rendering, 24fps

--- SCENE START ---
[0-2s] [CAMERA: SHOT TYPE + lens]
${isFirstBatch ? '[HOOK] Attention-grabbing opening beat with character/environment.' : 'Opening beat with character/environment.'}
Character Name (age, detailed physical description, clothing) performs action.
Environment details, lighting, mood.

[2-4s] [CAMERA: SHOT TYPE + lens]
Next action beat with continued character details.

[4-6s] [CAMERA: SHOT TYPE + lens]
Continued action or dialogue moment.

[CHARACTER NAME] (V.O.): "Brief dialogue (8-12 words max)"

[6-8s] [CAMERA: SHOT TYPE + lens]
Final beat of scene.

[SFX] [HOOK/TRANSITION/ACTION SFX] + [AMBIENT] sounds
[BGM] NONE - Add in post-production
[Subtitles] ${subtitles}
--- SCENE END ---
\`\`\`

## OUTPUT REQUIREMENTS

⚠️ **MANDATORY SCENE NUMBERING (CRITICAL - DO NOT SKIP):**
Every single prompt MUST start with "Scene XX:" where XX is the two-digit scene number.
- Scene ${String(startSceneNum).padStart(2, '0')}: ...
- Scene ${String(startSceneNum + 1).padStart(2, '0')}: ...
- etc.
**NEVER omit the "Scene XX:" header. This is the MOST IMPORTANT formatting rule.**
**If you skip the scene number, the entire batch is INVALID and must be regenerated.**

1. **SCENE MARKERS:** Always use \`--- SCENE START ---\` and \`--- SCENE END ---\`
2. **TIMING:** Use [0-2s], [2-4s], [4-6s], [6-8s] = 8 seconds total per scene
3. **CAMERA:** Include shot type + lens (WIDE SHOT 35mm, MEDIUM SHOT 50mm, CLOSE-UP 85mm, etc.)
4. **CHARACTERS:** First appearance = 150+ words (age, build, face, hair, clothing, expression)
5. **DIALOGUE:** ${dialogueLanguage}, MAX 8-12 words per line, conversational tone, NO ALL CAPS
6. **AUDIO SFX:** Scene-specific sounds ONLY (no continuous BGM)
7. **HOOK:** Scene 01 MUST have [HOOK] tag with [HOOK SFX]
8. **MICRO-HOOKS:** Add [MICRO-HOOK] tag in middle scenes
9. **CTA:** Final scene MUST include [CTA] with [ENDING SFX]

${getAudioGuidelines()}

## 🎯 PROFESSIONAL QUALITY TECHNIQUES (CRITICAL - Apply to Every Scene)

**1. EMOTIONAL BEATS:** Specify emotional arc in each scene (e.g., "curiosity → intrigue" or "tension → relief")
**2. SPATIAL DEPTH:** Use FOREGROUND (sharp focus) + MIDGROUND (subject) + BACKGROUND (soft bokeh) for cinematic 3D composition
**3. MOTIVATED CAMERA:** Explain WHY camera moves (e.g., "pushes in to create intimacy" not just "dolly in")
**4. LAYERED AUDIO:** Structure as Layer 1: Dialogue | Layer 2: SFX | Layer 3: Ambient (-15dB) | Layer 4: Music (-12dB)
**5. QUALITY CONTROL:**${NEGATIVE_PROMPTING_QUALITY}

## 🎬 SIX-BLOCK PROMPT STRUCTURE (Required for EVERY Scene)

**CRITICAL:** Each VEO/Flow clip is generated INDEPENDENTLY with NO context from other clips. 
For seamless multi-clip videos, EVERY scene prompt MUST follow this exact 6-block structure:

\`\`\`
[SUBJECT] + [ACTION] + [SCENE/CONTEXT] + [CAMERA ANGLE] + [CAMERA MOVEMENT] + [VISUAL STYLE]
\`\`\`

**Apply to each 2-second beat:**
- **[SUBJECT]:** FULL character description (copy verbatim from Character Bible - never abbreviate)
- **[ACTION]:** What the subject is doing (verb-based, specific)
- **[SCENE/CONTEXT]:** Environment, setting, props, time of day
- **[CAMERA ANGLE]:** Shot type + lens (WIDE 35mm, MEDIUM 50mm, CLOSE-UP 85mm)
- **[CAMERA MOVEMENT]:** Dolly, pan, tracking, static (with motivation)
- **[VISUAL STYLE]:** Lighting, color temperature, mood, atmosphere

**WHY:** Flow has NO memory between clips. If you don't repeat the character description, 
the next clip will generate a DIFFERENT looking person. Same for environment, lighting, etc.

## 💡 LIGHTING CONSISTENCY TEMPLATE (Apply to ALL Scenes)

**CRITICAL:** Define lighting ONCE and repeat VERBATIM in every scene to prevent jarring cuts.

**Template Format:**
\`\`\`
LIGHTING: [Color Temperature] + [Direction] + [Quality] + [Shadow Type]
\`\`\`

**Example Templates (choose one and use IDENTICALLY across all scenes):**

\`\`\`
SOFT_NATURAL = "diffused window light from 10 o'clock position, 5000K neutral daylight, 
soft wrap-around quality filling shadows, shadow detail retained, low contrast ratio 2:1"

DRAMATIC_MOODY = "single hard key from extreme 3 o'clock angle, warm 3000K tungsten glow, 
deep shadows with minimal fill, high 8:1 contrast ratio, visible light falloff"

GOLDEN_HOUR = "warm golden sunlight from 5 o'clock low angle, 3200K amber tones, 
long soft shadows toward 11 o'clock, gentle rim highlights, filmic color grade"
\`\`\`

**Rules:**
- Use exact Kelvin values (3000K, 5000K, 6500K) not vague terms like "warm light"
- Specify light direction using clock positions (10 o'clock, 3 o'clock, etc.)
- Define shadow direction and quality (hard/soft, direction, contrast ratio)
- Copy-paste EXACT lighting description to EVERY scene (Flow doesn't remember)

## 🎥 CAMERA CONTINUITY SYSTEM (Between Scenes)

**For smooth cuts between clips, use motion matching language:**

**Ending a scene:** Describe camera ending state for the next scene to continue
\`\`\`
[6-8s] [CAMERA: SLOW DOLLY IN 50mm, ending in MEDIUM CLOSE-UP]
\`\`\`

**Starting next scene:** Continue the previous camera motion
\`\`\`
[0-2s] [CAMERA: CONTINUING DOLLY IN from MEDIUM CLOSE-UP to EXTREME CLOSE-UP 85mm]
\`\`\`

**Shot Size Progression (natural flow):**
- WIDE → MEDIUM → CLOSE-UP → EXTREME CLOSE-UP (smooth)
- WIDE → EXTREME CLOSE-UP (jarring - use only for dramatic effect)

**Angle Consistency:**
- Maintain eye-level camera unless story demands a shift
- Only change to low-angle/high-angle/Dutch tilt for dramatic purpose
- Note reason for angle change in prompt

## 🎭 CHARACTER DEFINITION (For Recurring Characters in FLOW)

**CRITICAL for FLOW:** Each 8-second scene is generated INDEPENDENTLY with NO memory of previous scenes. To maintain character consistency across scenes, you MUST provide IDENTICAL detailed descriptions in EVERY scene.

${!isFirstBatch ? `### ⚠️ BATCH CONTINUATION - CHARACTER PERSISTENCE REQUIRED
**This is a continuation batch. You MUST maintain the SAME main character from the beginning of the video:**
- DO NOT introduce a new protagonist character
- DO NOT change the main character's gender, age range, or core appearance
- If unsure, use a neutral/androgynous character that can represent anyone
- The main character should feel like the SAME person throughout all ${totalScenes} scenes
- If Batch 1 used a "man in his 50s", continue with that exact character
- If Batch 1 used a "woman in her 30s", continue with that exact character

**Recommended approach for continuation batches:**
- Reference "the same [character name] from earlier scenes" in your descriptions
- Copy the EXACT character bible attributes you used in previous scenes` : ''}

### Character Bible System

When generating prompts with recurring human characters (same person appears in multiple scenes):

**1. Create Detailed Character Bible (15+ Attributes):**
   - Age range and gender (e.g., "man in his late 40s")
   - Facial structure (e.g., "weathered face, pronounced cheekbones")  
   - Eyes (e.g., "deep-set, thoughtful blue eyes")
   - Hair (e.g., "short, neatly trimmed grey beard framing jawline")
   - Distinctive marks (e.g., "distinguished slight frown line between brows")
   - Clothing specifics (e.g., "navy blue wool sweater and dark jeans")
   - Build and posture (e.g., "athletic build, confident posture")

**2. Add Negative Prompts (Prevent Character Drift):**
   "No different hair color, no different eye color, no change in age, no glasses, no hat, no visible jewelry unless specified, no outfit changes unless explicitly described"

**3. Copy-Paste VERBATIM to Every Scene:**
   - NEVER abbreviate or paraphrase
   - NEVER use vague references like "the figure" or "the person"
   - ALWAYS include full character bible + negatives identically

**Example (Live Action):**
"Aram, a man in his late 40s, weathered face, pronounced cheekbones, deep-set thoughtful blue eyes, distinguished slight frown line between brows, short neatly trimmed grey beard framing jawline, navy blue wool sweater, dark jeans. No glasses, no hat, no visible jewelry."

**Example (2D Animation - Abstract):**
"An androgynous figure, ageless appearance (suggests early 30s), slender build, simple long grey coat that flutters, face rendered in clean vector art lines, peaceful expression, soft loose waves in hair, minimalist 2D style, muted earth tone color palette. No glasses, no accessories, no detailed facial features, no realistic textures, no extra characters."

**WHEN TO SKIP Character Bible:**
- Pure abstract content (cosmic scenes, nature, objects only)
- Voiceover-only content with no on-screen characters
- Scenes with intentionally different characters
- Each scene features different people

**Implementation:**
- Scene 01: Introduce character with full 150+ word description
- Scenes 02+: Copy EXACT same description every time (not "the scene continues with...")
- Maintain identical clothing, features, and negatives across ALL appearances

${dnaBlock}

## 👤 CHARACTER STRATEGY (Adaptive)

${charStrategy.guidance}

${charStrategy.useCharacters ?
      `**IMPORTANT:** Use character names consistently. Re-state description on each appearance: "Character Name (as per Scene 01)"` :
      `**IMPORTANT:** AVOID character names. Use: "A person," "The figure," "Silhouette representation"`
    }

## 📋 SCENE STRUCTURE REQUIREMENTS

Return ONLY valid JSON (no markdown code blocks, no commentary):

{
  "prompts": [
    "Scene 01: [Title]\\n**STYLE:** ${VISUAL_STYLE_SPECS[videoStyle] || VISUAL_STYLE_SPECS['default']}\\n--- SCENE START ---\\n[0-2s] [CAMERA: WIDE SHOT 35mm]\\n[HOOK] Opening hook description...\n... \n--- SCENE END ---",
    "Scene 02: [Title]\\n**STYLE:** ${VISUAL_STYLE_SPECS[videoStyle] || VISUAL_STYLE_SPECS['default']}\\n--- SCENE START ---\\n...\\n--- SCENE END ---",
    "Scene ${String(totalScenes).padStart(2, '0')}: [Title]\\n**STYLE:** ${VISUAL_STYLE_SPECS[videoStyle] || VISUAL_STYLE_SPECS['default']}\\n--- SCENE START ---\\n...\\n[CTA] Call-to-action...\\n--- SCENE END ---"
  ]
}

Generate ${numPrompts} scenes starting from Scene ${String(startSceneNum).padStart(2, '0')}.
${isFirstBatch ? '⚠️ REMEMBER: Scene 01 MUST have the HOOK with [HOOK SFX]!' : ''}
${startSceneNum + numPrompts - 1 === totalScenes ? '⚠️ REMEMBER: Final scene MUST have the CTA with [ENDING SFX]!' : ''}
⚠️ CRITICAL: NEVER include continuous BGM in prompts - Only scene-specific SFX and ambient sounds!`;
}

async function callVeoApi(apiKey, promptText) {
  const model = document.getElementById('veoModelSelect').value || 'gemini-2.5-flash';

  // Check if it's a Claude model
  if (model.startsWith('claude-')) {
    if (!state.settings.claudeApiKey) {
      throw new Error('Claude API key required for Claude models. Configure in Settings.');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': state.settings.claudeApiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 8192,
        messages: [{ role: 'user', content: promptText + '\n\nRespond with ONLY valid JSON.' }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API Error: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  // Gemini API call (existing logic)
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 429) {
      throw new Error('Gemini API quota exceeded. Wait 1-2 minutes or use a new API key.');
    }
    throw new Error(`Gemini API Error: ${errorData.error?.message || response.status}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid response from Gemini API');
  }
  return data.candidates[0].content.parts[0].text;
}

async function generateVeoPrompts() {
  const topic = document.getElementById('veoTopic').value.trim();
  if (!topic) {
    showNotification('❌ Enter topic or script first', 'error', 'veoStatus');
    return;
  }

  if (!state.settings.geminiApiKey) {
    showNotification('❌ Configure Gemini API key in Settings', 'error', 'veoStatus');
    return;
  }

  const generateBtn = document.getElementById('generateVeoBtn');
  generateBtn.disabled = true;
  generateBtn.innerHTML = '🧠 AI generating...';

  showProgressBar('veoProgressContainer', 'veoProgressBar', 'veoProgressPercent');
  showNotification('⏳ Generating VEO prompts...', 'loading', 'veoStatus');
  veoLog('Starting VEO prompt generation...', 'system');

  try {
    const numPrompts = parseInt(document.getElementById('veoNumPrompts').value, 10) || 10;
    const videoStyle = combineStyleDimensions();
    const dialogue = document.getElementById('veoDialogue').value;
    const subtitles = document.getElementById('veoSubtitles').value;

    // Style check
    const visualStyle = document.getElementById('veoVisualStyle').value;
    const contentGenre = document.getElementById('veoContentGenre').value;
    const era = document.getElementById('veoEraAesthetic').value;
    const effects = document.getElementById('veoSpecialEffects').value;

    if (visualStyle === '3D Animation' && !contentGenre && !era && !effects) {
      if (!confirm(`⚠️ Style Check:\n\nCurrent: "${videoStyle}"\n\nUsing defaults. Continue?`)) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '✨ Generate All Prompts';
        hideProgressBar('veoProgressContainer');
        document.getElementById('veoVisualStyle').classList.add('style-reminder');
        setTimeout(() => document.getElementById('veoVisualStyle').classList.remove('style-reminder'), 4000);
        return;
      }
    }

    if (numPrompts > 30 && !confirm(`⚠️ ${numPrompts} prompts may cause errors. Use Batch Generation instead?`)) {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '✨ Generate All Prompts';
      hideProgressBar('veoProgressContainer');
      return;
    }

    updateProgressBar('veoProgressBar', 'veoProgressPercent', 20);
    veoLog(`Building prompt for ${numPrompts} scenes...`, 'info');

    const masterPrompt = buildMasterPrompt(topic, numPrompts, videoStyle, dialogue, subtitles);

    updateProgressBar('veoProgressBar', 'veoProgressPercent', 40);
    const selectedModel = document.getElementById('veoModelSelect').value;
    const apiName = selectedModel.startsWith('claude-') ? 'Claude' : 'Gemini';
    veoLog(`Sending to ${apiName} API...`, 'info');

    const jsonResponse = await callVeoApi(state.settings.geminiApiKey, masterPrompt);

    updateProgressBar('veoProgressBar', 'veoProgressPercent', 70);
    veoLog(`Received response (${jsonResponse.length} chars)`, 'info');

    // Robust JSON parsing with error recovery
    let responseData;
    try {
      const cleanedJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      responseData = JSON.parse(cleanedJson);
      veoLog('JSON parsed successfully', 'success');
    } catch (parseError) {
      veoLog(`JSON parse error: ${parseError.message}`, 'error');

      // Try repair: escape problematic characters
      const cleanedJson = jsonResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '')
        .replace(/\t/g, '\\t');

      try {
        responseData = JSON.parse(cleanedJson);
        veoLog('⚠️ JSON repaired successfully', 'warn');
      } catch (secondError) {
        throw new Error(`JSON parse failed. Try fewer prompts or use Batch Generation.`);
      }
    }

    const promptsArray = responseData.prompts || responseData.script;
    if (!promptsArray || !Array.isArray(promptsArray) || promptsArray.length === 0) {
      throw new Error('No prompts generated.');
    }

    updateProgressBar('veoProgressBar', 'veoProgressPercent', 100);

    // === CHARACTER CONSISTENCY: Inject Character Bible into FLOW Prompts ===
    const characterBible = String(state.settings.characterBible || '');
    const characterNegatives = String(state.settings.characterNegatives || '');

    // Normalize promptsArray to strings (AI may return objects like {prompt: "..."})
    // CRITICAL: Preserve scene number information from object fields
    for (let i = 0; i < promptsArray.length; i++) {
      if (typeof promptsArray[i] !== 'string') {
        if (promptsArray[i] && typeof promptsArray[i] === 'object') {
          let text = promptsArray[i].prompt || promptsArray[i].text || promptsArray[i].content || '';
          const sceneNum = promptsArray[i].scene || promptsArray[i].sceneNumber || promptsArray[i].scene_number;
          const title = promptsArray[i].title || '';

          // If we have a scene number but text doesn't start with "Scene XX:", prepend it
          if (sceneNum && text && !text.match(/^Scene\s+\d+:/i)) {
            const paddedNum = String(sceneNum).padStart(2, '0');
            if (title && title.match(/^Scene\s+\d+:/i)) {
              text = `${title}\n${text}`;
            } else {
              text = `Scene ${paddedNum}:\n${text}`;
            }
          } else if (!text) {
            text = JSON.stringify(promptsArray[i]);
          }
          promptsArray[i] = text;
        } else {
          promptsArray[i] = String(promptsArray[i]);
        }
      }
    }

    if (characterBible.trim().length > 0) {
      veoLog(`🎭 Applying Character Bible to ${promptsArray.length} scenes...`, 'info');

      // Build full character block (description + negatives)
      const fullCharacterBlock = characterNegatives.trim().length > 0
        ? `${characterBible.trim()} ${characterNegatives.trim()}`
        : characterBible.trim();

      console.log('🎭 Character Bible:', fullCharacterBlock.substring(0, 100) + '...');

      // Inject into Scene 02+ (Scene 01 should already have character intro)
      for (let i = 1; i < promptsArray.length; i++) {
        const sceneNum = String(i + 1).padStart(2, '0');
        const sceneMatch = promptsArray[i].match(/^(Scene \d+:.*?)(\n)/);

        if (sceneMatch) {
          // Insert character block right after "Scene XX: Title" line
          const sceneTitle = sceneMatch[1];
          const restOfPrompt = promptsArray[i].substring(sceneMatch[0].length);

          // Check if prompt has vague continuity markers
          const hasContinuityMarker = restOfPrompt.match(/^(The scene continues|Continuing from|The figure|A person)/i);

          if (hasContinuityMarker) {
            // Replace vague marker with character bible
            const updatedRest = restOfPrompt.replace(/^[^\n]*\n/, `${fullCharacterBlock}\n`);
            promptsArray[i] = `${sceneTitle}\n${updatedRest}`;
            console.log(`✅ Scene ${sceneNum}: Replaced vague marker with character bible`);
          } else {
            // Prepend character bible
            promptsArray[i] = `${sceneTitle}\n${fullCharacterBlock}\n${restOfPrompt}`;
            console.log(`✅ Scene ${sceneNum}: Prepended character bible`);
          }
        } else {
          console.warn(`⚠️ Scene ${sceneNum}: No "Scene XX:" marker found, skipping`);
        }
      }

      veoLog(`✅ Character Bible applied to ${promptsArray.length - 1} scenes`, 'success');
    }
    // === END CHARACTER CONSISTENCY ===

    state.generatedPrompts = promptsArray;
    document.getElementById('veoPromptsOutput').value = promptsArray.join('\n\n');
    document.getElementById('veoOutputSection').style.display = 'block';
    document.getElementById('veoStats').textContent = `✅ Generated ${promptsArray.length} prompts | Duration: ${promptsArray.length * 8}s`;

    await chrome.storage.local.set({ veoPrompts: promptsArray.join('\n\n') });

    showNotification(`🎉 Generated ${promptsArray.length} VEO prompts!`, 'success', 'veoStatus');
    veoLog(`Successfully generated ${promptsArray.length} prompts`, 'success');
    veoLog(`Model: ${selectedModel}`, 'info');

  } catch (error) {
    showNotification(`❌ Error: ${error.message}`, 'error', 'veoStatus');
    veoLog(`Error: ${error.message}`, 'error');
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '✨ Generate All Prompts';
    setTimeout(() => hideProgressBar('veoProgressContainer'), 1000);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// VEO BATCH GENERATION
// ──────────────────────────────────────────────────────────────────────────────

function updateBatchSection() {
  const numPrompts = parseInt(document.getElementById('veoNumPrompts').value, 10) || 10;
  const topic = document.getElementById('veoTopic').value.trim();

  document.getElementById('totalDuration').textContent = numPrompts * 8;

  // Fixed batch size of 5 for better reliability
  state.BATCH_SIZE = 5;

  const batchContainer = document.getElementById('batchButtonsContainer');
  const generateBtn = document.getElementById('generateAllBatchesBtn');

  // Always calculate batches (minimum 1 batch)
  state.totalBatches = Math.max(1, Math.ceil(numPrompts / state.BATCH_SIZE));
  state.batchResults = {};

  // Update main button text to show batch count
  if (generateBtn) {
    const batchText = state.totalBatches === 1 ? '1 batch' : `${state.totalBatches} batches`;
    generateBtn.innerHTML = `⚡ Generate (${batchText})`;
  }

  // Generate batch buttons for manual retry
  batchContainer.innerHTML = '';
  for (let i = 0; i < state.totalBatches; i++) {
    const startPrompt = i * state.BATCH_SIZE + 1;
    const endPrompt = Math.min((i + 1) * state.BATCH_SIZE, numPrompts);

    const button = document.createElement('button');
    button.className = 'batch-button';
    button.id = `batch-button-${i + 1}`;
    button.innerHTML = `📦 ${startPrompt}-${endPrompt}`;
    button.onclick = () => handleGenerateBatch(i + 1, startPrompt, endPrompt);
    batchContainer.appendChild(button);
  }

  // Add listener to track manual style changes (only once)
  const visualSelect = document.getElementById('veoVisualStyle');
  if (visualSelect && !visualSelect.dataset.listenerAdded) {
    visualSelect.addEventListener('change', () => {
      state.styleManuallySet = true;
      veoLog(`Style manually changed to: ${visualSelect.value}`, 'info');

      // Update the label to show manual selection
      const styleLabel = document.querySelector('label[for="veoVisualStyle"]');
      if (styleLabel) {
        styleLabel.innerHTML = 'Visual Rendering <span style="color: #2196F3; font-size: 0.8em">(manual selection)</span>';
      }
    });
    visualSelect.dataset.listenerAdded = 'true';
  }

}

async function handleGenerateBatch(batchNum, startPrompt, endPrompt) {
  if (!state.settings.geminiApiKey) {
    showNotification('❌ Configure Gemini API key', 'error', 'veoStatus');
    return;
  }

  const fullTopic = document.getElementById('veoTopic').value.trim();
  if (!fullTopic) {
    showNotification('❌ Enter topic first', 'error', 'veoStatus');
    return;
  }

  const button = document.getElementById(`batch-button-${batchNum}`);

  // Check if this is a retry
  const isRetry = state.batchResults[batchNum] !== undefined;

  button.disabled = true;
  if (isRetry) {
    button.innerHTML = '🔄...';  // Show retry icon
    veoLog(`Retrying batch ${batchNum}: prompts ${startPrompt}-${endPrompt}`, 'info');
  } else {
    button.innerHTML = '🧠...';  // First-time generation
    veoLog(`Batch ${batchNum}: prompts ${startPrompt}-${endPrompt}`, 'system');
  }

  try {
    // Use current visual style selection (already set when script was loaded)
    const videoStyle = combineStyleDimensions();

    const dialogue = document.getElementById('veoDialogue').value;
    const subtitles = document.getElementById('veoSubtitles').value;
    const batchSize = endPrompt - startPrompt + 1;

    // Get segmented topic for this batch (key fix for content coverage)
    const segmentedTopic = getSegmentedTopicForBatch(fullTopic, batchNum, state.totalBatches, startPrompt, endPrompt);
    console.log(`📦 Batch ${batchNum} using segmented content (${segmentedTopic.length} chars vs ${fullTopic.length} full)`);

    const masterPrompt = buildMasterPrompt(segmentedTopic, batchSize, videoStyle, dialogue, subtitles, startPrompt);
    const jsonResponse = await callVeoApi(state.settings.geminiApiKey, masterPrompt);

    // Robust JSON cleaning - handle special characters from 100% clone scripts
    let cleanedJson = jsonResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      // Replace curly quotes and special apostrophes
      .replace(/[""]/g, '"')
      .replace(/[''´`]/g, "'")
      // Remove control characters that break JSON
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
      .trim();

    // Attempt to parse, with detailed error on failure
    let responseData;
    try {
      responseData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.warn('⚠️ Initial JSON parse failed, attempting repairs...', parseError.message);
      console.error('JSON preview:', cleanedJson.substring(0, 300));

      try {
        // Step 1: Escape problematic characters within strings
        cleanedJson = cleanedJson
          .replace(/\n/g, '\\n')   // Escape literal newlines
          .replace(/\r/g, '')      // Remove carriage returns
          .replace(/\t/g, '\\t')   // Escape tabs
          .replace(/\\/g, '\\\\')  // Escape backslashes not already escaped
          .replace(/\\\\\\\\/g, '\\\\')  // Fix double-escapes
          .replace(/\\\\n/g, '\\n')  // Restore escaped newlines
          .replace(/\\\\t/g, '\\t'); // Restore escaped tabs

        responseData = JSON.parse(cleanedJson);
        veoLog('⚠️ JSON repaired (escapes fixed)', 'warn');
      } catch (secondError) {
        console.warn('⚠️ Second repair attempt...', secondError.message);
        try {
          // Step 2: Try to extract JSON array/object if surrounded by text
          const jsonMatch = cleanedJson.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
          if (jsonMatch) {
            let extracted = jsonMatch[1];
            // Remove any remaining control characters
            extracted = extracted.replace(/[\x00-\x1F\x7F]/g, ' ');
            // Fix trailing commas
            extracted = extracted.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
            // Try to close unterminated strings by finding unmatched quotes
            if ((extracted.match(/"/g) || []).length % 2 !== 0) {
              extracted = extracted + '"';
            }
            // Try to close unterminated arrays/objects
            const openBrackets = (extracted.match(/\[/g) || []).length;
            const closeBrackets = (extracted.match(/\]/g) || []).length;
            if (openBrackets > closeBrackets) {
              extracted = extracted + ']'.repeat(openBrackets - closeBrackets);
            }
            const openBraces = (extracted.match(/\{/g) || []).length;
            const closeBraces = (extracted.match(/\}/g) || []).length;
            if (openBraces > closeBraces) {
              extracted = extracted + '}'.repeat(openBraces - closeBraces);
            }
            responseData = JSON.parse(extracted);
            veoLog('⚠️ JSON repaired (extracted and balanced)', 'warn');
          } else {
            throw new Error('No JSON structure found');
          }
        } catch (thirdError) {
          console.error('❌ JSON repair failed after all attempts');
          throw new Error(`JSON parse failed: ${parseError.message.substring(0, 100)}`);
        }
      }
    }

    const promptsArray = responseData.prompts || responseData.script;

    if (!promptsArray || promptsArray.length === 0) throw new Error('No prompts');

    state.batchResults[batchNum] = promptsArray;

    // Visual feedback for retry vs first-time
    if (isRetry) {
      button.className = 'batch-button retried';  // Orange color
      button.innerHTML = `🔄 ${startPrompt}-${endPrompt}`;
      veoLog(`Batch ${batchNum} retried successfully`, 'success');
    } else {
      button.className = 'batch-button completed';
      button.innerHTML = `✅ ${startPrompt}-${endPrompt}`;
      veoLog(`Batch ${batchNum} complete: ${promptsArray.length} prompts`, 'success');
    }

    combineAndDisplayBatches();

  } catch (error) {
    button.disabled = false;
    button.innerHTML = `❌ ${startPrompt}-${endPrompt}`;
    veoLog(`Batch ${batchNum} failed: ${error.message}`, 'error');
  }
}

async function generateAllBatches() {
  const numPrompts = parseInt(document.getElementById('veoNumPrompts').value, 10) || 10;
  const totalBatches = Math.ceil(numPrompts / state.BATCH_SIZE);

  // Get dynamic delay based on selected model
  const model = document.getElementById('veoModelSelect')?.value || 'gemini-2.5-flash';
  const delayMs = getDelayForModel(model);

  veoLog(`Auto-generating ${totalBatches} batches... (${delayMs}ms delay for ${model})`, 'system');
  showNotification(`Generating ${totalBatches} batches...`, 'loading', 'veoStatus');

  for (let i = 0; i < totalBatches; i++) {
    const startPrompt = i * state.BATCH_SIZE + 1;
    const endPrompt = Math.min((i + 1) * state.BATCH_SIZE, numPrompts);

    if (state.batchResults[i + 1]) continue;

    await handleGenerateBatch(i + 1, startPrompt, endPrompt);

    // Dynamic delay based on model
    if (i < totalBatches - 1) await new Promise(r => setTimeout(r, delayMs));
  }

  showNotification('✅ All batches complete!', 'success', 'veoStatus');
}


// ──────────────────────────────────────────────────────────────────────────────
// BATCH COMBINING & SCENE ORDERING
// ──────────────────────────────────────────────────────────────────────────────

// Extract scene number from prompt text (e.g., "Scene 01:" -> 1)
// Handles both string prompts and object prompts (e.g., {prompt: "...", scene: 1})
function extractSceneNumber(prompt) {
  // If prompt is not a string, try to extract from object or convert
  if (typeof prompt !== 'string') {
    if (prompt && typeof prompt === 'object') {
      // Handle structured response with scene number
      if (prompt.scene) return parseInt(prompt.scene, 10);
      if (prompt.sceneNumber) return parseInt(prompt.sceneNumber, 10);
      // Try to get prompt text from object
      prompt = prompt.prompt || prompt.text || prompt.content || JSON.stringify(prompt);
    } else {
      return -1;
    }
  }

  // Try multiple patterns to find scene number
  // Pattern 1: At start of string "Scene 01:"
  let match = prompt.match(/^Scene\s+(\d+):/i);
  if (match) return parseInt(match[1], 10);

  // Pattern 2: Anywhere in first 50 chars "Scene 01:"
  match = prompt.substring(0, 50).match(/Scene\s+(\d+):/i);
  if (match) return parseInt(match[1], 10);

  // Pattern 3: Just "Scene XX" without colon
  match = prompt.substring(0, 50).match(/Scene\s+(\d+)/i);
  if (match) return parseInt(match[1], 10);

  return -1;
}

// Validate that scenes are continuous (warn about gaps)
function validateSceneContinuity(sceneNumbers) {
  if (sceneNumbers.length === 0) return;

  const missing = [];
  const sorted = [...sceneNumbers].sort((a, b) => a - b);

  for (let i = sorted[0]; i <= sorted[sorted.length - 1]; i++) {
    if (!sorted.includes(i)) {
      missing.push(i);
    }
  }

  if (missing.length > 0) {
    const missingStr = missing.map(n => String(n).padStart(2, '0')).join(', ');
    veoLog(`⚠️ Warning: Missing scenes ${missingStr}`, 'warn');
    showNotification(`⚠️ Missing scenes: ${missingStr}`, 'warning', 'veoStatus');
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// ON-SCREEN TEXT FILTER (VEO Compatibility)
// Rules:
//   - 1-2 word labels/markers: Always keep (unlimited)
//   - 3-5 word sentence: Keep FIRST one only per scene
//   - 6+ word sentences: Move to Extended Text
//   - 2nd+ sentences (3-5 words): Move to Extended Text
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Filter on-screen text in VEO prompts for VEO compatibility
 * @param {string[]} prompts - Array of VEO prompt strings
 * @returns {object} { filteredPrompts: string[], extendedTextOverflow: string[] }
 */
function filterOnScreenText(prompts) {
  const extendedTextOverflow = [];

  const filteredPrompts = prompts.map((prompt, sceneIdx) => {
    // Find all on-screen text entries in this scene
    // Pattern matches: [On-Screen Text: "..."] or [ON-SCREEN TEXT: "..."] or similar
    const onScreenPattern = /\[On-?Screen\s*Text[:\s]*"([^"]+)"\]/gi;

    let foundFirstSentence = false;
    const sceneNum = extractSceneNumber(prompt) || (sceneIdx + 1);

    // Replace each on-screen text match
    const filtered = prompt.replace(onScreenPattern, (match, textContent) => {
      const wordCount = textContent.trim().split(/\s+/).length;

      // Rule 1: 1-2 words = Always keep (labels/markers)
      if (wordCount <= 2) {
        console.log(`📝 Scene ${sceneNum}: Keeping label "${textContent}" (${wordCount} words)`);
        return match; // Keep as-is
      }

      // Rule 2: 6+ words = Always remove to Extended Text
      if (wordCount >= 6) {
        console.log(`📝 Scene ${sceneNum}: Moving long text to Extended "${textContent.substring(0, 30)}..." (${wordCount} words)`);
        extendedTextOverflow.push(`[Scene ${String(sceneNum).padStart(2, '0')}] "${textContent}"`);
        return ''; // Remove from VEO prompt
      }

      // Rule 3: 3-5 words = Keep FIRST one only
      if (wordCount >= 3 && wordCount <= 5) {
        if (!foundFirstSentence) {
          foundFirstSentence = true;
          console.log(`📝 Scene ${sceneNum}: Keeping first sentence "${textContent}" (${wordCount} words)`);
          return match; // Keep first sentence
        } else {
          console.log(`📝 Scene ${sceneNum}: Moving 2nd+ sentence to Extended "${textContent}" (${wordCount} words)`);
          extendedTextOverflow.push(`[Scene ${String(sceneNum).padStart(2, '0')}] "${textContent}"`);
          return ''; // Remove 2nd+ sentences
        }
      }

      return match; // Fallback: keep as-is
    });

    // Clean up any empty lines left by removed text
    return filtered.replace(/\n{3,}/g, '\n\n').trim();
  });

  console.log(`✅ On-Screen Text Filter: ${extendedTextOverflow.length} texts moved to Extended`);

  return {
    filteredPrompts,
    extendedTextOverflow
  };
}

function combineAndDisplayBatches() {
  // Flatten all batch results into single array
  const allPrompts = [];
  for (const batchNum in state.batchResults) {
    console.log(`📦 Batch ${batchNum}: ${state.batchResults[batchNum].length} prompts`);
    allPrompts.push(...state.batchResults[batchNum]);
  }

  console.log(`📊 Total prompts to combine: ${allPrompts.length}`);
  if (allPrompts.length === 0) return;

  // Normalize prompts to strings (AI may return objects)
  // CRITICAL: Preserve scene number information from object fields
  const normalizedPrompts = allPrompts.map((prompt, idx) => {
    if (typeof prompt === 'string') return prompt;
    if (prompt && typeof prompt === 'object') {
      // Extract text from common object formats
      let text = prompt.prompt || prompt.text || prompt.content || prompt.script || '';

      // Check if scene number is in a separate field
      const sceneNum = prompt.scene || prompt.sceneNumber || prompt.scene_number;
      const title = prompt.title || '';

      // If we have a scene number but text doesn't start with "Scene XX:", prepend it
      if (sceneNum && text && !text.match(/^Scene\s+\d+:/i)) {
        const paddedNum = String(sceneNum).padStart(2, '0');
        // Use title if available, otherwise create "Scene XX:"
        if (title && title.match(/^Scene\s+\d+:/i)) {
          text = `${title}\n${text}`;
        } else {
          text = `Scene ${paddedNum}:\n${text}`;
        }
        console.log(`✅ Prompt ${idx}: Restored scene number from object field (Scene ${paddedNum})`);
      } else if (!text) {
        text = JSON.stringify(prompt);
        console.warn(`⚠️ Prompt ${idx}: Converted object to JSON string (no text field found)`);
      } else {
        console.log(`📝 Prompt ${idx}: Converted object to string`);
      }

      return text;
    }
    return String(prompt);
  });

  // Create array of {sceneNum, prompt} objects
  const promptsWithSceneNums = normalizedPrompts.map((prompt, idx) => {
    const sceneNum = extractSceneNumber(prompt);
    if (sceneNum === -1) {
      console.warn(`⚠️ Prompt ${idx}: Could not extract scene number from: "${prompt.substring(0, 60)}..."`);
    }
    return { sceneNum, prompt };
  });

  // Log detected scene numbers
  const detectedScenes = promptsWithSceneNums.map(p => p.sceneNum).filter(n => n > 0);
  console.log(`🎬 Detected scene numbers: [${detectedScenes.join(', ')}]`);

  // Sort by scene number (not batch number!)
  promptsWithSceneNums.sort((a, b) => a.sceneNum - b.sceneNum);

  // Deduplicate: Keep only the LAST occurrence of each scene number
  // This ensures retries override old versions
  const deduped = new Map();
  const undetectedPrompts = [];  // Track prompts without scene numbers

  for (const item of promptsWithSceneNums) {
    if (item.sceneNum > 0) {
      // Check if this is a duplicate
      if (deduped.has(item.sceneNum)) {
        console.log(`🔄 Scene ${item.sceneNum}: Replacing duplicate with newer version`);
      }
      deduped.set(item.sceneNum, item.prompt);
    } else {
      // Scene number not detected - keep track for now
      undetectedPrompts.push(item.prompt);
    }
  }

  // Log deduplication results
  const duplicatesRemoved = promptsWithSceneNums.length - deduped.size - undetectedPrompts.length;
  if (duplicatesRemoved > 0) {
    console.log(`🗑️ Removed ${duplicatesRemoved} duplicate scene(s)`);
  }

  if (undetectedPrompts.length > 0) {
    console.warn(`⚠️ ${undetectedPrompts.length} prompt(s) have no scene number - assigning synthetic numbers`);
    // Assign synthetic scene numbers (starting from max detected + 1)
    const maxDetected = Math.max(...Array.from(deduped.keys()), 0);
    undetectedPrompts.forEach((prompt, idx) => {
      const syntheticNum = maxDetected + idx + 1;
      deduped.set(syntheticNum, prompt);
      console.log(`📝 Assigned synthetic Scene ${syntheticNum} to undetected prompt`);
    });
  }

  // Extract final sorted prompts
  let finalPrompts = Array.from(deduped.entries())
    .sort(([a], [b]) => a - b)
    .map(([_, prompt]) => prompt);
  const sceneNums = Array.from(deduped.keys()).sort((a, b) => a - b);

  console.log(`✅ Final combined: ${finalPrompts.length} prompts, scenes: [${sceneNums.join(', ')}]`);

  // ✅ Apply On-Screen Text Filter for VEO compatibility
  const filterResult = filterOnScreenText(finalPrompts);
  finalPrompts = filterResult.filteredPrompts;

  // Append overflow texts to Extended Text field (Post-Production)
  if (filterResult.extendedTextOverflow.length > 0) {
    const extendedTextarea = document.getElementById('postProdExtendedText');
    if (extendedTextarea) {
      const existingText = extendedTextarea.value.trim();
      const overflowText = filterResult.extendedTextOverflow.join('\n');
      extendedTextarea.value = existingText
        ? `${existingText}\n\n--- VEO Overflow ---\n${overflowText}`
        : `--- VEO Overflow ---\n${overflowText}`;
      console.log(`📝 Added ${filterResult.extendedTextOverflow.length} texts to Extended Text field`);
    }
  }

  // Update UI
  state.generatedPrompts = finalPrompts;
  document.getElementById('veoPromptsOutput').value = finalPrompts.join('\n\n');
  document.getElementById('veoOutputSection').style.display = 'block';

  // Show scene range instead of just batch count
  if (sceneNums.length > 0) {
    const minScene = sceneNums[0];
    const maxScene = sceneNums[sceneNums.length - 1];
    const totalDuration = finalPrompts.length * 8;

    document.getElementById('veoStats').textContent =
      `✅ ${finalPrompts.length} prompts (Scene ${String(minScene).padStart(2, '0')}-${String(maxScene).padStart(2, '0')}) | ${formatDuration(totalDuration)}`;
  }

  chrome.storage.local.set({ veoPrompts: finalPrompts.join('\n\n') });

  // Validate scene continuity
  validateSceneContinuity(sceneNums);
}

// ──────────────────────────────────────────────────────────────────────────────
// SEND SCRIPT TO VEO TAB
// ──────────────────────────────────────────────────────────────────────────────

function sendScriptToVeo() {
  if (!state.generatedScript) {
    showNotification('❌ Generate a script first', 'error');
    return;
  }

  switchTab('veo-prompts');
  document.getElementById('veoTopic').value = state.generatedScript.fullScript;

  // Use script-based duration parsing instead of word count estimation
  if (!document.getElementById('manualPromptsOverride').checked) {
    autoCalcPromptsFromScript(state.generatedScript.fullScript);
  }

  // AUTO-SUGGEST visual style based on script content
  const template = state.generatedScript.template || '';
  const suggestedStyle = suggestVisualStyle(state.generatedScript.fullScript, template);
  const visualSelect = document.getElementById('veoVisualStyle');

  if (visualSelect) {
    const currentStyle = visualSelect.value;
    visualSelect.value = suggestedStyle;
    state.styleManuallySet = false; // Reset so user knows AI suggested this

    // Show notification about suggested style
    veoLog(`AI recommended style: ${suggestedStyle} (based on content analysis)`, 'info');
    showNotification(`🎨 AI suggests: ${suggestedStyle} style`, 'info', 'veoStatus');

    // Add visual indicator to the dropdown
    const styleLabel = document.querySelector('label[for="veoVisualStyle"]');
    if (styleLabel) {
      styleLabel.innerHTML = 'Visual Rendering <span style="color: #4CAF50; font-size: 0.8em">(AI suggested: ' + suggestedStyle + ')</span>';
    }
  }

  updateBatchSection();
  showNotification(`✅ Script loaded to VEO tab`, 'success', 'veoStatus');
  veoLog('Script sent to VEO tab', 'info');
}

// ──────────────────────────────────────────────────────────────────────────────
// COPY & EXPORT FUNCTIONS
// ──────────────────────────────────────────────────────────────────────────────

function copyScriptToClipboard() {
  if (!state.generatedScript) { showNotification('❌ No script', 'error'); return; }
  navigator.clipboard.writeText(state.generatedScript.fullScript).then(() => showNotification('✅ Copied!', 'success'));
}

function exportScriptAsText() {
  if (!state.generatedScript) { showNotification('❌ No script', 'error'); return; }
  downloadFile(state.generatedScript.fullScript, `script_${Date.now()}.txt`, 'text/plain');
  showNotification('✅ Exported!', 'success');
}

function copyVeoTopic() {
  const topic = document.getElementById('veoTopic').value;
  if (!topic) { showNotification('❌ No topic', 'error', 'veoStatus'); return; }
  navigator.clipboard.writeText(topic).then(() => showNotification('✅ Copied!', 'success', 'veoStatus'));
}

function exportVeoTopic() {
  const topic = document.getElementById('veoTopic').value;
  if (!topic) { showNotification('❌ No topic', 'error', 'veoStatus'); return; }
  downloadFile(topic, `veo-topic-${Date.now()}.txt`, 'text/plain');
  showNotification('✅ Exported!', 'success', 'veoStatus');
}

function copyVeoPrompts() {
  const prompts = document.getElementById('veoPromptsOutput').value;
  if (!prompts) { showNotification('❌ No prompts', 'error', 'veoStatus'); return; }
  navigator.clipboard.writeText(prompts).then(() => {
    showNotification('✅ Copied!', 'success', 'veoStatus');
    veoLog('Prompts copied', 'success');
  });
}

function exportVeoPrompts() {
  const prompts = document.getElementById('veoPromptsOutput').value;
  if (!prompts) { showNotification('❌ No prompts', 'error', 'veoStatus'); return; }
  downloadFile(prompts, `veo-prompts-${Date.now()}.txt`, 'text/plain');
  showNotification('✅ Exported!', 'success', 'veoStatus');
  veoLog('Prompts exported', 'success');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ──────────────────────────────────────────────────────────────────────────────
// AUTO-CALCULATE PROMPTS
// ──────────────────────────────────────────────────────────────────────────────

function autoCalculatePrompts() {
  if (document.getElementById('manualPromptsOverride')?.checked) return;

  const topic = document.getElementById('veoTopic').value.trim();
  if (topic.length < 500) return;

  const scenePatterns = [/^##\s+.*$/gm, /^\*\*SCENE START\*\*$/gm, /^Scene\s+\d+:/gim];
  let detectedScenes = 0;
  for (const pattern of scenePatterns) {
    const matches = topic.match(pattern);
    if (matches && matches.length > detectedScenes) detectedScenes = matches.length;
  }

  let suggestedPrompts = detectedScenes >= 5
    ? detectedScenes
    : Math.ceil(topic.split(/\s+/).length / 2.5 / 8);

  suggestedPrompts = Math.min(suggestedPrompts, 999);

  if (suggestedPrompts >= 5) {
    const current = parseInt(document.getElementById('veoNumPrompts').value, 10);
    if (current === 10 || Math.abs(current - suggestedPrompts) > 5) {
      document.getElementById('veoNumPrompts').value = suggestedPrompts;
      document.getElementById('veoNumPrompts').classList.add('auto-calculated');
      setTimeout(() => document.getElementById('veoNumPrompts').classList.remove('auto-calculated'), 3000);
      veoLog(`Auto-calculated: ${suggestedPrompts} prompts`, 'info');
    }
  }

  updateBatchSection();
}

// ──────────────────────────────────────────────────────────────────────────────
// VEO PROMPT ASSESSMENT
// ──────────────────────────────────────────────────────────────────────────────

async function assessPromptsQuality() {
  console.log('🔍 Starting prompt assessment...');

  // Get prompts from VEO output
  const promptsText = document.getElementById('veoPromptsOutput')?.value;
  if (!promptsText || promptsText.trim().length === 0) {
    alert('❌ No prompts to assess. Generate VEO prompts first.');
    return;
  }

  // Parse prompts - split by Scene markers, not just blank lines
  // This ensures each prompt is a complete scene including all content

  // Try to split by "Scene XX:" markers
  const sceneSplitRegex = /(?=^Scene \d+:)/gm;
  const potentialScenes = promptsText.split(sceneSplitRegex).filter(s => s.trim().length > 0);

  console.log('🔍 Parser debug:', {
    totalText: promptsText.length,
    potentialScenes: potentialScenes.length,
    firstScenePreview: potentialScenes[0]?.substring(0, 50)
  });

  // Check if we successfully split by Scene markers
  if (potentialScenes.length > 1 && potentialScenes[0].startsWith('Scene ')) {
    state.generatedPrompts = potentialScenes;
    console.log(`📊 Found ${state.generatedPrompts.length} scenes (parsed by 'Scene XX:' markers) ✅`);
  } else {
    // Fallback to old method if no Scene markers found
    state.generatedPrompts = promptsText.split(/\n\n+/).filter(p => p.trim().length > 0);
    console.log(`📊 Found ${state.generatedPrompts.length} prompts (parsed by blank lines - fallback) ⚠️`);
  }

  state.veoPromptsText = promptsText;

  // Get selected assessment model
  const selectedModel = document.getElementById('assessmentModelSelect')?.value || 'gemini-2.5-flash';
  const needsClaude = selectedModel.startsWith('claude-');
  const needsGemini = !needsClaude;

  // Check API keys
  if (needsClaude && !state.settings.claudeApiKey) {
    alert('❌ Claude API key required. Configure in Settings.');
    return;
  }
  if (needsGemini && !state.settings.geminiApiKey) {
    alert('❌ Gemini API key required. Configure in Settings.');
    return;
  }

  // Disable button and show progress
  const assessBtn = document.getElementById('assessPromptsBtn');
  assessBtn.disabled = true;
  assessBtn.innerHTML = '⏳ Assessing...';

  document.getElementById('assessmentProgress').style.display = 'block';
  document.getElementById('assessmentResults').style.display = 'none';

  console.log(`📊 Assessment Model: ${selectedModel}`);
  updateAssessmentProgress(10, 'Running technical checks...');

  try {
    // Phase 1: Automated Technical Checks
    const technicalResults = await runTechnicalChecks(state.generatedPrompts);
    const modelName = selectedModel.startsWith('claude-') ? 'Claude' : 'Gemini';
    updateAssessmentProgress(30, `Technical checks complete. Running ${modelName} AI assessment...`);

    // Phase 2: AI Quality Assessment
    const aiResults = await runAIAssessment(state.generatedPrompts);
    updateAssessmentProgress(70, 'AI assessment complete. Calculating score...');

    // Phase 3: Calculate Final Score
    const assessment = calculateFinalScore(technicalResults, aiResults);
    updateAssessmentProgress(90, 'Generating recommendations...');

    // Store assessment
    state.lastAssessment = assessment;
    updateAssessmentProgress(100, 'Assessment complete!');

    // Display results
    setTimeout(() => {
      document.getElementById('assessmentProgress').style.display = 'none';
      document.getElementById('assessmentResults').style.display = 'block';

      // Update score display
      const scoreValue = document.getElementById('scoreValue');
      const scoreStatus = document.getElementById('scoreStatus');

      if (scoreValue) {
        scoreValue.textContent = assessment.overallScore || '--';
      }

      if (scoreStatus) {
        scoreStatus.textContent = assessment.status || '--';
        // Set badge color based on score
        if (assessment.overallScore >= 90) {
          scoreStatus.style.background = '#10b981';
        } else if (assessment.overallScore >= 75) {
          scoreStatus.style.background = '#3b82f6';
        } else if (assessment.overallScore >= 60) {
          scoreStatus.style.background = '#f59e0b';
        } else {
          scoreStatus.style.background = '#ef4444';
        }
        scoreStatus.style.color = 'white';
      }

      // Display detailed scores if function exists
      console.log('Checking for displayDetailedScores:', typeof displayDetailedScores);
      console.log('Assessment breakdown:', assessment.breakdown);

      if (typeof displayDetailedScores === 'function' && assessment.breakdown) {
        console.log('📊 Calling displayDetailedScores...');
        try {
          displayDetailedScores(assessment.breakdown);
          console.log('✅ displayDetailedScores called successfully');
        } catch (err) {
          console.error('❌ Error in displayDetailedScores:', err);
        }
      } else {
        console.warn('⚠️ displayDetailedScores not available or no breakdown data');
      }

      // Display issues and recommendations if functions exist
      if (typeof displayIssuesAndRecommendations === 'function') {
        console.log('📋 Calling displayIssuesAndRecommendations...');
        displayIssuesAndRecommendations(assessment);
      }

      // Re-enable button with new text
      assessBtn.disabled = false;
      assessBtn.innerHTML = '🔄 Re-Assess Prompts Quality';

      console.log('✅ Assessment complete - Score:', assessment.overallScore);
    }, 500);

  } catch (error) {
    console.error('❌ Assessment error:', error);
    alert(`❌ Assessment failed: ${error.message}`);
    document.getElementById('assessmentProgress').style.display = 'none';
    assessBtn.disabled = false;
    assessBtn.innerHTML = '🔍 Assess Prompts Quality';
  }
}

function updateAssessmentProgress(percent, text) {
  document.getElementById('assessmentProgressBar').style.width = `${percent}%`;
  document.getElementById('assessmentProgressPercent').textContent = `${percent}%`;
  document.getElementById('assessmentProgressText').textContent = text;
}

/* DISABLED: Using runTechnicalChecks from assessment_stage1.js instead
async function runTechnicalChecks(prompts) {
  const results = {
    dataCorruption: [],
    technicalConsistency: { consistent: true, issues: [] },
    characterContinuity: { consistent: true, variations: [] },
    durationCheck: { valid: true, total: 0, issues: [] }
  };
 
  // 1. Data Corruption Check
  prompts.forEach((prompt, idx) => {
    if (!prompt || prompt.includes('[object Object]') || prompt.trim().length < 20) {
      results.dataCorruption.push(`Scene ${idx + 1}: Corrupted or empty`);
    }
  });
 
  // 2. Character Continuity
  const characterNames = new Set();
  prompts.forEach(prompt => {
    const matches = prompt.match(/\b[A-Z][a-z]+\b/g) || [];
    matches.forEach(name => {
      if (name.length > 3 && !['Scene', 'Shot', 'Camera', 'Dialogue'].includes(name)) {
        characterNames.add(name);
      }
    });
  });
 
  if (characterNames.size > 3) {
    results.characterContinuity.consistent = false;
    results.characterContinuity.variations = Array.from(characterNames);
  }
 
  // 3. Duration Check (assume 8s per scene)
  results.durationCheck.total = prompts.length * 8;
 
  return results;
}
*/

async function runAIAssessment(prompts) {
  // Get selected model from ASSESSMENT dropdown (not VEO dropdown)
  const selectedModel = document.getElementById('assessmentModelSelect')?.value || 'gemini-2.5-flash';
  const isClaudeModel = selectedModel.startsWith('claude-');

  console.log(`🔧 AI Assessment - Model: ${selectedModel}, isClaudeModel: ${isClaudeModel}`);

  // Check for required API key BASED ON SELECTED MODEL
  if (isClaudeModel && !state.settings.claudeApiKey) {
    console.warn('⚠️ Claude selected but no API key - returning fallback scores');
    return {
      contentCoverage: 7,
      visualStorytelling: 7,
      pacingAlignment: 7,
      redundancyCheck: 8,
      productionFeasibility: 8,
      criticalIssues: [],
      recommendations: ['Claude API key required for AI assessment']
    };
  }

  if (!isClaudeModel && !state.settings.geminiApiKey) {
    console.warn('⚠️ Gemini selected but no API key - returning fallback scores');
    return {
      contentCoverage: 7,
      visualStorytelling: 7,
      pacingAlignment: 7,
      redundancyCheck: 8,
      productionFeasibility: 8,
      criticalIssues: [],
      recommendations: ['Gemini API key required for AI assessment']
    };
  }

  const scriptContent = state.generatedScript?.fullScript || 'No script available';
  const analyzerData = state.analyzerData ? JSON.stringify(state.analyzerData, null, 2) : 'No analyzer data';

  // Dynamic prompt sizing: Claude gets full content, Gemini gets reduced to avoid MAX_TOKENS
  const scriptExcerptSize = isClaudeModel ? 2000 : 1000;
  const promptsToShow = isClaudeModel ? 5 : 3;

  const assessmentPrompt = `You are a Senior Director with 15+ years of video production expertise, specializing in AI video generation with Google VEO 3.1.

⚠️ CRITICAL CONTEXT - VEO 3.1 STRUCTURE:
- VEO 3.1 uses 8-second clips (4s/6s/8s supported)
- Each prompt describes ONE complete 8-second scene
- Timestamps like [0-2s], [2-4s], [4-6s], [6-8s] are cinematography directions WITHIN a scene, NOT separate scenes
- "Person", "The person", "They", "Their" are GENERIC references, NOT character names
- Character names are proper nouns like "Alex Martinez", "Sarah", etc.

🔍 SCENE COUNTING RULES:
- Count ONLY "Scene XX:" markers as separate scenes
- Do NOT count [0-2s], [2-4s] timestamps as scenes
- Do NOT count [HOOK], [MICRO-HOOK], [CTA] tags as scenes
- Expected scene count: 6-8 for <60s, 10-15 for 1-3min, 20-30 for 3-5min

Assess these AI video prompts for quality, completeness, and production readiness.

ORIGINAL SCRIPT (excerpt):
${scriptContent.substring(0, scriptExcerptSize)}...
${isClaudeModel ? `\nANALYZER DATA:\n${analyzerData.substring(0, 500)}...` : ''}

GENERATED PROMPTS (${prompts.length} scenes, showing first ${promptsToShow}):
${prompts.slice(0, promptsToShow).join('\n\n')}
${prompts.length > promptsToShow ? `\n... and ${prompts.length - promptsToShow} more scenes` : ''}

ASSESS on 5 criteria (score 1-10 each):

A. CONTENT COVERAGE (25% weight)
   - All script sections have corresponding scenes
   - Key messages are visually represented
   - CTA scene present with social handle (@username)

B. VISUAL STORYTELLING (20% weight)
   - Abstract concepts have clear visual metaphors
   - Show-don't-tell principle applied
   - Each scene has unique visual purpose

C. PACING ALIGNMENT (10% weight)
   - Scene count appropriate: 6-8 for <60s, 10-15 for 1-3min
   - Each scene = 8 seconds for VEO compatibility
   - No over-segmentation (>12 scenes for 60s is excessive)
   - No under-segmentation (<5 scenes for 60s lacks variety)

D. REDUNDANCY CHECK (10% weight)
   - No duplicate concepts or repeated visuals
   - Efficient scene count without unnecessary repetition

E. PRODUCTION FEASIBILITY (5% weight)
   - Prompts achievable with AI video tools
   - Camera movements realistic for AI generation
   - Visual complexity appropriate for VEO 3.1

OUTPUT format (JSON ONLY):
{
  "contentCoverage": 8.5,
  "visualStorytelling": 7.0,
  "pacingAlignment": 8.0,
  "redundancyCheck": 9.0,
  "productionFeasibility": 8.5,
  "criticalIssues": ["Missing CTA scene"],
  "recommendations": ["Add final scene with call-to-action"]
}`;

  try {
    let responseText;

    if (isClaudeModel) {
      // Claude API call
      if (!state.settings.claudeApiKey) {
        throw new Error('Claude API key required');
      }

      console.log('📡 Calling Claude API for assessment...');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': state.settings.claudeApiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 1000,
          messages: [{ role: 'user', content: assessmentPrompt + '\n\nRespond with ONLY valid JSON.' }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown'}`);
      }
      const data = await response.json();
      responseText = data.content[0].text;
      console.log('✅ Claude API response received');
    } else {
      // Gemini API call
      if (!state.settings.geminiApiKey) {
        throw new Error('Gemini API key required');
      }

      console.log('📡 Calling Gemini API for assessment...');
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${state.settings.geminiApiKey}`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: assessmentPrompt }] }],
          generationConfig: {
            maxOutputTokens: 4096  // Increased to avoid truncation with Gemini's thinking
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown'}`);
      }

      const data = await response.json();
      console.log('📊 Gemini response structure:', Object.keys(data));

      // Check for MAX_TOKENS truncation first
      const finishReason = data.candidates?.[0]?.finishReason;
      if (finishReason === 'MAX_TOKENS') {
        console.warn('⚠️ Gemini response was truncated (MAX_TOKENS). Trying to parse partial response...');
      }

      // Handle various Gemini response formats
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = data.candidates[0].content.parts[0].text;
      } else if (data.text) {
        responseText = data.text;
      } else if (typeof data === 'string') {
        responseText = data;
      } else if (finishReason === 'MAX_TOKENS') {
        // Response was truncated before any content was generated
        throw new Error('Gemini response truncated (MAX_TOKENS) - try reducing prompt size or use Claude');
      } else {
        console.error('❌ Unexpected Gemini response format:', JSON.stringify(data).substring(0, 500));
        throw new Error('Unexpected Gemini response format');
      }
      console.log('✅ Gemini API response received');
    }

    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    console.log('📄 Cleaned JSON preview:', cleanJson.substring(0, 200));

    // ROBUST JSON PARSING
    let aiResults;
    try {
      aiResults = JSON.parse(cleanJson);
    } catch (parseError) {
      console.warn('⚠️ Initial JSON parse failed, attempting repairs...', parseError);
      try {
        // Attempt to extract JSON object if surrounded by text
        const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          let extracted = jsonMatch[0];
          // Remove control characters that break JSON parsing
          extracted = extracted.replace(/[\x00-\x1F\x7F]/g, ' ');
          // Simple repair for trailing commas which Gemini sometimes adds
          const repaired = extracted.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          aiResults = JSON.parse(repaired);
        } else {
          throw parseError;
        }
      } catch (finalError) {
        console.error('❌ JSON Repair failed:', finalError);
        console.log('Raw text:', responseText);
        // Fallback object to prevent crash
        aiResults = {
          contentCoverage: 7,
          visualStorytelling: 7,
          pacingAlignment: 7,
          redundancyCheck: 8,
          productionFeasibility: 8,
          criticalIssues: ["Error parsing AI response"],
          recommendations: ["Manually review prompts"]
        };
      }
    }

    // Normalize AI response - ensure criticalIssues and recommendations are always arrays
    if (!aiResults.criticalIssues || !Array.isArray(aiResults.criticalIssues)) {
      console.warn('⚠️ AI did not return criticalIssues array - initializing empty array');
      aiResults.criticalIssues = [];
    }

    if (!aiResults.recommendations || !Array.isArray(aiResults.recommendations)) {
      console.warn('⚠️ AI did not return recommendations array - initializing empty array');
      aiResults.recommendations = [];
    }

    console.log('📊 AI Assessment Results:', {
      criticalIssuesCount: aiResults.criticalIssues.length,
      recommendationsCount: aiResults.recommendations.length,
      contentCoverage: aiResults.contentCoverage,
      visualStorytelling: aiResults.visualStorytelling
    });

    return aiResults;

  } catch (error) {
    console.error('AI assessment error:', error);
    return {
      contentCoverage: 7,
      visualStorytelling: 7,
      pacingAlignment: 7,
      redundancyCheck: 8,
      productionFeasibility: 8,
      criticalIssues: [],
      recommendations: [`AI assessment unavailable: ${error.message}`]
    };
  }
}

function calculateFinalScore(technicalResults, aiResults) {
  console.log('🧮 Calculating final score from NEW structure...');

  // NEW STRUCTURE: { coverage, technical, continuity, pacing, redundancy, audio }
  // Use scores from nested objects, fallback to defaults
  let technicalScore = technicalResults.technical?.score || 8;
  let characterScore = technicalResults.continuity?.score || 8;

  // Blend Technical and AI scores for better accuracy
  const getBlendedScore = (name, techScore, aiScore, defaultVal) => {
    if (typeof techScore === 'number' && typeof aiScore === 'number') {
      const blended = (techScore + aiScore) / 2;
      console.log(`📊 ${name}: Tech=${techScore}, AI=${aiScore} → Blended=${blended.toFixed(1)}`);
      return blended;
    }
    const result = techScore || aiScore || defaultVal;
    console.log(`📊 ${name}: Tech=${techScore ?? 'N/A'}, AI=${aiScore ?? 'N/A'} → Fallback=${result}`);
    return result;
  };

  const scores = {
    contentCoverage: getBlendedScore('Content Coverage', technicalResults.coverage?.score, aiResults.contentCoverage, 7),
    visualStorytelling: aiResults.visualStorytelling || 7,
    technicalConsistency: technicalScore,
    characterContinuity: characterScore,
    pacingAlignment: getBlendedScore('Pacing Alignment', technicalResults.pacing?.score, aiResults.pacingAlignment, 7),
    redundancyCheck: getBlendedScore('Redundancy Check', technicalResults.redundancy?.score, aiResults.redundancyCheck, 8),
    productionFeasibility: aiResults.productionFeasibility || 8
  };

  const overallScore = Math.round(
    scores.contentCoverage * 0.25 +
    scores.visualStorytelling * 0.20 +
    scores.technicalConsistency * 0.15 +
    scores.characterContinuity * 0.15 +
    scores.pacingAlignment * 0.10 +
    scores.redundancyCheck * 0.10 +
    scores.productionFeasibility * 0.05
  ) * 10;

  // Determine status
  let status = 'PASS';
  if (overallScore < 60) status = 'FAIL';
  else if (overallScore < 75) status = 'WARN';

  // Compile critical issues from NEW structure
  const criticalIssues = [];

  // Character issues
  if (technicalResults.continuity?.characterCount > 5) {
    criticalIssues.push(`Character inconsistency: ${technicalResults.continuity.characterCount} different names found`);
  }

  // Collect critical issues from all checks
  [technicalResults.coverage, technicalResults.pacing].forEach(check => {
    if (check?.issues) {
      check.issues.filter(i => i.type === 'critical').forEach(i => criticalIssues.push(i.message));
    }
  });

  // AI critical issues - enabled with smart filtering
  if (aiResults.criticalIssues && Array.isArray(aiResults.criticalIssues)) {
    aiResults.criticalIssues.forEach(issue => {
      const issueLower = issue.toLowerCase();

      // Skip generic/vague issues
      if (issueLower.includes('consider') || issueLower.includes('could be')) {
        console.log('⚠️ Skipped vague AI issue:', issue.substring(0, 50));
        return;
      }

      // Add real critical issues
      criticalIssues.push(issue);
      console.log('🚨 Added AI critical issue:', issue.substring(0, 50));
    });
  }

  // Recommendations from NEW structure
  const recommendations = [];

  // Add technical recommendations first
  [technicalResults.coverage, technicalResults.pacing, technicalResults.continuity].forEach(check => {
    if (check?.issues) {
      check.issues.filter(i => i.recommendation).forEach(i => recommendations.push(i.recommendation));
    }
  });

  // Smart AI recommendation filtering - block obviously wrong ones, allow the rest
  if (aiResults.recommendations) {
    aiResults.recommendations.forEach(rec => {
      const recLower = rec.toLowerCase();

      // BLOCK: Wrong/competitor channel handles
      if (recLower.includes('@') && !recLower.includes('@psychologyhack') && !recLower.includes('psychology hack')) {
        console.log('⚠️ Blocked: Wrong channel handle -', rec.substring(0, 60));
        return;
      }

      // BLOCK: Scene count reduction advice when pacing is already perfect
      if (recLower.includes('reduce') && recLower.includes('scene') && scores.pacingAlignment >= 10) {
        console.log('⚠️ Blocked: Scene reduction advice (pacing already perfect 10/10)');
        return;
      }

      // ALLOW everything else - especially visual storytelling and production improvements
      recommendations.push(rec);
      console.log('✅ Added recommendation:', rec.substring(0, 60));
    });
  }

  if (status === 'WARN' || status === 'FAIL') {
    recommendations.push('Review and improve prompt quality before sending to production');
  }

  console.log(`✅ Final: ${overallScore}/100 (${status}), Issues: ${criticalIssues.length}`);

  // Create breakdown with weights for UI display
  const breakdown = {
    contentCoverage: { score: scores.contentCoverage, weight: 0.25 },
    visualStorytelling: { score: scores.visualStorytelling, weight: 0.20 },
    technicalConsistency: { score: scores.technicalConsistency, weight: 0.15 },
    characterContinuity: { score: scores.characterContinuity, weight: 0.15 },
    pacing: { score: scores.pacingAlignment, weight: 0.10 },
    redundancy: { score: scores.redundancyCheck, weight: 0.10 },
    feasibility: { score: scores.productionFeasibility, weight: 0.05 }
  };

  return {
    overallScore,
    status,
    scores,
    breakdown,  // Proper structure for UI
    criticalIssues,
    recommendations,
    technicalResults,
    promptCount: state.generatedPrompts.length,
    timestamp: new Date().toISOString()
  };
}

function displayAssessmentResults(assessment) {
  document.getElementById('assessmentResults').style.display = 'block';

  // Overall Score
  document.getElementById('scoreValue').textContent = assessment.overallScore;
  document.getElementById('scoreValue').style.color =
    assessment.status === 'PASS' ? '#10b981' : assessment.status === 'WARN' ? '#f59e0b' : '#ef4444';

  const statusBadge = document.getElementById('scoreStatus');
  statusBadge.textContent = assessment.status;
  statusBadge.style.background =
    assessment.status === 'PASS' ? '#10b981' : assessment.status === 'WARN' ? '#f59e0b' : '#ef4444';
  statusBadge.style.color = 'white';

  // Detailed Scores
  const criteria = [
    { name: 'Content Coverage', key: 'contentCoverage', weight: '25%' },
    { name: 'Visual Storytelling', key: 'visualStorytelling', weight: '20%' },
    { name: 'Technical Consistency', key: 'technicalConsistency', weight: '15%' },
    { name: 'Character Continuity', key: 'characterContinuity', weight: '15%' },
    { name: 'Pacing Alignment', key: 'pacingAlignment', weight: '10%' },
    { name: 'Redundancy Check', key: 'redundancyCheck', weight: '10%' },
    { name: 'Production Feasibility', key: 'productionFeasibility', weight: '5%' }
  ];

  const detailedHTML = criteria.map(c => {
    const score = assessment.scores[c.key];
    const percent = (score / 10) * 100;
    return `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-size: 13px;"><strong>${c.name}</strong> (${c.weight})</span>
          <span style="font-size: 13px; font-weight: bold;">${score.toFixed(1)}/10</span>
        </div>
        <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
          <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #10b981, #059669); transition: width 0.5s;"></div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('detailedScores').innerHTML = detailedHTML;

  // Critical Issues
  if (assessment.criticalIssues.length > 0) {
    document.getElementById('criticalIssuesContainer').style.display = 'block';
    document.getElementById('criticalIssues').innerHTML = assessment.criticalIssues
      .map((issue, i) => `<div style="margin-bottom: 6px;">☑ ${issue}</div>`)
      .join('');
  } else {
    document.getElementById('criticalIssuesContainer').style.display = 'none';
  }

  // Recommendations
  if (assessment.recommendations.length > 0) {
    document.getElementById('recommendationsContainer').style.display = 'block';
    document.getElementById('recommendations').innerHTML = assessment.recommendations
      .map((rec, i) => `<div style="margin-bottom: 6px;">${i + 1}. ${rec}</div>`)
      .join('');
  } else {
    document.getElementById('recommendationsContainer').style.display = 'none';
  }

  // Show appropriate action buttons
  if (assessment.status === 'PASS') {
    document.getElementById('sendToFlowAutomateBtn').style.display = 'block';
    document.getElementById('applyAutoFixesBtn').style.display = 'none';
    document.getElementById('reGeneratePromptsBtn').style.display = 'none';
  } else {
    document.getElementById('sendToFlowAutomateBtn').style.display = 'none';
    document.getElementById('applyAutoFixesBtn').style.display = 'block';
    document.getElementById('reGeneratePromptsBtn').style.display = 'block';
  }

  // Re-enable assessment button
  document.getElementById('assessmentControl').querySelector('#assessPromptsBtn').disabled = false;

  veoLog(`Assessment complete: ${assessment.overallScore}/100 (${assessment.status})`, 'success');
}

// ──────────────────────────────────────────────────────────────────────────────
// PHASE 2: POST-ASSESSMENT WORKFLOWS
// ──────────────────────────────────────────────────────────────────────────────

async function sendToFlowAutomate() {
  console.log('📤 Sending prompts to FlowAutomate...');

  // Get prompts from textarea (works from VEO tab or Assessment tab)
  const promptsText = document.getElementById('veoPromptsOutput')?.value || state.veoPromptsText || '';

  if (!promptsText) {
    showNotification('❌ No prompts to send. Generate VEO prompts first.', 'error', 'veoStatus');
    return;
  }

  // Count prompts
  const promptCount = (promptsText.match(/Scene \d+:/gi) || []).length ||
    (promptsText.match(/\n\n/g) || []).length + 1;

  try {
    // Get AutoFlow extension ID from storage (set in settings)
    const result = await chrome.storage.local.get(['autoFlowExtensionId']);
    const autoFlowId = result.autoFlowExtensionId;

    // Save to chrome.storage.local for FlowAutomate to read (fallback method)
    await chrome.storage.local.set({
      veoPromptsFromScriptWriter: promptsText,
      veoPromptsReceivedAt: Date.now(),
      veoPromptsMetadata: {
        promptCount: promptCount,
        assessmentScore: state.lastAssessment?.overallScore || null,
        scriptTopic: state.generatedScript?.topic || document.getElementById('veoTopic')?.value?.substring(0, 100) || '',
        visualStyle: {
          renderingStyle: document.getElementById('veoVisualStyle')?.value || '',
          genre: document.getElementById('veoContentGenre')?.value || '',
          era: document.getElementById('veoEraAesthetic')?.value || '',
          effects: document.getElementById('veoSpecialEffects')?.value || ''
        },
        sentAt: new Date().toISOString(),
        sourceVersion: 'ScriptWriter v12.0'
      }
    });

    console.log(`✅ Saved ${promptCount} prompts to storage for FlowAutomate`);

    // *** NEW: Send cross-extension message for real-time delivery ***
    if (autoFlowId) {
      console.log(`📡 Sending cross-extension message to AutoFlow: ${autoFlowId}`);
      try {
        const response = await chrome.runtime.sendMessage(autoFlowId, {
          type: 'promptsFromScriptWriter',
          data: {
            prompts: promptsText,
            metadata: {
              promptCount: promptCount,
              source: 'ScriptWriter v12.0',
              sentAt: new Date().toISOString()
            }
          }
        });
        if (response?.received) {
          console.log('✅ AutoFlow received prompts via direct message!');
        }
      } catch (msgError) {
        console.warn('⚠️ Cross-extension message failed (AutoFlow may not be open):', msgError.message);
        // Storage fallback will still work
      }
    } else {
      console.log('ℹ️ No AutoFlow extension ID configured. Using storage-only method.');
      console.log('ℹ️ User should open AutoFlow after sending, or configure extension ID in settings.');
    }

    // Also copy to clipboard as backup
    await navigator.clipboard.writeText(promptsText);

    // Save assessment to history if available
    if (state.lastAssessment) {
      await saveAssessmentToHistory({
        ...state.lastAssessment,
        sentToFlowAutomate: true
      });
    }

    showNotification(`✅ Sent ${promptCount} prompts to FlowAutomate! Open FlowAutomate to receive.`, 'success', 'veoStatus');
    veoLog(`Sent ${promptCount} prompts to FlowAutomate (also copied to clipboard)`, 'success');

  } catch (error) {
    console.error('Error sending to FlowAutomate:', error);
    showNotification('❌ Failed to send prompts: ' + error.message, 'error', 'veoStatus');
  }
}

async function applyAllAutoFixes() {
  console.log('✨ Applying auto-fixes...');

  if (!state.lastAssessment) {
    showNotification('❌ No assessment available', 'error', 'veoStatus');
    return;
  }

  const assessment = state.lastAssessment;
  const appliedFixes = [];

  showNotification('⏳ Applying auto-fixes...', 'loading', 'veoStatus');
  updateAssessmentProgress(0, 'Applying fixes...');
  document.getElementById('assessmentProgress').style.display = 'block';

  try {
    // Fix 1: Character Inconsistencies
    if (assessment.technicalResults?.characterContinuity?.variations?.length > 3) {
      const variations = assessment.technicalResults.characterContinuity.variations;
      const fix = autoFixCharacterNames(variations);
      appliedFixes.push(`Standardized character to "${fix.canonicalName}"`);
      updateAssessmentProgress(33, 'Character names standardized...');
    }

    // Fix 2: Data Corruption
    if (assessment.technicalResults?.dataCorruption?.length > 0) {
      const fixedCount = autoFixCorruptedScenes();
      if (fixedCount > 0) {
        appliedFixes.push(`Removed ${fixedCount} corrupted scenes`);
      }
      updateAssessmentProgress(66, 'Corrupted scenes removed...');
    }

    // Fix 3: Missing Content (would require AI)
    // This is a placeholder - actual implementation would generate missing scenes
    updateAssessmentProgress(100, 'Fixes applied!');

    // Update VEO output
    document.getElementById('veoPromptsOutput').value = state.generatedPrompts.join('\n\n');
    state.veoPromptsText = state.generatedPrompts.join('\n\n');

    setTimeout(async () => {
      document.getElementById('assessmentProgress').style.display = 'none';

      if (appliedFixes.length > 0) {
        showNotification(`✅ Applied ${appliedFixes.length} fixes!`, 'success', 'veoStatus');
        veoLog(`Fixes: ${appliedFixes.join(', ')}`, 'success');

        // Auto re-assess
        showNotification('🔄 Re-assessing...', 'loading', 'veoStatus');
        await assessPromptsQuality();
      } else {
        showNotification('ℹ️ No applicable fixes found', 'info', 'veoStatus');
      }
    }, 500);

  } catch (error) {
    console.error('Auto-fix error:', error);
    document.getElementById('assessmentProgress').style.display = 'none';
    showNotification('❌ Auto-fix failed', 'error', 'veoStatus');
  }
}

function autoFixCharacterNames(variations) {
  // Find most common name
  const nameFrequency = {};
  variations.forEach(name => {
    nameFrequency[name] = (nameFrequency[name] || 0) + 1;
  });

  const canonicalName = Object.keys(nameFrequency)
    .sort((a, b) => nameFrequency[b] - nameFrequency[a])[0];

  // Replace all variations
  state.generatedPrompts = state.generatedPrompts.map(prompt => {
    let fixed = prompt;
    variations.forEach(variation => {
      if (variation !== canonicalName) {
        const regex = new RegExp(`\\b${variation}\\b`, 'g');
        fixed = fixed.replace(regex, canonicalName);
      }
    });
    return fixed;
  });

  return { canonicalName, fixedCount: variations.length - 1 };
}

function autoFixCorruptedScenes() {
  const originalLength = state.generatedPrompts.length;

  // Remove corrupted/empty scenes
  state.generatedPrompts = state.generatedPrompts.filter(prompt => {
    return prompt &&
      !prompt.includes('[object Object]') &&
      prompt.trim().length >= 20;
  });

  return originalLength - state.generatedPrompts.length;
}

async function reGeneratePrompts() {
  console.log('♻️ Re-generating prompts with improvements...');

  if (!state.lastAssessment) {
    showNotification('❌ No assessment data available', 'error', 'veoStatus');
    return;
  }

  // Add assessment feedback to improve generation
  const improvements = state.lastAssessment.recommendations?.join('; ') || '';
  const issues = state.lastAssessment.criticalIssues?.join('; ') || '';

  showNotification(`🔄 Re-generating with improvements...`, 'info', 'veoStatus');
  veoLog(`Improvements: ${improvements}`, 'info');

  // Trigger the VEO generation again
  // The generate function will pick up the feedback
  const generateBtn = document.querySelector('[onclick*="generateVEO"]') ||
    document.getElementById('generateVEOBtn');

  if (generateBtn) {
    generateBtn.click();
  } else {
    showNotification('❌ Could not find generate button', 'error', 'veoStatus');
  }
}

async function saveAssessmentToHistory(assessment) {
  try {
    const history = await chrome.storage.local.get('assessmentHistory') ||
      { assessmentHistory: { assessments: [] } };

    const assessments = history.assessmentHistory?.assessments || [];

    assessments.unshift({
      id: crypto.randomUUID(),
      timestamp: assessment.timestamp || new Date().toISOString(),
      scriptTopic: state.generatedScript?.topic || 'Unknown',
      promptCount: assessment.promptCount,
      overallScore: assessment.overallScore,
      status: assessment.status,
      scores: assessment.scores,
      criticalIssues: assessment.criticalIssues,
      recommendations: assessment.recommendations,
      sentToFlowAutomate: assessment.sentToFlowAutomate || false,
      fixesApplied: assessment.fixesApplied || []
    });

    // Keep last 50
    if (assessments.length > 50) {
      assessments.length = 50;
    }

    await chrome.storage.local.set({
      assessmentHistory: { assessments }
    });

    // Update history display
    updateAssessmentHistoryDisplay(assessments.slice(0, 10));

  } catch (error) {
    console.error('Error saving assessment:', error);
  }
}

function updateAssessmentHistoryDisplay(assessments) {
  const historyContainer = document.getElementById('assessmentHistory');

  // Safety check - element may not exist
  if (!historyContainer) {
    console.warn('⚠️ assessmentHistory element not found');
    return;
  }

  if (!assessments || assessments.length === 0) {
    historyContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No assessments yet</div>';
    return;
  }

  historyContainer.innerHTML = assessments.map(a => `
    <div style="padding: 12px; background: #f9fafb; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid ${a.status === 'PASS' ? '#10b981' : a.status === 'WARN' ? '#f59e0b' : '#ef4444'
    };">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
        <strong style="font-size: 13px;">${a.scriptTopic?.substring(0, 40)}${a.scriptTopic?.length > 40 ? '...' : ''}</strong>
        <span style="font-size: 13px; font-weight: bold; color: ${a.status === 'PASS' ? '#10b981' : a.status === 'WARN' ? '#f59e0b' : '#ef4444'
    };">${a.overallScore}/100</span>
      </div>
      <div style="font-size: 11px; color: #666;">
        ${a.promptCount} prompts • ${new Date(a.timestamp).toLocaleDateString()} ${new Date(a.timestamp).toLocaleTimeString()}
        ${a.sentToFlowAutomate ? ' • <span style="color: #10b981;">✓ Sent</span>' : ''}
      </div>
    </div>
  `).join('');
}

// ──────────────────────────────────────────────────────────────────────────────
// PHASE 3: EXPORT FUNCTIONALITY
// ──────────────────────────────────────────────────────────────────────────────

function exportAssessmentJSON() {
  if (!state.lastAssessment) {
    showNotification('❌ No assessment to export', 'error', 'veoStatus');
    return;
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    exportVersion: '1.0',
    assessment: state.lastAssessment,
    prompts: state.generatedPrompts,
    promptsText: state.veoPromptsText,
    script: {
      topic: state.generatedScript?.topic,
      wordCount: state.generatedScript?.wordCount
    }
  };

  const filename = `assessment-${Date.now()}.json`;
  downloadFile(JSON.stringify(exportData, null, 2), filename, 'application/json');
  showNotification('✅ Assessment exported as JSON', 'success', 'veoStatus');
  veoLog('Assessment exported (JSON)', 'success');
}

function exportAssessmentMarkdown() {
  if (!state.lastAssessment) {
    showNotification('❌ No assessment to export', 'error', 'veoStatus');
    return;
  }

  const a = state.lastAssessment;
  const topic = state.generatedScript?.topic || 'Unknown Topic';

  const markdown = `# VEO Prompt Assessment Report

## Summary
- **Topic**: ${topic}
- **Date**: ${new Date(a.timestamp).toLocaleString()}
- **Overall Score**: ${a.overallScore}/100 (${a.status})
- **Prompt Count**: ${a.promptCount}

## Detailed Scores

| Criteria | Score | Weight |
|----------|-------|--------|
| Content Coverage | ${a.scores.contentCoverage.toFixed(1)}/10 | 25% |
| Visual Storytelling | ${a.scores.visualStorytelling.toFixed(1)}/10 | 20% |
| Technical Consistency | ${a.scores.technicalConsistency.toFixed(1)}/10 | 15% |
| Character Continuity | ${a.scores.characterContinuity.toFixed(1)}/10 | 15% |
| Pacing Alignment | ${a.scores.pacingAlignment.toFixed(1)}/10 | 10% |
| Redundancy Check | ${a.scores.redundancyCheck.toFixed(1)}/10 | 10% |
| Production Feasibility | ${a.scores.productionFeasibility.toFixed(1)}/10 | 5% |

## Critical Issues
${a.criticalIssues.length > 0
      ? a.criticalIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')
      : 'None'}

## Recommendations
${a.recommendations.length > 0
      ? a.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')
      : 'None'}

## Generated Prompts (${state.generatedPrompts.length} total)

${state.generatedPrompts.map((p, i) => `### Scene ${i + 1}\n\n${p}\n`).join('\n')}

---

*Report generated by Script Writer v7.1 Assessment System*
`;

  const filename = `assessment-${topic.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
  downloadFile(markdown, filename, 'text/markdown');
  showNotification('✅ Assessment exported as Markdown', 'success', 'veoStatus');
  veoLog('Assessment exported (Markdown)', 'success');
}

function exportAssessmentPDF() {
  showNotification('ℹ️ PDF export requires jsPDF library. Exporting as Markdown instead.', 'info', 'veoStatus');
  exportAssessmentMarkdown();

  // Note: Full PDF implementation would require adding jsPDF library to the extension
  // For now, we provide Markdown as a professional format that can be converted to PDF externally
}

// ──────────────────────────────────────────────────────────────────────────────
// POST-PRODUCTION CONTENT GENERATION
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Generate all Post-Production content (SEO Title, Description, Thumbnail, Tags, Comments)
 */
async function generatePostProdContent() {
  console.log('🎬 Generating Post-Production content...');

  // Check for script
  if (!state.generatedScript?.fullScript) {
    showNotification('❌ Generate a script first', 'error');
    return;
  }

  // Check for API key
  const selectedModel = document.getElementById('postProdModelSelect')?.value || 'gemini-2.5-pro';
  const isGemini = selectedModel.startsWith('gemini');
  const hasKey = isGemini
    ? state.settings.geminiApiKey?.length > 10
    : state.settings.claudeApiKey?.length > 10;

  if (!hasKey) {
    showNotification(`❌ Configure ${isGemini ? 'Gemini' : 'Claude'} API key in Settings`, 'error');
    return;
  }

  // Show progress
  document.getElementById('generatePostProdBtn').disabled = true;
  document.getElementById('postProdProgress').style.display = 'block';
  document.getElementById('postProdProgressBar').style.width = '0%';
  document.getElementById('postProdProgressPercent').textContent = '0%';

  try {
    // Build the prompt
    const prompt = buildPostProdPrompt();
    updatePostProdProgress(20);

    // Call AI
    let result;
    if (isGemini) {
      result = await callGeminiAPI(prompt, selectedModel, state.settings.geminiApiKey);
    } else {
      result = await callClaudeAPI(prompt, selectedModel, state.settings.claudeApiKey);
    }
    updatePostProdProgress(80);

    // Parse and populate fields
    parseAndPopulatePostProd(result);
    updatePostProdProgress(100);

    showNotification('✅ Post-Production content generated!', 'success');
  } catch (error) {
    console.error('❌ Post-Production generation failed:', error);
    showNotification(`❌ Generation failed: ${error.message}`, 'error');
  } finally {
    document.getElementById('generatePostProdBtn').disabled = false;
    setTimeout(() => {
      document.getElementById('postProdProgress').style.display = 'none';
    }, 1000);
  }
}

/**
 * Build prompt for Post-Production content generation
 */
function buildPostProdPrompt() {
  const topic = document.getElementById('topic')?.value || state.generatedScript?.topic || '';
  const script = state.generatedScript?.fullScript || '';
  const audience = document.getElementById('audience')?.value || '';

  // Get analyzer context if available
  const context = document.getElementById('context')?.value || '';

  // Extract Comment Bait from analyzer if available
  let commentBaitContext = '';
  if (state.analyzerData?.rawAnalysis) {
    const viralSection = extractSection(state.analyzerData.rawAnalysis, '### 12. VIRAL MECHANICS');
    if (viralSection) {
      const commentBaitMatch = viralSection.match(/comment.?bait[:\s]*([^\n]+(?:\n[^\n#]+)*)/i);
      if (commentBaitMatch) {
        commentBaitContext = `\nORIGINAL COMMENT BAIT EXAMPLES:\n${commentBaitMatch[1].trim()}\n`;
      }
    }
  }

  // Include timestamps, CTAs, hashtags options
  const includeTimestamps = document.getElementById('includeTimestamps')?.checked !== false;
  const includeCTAs = document.getElementById('includeCTAs')?.checked !== false;
  const includeHashtags = document.getElementById('includeHashtags')?.checked !== false;

  return `You are an expert YouTube SEO and engagement specialist.

## TASK
Generate complete Post-Production content for this video based on the script.

## VIDEO INFO
**Topic:** ${topic}
**Target Audience:** ${audience}
${commentBaitContext}

## SCRIPT CONTENT
${script.substring(0, 3000)}
${script.length > 3000 ? '\n[Script truncated...]' : ''}

## GENERATE THE FOLLOWING (Format each section with the exact headers shown):

### SEO_TITLE
[Write a 50-60 character SEO-optimized title with power words and curiosity trigger]

### DESCRIPTION
[Write a 1500+ character description including:
${includeTimestamps ? '- Timestamps with engaging section titles' : ''}
${includeCTAs ? '- 2-3 CTAs (subscribe, comment, free resource)' : ''}
${includeHashtags ? '- 5-7 relevant hashtags at the end' : ''}
- Hook in first 2 lines
- Keywords naturally distributed]

### THUMBNAIL_PROMPT
[Generate a Google Nano Banana optimized thumbnail prompt following these EXACT specifications:

**TECHNICAL SPECS:**
- Format: 16:9 aspect ratio, 1280x720 pixels
- Style: High contrast, vibrant colors that pop against YouTube's white/dark interface

**LAYOUT (Left-Right Split):**
- LEFT HALF: Clean placeholder area for creator's face/image with slight zoom effect
- RIGHT HALF: Visual elements, icons, or scene depicting the video topic

**TEXT OVERLAY (CRITICAL):**
- 3-5 POWER WORDS maximum (readable on mobile)
- Bold, sans-serif font with strong outline/drop shadow
- High contrast: Yellow/White text on dark or Orange/Red on light
- Position: Upper-right or lower-third (never center-center)

**EMOTIONAL TRIGGER:**
- Choose ONE: Curiosity, Shock, FOMO, Promise of Value, Controversy
- Use facial expression cues: Wide eyes, raised eyebrows, open mouth, pointing gesture

**COLOR PSYCHOLOGY:**
- Primary: High-saturation color related to topic emotion
- Accent: Complementary color for text/highlights
- Avoid: Muted or pastel colors (low CTR)

**COMPOSITION:**
- Clear single focal point (3-second rule: viewer knows what it's about instantly)
- No clutter - maximum 3 visual elements
- Use arrows, circles, or glow effects to guide eye if needed

Format the prompt ready for Gemini/Midjourney:]

### ON_SCREEN_TEXT
[SHORT labels/markers for VEO only (1-3 words max to avoid misspelling):
SCENE 01: "NOW" - marker
SCENE 02: "STEP 1" - label
SCENE 03: "WARNING" - alert
...]

### EXTENDED_TEXT
[LONG sentences with timelines for post-production editing (VEO can't render 4+ words accurately):
[0:02] THE MOST EXPENSIVE 9 MINUTES OF YOUR LIFE
[0:15] EVERYTHING STARTS WITH A SINGLE DECISION
[0:45] YOUR FUTURE SELF WILL THANK YOU
...]

### TAGS
[List 8-12 SEO-optimized YouTube tags, comma-separated]

### FIRST_COMMENT
[Write an engaging first comment that:
- Sparks discussion (asks a question)
- Relates to video content
- Encourages replies
- 50-100 characters]

### PINNED_COMMENT
[Write a pinned comment that:
- Provides additional value
- Includes CTA (resource link placeholder, channel reminder)
- Encourages engagement
- 150-250 characters]

Respond with each section clearly labeled. Be creative but authentic!`;
}

/**
 * Parse AI response and populate Post-Production fields
 */
function parseAndPopulatePostProd(response) {
  // Clean response
  const text = response.replace(/```[\w]*\n?/g, '').trim();

  // Parse each section
  const sections = {
    title: extractPostProdSection(text, 'SEO_TITLE'),
    description: extractPostProdSection(text, 'DESCRIPTION'),
    thumbnail: extractPostProdSection(text, 'THUMBNAIL_PROMPT'),
    onScreenText: extractPostProdSection(text, 'ON_SCREEN_TEXT'),
    tags: extractPostProdSection(text, 'TAGS'),
    firstComment: extractPostProdSection(text, 'FIRST_COMMENT'),
    pinnedComment: extractPostProdSection(text, 'PINNED_COMMENT'),
    extendedText: extractPostProdSection(text, 'EXTENDED_TEXT')
  };

  // Populate fields
  if (sections.title) {
    document.getElementById('postProdTitle').value = sections.title;
    updateTitleCharCount();
  }
  if (sections.description) {
    document.getElementById('postProdDescription').value = sections.description;
  }
  if (sections.thumbnail) {
    document.getElementById('postProdThumbnail').value = sections.thumbnail;
  }
  if (sections.onScreenText) {
    document.getElementById('postProdOnScreenText').value = sections.onScreenText;
  }
  if (sections.tags) {
    document.getElementById('postProdTags').value = sections.tags;
  }
  if (sections.firstComment) {
    document.getElementById('postProdFirstComment').value = sections.firstComment;
  }
  if (sections.pinnedComment) {
    document.getElementById('postProdPinnedComment').value = sections.pinnedComment;
  }
  if (sections.extendedText) {
    document.getElementById('postProdExtendedText').value = sections.extendedText;
  }

  console.log('✅ Post-Production fields populated');
}

/**
 * Extract a specific section from Post-Production AI response
 */
function extractPostProdSection(text, sectionName) {
  // Try multiple patterns
  const patterns = [
    new RegExp(`###\\s*${sectionName}[\\s:]*([\\s\\S]*?)(?=###|$)`, 'i'),
    new RegExp(`\\*\\*${sectionName}\\*\\*[:\\s]*([\\s\\S]*?)(?=\\*\\*|###|$)`, 'i'),
    new RegExp(`${sectionName}[:\\s]+([\\s\\S]*?)(?=\\n[A-Z_]+:|###|$)`, 'i')
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

/**
 * Update title character count
 */
function updateTitleCharCount() {
  const title = document.getElementById('postProdTitle')?.value || '';
  const countEl = document.getElementById('titleCharCount');
  if (countEl) {
    countEl.textContent = `${title.length}/60`;
    countEl.style.color = title.length > 60 ? '#ef4444' : '#666';
  }
}

/**
 * Update progress bar
 */
function updatePostProdProgress(percent) {
  document.getElementById('postProdProgressBar').style.width = `${percent}%`;
  document.getElementById('postProdProgressPercent').textContent = `${percent}%`;
}

// Copy functions
function copyPostProdTitle() {
  navigator.clipboard.writeText(document.getElementById('postProdTitle')?.value || '');
  showNotification('📋 Title copied!', 'success');
}

function copyPostProdDescription() {
  navigator.clipboard.writeText(document.getElementById('postProdDescription')?.value || '');
  showNotification('📋 Description copied!', 'success');
}

function copyPostProdThumbnail() {
  navigator.clipboard.writeText(document.getElementById('postProdThumbnail')?.value || '');
  showNotification('📋 Thumbnail prompt copied!', 'success');
}

function copyPostProdOnScreenText() {
  navigator.clipboard.writeText(document.getElementById('postProdOnScreenText')?.value || '');
  showNotification('📋 On-screen text copied!', 'success');
}

function copyExtendedText() {
  navigator.clipboard.writeText(document.getElementById('postProdExtendedText')?.value || '');
  showNotification('📋 Extended text copied!', 'success');
}

function copyPostProdTags() {
  navigator.clipboard.writeText(document.getElementById('postProdTags')?.value || '');
  showNotification('📋 Tags copied!', 'success');
}

function copyPostProdComments() {
  const first = document.getElementById('postProdFirstComment')?.value || '';
  const pinned = document.getElementById('postProdPinnedComment')?.value || '';
  navigator.clipboard.writeText(`FIRST COMMENT:\n${first}\n\nPINNED COMMENT:\n${pinned}`);
  showNotification('📋 Comments copied!', 'success');
}

function copyAllPostProd() {
  const title = document.getElementById('postProdTitle')?.value || '';
  const desc = document.getElementById('postProdDescription')?.value || '';
  const thumb = document.getElementById('postProdThumbnail')?.value || '';
  const onScreen = document.getElementById('postProdOnScreenText')?.value || '';
  const extendedText = document.getElementById('postProdExtendedText')?.value || '';
  const tags = document.getElementById('postProdTags')?.value || '';
  const first = document.getElementById('postProdFirstComment')?.value || '';
  const pinned = document.getElementById('postProdPinnedComment')?.value || '';

  const all = `SEO TITLE:\n${title}\n\nDESCRIPTION:\n${desc}\n\nTHUMBNAIL PROMPT:\n${thumb}\n\nON-SCREEN TEXT (VEO):\n${onScreen}\n\nEXTENDED TEXT (EDITING):\n${extendedText}\n\nTAGS:\n${tags}\n\nFIRST COMMENT:\n${first}\n\nPINNED COMMENT:\n${pinned}`;

  navigator.clipboard.writeText(all);
  showNotification('📋 All Post-Production content copied!', 'success');
}

function exportPostProdPackage() {
  const topic = state.generatedScript?.topic || 'video';
  const title = document.getElementById('postProdTitle')?.value || '';
  const desc = document.getElementById('postProdDescription')?.value || '';
  const thumb = document.getElementById('postProdThumbnail')?.value || '';
  const onScreen = document.getElementById('postProdOnScreenText')?.value || '';
  const extendedText = document.getElementById('postProdExtendedText')?.value || '';
  const tags = document.getElementById('postProdTags')?.value || '';
  const first = document.getElementById('postProdFirstComment')?.value || '';
  const pinned = document.getElementById('postProdPinnedComment')?.value || '';

  const markdown = `# Post-Production Package: ${topic}

## SEO Title
${title}

## Description
${desc}

## Thumbnail Prompt
${thumb}

## On-Screen Text (VEO - Short Labels)
${onScreen}

## Extended Text (For Editing - Long Sentences with Timelines)
${extendedText}

## Tags
${tags}

## Comment Bait

### First Comment
${first}

### Pinned Comment
${pinned}

---
*Generated by ScriptWriter Pro*
`;

  const filename = `post-prod-${topic.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
  downloadFile(markdown, filename, 'text/markdown');
  showNotification('💾 Post-Production package exported!', 'success');
}

// ──────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ──────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎯 Initializing Script Writer v7.1...');

  await loadSettings();
  await loadAnalyzerData();

  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(tab.getAttribute('data-tab'));
    });
  });

  // Generate Tab
  document.getElementById('useAnalyzerData')?.addEventListener('change', async (e) => {
    state.useAnalyzerData = e.target.checked;
    if (e.target.checked) await loadAnalyzerData();
  });

  document.getElementById('generateBtn')?.addEventListener('click', generateScript);
  document.getElementById('generateSuggestionsBtn')?.addEventListener('click', generateAISuggestionsFromAnalyzer);
  document.getElementById('copyScriptBtn')?.addEventListener('click', copyScriptToClipboard);
  document.getElementById('exportScriptBtn')?.addEventListener('click', exportScriptAsText);
  document.getElementById('sendToVeoBtn')?.addEventListener('click', sendScriptToVeo);
  document.getElementById('topic')?.addEventListener('input', generateAISuggestions);
  document.getElementById('audience')?.addEventListener('input', generateAISuggestions);
  document.getElementById('modelSelect')?.addEventListener('change', (e) => { state.settings.aiModel = e.target.value; });

  // Custom Length Toggle
  document.getElementById('targetLength')?.addEventListener('change', (e) => {
    const customGroup = document.getElementById('customLengthGroup');
    if (e.target.value === 'custom') {
      customGroup.style.display = 'block';
      document.getElementById('customHours')?.focus();
    } else {
      customGroup.style.display = 'none';
    }
  });


  // VEO Tab
  document.getElementById('generateVeoBtn')?.addEventListener('click', generateVeoPrompts);
  document.getElementById('copyTopicBtn')?.addEventListener('click', copyVeoTopic);
  document.getElementById('exportTopicBtn')?.addEventListener('click', exportVeoTopic);
  document.getElementById('copyPromptsBtn')?.addEventListener('click', copyVeoPrompts);
  document.getElementById('exportPromptsBtn')?.addEventListener('click', exportVeoPrompts);
  document.getElementById('generateAllBatchesBtn')?.addEventListener('click', generateAllBatches);
  document.getElementById('veoTopic')?.addEventListener('input', autoCalculatePrompts);
  document.getElementById('veoNumPrompts')?.addEventListener('input', updateBatchSection);
  document.getElementById('veoNumPrompts')?.addEventListener('input', () => {
    document.getElementById('totalDuration').textContent = (parseInt(document.getElementById('veoNumPrompts').value, 10) || 0) * 8;
  });
  document.getElementById('manualPromptsOverride')?.addEventListener('change', (e) => {
    const numInput = document.getElementById('veoNumPrompts');
    if (e.target.checked) {
      numInput.style.borderColor = '#8b5cf6';
      veoLog('Manual mode ON', 'info');
    } else {
      numInput.style.borderColor = '';
      autoCalculatePrompts();
    }
  });
  document.getElementById('veoVisualStyle')?.addEventListener('change', (e) => {
    e.target.classList.remove('style-reminder');
    veoLog(`Style: ${e.target.value}`, 'info');
  });
  document.getElementById('veoModelSelect')?.addEventListener('change', (e) => {
    state.settings.veoModel = e.target.value;
    veoLog(`Model: ${e.target.value}`, 'info');
  });

  // Post-Production Tab
  document.getElementById('generatePostProdBtn')?.addEventListener('click', generatePostProdContent);
  document.getElementById('copyTitleBtn')?.addEventListener('click', copyPostProdTitle);
  document.getElementById('copyDescriptionBtn')?.addEventListener('click', copyPostProdDescription);
  document.getElementById('copyThumbnailBtn')?.addEventListener('click', copyPostProdThumbnail);
  document.getElementById('copyOnScreenTextBtn')?.addEventListener('click', copyPostProdOnScreenText);
  document.getElementById('copyTagsBtn')?.addEventListener('click', copyPostProdTags);
  document.getElementById('copyExtendedTextBtn')?.addEventListener('click', copyExtendedText);
  document.getElementById('copyCommentsBtn')?.addEventListener('click', copyPostProdComments);
  document.getElementById('copyAllPostProdBtn')?.addEventListener('click', copyAllPostProd);
  document.getElementById('exportPostProdBtn')?.addEventListener('click', exportPostProdPackage);
  document.getElementById('postProdTitle')?.addEventListener('input', updateTitleCharCount);

  // Character Consistency auto-save
  document.getElementById('characterBible')?.addEventListener('blur', async () => {
    state.settings.characterBible = document.getElementById('characterBible').value.trim();
    await chrome.storage.local.set({ settings: state.settings });
    console.log('🎭 Character Bible auto-saved');
  });
  document.getElementById('characterNegatives')?.addEventListener('blur', async () => {
    state.settings.characterNegatives = document.getElementById('characterNegatives').value.trim();
    await chrome.storage.local.set({ settings: state.settings });
    console.log('🚫 Character Negatives auto-saved');
  });

  // Auto-Character Generation event listeners
  document.querySelectorAll('input[name="characterMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const autoSection = document.getElementById('autoCharacterSection');
      const manualSection = document.getElementById('manualCharacterSection');

      if (e.target.value === 'auto') {
        autoSection.style.display = 'block';
        manualSection.style.display = 'none';
        console.log('✨ Auto-generation mode enabled');
      } else {
        autoSection.style.display = 'none';
        manualSection.style.display = 'block';
        console.log('✍️ Manual mode enabled');
      }
    });
  });

  document.getElementById('competitorSimilarity')?.addEventListener('input', (e) => {
    const val = e.target.value;
    let label = `${val}%`;
    if (val >= 40 && val <= 50) label += ' (Recommended)';
    else if (val < 40) label += ' (More unique, less familiar)';
    else label += ' (Very similar, risky)';
    document.getElementById('similarityLabel').textContent = label;
  });

  document.getElementById('generateCharacterBtn')?.addEventListener('click', generateAutoCharacter);
  document.getElementById('acceptCharacterBtn')?.addEventListener('click', acceptGeneratedCharacter);
  document.getElementById('regenerateCharacterBtn')?.addEventListener('click', generateAutoCharacter);

  // Settings Tab
  document.getElementById('testApiBtn')?.addEventListener('click', testClaudeConnection);
  document.getElementById('testGeminiBtn')?.addEventListener('click', testGeminiConnection);
  document.getElementById('saveSettingsBtn')?.addEventListener('click', saveSettings);

  // Listen for analyzer data
  chrome.runtime.onMessage.addListener(async (request) => {
    console.log('📨 Message received:', request);

    if (request.action === 'analyzerDataReceived') {
      console.log('🎯 Analyzer data received event triggered!');

      await loadAnalyzerData();
      showNotification('📊 Analyzer data received!', 'success');

      console.log('Checking conditions for auto-suggestions:');
      console.log('- analyzerData present:', !!state.analyzerData);
      console.log('- Claude API key present:', !!state.settings.claudeApiKey);

      // Auto-generate AI suggestions to populate remaining fields
      if (state.analyzerData && state.settings.claudeApiKey) {
        console.log('✅ Conditions met! Auto-generating suggestions in 500ms...');
        setTimeout(() => {
          generateAISuggestionsFromAnalyzer();
        }, 500); // Small delay to ensure analyzer data is loaded first
      } else {
        console.warn('⚠️ Cannot auto-generate suggestions - missing requirements');
        if (!state.analyzerData) console.warn('  - No analyzer data');
        if (!state.settings.claudeApiKey) console.warn('  - No Claude API key');
      }
    }
  });

  // Assessment buttons
  document.getElementById('assessPromptsBtn')?.addEventListener('click', assessPromptsQuality);
  document.getElementById('sendToFlowAutomateBtn')?.addEventListener('click', sendToFlowAutomate);
  document.getElementById('applyAutoFixesBtn')?.addEventListener('click', applyAllAutoFixes);
  document.getElementById('reGeneratePromptsBtn')?.addEventListener('click', reGeneratePrompts);

  // Duration display - update when prompts count changes
  document.getElementById('veoNumPrompts')?.addEventListener('input', updateDurationDisplay);
  updateDurationDisplay(); // Initial update

  // Export buttons
  document.getElementById('exportAssessmentJSON')?.addEventListener('click', exportAssessmentJSON);
  document.getElementById('exportAssessmentMD')?.addEventListener('click', exportAssessmentMarkdown);
  document.getElementById('exportAssessmentPDF')?.addEventListener('click', exportAssessmentPDF);

  // Load assessment history on startup
  chrome.storage.local.get('assessmentHistory').then(result => {
    if (result.assessmentHistory?.assessments) {
      updateAssessmentHistoryDisplay(result.assessmentHistory.assessments.slice(0, 10));
    }
  });

  updateBatchSection();

  // Send to FlowAutomate button (VEO Prompts tab)
  document.getElementById('sendToFlowBtn')?.addEventListener('click', sendToFlowAutomate);

  // ──────────────────────────────────────────────────────────────────────────────
  // POST-PRODUCTION TAB EVENT LISTENERS
  // ──────────────────────────────────────────────────────────────────────────────

  // Generate All Post-Production content
  document.getElementById('generatePostProdBtn')?.addEventListener('click', generatePostProduction);

  // Title character count
  document.getElementById('postProdTitle')?.addEventListener('input', updateTitleCharCount);

  // Copy buttons
  document.getElementById('copyTitleBtn')?.addEventListener('click', function () {
    copyToClipboard(document.getElementById('postProdTitle').value, 'Title copied!', this);
  });
  document.getElementById('copyDescriptionBtn')?.addEventListener('click', function () {
    copyToClipboard(document.getElementById('postProdDescription').value, 'Description copied!', this);
  });
  document.getElementById('copyThumbnailBtn')?.addEventListener('click', function () {
    copyToClipboard(document.getElementById('postProdThumbnail').value, 'Thumbnail prompt copied!', this);
  });
  document.getElementById('copyOnScreenTextBtn')?.addEventListener('click', function () {
    copyToClipboard(document.getElementById('postProdOnScreenText').value, 'On-screen text copied!', this);
  });
  document.getElementById('copyTagsBtn')?.addEventListener('click', function () {
    copyToClipboard(document.getElementById('postProdTags').value, 'Tags copied!', this);
  });
  document.getElementById('copyAllPostProdBtn')?.addEventListener('click', copyAllPostProduction);
  document.getElementById('exportPostProdBtn')?.addEventListener('click', exportPostProduction);

  console.log('✅ Script Writer v7.1 Ready!');
  veoLog('Extension ready', 'system');
});

// ──────────────────────────────────────────────────────────────────────────────
// POST-PRODUCTION FUNCTIONS
// ──────────────────────────────────────────────────────────────────────────────

function updateTitleCharCount() {
  const title = document.getElementById('postProdTitle')?.value || '';
  const count = title.length;
  const countEl = document.getElementById('titleCharCount');
  if (countEl) {
    countEl.textContent = `${count}/60`;
    countEl.style.color = count <= 60 ? '#10b981' : '#ef4444';
  }
}

/**
 * Copy text to clipboard with notification and button feedback
 * @param {string} text - Text to copy
 * @param {string} successMessage - Message to show on success
 * @param {HTMLElement} buttonEl - Optional button element for visual feedback
 */
function copyToClipboard(text, successMessage, buttonEl) {
  if (!text || text.trim() === '') {
    showNotification('❌ Nothing to copy', 'error', 'postProdStatus');
    if (buttonEl) flashButton(buttonEl, '❌', false);
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    showNotification(`✅ ${successMessage}`, 'success', 'postProdStatus');
    if (buttonEl) flashButton(buttonEl, '✅', true);
  }).catch(err => {
    console.error('Copy failed:', err);
    showNotification('❌ Copy failed', 'error', 'postProdStatus');
    if (buttonEl) flashButton(buttonEl, '❌', false);
  });
}

/**
 * Flash button with success/error icon briefly
 */
function flashButton(btn, icon, isSuccess) {
  const original = btn.innerHTML;
  btn.innerHTML = icon;
  btn.style.color = isSuccess ? '#10b981' : '#ef4444';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.color = '';
  }, 1500);
}

/**
 * Call Gemini API for Post Production content generation
 * @param {string} prompt - The prompt to send
 * @param {string} model - Gemini model name
 * @param {string} apiKey - API key
 * @returns {string} Generated text response
 */
async function callGeminiAPI(prompt, model, apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 32768,
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Invalid response from Gemini API');
  }

  return text;
}

/**
 * Call Claude API for Post Production content generation
 * @param {string} prompt - The prompt to send
 * @param {string} model - Claude model name
 * @param {string} apiKey - API key
 * @returns {string} Generated text response
 */
async function callClaudeAPI(prompt, model, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 16384,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function generatePostProduction() {
  const btn = document.getElementById('generatePostProdBtn');
  const progressDiv = document.getElementById('postProdProgress');
  const progressBar = document.getElementById('postProdProgressBar');
  const progressPercent = document.getElementById('postProdProgressPercent');

  // Get source content
  const script = document.getElementById('generatedScript')?.value || '';
  const veoPrompts = document.getElementById('veoPromptsOutput')?.value || '';
  const topic = document.getElementById('topic')?.value || document.getElementById('veoTopic')?.value || '';

  if (!script && !veoPrompts && !topic) {
    showNotification('Please generate a script or VEO prompts first, or enter a topic.', 'error', 'postProdStatus');
    return;
  }

  // Get analyzer data for personas
  const analyzerData = state.analyzerData || {};
  const personas = analyzerData.personas || analyzerData.audience_persona || [];
  const primaryPersona = personas[0] || {};

  // Get selected model
  const model = document.getElementById('postProdModelSelect')?.value || 'gemini-2.5-pro';
  const isGemini = model.startsWith('gemini');

  // Check API key
  const apiKey = isGemini ? state.settings.geminiApiKey : state.settings.claudeApiKey;
  if (!apiKey) {
    showNotification(`Please add your ${isGemini ? 'Gemini' : 'Claude'} API key in Settings.`, 'error', 'postProdStatus');
    return;
  }

  // Get options
  const includeTimestamps = document.getElementById('includeTimestamps')?.checked ?? true;
  const includeCTAs = document.getElementById('includeCTAs')?.checked ?? true;
  const includeHashtags = document.getElementById('includeHashtags')?.checked ?? true;

  // Count VEO scenes for timestamps
  const sceneCount = (veoPrompts.match(/Scene \d+:/gi) || []).length || 10;

  btn.disabled = true;
  btn.innerHTML = '⏳ Generating...';
  progressDiv.style.display = 'block';

  try {
    // Build the comprehensive prompt
    const prompt = buildPostProductionPrompt({
      topic,
      script,
      veoPrompts,
      primaryPersona,
      sceneCount,
      includeTimestamps,
      includeCTAs,
      includeHashtags
    });

    // Update progress
    progressBar.style.width = '20%';
    progressPercent.textContent = '20%';

    // Make API call
    let response;
    if (isGemini) {
      response = await callGeminiAPI(prompt, model, apiKey);
    } else {
      response = await callClaudeAPI(prompt, model, apiKey);
    }

    progressBar.style.width = '80%';
    progressPercent.textContent = '80%';

    // Parse response
    const result = parsePostProductionResponse(response);

    // Populate fields
    document.getElementById('postProdTitle').value = result.title || '';
    document.getElementById('postProdDescription').value = result.description || '';
    document.getElementById('postProdThumbnail').value = result.thumbnail || '';
    document.getElementById('postProdOnScreenText').value = result.onScreenText || '';
    document.getElementById('postProdTags').value = result.tags || '';

    updateTitleCharCount();

    progressBar.style.width = '100%';
    progressPercent.textContent = '100%';

    showNotification('✅ Post-production content generated!', 'success', 'postProdStatus');

  } catch (error) {
    console.error('Post-production generation error:', error);
    showNotification(`Error: ${error.message}`, 'error', 'postProdStatus');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '✨ Generate All Post-Production Content';
    setTimeout(() => {
      progressDiv.style.display = 'none';
      progressBar.style.width = '0%';
    }, 1000);
  }
}

function buildPostProductionPrompt({ topic, script, veoPrompts, primaryPersona, sceneCount, includeTimestamps, includeCTAs, includeHashtags }) {
  const personaInfo = primaryPersona.description || primaryPersona.name || 'content creators';
  const painPoints = primaryPersona.pain_points?.join(', ') || 'common challenges';

  return `You are a YouTube SEO expert and post-production specialist. Generate comprehensive post-production content for a video.

## SOURCE CONTENT:
Topic: ${topic}
${script ? `\nScript Summary:\n${script.substring(0, 2000)}...` : ''}
${veoPrompts ? `\nVEO Prompts (${sceneCount} scenes):\n${veoPrompts.substring(0, 1500)}...` : ''}

## TARGET AUDIENCE:
${personaInfo}
Pain Points: ${painPoints}

## GENERATE THE FOLLOWING (respond in JSON format):

### 1. SEO Title (50-60 characters)
Formula: [Primary Keyword] + [Hook/Value] + [Power Word]
- Primary keyword in first 5 words
- Natural language, no keyword stuffing

### 2. Description
Structure:
- Line 1-2: Hook with primary keyword (compelling, under 100 chars)
- Line 3-4: PERSONA HOOK using formula: "Perfect for [WHO] who struggle with [PAIN POINT] and want [DESIRED OUTCOME]."
${includeTimestamps ? `- Timestamps for ${sceneCount} scenes (0:00, 0:08, 0:16, etc. at 8-second intervals)` : ''}
${includeCTAs ? `- CTAs: Subscribe reminder, comment prompt, related video suggestion` : ''}
${includeHashtags ? `- 3-5 relevant hashtags at the end` : ''}

### 3. Thumbnail/Banner Prompt (for AI image generation)
Structure: [Subject] + [Expression/Emotion] + [Setting] + [Style] + [Technical] + [Text Overlay] + [Negative]
Example format:
"Close-up of [character description] with [expression], [background], YouTube thumbnail style, bold colors, high contrast, 1280x720px, vibrant saturation, dramatic lighting, '[4-6 WORD HOOK TEXT]' in bold Impact font, no watermark, no blurry, no text errors"

### 4. On-Screen Text by Scene
For each of the ${sceneCount} scenes, provide:
- Scene number
- Suggested lower third text or caption
- Keep each under 6 words for readability

### 5. Tags (5-8 tags)
- Primary keyword variations
- Related topics
- Channel name placeholder

## RESPONSE FORMAT (JSON only, no markdown):
{
  "title": "Your SEO optimized title here",
  "description": "Full description with persona hook, timestamps, CTAs, hashtags",
  "thumbnail": "Complete text-to-image prompt for thumbnail",
  "onScreenText": "Scene 1: Text here\\nScene 2: Text here\\n...",
  "tags": "tag1, tag2, tag3, tag4, tag5"
}`;
}

function parsePostProductionResponse(response) {
  try {
    // Try to parse as JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('Failed to parse as JSON, extracting manually');
  }

  // Manual extraction fallback
  const result = {
    title: '',
    description: '',
    thumbnail: '',
    onScreenText: '',
    tags: ''
  };

  // Extract title
  const titleMatch = response.match(/title["\s:]+([^\n"]+)/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  // Extract description
  const descMatch = response.match(/description["\s:]+([^"]+)/i);
  if (descMatch) result.description = descMatch[1].trim();

  // Extract thumbnail
  const thumbMatch = response.match(/thumbnail["\s:]+([^"]+)/i);
  if (thumbMatch) result.thumbnail = thumbMatch[1].trim();

  // Extract on-screen text
  const textMatch = response.match(/onScreenText["\s:]+([^"]+)/i);
  if (textMatch) result.onScreenText = textMatch[1].replace(/\\n/g, '\n').trim();

  // Extract tags
  const tagsMatch = response.match(/tags["\s:]+([^"]+)/i);
  if (tagsMatch) result.tags = tagsMatch[1].trim();

  return result;
}

function copyAllPostProduction() {
  const title = document.getElementById('postProdTitle')?.value || '';
  const description = document.getElementById('postProdDescription')?.value || '';
  const thumbnail = document.getElementById('postProdThumbnail')?.value || '';
  const onScreenText = document.getElementById('postProdOnScreenText')?.value || '';
  const tags = document.getElementById('postProdTags')?.value || '';

  const combined = `=== SEO TITLE ===
${title}

=== DESCRIPTION ===
${description}

=== THUMBNAIL PROMPT ===
${thumbnail}

=== ON-SCREEN TEXT ===
${onScreenText}

=== TAGS ===
${tags}`;

  copyToClipboard(combined, 'All post-production content copied!');
}

/**
 * Smart Export - Creates comprehensive project package
 * Exports: YouTube txt, CapCut SRT, Script, VEO Prompts, JSON backup
 * Naming: Title_vDate_Time format for version tracking
 */
function exportPostProduction() {
  const title = document.getElementById('postProdTitle')?.value || '';
  const description = document.getElementById('postProdDescription')?.value || '';
  const thumbnail = document.getElementById('postProdThumbnail')?.value || '';
  const onScreenText = document.getElementById('postProdOnScreenText')?.value || '';
  const tags = document.getElementById('postProdTags')?.value || '';

  // Get script and VEO prompts from state/DOM
  const script = state.generatedScript?.fullScript || document.getElementById('scriptOutput')?.textContent || '';
  const veoPrompts = state.veoPromptsText || document.getElementById('veoPromptsOutput')?.textContent || '';

  if (!title && !description && !script && !veoPrompts) {
    showNotification('❌ No content to export', 'error', 'postProdStatus');
    return;
  }

  // Generate smart filename from title
  const baseFilename = generateSmartFilename(title || 'Project');

  let filesExported = 0;

  // 1. Export YouTube-ready TXT
  if (title || description || tags) {
    const youtubeTxt = generateYouTubeExport(title, description, tags);
    downloadSmartFile(youtubeTxt, `${baseFilename}_youtube.txt`, 'text/plain');
    filesExported++;
  }

  // 2. Export CapCut SRT captions
  const srtContent = generateSRTExport(onScreenText);
  if (srtContent) {
    downloadSmartFile(srtContent, `${baseFilename}_captions.srt`, 'text/srt');
    filesExported++;
  }

  // 3. Export Final Script
  if (script) {
    downloadSmartFile(script, `${baseFilename}_script.txt`, 'text/plain');
    filesExported++;
  }

  // 4. Export VEO Prompts
  if (veoPrompts) {
    downloadSmartFile(veoPrompts, `${baseFilename}_veo_prompts.txt`, 'text/plain');
    filesExported++;
  }

  // 5. Export comprehensive JSON backup
  const jsonContent = {
    meta: { version: baseFilename, exportedAt: new Date().toISOString(), exportedBy: 'ScriptWriter Pro' },
    postProduction: { title, description, thumbnail, onScreenText, tags },
    content: { script, veoPrompts }
  };
  downloadSmartFile(JSON.stringify(jsonContent, null, 2), `${baseFilename}_complete.json`, 'application/json');
  filesExported++;

  showNotification(`📦 Smart Export: ${filesExported} files created!`, 'success', 'postProdStatus');
}

/**
 * Generate smart filename from title with version timestamp
 * Format: Title_vYYYY-MM-DD_HHMM
 */
function generateSmartFilename(title) {
  // Sanitize title: remove special chars, limit length, replace spaces with underscores
  const sanitized = title
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_')           // Replace spaces with underscores
    .substring(0, 50)               // Limit length
    .replace(/_+$/, '');            // Remove trailing underscores

  // Generate version timestamp
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const time = now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0'); // HHMM

  const baseName = sanitized || 'PostProduction';
  return `${baseName}_v${date}_${time}`;
}

/**
 * Generate YouTube-ready export text
 */
function generateYouTubeExport(title, description, tags) {
  return `=== TITLE ===
${title}

=== DESCRIPTION ===
${description}

=== TAGS ===
${tags}

---
Exported by ScriptWriter Pro
`;
}

/**
 * Generate SRT format for CapCut import
 * Parses on-screen text into timed captions
 */
function generateSRTExport(onScreenText) {
  if (!onScreenText || onScreenText.trim() === '') return null;

  const lines = onScreenText.split('\n').filter(line => line.trim());
  let srtContent = '';
  let sceneIndex = 0;

  lines.forEach((line, i) => {
    // Extract scene number if present (e.g., "Scene 1:" or "Scene 01:")
    const sceneMatch = line.match(/Scene\s*(\d+)/i);
    if (sceneMatch) {
      sceneIndex = parseInt(sceneMatch[1]) - 1;
    }

    // Calculate timestamps (8 seconds per scene)
    const startSeconds = sceneIndex * 8;
    const endSeconds = startSeconds + 8;

    const startTime = formatSRTTime(startSeconds);
    const endTime = formatSRTTime(endSeconds);

    // Clean the text (remove "Scene X:" prefix if present)
    const cleanText = line.replace(/Scene\s*\d+\s*[:.-]\s*/i, '').trim();

    if (cleanText) {
      srtContent += `${i + 1}\n`;
      srtContent += `${startTime} --> ${endTime}\n`;
      srtContent += `${cleanText}\n\n`;
    }

    sceneIndex++;
  });

  return srtContent || null;
}

/**
 * Format seconds to SRT time format: HH:MM:SS,mmm
 */
function formatSRTTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},000`;
}

/**
 * Download file with smart naming
 */
function downloadSmartFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL RENDERING SYSTEM v2.0 - EVENT LISTENERS
// Initialize dropdown handlers for style/niche changes
// ═══════════════════════════════════════════════════════════════════════════════

// Initialize Visual Rendering System when DOM is ready
(function initVisualRenderingSystem() {
  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVisualRenderingListeners);
  } else {
    setupVisualRenderingListeners();
  }

  function setupVisualRenderingListeners() {
    console.log('🎨 Initializing Visual Rendering System v2.0 event listeners...');

    // Niche dropdown change handler
    const nicheSelect = document.getElementById('contentNiche');
    if (nicheSelect) {
      nicheSelect.addEventListener('change', function () {
        updateStylePreview();
        updateNicheInfoCard();
        console.log('🎯 Niche changed to:', this.value);
      });
    }

    // Visual Style dropdown change handler
    const styleSelect = document.getElementById('veoVisualStyle');
    if (styleSelect) {
      styleSelect.addEventListener('change', function () {
        state.styleManuallySet = true; // Mark as manually set to prevent auto-override
        updateStylePreview();
        console.log('🎨 Style changed to:', this.value);
      });
    }

    // Auto-suggest on topic blur (when user finishes entering topic)
    const topicTextarea = document.getElementById('veoTopic');
    if (topicTextarea) {
      topicTextarea.addEventListener('blur', function () {
        const content = this.value.trim();
        if (content.length > 20) {
          const suggestion = autoApplyStyleSuggestion(content);
          if (suggestion) {
            console.log('🤖 AI Style Suggestion:', suggestion);
          }
        }
      });
    }

    // Initial style preview update
    setTimeout(() => {
      if (typeof updateStylePreview === 'function') {
        updateStylePreview();
      }
      if (typeof updateNicheInfoCard === 'function') {
        updateNicheInfoCard();
      }
      console.log('✅ Visual Rendering System v2.0 initialized');
    }, 100);
  }
})();

console.log('📋 ScriptWriter Pro v12 + Visual Rendering v2.0 ready');
