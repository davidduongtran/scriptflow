/**
 * ScriptFlow - Visual Styles Data v2.0
 * Visual Rendering System with Technical DNA
 * 
 * Contains:
 * - VISUAL_STYLE_SPECS: 22+ visual style definitions with technical DNA
 * - HEX_TO_COLOR_NAME: 50+ hex-to-colorname mappings for VEO
 * - NICHE_DATABASE: 14 content niches with style rankings
 * - CONTENT_CHARACTERISTICS: Auto-detection signals for content types
 * 
 * @module data/visualStyles
 */
(function (TITAN) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // HEX TO COLOR NAME MAPPING
    // VEO renders raw hex codes as visible text - this converts them to descriptive names
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.hexToColorName = {
        // Blues
        '#2196F3': 'bright blue',
        '#1976D2': 'deep blue',
        '#03A9F4': 'sky blue',
        '#00BCD4': 'cyan',
        '#1A237E': 'navy blue',
        '#2563eb': 'corporate blue',
        '#64B5F6': 'soft blue',
        '#4a90d9': 'calming blue',
        // Greens
        '#4CAF50': 'fresh green',
        '#2E7D32': 'forest green',
        '#8BC34A': 'lime green',
        '#009688': 'teal',
        '#26A69A': 'teal green',
        '#22c55e': 'vibrant green',
        '#00ff88': 'neon green',
        // Reds/Oranges
        '#F44336': 'vibrant red',
        '#E53935': 'bold red',
        '#FF5722': 'deep orange',
        '#FF7043': 'coral orange',
        '#E91E63': 'hot pink',
        '#FF8A65': 'coral',
        '#ef4444': 'red',
        '#dc2626': 'crimson',
        // Yellows/Golds
        '#FFD700': 'golden yellow',
        '#FFC107': 'amber',
        '#FFEB3B': 'bright yellow',
        '#fbbf24': 'warm yellow',
        '#f59e0b': 'golden orange',
        '#d4af37': 'gold',
        // Purples
        '#9C27B0': 'purple',
        '#673AB7': 'deep purple',
        '#E1BEE7': 'lavender',
        '#b829dd': 'neon purple',
        '#8b5cf6': 'violet',
        // Pinks
        '#F8BBD9': 'soft pink',
        '#FFCCBC': 'soft peach',
        '#ff0080': 'hot pink',
        // Greys/Neutrals
        '#607D8B': 'slate grey',
        '#9E9E9E': 'medium grey',
        '#ECEFF1': 'light grey',
        '#6b7280': 'neutral grey',
        '#64748b': 'cool grey',
        '#1f1f1f': 'dark grey',
        '#2d2d2d': 'charcoal',
        '#0a0a0a': 'deep black',
        '#111827': 'near black',
        // Whites/Creams
        '#FFFFFF': 'white',
        '#ffffff': 'white',
        '#FFF8E1': 'warm cream',
        '#f5f5dc': 'cream',
        '#fafafa': 'soft white',
        '#fafaf9': 'off-white',
        '#f5e6d3': 'warm cream',
        // Teals
        '#1a535c': 'deep teal',
        '#0d9488': 'accent teal',
        '#00ffff': 'bright cyan',
        '#00d4ff': 'electric blue',
        '#B2DFDB': 'seafoam',
        // Special
        '#c9a9a6': 'muted rose',
        '#e8d4b8': 'warm beige',
        '#a67c52': 'muted gold',
        '#0f172a': 'dark navy'
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // VISUAL STYLE SPECIFICATIONS - 22+ Styles with Technical DNA
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.visualStyleSpecs = {
        // ═══════════════════════════════════════════════════════════════════════════════
        // 🎬 ANIMATION STYLES (9)
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

        'Ultra-Thin Stick Figure': {
            name: 'Ultra-Thin Stick Figure',
            category: 'Animation',
            technicalDNA: 'ultra-thin stick figure animation, delicate pencil-thin line-drawn characters with small circle heads, tiny dot eyes, simple curved line mouths, single-stroke minimal black lines (1-2px line weight maximum), pure white background, no fills, no color on characters, flat 2D style with no depth or perspective, clean minimalist line art aesthetic, expressive body language and gestures, natural fluid movement, hand-drawn animation feel, 24fps',
            promptPrefix: 'Stick figure animation. Ultra-thin line-drawn character with single-stroke minimal lines, small circle head, tiny dot eyes, simple curved mouth line, delicate pencil-thin black strokes only (1-2px line weight maximum) on pure white background. Flat 2D style with no depth. Minimalist line art aesthetic with expressive poses and natural fluid movement.',
            fps: '24fps',
            lighting: 'flat white background with no environmental lighting, no shadows cast by characters, uniform brightness, simple 2D flat lighting only',
            cameraWork: 'static framing, centered composition, locked-off camera, flat 2D framing with no perspective or depth',
            movementQuality: 'natural fluid movement, smooth transitions, simple 2D motion only',
            negativePrompts: 'no thick lines, no bold strokes, no heavy line weight, no marker lines, no brush strokes, no pen pressure variation, no color fills, no shading, no gradients, no complex details, no realistic textures, no 3D effects, no 3D perspective, no architectural detail, no realistic depth, no complex environments, no backgrounds other than white or simple flat shapes, no additional characters unless specified, no clothing details, no shadows on characters, no textured lines, no variable stroke width',
            backgroundStyle: 'pure white background preferred, or minimal flat 2D shapes (simple rectangles, basic outlines) with no perspective, no depth, no architectural detail',
            colorPalettes: {
                finance: 'ultra-thin black lines #212121 (1-2px) on white #FFFFFF background, optional green accent #4CAF50 for charts/arrows/money symbols (keep lines thin, maintain 1-2px weight)',
                psychology: 'ultra-thin black lines #212121 (1-2px) on white #FFFFFF background, optional warm red accent #E91E63 for hearts/emotional indicators (keep lines thin, maintain 1-2px weight)'
            },
            audioStrategy: 'upbeat background music with clear sound effects (whoosh for transitions, pop for emphasis), optional casual voiceover narration. Audio: cheerful indie music, subtle sound effects. No character dialogue unless critical.',
            financeRank: 9,
            psychologyRank: 8,
            bestFor: 'Simple explainers, educational content, relationship dynamics, abstract concepts, quick visuals, universal appeal, viral social content, budget-conscious production, minimalist storytelling',
            productionTips: [
                'Keep action simple - one clear motion per 8-second clip',
                'Use exaggerated gestures for emotional clarity',
                'Maintain identical ultra-thin character description across all scenes',
                'Pre-generate character reference images in consistent ultra-thin style',
                'Add "ultra-thin stick figure" before every character name in prompts',
                'Limit characters to 2-3 max per scene for clarity',
                'Keep backgrounds minimal - use pure white or simple flat 2D shapes only',
                'Avoid 3D perspective, depth, or architectural detail (forces thicker lines)',
                'Specify "1-2px line weight maximum" in every prompt',
                'Use "flat 2D style" language consistently to prevent depth rendering'
            ],
            thinLineKeywords: [
                'ultra-thin',
                'delicate pencil-thin',
                'single-stroke minimal lines',
                '1-2px line weight maximum',
                'flat 2D style',
                'no depth',
                'no perspective',
                'simple 2D flat'
            ]
        },

        'Stylized Stick Figure': {
            name: 'Stylized Stick Figure',
            category: 'Animation',
            technicalDNA: 'stylized stick figure animation, clean cartoon-style characters with medium-weight black outlines (4-6px stroke width), large circle heads with white fill, expressive small black dot eyes, simple curved line mouths showing emotions (smiles, open laughs), styled hair shapes (bob, tuft, ponytail), simple stick limbs with clean lines and gestural poses, gray fills allowed for clothing (dress, shirt), gradient colored backgrounds (purple, teal, blue, orange), stylized flat city silhouettes with simple geometric building shapes, flat colored ground surfaces, atmospheric depth with foreground/background layers, hand-drawn animation feel with smooth fluid movement, 24fps',
            promptPrefix: 'Stylized stick figure animation. Clean cartoon-style characters with medium-weight black outlines (4-6px), large circle heads with white fill, expressive dot eyes, simple curved mouth. Hand-drawn animation feel.',
            fps: '24fps',
            lighting: 'soft ambient lighting, subtle character rim light, atmospheric depth layers, flat cel-shaded style',
            cameraWork: 'static centered framing, medium shot composition, can include stylized backgrounds',
            movementQuality: 'smooth fluid cartoon animation, expressive body language and gestures, natural conversation feel',
            negativePrompts: 'no realistic textures, no complex shading, no 3D rendering, no photorealistic elements, no detailed facial features, no complex clothing patterns, no realistic proportions, no heavy crosshatching, no sketch lines, no ultra-thin lines (must be medium weight 4-6px)',
            backgroundStyle: 'gradient colored skies (purple #9C27B0 to teal #00BCD4, orange to pink, blue gradients), stylized flat city silhouettes with simple geometric skyscraper shapes, flat colored ground surfaces (magenta #E91E63, purple, teal), atmospheric layers for depth, simple geometric shapes allowed',
            colorPalettes: {
                finance: 'professional vibrant - gradient teal #00BCD4 to green #4CAF50 sky, navy city silhouettes, gray fills for business attire, magenta #E91E63 accents',
                psychology: 'warm emotional - gradient purple #9C27B0 to pink #E91E63 sky, soft blue city silhouettes, gray fills for casual clothing, warm coral accents'
            },
            audioStrategy: 'clear dialogue-focused mix, subtle background music at -12dB, scene-specific sound effects precisely synchronized, minimalist musical underscore supporting mood without competing',
            financeRank: 9,
            psychologyRank: 9,
            bestFor: 'Interview/dialogue scenes, social media shorts (TikTok, Reels, YouTube Shorts), expressive storytelling, character-driven explainers, scene-based narratives, emotional content with personality, multi-character interactions',
            productionTips: [
                'Perfect for interview and dialogue-heavy content',
                'Keep character designs simple - circle heads, dot eyes, curved mouth lines',
                'Use medium-weight outlines consistently (4-6px) - not ultra-thin',
                'Gray fills only for clothing - keep faces and limbs as outlines',
                'Gradient backgrounds add visual interest without complexity',
                'City silhouettes should be flat geometric shapes only',
                'Limit to 3-4 colors per scene maximum',
                'Expressive through gestures and simple facial changes',
                'Hand-drawn feel with smooth movement, not choppy'
            ]
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
    // NICHE DATABASE - 14 Content Niches with Style Rankings
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.nicheDatabase = {
        finance: {
            name: 'Personal Finance', icon: '💰', tier: 'core',
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
            name: 'Psychology', icon: '🧠', tier: 'core',
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
        gaming: { name: 'Gaming', icon: '🎮', tier: 'extended', topStyles: ['3D Animation', 'Pixel Art', 'Anime', 'Neon Cyberpunk', 'Comic Book'], keywords: ['game', 'gaming', 'player', 'gamer', 'stream', 'esport', 'console', 'pc', 'playstation', 'xbox', 'nintendo'], defaultPalette: 'default' },
        technology: { name: 'Technology', icon: '💻', tier: 'extended', topStyles: ['Isometric 3D', '3D Animation', 'Neon Cyberpunk', 'Low-Poly', 'Cinematic'], keywords: ['tech', 'technology', 'software', 'hardware', 'ai', 'artificial intelligence', 'robot', 'computer', 'phone', 'app', 'code'], defaultPalette: 'default' },
        education: { name: 'Education', icon: '📚', tier: 'extended', topStyles: ['Whiteboard', '2D Minimal', '3D Animation', 'Isometric 3D', '2D Animation'], keywords: ['learn', 'teach', 'education', 'school', 'university', 'student', 'course', 'tutorial', 'lesson', 'study'], defaultPalette: 'default' },
        health: { name: 'Health & Fitness', icon: '💪', tier: 'extended', topStyles: ['Cinematic', '3D Animation', 'Photorealistic', '2D Minimal', 'Documentary'], keywords: ['health', 'fitness', 'workout', 'exercise', 'diet', 'nutrition', 'weight', 'muscle', 'gym', 'yoga', 'wellness'], defaultPalette: 'default' },
        cooking: { name: 'Cooking & Food', icon: '🍳', tier: 'extended', topStyles: ['Cinematic', 'Photorealistic', '3D Animation', 'Watercolor', 'Stop Motion'], keywords: ['cook', 'recipe', 'food', 'meal', 'kitchen', 'chef', 'ingredient', 'dish', 'bake', 'restaurant'], defaultPalette: 'default' },
        travel: { name: 'Travel', icon: '✈️', tier: 'extended', topStyles: ['Cinematic', 'Photorealistic', 'Documentary', 'Watercolor', '3D Animation'], keywords: ['travel', 'trip', 'vacation', 'destination', 'explore', 'adventure', 'flight', 'hotel', 'tourist'], defaultPalette: 'default' },
        business: { name: 'Business', icon: '💼', tier: 'extended', topStyles: ['3D Animation', 'Cinematic', 'Isometric 3D', '2D Minimal', 'Documentary'], keywords: ['business', 'entrepreneur', 'startup', 'company', 'ceo', 'founder', 'marketing', 'sales', 'client'], defaultPalette: 'default' },
        motivation: { name: 'Motivation', icon: '🔥', tier: 'extended', topStyles: ['Cinematic', '3D Animation', 'Silhouette', '2D Minimal', 'Documentary'], keywords: ['motivation', 'inspire', 'success', 'goal', 'dream', 'hustle', 'grind', 'discipline', 'mindset'], defaultPalette: 'default' },
        spirituality: { name: 'Spirituality', icon: '🧘', tier: 'extended', topStyles: ['Watercolor', 'Abstract', '2D Minimal', 'Silhouette', 'Anime'], keywords: ['spiritual', 'meditation', 'mindfulness', 'zen', 'soul', 'universe', 'energy', 'chakra', 'manifest'], defaultPalette: 'default' },
        kids: { name: 'Kids & Family', icon: '👨‍👩‍👧‍👦', tier: 'extended', topStyles: ['2D Animation', '3D Animation', 'Claymation', 'Paper Cutout', 'Pixel Art'], keywords: ['kids', 'children', 'family', 'parent', 'baby', 'toddler', 'child', 'play', 'fun', 'cartoon'], defaultPalette: 'default' },
        science: { name: 'Science', icon: '🔬', tier: 'extended', topStyles: ['3D Animation', 'Isometric 3D', 'Documentary', 'Whiteboard', 'Photorealistic'], keywords: ['science', 'scientist', 'research', 'experiment', 'physics', 'chemistry', 'biology', 'space', 'discovery'], defaultPalette: 'default' },
        history: { name: 'History', icon: '🏛️', tier: 'extended', topStyles: ['Cinematic', 'Documentary', 'Oil Painting', '2D Minimal', '3D Animation'], keywords: ['history', 'historical', 'ancient', 'war', 'civilization', 'empire', 'king', 'queen', 'century'], defaultPalette: 'default' }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // CONTENT CHARACTERISTICS - For Auto-Detection
    // ═══════════════════════════════════════════════════════════════════════════════

    TITAN.contentCharacteristics = {
        contentTypes: {
            educational_explainer: { styles: ['Whiteboard', 'Isometric 3D', '2D Minimal', '2D Animation'], signals: ['explain', 'how to', 'what is', 'guide', 'tutorial', 'learn', 'understand', 'step by step'], colorMood: 'professional' },
            storytelling_narrative: { styles: ['3D Animation', 'Cinematic', 'Anime', 'Documentary'], signals: ['story', 'journey', 'once upon', 'character', 'happened', 'experience', 'adventure'], colorMood: 'emotional' },
            data_visualization: { styles: ['Isometric 3D', '2D Minimal', 'Whiteboard', '2D Animation'], signals: ['data', 'statistics', 'chart', 'graph', 'percentage', 'numbers', 'analysis', 'compare'], colorMood: 'analytical' },
            emotional_sensitive: { styles: ['Watercolor', 'Silhouette', 'Anime', '2D Minimal'], signals: ['feel', 'emotion', 'struggle', 'trauma', 'heal', 'pain', 'anxiety', 'depression', 'loss'], colorMood: 'therapeutic' },
            action_dynamic: { styles: ['3D Animation', 'Comic Book', 'Anime', 'Cinematic'], signals: ['action', 'fight', 'battle', 'intense', 'epic', 'power', 'strong', 'fast'], colorMood: 'energetic' },
            calm_peaceful: { styles: ['Watercolor', '2D Minimal', 'Silhouette', 'Abstract'], signals: ['calm', 'peace', 'relax', 'meditation', 'gentle', 'soft', 'quiet', 'serene'], colorMood: 'calm' },
            futuristic_tech: { styles: ['Neon Cyberpunk', 'Isometric 3D', '3D Animation', 'Low-Poly'], signals: ['future', 'ai', 'robot', 'cyber', 'tech', 'digital', 'virtual', 'metaverse', 'crypto'], colorMood: 'futuristic' },
            nostalgic_retro: { styles: ['Pixel Art', 'Stop Motion', 'Claymation', 'Paper Cutout'], signals: ['retro', 'vintage', 'nostalgia', 'old school', '90s', '80s', 'classic', 'childhood'], colorMood: 'warm' }
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

    // Legacy global aliases for backward compatibility
    window.VISUAL_STYLE_SPECS = TITAN.visualStyleSpecs;
    window.HEX_TO_COLOR_NAME = TITAN.hexToColorName;
    window.NICHE_DATABASE = TITAN.nicheDatabase;
    window.CONTENT_CHARACTERISTICS = TITAN.contentCharacteristics;

    console.log('✅ TITAN.visualStyles loaded - 22 styles, 14 niches, auto-detection enabled');

})(window.TITAN = window.TITAN || {});
