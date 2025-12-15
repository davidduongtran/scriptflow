// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL RENDERING SYSTEM v2.0 - COMPLETE UPGRADE
// Single file containing all new code for ScriptWriter Pro
// 
// INTEGRATION INSTRUCTIONS:
// 1. Find VISUAL_STYLE_SPECS in sidepanel.js (~line 2148)
// 2. Replace it and add all code from this file
// 3. Update HTML dropdowns as specified
// 4. Add event listeners in DOMContentLoaded
// ═══════════════════════════════════════════════════════════════════════════════

// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║ SECTION 1: ENHANCED VISUAL_STYLE_SPECS                                        ║
// ║ Replace existing VISUAL_STYLE_SPECS (~line 2148 in sidepanel.js)              ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

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

  // ═══════════════════════════════════════════════════════════════════════════════
  // DEFAULT FALLBACK
  // ═══════════════════════════════════════════════════════════════════════════════

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

// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║ SECTION 2: NICHE DATABASE                                                     ║
// ║ Add after VISUAL_STYLE_SPECS                                                  ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

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

// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║ SECTION 3: CONTENT CHARACTERISTICS (For Auto-Detection)                       ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

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

// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║ SECTION 4: HELPER FUNCTIONS                                                   ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

/**
 * Get style specification by name
 */
function getStyleSpec(styleName) {
  return VISUAL_STYLE_SPECS[styleName] || VISUAL_STYLE_SPECS['default'];
}

/**
 * Enhanced combineStyleDimensions - REPLACE existing function
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

// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║ SECTION 5: EVENT LISTENERS (Add to DOMContentLoaded)                          ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

/*
ADD THESE INSIDE YOUR EXISTING DOMContentLoaded:

// Style/Niche change listeners
const styleSelect = document.getElementById('veoVisualStyle');
const nicheSelect = document.getElementById('contentNiche');

if (styleSelect) {
  styleSelect.addEventListener('change', () => {
    state.styleManuallySet = true;
    updateStylePreview();
  });
}

if (nicheSelect) {
  nicheSelect.addEventListener('change', () => {
    if (nicheSelect.value === 'auto') {
      const topic = document.getElementById('veoTopic')?.value || '';
      if (topic.length >= 20) {
        const suggestion = suggestStyleUniversal(topic, null);
        if (suggestion.detectedNiche) {
          nicheSelect.value = suggestion.detectedNiche;
        }
      }
    }
    updateNicheInfoCard();
  });
}

// Auto-suggest on topic blur
const topicEl = document.getElementById('veoTopic');
if (topicEl) {
  topicEl.addEventListener('blur', () => {
    const content = topicEl.value;
    if (content.length >= 50) {
      autoApplyStyleSuggestion(content);
    }
  });
}

// Initial updates
updateStylePreview();
updateNicheInfoCard();
*/

// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║ SECTION 6: buildMasterPrompt() UPDATE                                         ║
// ║ Add Style Anchor injection at the beginning of the function                   ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝

/*
IN buildMasterPrompt(), ADD THIS AFTER THE ADAPTIVE DESIGN SECTION:

// ===== STYLE ANCHOR INTEGRATION =====
const niche = document.getElementById('contentNiche')?.value || 'finance';
const styleAnchor = getStyleAnchor(videoStyle, niche);

console.log('🎨 Style Configuration:', {
  style: videoStyle,
  niche: niche
});
// ===== END STYLE ANCHOR INTEGRATION =====

THEN, INCLUDE ${styleAnchor} IN THE RETURNED TEMPLATE AFTER "## User's Request"
*/

console.log('✅ Visual Rendering System v2.0 loaded - 22 styles, 14 niches, auto-detection enabled');
