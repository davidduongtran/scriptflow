# 🎬 VEO Flow Visual Rendering Technical DNA v1.0
## Complete Style Specification for Finance & Psychology Niches

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Core Visual Styles - Technical DNA](#core-visual-styles)
3. [Finance Niche - Top Styles](#finance-niche)
4. [Psychology Niche - Top Styles](#psychology-niche)
5. [Content-to-Style Matching Matrix](#content-matching)
6. [Color Psychology Integration](#color-psychology)
7. [Style Anchor System](#style-anchor)
8. [Implementation Code](#implementation)

---

## 🎯 OVERVIEW {#overview}

### Purpose
This document defines the **Technical DNA** for each visual rendering style - the specific parameters that must be injected into VEO 3 prompts to ensure:
- ✅ Consistent visual output across all scenes
- ✅ Professional-grade rendering quality
- ✅ Niche-appropriate aesthetics
- ✅ Character/style consistency

### Your Niches
| Niche | Primary Styles | Content Focus |
|-------|---------------|---------------|
| **Personal Finance** | 3D Animation, Isometric 3D, Whiteboard, 2D Minimal | Budget, investing, money tips |
| **Psychology** | Anime/2D Illustrated, Soft Watercolor, Silhouette, 2D Minimal | Mental health, relationships, self-improvement |

---

## 🎨 CORE VISUAL STYLES - TECHNICAL DNA {#core-visual-styles}

### 🎬 ANIMATION STYLES (8)

#### 1. 3D Animation (Pixar-Style)
```
TECHNICAL DNA:
- Rendering: Ray-traced PBR (Physically Based Rendering)
- Subsurface scattering for skin/organic materials
- Global illumination with ambient occlusion
- Frame rate: 24fps (cinematic) or 30fps (YouTube standard)
- Anti-aliasing: TAA (Temporal Anti-Aliasing)
- Resolution: 4K (3840x2160)
- Motion blur: Enabled (0.5 shutter)
- Color space: sRGB with HDR highlights
- Lighting: 3-point studio + HDRI environment

PROMPT INJECTION:
"3D animated, Pixar-quality rendering, ray-traced lighting, subsurface scattering on skin, global illumination, soft shadows, vibrant saturated colors, 4K detail, smooth 24fps motion, cinematic depth of field"

BEST FOR: Finance explainers, character-driven stories, professional brand content
```

#### 2. 3D Realistic (Photorealistic)
```
TECHNICAL DNA:
- Rendering: Path-traced photorealism
- Photogrammetric textures (8K micro-detail)
- Ray-traced reflections and refractions
- Physical material properties (metalness, roughness maps)
- Frame rate: 24fps
- Resolution: 4K-8K
- HDRI lighting with realistic falloff
- Film grain: Subtle (0.02)
- Lens simulation: Real camera characteristics

PROMPT INJECTION:
"photorealistic 3D rendering, path-traced lighting, 8K texture detail, physically accurate materials, ray-traced reflections, HDRI environment lighting, subtle film grain, cinematic lens characteristics, hyperrealistic detail"

BEST FOR: Product showcases, real estate, documentary-style finance content
```

#### 3. 3D Toon (Stylized Cartoon)
```
TECHNICAL DNA:
- Rendering: Cell-shaded with outline pass
- Flat shadow regions (2-3 tones max)
- Bold outlines: 2-4px black or colored
- Saturated color palette (high saturation 70-90%)
- Frame rate: 24fps or 30fps
- Specular highlights: Sharp, anime-style
- No subsurface scattering
- Simplified geometry

PROMPT INJECTION:
"3D cel-shaded cartoon style, bold black outlines (3px), flat color shading with 2-tone shadows, highly saturated vibrant colors, stylized simplified forms, sharp specular highlights, clean vector-like aesthetic"

BEST FOR: Fun finance tips, engaging educational content, younger audiences
```

#### 4. 3D Sculpted (Clay/Plastic Look)
```
TECHNICAL DNA:
- Rendering: Soft ambient occlusion heavy
- Material: Matte plastic/clay surface
- Subsurface scattering: Heavy (translucent feel)
- Soft diffuse lighting
- Frame rate: 24fps
- Rounded geometry, smooth bevels
- Fingerprint/imperfection textures optional
- Soft shadows only

PROMPT INJECTION:
"3D sculpted clay-like aesthetic, matte plastic materials, heavy subsurface scattering, soft rounded forms, ambient occlusion shading, gentle diffuse lighting, smooth beveled edges, tactile handmade quality"

BEST FOR: Approachable finance content, stop-motion feel, craft aesthetic
```

#### 5. 2D Animation (Vector/Flat)
```
TECHNICAL DNA:
- Rendering: Vector-based, resolution-independent
- Flat colors with no gradients (or minimal)
- Clean geometric shapes
- Frame rate: 24fps (on 2s = 12 drawings)
- Line work: Clean, consistent weight
- Limited color palette: 5-8 colors
- No shadows or minimal flat shadows
- Motion: Smooth tweening

PROMPT INJECTION:
"2D flat vector animation, clean geometric shapes, solid flat colors, minimal gradients, consistent line weight, limited color palette (6 colors), smooth motion tweening, modern graphic design aesthetic"

BEST FOR: Motion graphics, data visualization, clean explainers
```

#### 6. 2D Minimal (School of Life Style)
```
TECHNICAL DNA:
- Rendering: Ultra-simplified vector
- Human figures: Geometric, featureless or minimal
- Color palette: Muted earth tones (beige, terracotta, sage)
- No outlines or very thin
- White/cream backgrounds
- Frame rate: 24fps (limited animation)
- Symbolic iconography
- Intellectual, contemplative mood

PROMPT INJECTION:
"minimalist 2D animation, geometric simplified human figures, muted earth tone palette (beige, terracotta, sage green), cream white background, no outlines, symbolic visual metaphors, intellectual contemplative aesthetic, School of Life style"

BEST FOR: Philosophy, deep psychology concepts, thoughtful finance content
```

#### 7. Anime (Japanese Animation)
```
TECHNICAL DNA:
- Rendering: 2D hand-drawn aesthetic
- Frame rate: 24fps (animated on 2s = 12fps actual)
- Large expressive eyes, simplified nose/mouth
- Cel-shading with sharp shadow edges
- Speed lines, impact frames
- Limited animation with key poses
- Color palette: Soft pastels or vivid (genre dependent)
- Line boil effect optional

PROMPT INJECTION:
"anime style animation, expressive large eyes, cel-shaded with sharp shadow edges, soft pastel color palette, Japanese animation aesthetic, limited animation on 2s, emotional character expressions, manga-influenced design"

BEST FOR: Psychology content (Psych2Go style), relatable characters, emotional topics
```

#### 8. Pixel Art (Retro Gaming)
```
TECHNICAL DNA:
- Rendering: Pixelated grid-based
- Resolution: 320x180 or 640x360 internal, upscaled
- Color palette: Limited 16-32 colors
- Dithering for gradients
- Frame rate: 12fps (chunky animation)
- No anti-aliasing
- 8-bit or 16-bit aesthetic
- Chiptune audio pairing

PROMPT INJECTION:
"16-bit pixel art style, limited 32-color palette, visible pixels, dithering for shading, retro video game aesthetic, chunky animation at 12fps, no anti-aliasing, nostalgic 1990s gaming visual"

BEST FOR: Gaming audience crossover, nostalgic appeal, unique differentiation
```

---

### 🎨 ART STYLES (6)

#### 9. Watercolor (Soft/Therapeutic)
```
TECHNICAL DNA:
- Rendering: Watercolor wash simulation
- Bleeding/feathered edges
- Soft focus, dreamy atmosphere
- Color palette: Soft pastels (lavender, blush, seafoam)
- Texture: Paper grain visible
- Frame rate: 24fps (gentle movements)
- Transparency/layering effects
- Organic, imperfect shapes

PROMPT INJECTION:
"soft watercolor painting style, bleeding wash edges, visible paper texture, soft pastel palette (lavender, blush pink, seafoam), dreamy atmospheric quality, gentle transparency layers, organic flowing shapes, therapeutic calming aesthetic"

BEST FOR: Mental health, anxiety content, healing topics, self-care
```

#### 10. Oil Painting (Classical)
```
TECHNICAL DNA:
- Rendering: Impasto texture simulation
- Visible brush strokes
- Rich, deep color palette
- Chiaroscuro lighting (dramatic light/shadow)
- Frame rate: 24fps (painterly motion)
- Canvas texture overlay
- Classical composition rules
- Warm undertones

PROMPT INJECTION:
"classical oil painting style, visible impasto brush strokes, rich deep color palette, dramatic chiaroscuro lighting, canvas texture, Renaissance-inspired composition, warm golden undertones, museum-quality aesthetic"

BEST FOR: Historical content, luxury finance, prestige positioning
```

#### 11. Comic Book (Bold/Dynamic)
```
TECHNICAL DNA:
- Rendering: Bold black outlines (4-6px)
- Halftone dot shading
- Primary color palette (CMYK feel)
- Dynamic angles, dramatic poses
- Frame rate: 24fps
- Speech bubbles, sound effects
- Panel-style composition optional
- High contrast

PROMPT INJECTION:
"bold comic book style, thick black outlines (5px), halftone dot shading, primary color palette (red, blue, yellow), dynamic dramatic angles, high contrast, superhero comic aesthetic, action-oriented composition"

BEST FOR: Action finance content, dynamic presentations, younger male audience
```

#### 12. Pop Art (Bold/Trendy)
```
TECHNICAL DNA:
- Rendering: Flat bold colors
- Ben-Day dots pattern
- High contrast, limited palette
- Andy Warhol / Roy Lichtenstein inspired
- Frame rate: 24fps
- Repetition motifs
- Commercial/advertising aesthetic
- Neon accents optional

PROMPT INJECTION:
"pop art style, bold flat colors, Ben-Day dot patterns, high contrast, Andy Warhol inspired, commercial advertising aesthetic, limited bold color palette, repetitive motifs, 1960s modern art feel"

BEST FOR: Trendy content, social media clips, attention-grabbing thumbnails
```

#### 13. Abstract (Conceptual)
```
TECHNICAL DNA:
- Rendering: Non-representational forms
- Geometric shapes, flowing forms
- Color as emotion
- Frame rate: 24fps
- Motion: Morphing, flowing
- Kandinsky/Mondrian inspired options
- Symbolic rather than literal
- Experimental composition

PROMPT INJECTION:
"abstract art style, non-representational geometric forms, color expressing emotion, flowing morphing shapes, Kandinsky-inspired composition, symbolic visual metaphors, experimental avant-garde aesthetic"

BEST FOR: Conceptual psychology topics, emotional content, artistic differentiation
```

#### 14. Silhouette (Universal/Anonymous)
```
TECHNICAL DNA:
- Rendering: Solid black shapes
- No internal detail
- Gradient or solid color backgrounds
- High contrast
- Frame rate: 24fps
- Universal human forms
- Emotional color backgrounds
- Minimal props as symbols

PROMPT INJECTION:
"silhouette style, solid black human figures, no facial features, gradient background (warm sunset or cool blue), high contrast, universal anonymous representation, symbolic minimal props, emotional atmosphere through color"

BEST FOR: Trauma topics, sensitive mental health, universal relatability
```

---

### 📸 REALISTIC STYLES (2)

#### 15. Cinematic (Film-Grade)
```
TECHNICAL DNA:
- Rendering: Film-grade 3D or live-action enhancement
- Aspect ratio: 2.39:1 anamorphic or 16:9
- Frame rate: 24fps (theatrical standard)
- Film grain: Medium (0.03-0.05)
- Color grading: Cinematic LUT (teal-orange, etc.)
- Lens flares, bokeh
- Shallow depth of field
- Volumetric lighting/fog

PROMPT INJECTION:
"cinematic film-grade quality, anamorphic widescreen composition, 24fps theatrical motion, subtle film grain, professional color grading, lens flares, shallow depth of field bokeh, volumetric atmospheric lighting, Hollywood production value"

BEST FOR: Premium content, documentary finance, authority positioning
```

#### 16. Documentary (Authentic)
```
TECHNICAL DNA:
- Rendering: Naturalistic, handheld feel
- Frame rate: 24fps or 30fps
- Natural lighting (available light look)
- Lower thirds, text overlays
- Interview framing
- B-roll style cutaways
- Subtle color grade (natural)
- Archival footage aesthetic option

PROMPT INJECTION:
"documentary style, naturalistic handheld camera feel, available natural lighting, interview-style framing, authentic real-world aesthetic, subtle natural color grading, journalistic visual approach, trust-building composition"

BEST FOR: Credibility content, real stories, investigative finance
```

---

### ✨ SPECIAL STYLES (6)

#### 17. Whiteboard Animation
```
TECHNICAL DNA:
- Rendering: Black line on white background
- Hand-drawing animation effect
- Frame rate: Variable (drawing speed)
- Accent colors: Red, blue highlights
- Simple iconography
- Progressive reveal
- Marker/pen texture
- Hand occasionally visible

PROMPT INJECTION:
"whiteboard animation style, black marker lines on white background, hand-drawing progressive reveal effect, simple icon illustrations, red and blue accent highlights, educational explainer aesthetic, marker pen texture"

BEST FOR: Educational explainers, psychology studies, finance concepts
```

#### 18. Isometric 3D
```
TECHNICAL DNA:
- Rendering: 30° isometric projection
- No perspective distortion
- Clean geometric shapes
- Flat or subtle shading
- Pastel or corporate palette
- Frame rate: 24fps
- Infographic aesthetic
- Tech/modern feel

PROMPT INJECTION:
"isometric 3D style, 30-degree isometric projection, clean geometric shapes, no perspective distortion, pastel color palette, flat minimal shading, modern tech infographic aesthetic, data visualization friendly"

BEST FOR: Finance data visualization, money flow diagrams, tech-forward content
```

#### 19. Low-Poly
```
TECHNICAL DNA:
- Rendering: Faceted geometry
- Visible polygon faces
- Flat shading per face
- Limited vertex count
- Stylized normals
- Frame rate: 24fps
- Modern minimalist palette
- Gaming aesthetic crossover

PROMPT INJECTION:
"low-poly 3D style, visible faceted polygon geometry, flat shading per face, limited vertices, stylized angular forms, modern minimalist color palette, indie game aesthetic, geometric simplification"

BEST FOR: Modern tech content, gaming crossover, unique visual hook
```

#### 20. Voxel (Minecraft-Style)
```
TECHNICAL DNA:
- Rendering: Cubic voxel construction
- Blocky aesthetic
- Limited color palette
- Pixel-art influenced textures
- Frame rate: 24fps
- Minecraft/Roblox feel
- Chunky satisfying movement
- Gaming nostalgia

PROMPT INJECTION:
"voxel 3D style, cubic blocky construction, Minecraft-inspired aesthetic, limited color palette, pixel-art textures on cubes, chunky satisfying geometry, gaming nostalgic feel, playful approachable visual"

BEST FOR: Gaming audience, younger demographics, playful finance content
```

#### 21. Neon/Cyberpunk
```
TECHNICAL DNA:
- Rendering: Deep blacks, neon accents
- Bloom/glow effects heavy
- Reflective wet surfaces
- Frame rate: 24fps
- Volumetric fog/atmosphere
- Synthwave color palette (pink, cyan, purple)
- Futuristic UI elements
- Rain/particle effects

PROMPT INJECTION:
"cyberpunk neon style, deep black shadows, glowing neon accents (pink, cyan, purple), heavy bloom glow effects, reflective wet surfaces, volumetric fog atmosphere, synthwave futuristic aesthetic, Blade Runner inspired"

BEST FOR: Crypto/tech finance, futuristic content, trend-forward psychology
```

#### 22. Paper Cutout / Felt Craft
```
TECHNICAL DNA:
- Rendering: Textured paper/fabric materials
- Visible cut edges
- Layered depth (parallax)
- Frame rate: 12-15fps (stop-motion feel)
- Craft/handmade aesthetic
- Warm wholesome colors
- Tactile texture emphasis
- South Park / felt animation inspired

PROMPT INJECTION:
"paper cutout craft style, visible textured paper layers, cut edge details, stop-motion animation feel at 15fps, handmade craft aesthetic, warm wholesome color palette, tactile layered depth, approachable DIY visual"

BEST FOR: Approachable content, craft/DIY niches, wholesome psychology
```

---

## 💰 FINANCE NICHE - TOP STYLES {#finance-niche}

### Ranked Recommendations

| Rank | Style | Why for Finance | Use Case |
|------|-------|-----------------|----------|
| **1** | **3D Animation** | Trust + engagement, professional feel | Main channel style |
| **2** | **Isometric 3D** | Perfect for data visualization, money flows | Infographics, tutorials |
| **3** | **Whiteboard Animation** | Explains complex concepts, high retention | Educational deep-dives |
| **4** | **2D Minimal** | Clean, modern, quick to produce | Quick tips, shorts |
| **5** | **Cinematic** | Authority positioning for long-form | Documentary-style |

### Finance Content-to-Style Matrix

| Content Type | Primary Style | Secondary Style | Color Palette |
|--------------|---------------|-----------------|---------------|
| Budget tips | 3D Animation | 2D Minimal | Green, blue, white |
| Investing basics | Isometric 3D | Whiteboard | Navy, gold, cream |
| Debt payoff | 3D Toon | Whiteboard | Green (growth), red→green (transformation) |
| Money mistakes | 3D Animation | Comic Book | Red accents, neutral base |
| Passive income | Cinematic | 3D Realistic | Gold, green, luxury tones |
| Tax tips | Whiteboard | 2D Minimal | Blue (trust), green (money) |
| Crypto/NFT | Neon/Cyberpunk | Low-Poly | Cyan, purple, pink |
| Real estate | 3D Realistic | Cinematic | Warm earth tones, gold |
| Frugal living | Paper Cutout | 2D Illustrated | Warm, wholesome pastels |
| Side hustles | 3D Toon | Pixel Art | Energetic, vibrant |

---

## 🧠 PSYCHOLOGY NICHE - TOP STYLES {#psychology-niche}

### Ranked Recommendations

| Rank | Style | Why for Psychology | Use Case |
|------|-------|-------------------|----------|
| **1** | **Anime/2D Illustrated** | Psych2Go proven success, relatable | Main channel style |
| **2** | **2D Minimal** | School of Life intellectual feel | Deep concepts |
| **3** | **Soft Watercolor** | Therapeutic, calming for sensitive topics | Mental health |
| **4** | **Silhouette** | Universal, anonymous, non-judgmental | Trauma, sensitive |
| **5** | **Whiteboard** | Educational credibility for studies | Research explainers |

### Psychology Content-to-Style Matrix

| Content Type | Primary Style | Secondary Style | Color Palette |
|--------------|---------------|-----------------|---------------|
| Mental health awareness | Anime | 2D Illustrated | Soft pastels, lavender |
| Anxiety/depression | Watercolor | Silhouette | Calming blues, soft greens |
| Relationship advice | Anime | Watercolor | Warm blush, coral |
| Trauma healing | Silhouette | Watercolor | Muted, safe colors |
| Personality types (MBTI) | Anime | 3D Toon | Character-specific palettes |
| Psychology facts | Whiteboard | 2D Minimal | Academic (navy, cream) |
| Self-improvement | Anime | 3D Animation | Energetic, warm |
| Philosophy/deep thought | 2D Minimal | Abstract | Earth tones, muted |
| Attachment styles | Anime | Silhouette | Soft, emotional |
| Cognitive biases | Whiteboard | Isometric 3D | Clean, analytical |
| Emotional intelligence | Watercolor | Anime | Warm, empathetic |
| Narcissism/toxic people | Silhouette | 2D Minimal | Dark with light accents |

---

## 🌈 COLOR PSYCHOLOGY INTEGRATION {#color-psychology}

### Finance Color Palettes

| Topic | Primary Colors | Hex Codes | Emotion |
|-------|---------------|-----------|---------|
| **Wealth/Growth** | Green, Gold | #2E7D32, #FFD700 | Prosperity, success |
| **Trust/Security** | Navy, Blue | #1A237E, #1976D2 | Reliability, stability |
| **Savings** | Teal, White | #00897B, #FFFFFF | Clean, refreshing |
| **Debt/Warning** | Red → Green | #D32F2F → #4CAF50 | Problem → Solution |
| **Premium/Luxury** | Black, Gold | #212121, #C9A227 | Exclusivity |
| **Action/Urgency** | Orange, Red | #FF5722, #F44336 | Energy, motivation |

### Psychology Color Palettes

| Topic | Primary Colors | Hex Codes | Emotion |
|-------|---------------|-----------|---------|
| **Calm/Anxiety relief** | Lavender, Seafoam | #E1BEE7, #B2DFDB | Peace, tranquility |
| **Healing/Growth** | Sage, Soft Gold | #A5D6A7, #FFE082 | Renewal, hope |
| **Sadness/Depression** | Muted Blue + Warm accent | #78909C, #FFAB91 | Melancholy with hope |
| **Love/Relationships** | Blush, Coral | #F8BBD9, #FF8A80 | Warmth, connection |
| **Energy/Motivation** | Soft Yellow, Orange | #FFF59D, #FFCC80 | Optimism, vitality |
| **Intellectual/Learning** | Navy, Cream | #303F9F, #FFF8E1 | Wisdom, clarity |
| **Trauma/Sensitive** | Muted tones, Safe neutrals | #B0BEC5, #D7CCC8 | Non-threatening |

---

## 🔗 STYLE ANCHOR SYSTEM {#style-anchor}

### Purpose
Inject consistent style parameters into EVERY scene prompt to prevent VEO 3 style drift.

### Anchor Template

```javascript
const styleAnchor = `
[GLOBAL STYLE ANCHOR - MAINTAIN THROUGHOUT]
Visual Rendering: ${selectedStyle.name}
Technical Specs: ${selectedStyle.technicalDNA}
Color Palette: ${selectedStyle.colorPalette}
Frame Rate: ${selectedStyle.fps}
Lighting Model: ${selectedStyle.lighting}
Mood/Atmosphere: ${selectedStyle.mood}
[END ANCHOR]
`;

// Inject into every scene prompt
const scenePrompt = `
${styleAnchor}

[SCENE ${sceneNumber}]
Duration: ${duration} seconds
Action: ${sceneDescription}
Camera: ${cameraMovement}
`;
```

### Example: Finance Video with 3D Animation

```
[GLOBAL STYLE ANCHOR - MAINTAIN THROUGHOUT]
Visual Rendering: 3D Animation (Pixar-Style)
Technical Specs: ray-traced PBR, subsurface scattering, global illumination, 24fps, 4K
Color Palette: Trust palette - Navy (#1A237E), Green (#2E7D32), Gold (#FFD700), White
Frame Rate: 24fps cinematic
Lighting Model: 3-point studio with soft HDRI fill
Mood/Atmosphere: Professional, trustworthy, approachable, educational
[END ANCHOR]

[SCENE 1]
Duration: 4 seconds
Action: Young professional looking stressed at bills on kitchen table
Camera: Medium close-up, slow push in
```

### Example: Psychology Video with Anime Style

```
[GLOBAL STYLE ANCHOR - MAINTAIN THROUGHOUT]
Visual Rendering: Anime (Japanese Animation)
Technical Specs: cel-shaded, expressive eyes, 24fps on 2s, soft pastel palette
Color Palette: Calm palette - Lavender (#E1BEE7), Soft Blue (#90CAF9), Blush (#F8BBD9)
Frame Rate: 24fps (12 actual drawings)
Lighting Model: Soft ambient, anime-style rim lighting
Mood/Atmosphere: Warm, empathetic, relatable, gentle, supportive
[END ANCHOR]

[SCENE 1]
Duration: 3 seconds
Action: Character sitting alone, looking contemplative
Camera: Wide establishing shot, soft focus background
```

---

## 💻 IMPLEMENTATION CODE {#implementation}

### Style Configuration Object

```javascript
const VISUAL_STYLES = {
  // ANIMATION STYLES
  "3D Animation": {
    name: "3D Animation",
    category: "Animation",
    technicalDNA: "ray-traced PBR rendering, subsurface scattering on skin, global illumination, soft shadows, 4K detail, smooth 24fps motion, cinematic depth of field",
    fps: "24fps",
    lighting: "3-point studio + HDRI environment",
    financeRank: 1,
    psychologyRank: 6,
    promptPrefix: "3D animated, Pixar-quality rendering,",
    colorPalettes: {
      finance: "navy, green, gold, white",
      psychology: "soft pastels, warm tones"
    }
  },
  
  "Anime": {
    name: "Anime",
    category: "Animation",
    technicalDNA: "2D hand-drawn aesthetic, expressive large eyes, cel-shaded with sharp shadow edges, soft pastel color palette, limited animation on 2s, emotional character expressions",
    fps: "24fps (on 2s)",
    lighting: "soft ambient, anime rim lighting",
    financeRank: 8,
    psychologyRank: 1,
    promptPrefix: "anime style animation,",
    colorPalettes: {
      finance: "vibrant, energetic",
      psychology: "soft pastels, lavender, blush"
    }
  },
  
  "2D Minimal": {
    name: "2D Minimal",
    category: "Animation",
    technicalDNA: "minimalist 2D animation, geometric simplified human figures, muted earth tone palette, cream white background, no outlines, symbolic visual metaphors, intellectual contemplative aesthetic",
    fps: "24fps",
    lighting: "flat, no dramatic shadows",
    financeRank: 4,
    psychologyRank: 2,
    promptPrefix: "minimalist 2D animation, School of Life style,",
    colorPalettes: {
      finance: "beige, terracotta, navy",
      psychology: "earth tones, sage, cream"
    }
  },
  
  "Watercolor": {
    name: "Soft Watercolor",
    category: "Art Style",
    technicalDNA: "soft watercolor painting style, bleeding wash edges, visible paper texture, soft pastel palette, dreamy atmospheric quality, gentle transparency layers, organic flowing shapes",
    fps: "24fps",
    lighting: "soft diffused, natural",
    financeRank: 10,
    psychologyRank: 3,
    promptPrefix: "soft watercolor painting style,",
    colorPalettes: {
      finance: "soft greens, blues",
      psychology: "lavender, blush, seafoam"
    }
  },
  
  "Silhouette": {
    name: "Silhouette",
    category: "Art Style",
    technicalDNA: "silhouette style, solid black human figures, no facial features, gradient background, high contrast, universal anonymous representation, symbolic minimal props",
    fps: "24fps",
    lighting: "backlit, high contrast",
    financeRank: 9,
    psychologyRank: 4,
    promptPrefix: "silhouette style, solid black figures,",
    colorPalettes: {
      finance: "sunset gradients, corporate blues",
      psychology: "emotional gradients, sunset, aurora"
    }
  },
  
  "Whiteboard": {
    name: "Whiteboard Animation",
    category: "Special",
    technicalDNA: "whiteboard animation style, black marker lines on white background, hand-drawing progressive reveal effect, simple icon illustrations, red and blue accent highlights",
    fps: "variable (drawing speed)",
    lighting: "flat white background",
    financeRank: 3,
    psychologyRank: 5,
    promptPrefix: "whiteboard animation, black marker on white,",
    colorPalettes: {
      finance: "black, red, blue accents",
      psychology: "black, soft color accents"
    }
  },
  
  "Isometric 3D": {
    name: "Isometric 3D",
    category: "Special",
    technicalDNA: "isometric 3D style, 30-degree isometric projection, clean geometric shapes, no perspective distortion, pastel color palette, flat minimal shading, modern tech infographic aesthetic",
    fps: "24fps",
    lighting: "soft ambient, no harsh shadows",
    financeRank: 2,
    psychologyRank: 8,
    promptPrefix: "isometric 3D style, 30-degree projection,",
    colorPalettes: {
      finance: "corporate pastels, data viz colors",
      psychology: "soft analytical colors"
    }
  },
  
  "Cinematic": {
    name: "Cinematic",
    category: "Realistic",
    technicalDNA: "cinematic film-grade quality, anamorphic widescreen, 24fps theatrical motion, subtle film grain, professional color grading, lens flares, shallow depth of field bokeh, volumetric lighting",
    fps: "24fps",
    lighting: "cinematic 3-point + practicals",
    financeRank: 5,
    psychologyRank: 7,
    promptPrefix: "cinematic film-grade quality,",
    colorPalettes: {
      finance: "teal-orange grade, luxury tones",
      psychology: "natural, documentary feel"
    }
  },
  
  "Neon Cyberpunk": {
    name: "Neon/Cyberpunk",
    category: "Special",
    technicalDNA: "cyberpunk neon style, deep black shadows, glowing neon accents (pink, cyan, purple), heavy bloom glow effects, reflective wet surfaces, volumetric fog atmosphere",
    fps: "24fps",
    lighting: "neon rim lights, volumetric",
    financeRank: 7,
    psychologyRank: 10,
    promptPrefix: "cyberpunk neon style, deep blacks,",
    colorPalettes: {
      finance: "pink, cyan, purple neons",
      psychology: "synthwave palette"
    }
  }
};

// Function to get style anchor
function getStyleAnchor(styleName, niche) {
  const style = VISUAL_STYLES[styleName];
  const palette = style.colorPalettes[niche] || style.colorPalettes.finance;
  
  return `
[GLOBAL STYLE ANCHOR - MAINTAIN THROUGHOUT]
Visual Rendering: ${style.name}
Technical Specs: ${style.technicalDNA}
Color Palette: ${palette}
Frame Rate: ${style.fps}
Lighting Model: ${style.lighting}
[END ANCHOR]
`;
}

// Function to build scene prompt
function buildScenePrompt(sceneData, styleName, niche) {
  const style = VISUAL_STYLES[styleName];
  const anchor = getStyleAnchor(styleName, niche);
  
  return `
${anchor}

[SCENE ${sceneData.number}]
Duration: ${sceneData.duration} seconds
Prompt: ${style.promptPrefix} ${sceneData.description}
Camera: ${sceneData.camera}
Text Overlay: ${sceneData.textOverlay || 'None'}
Transition: ${sceneData.transition || 'Cut'}
`;
}
```

### Dropdown HTML Update

```html
<div class="form-group">
  <label for="visualRendering">Visual Rendering Style</label>
  <select id="visualRendering" class="form-control">
    <option value="">Select rendering style...</option>
    
    <optgroup label="🎬 Animation">
      <option value="3D Animation">3D Animation - Pixar-quality (Finance #1)</option>
      <option value="2D Minimal">2D Minimal - School of Life (Psych #2)</option>
      <option value="Anime">Anime - Psych2Go style (Psych #1)</option>
      <option value="3D Toon">3D Toon - Stylized cartoon</option>
      <option value="Pixel Art">Pixel Art - Retro gaming</option>
    </optgroup>
    
    <optgroup label="🎨 Art Styles">
      <option value="Watercolor">Soft Watercolor - Therapeutic (Psych #3)</option>
      <option value="Silhouette">Silhouette - Universal (Psych #4)</option>
      <option value="Oil Painting">Oil Painting - Classical</option>
      <option value="Comic Book">Comic Book - Bold dynamic</option>
    </optgroup>
    
    <optgroup label="📸 Realistic">
      <option value="Cinematic">Cinematic - Film-grade (Finance #5)</option>
      <option value="3D Realistic">3D Realistic - Photorealistic</option>
      <option value="Documentary">Documentary - Authentic</option>
    </optgroup>
    
    <optgroup label="✨ Special">
      <option value="Whiteboard">Whiteboard Animation (Finance #3, Psych #5)</option>
      <option value="Isometric 3D">Isometric 3D - Infographics (Finance #2)</option>
      <option value="Neon Cyberpunk">Neon/Cyberpunk - Futuristic</option>
      <option value="Low-Poly">Low-Poly - Modern minimal</option>
      <option value="Voxel">Voxel - Minecraft-style</option>
      <option value="Paper Cutout">Paper Cutout - Craft aesthetic</option>
    </optgroup>
  </select>
</div>

<div class="form-group">
  <label for="contentNiche">Content Niche</label>
  <select id="contentNiche" class="form-control">
    <option value="finance">💰 Personal Finance</option>
    <option value="psychology">🧠 Psychology</option>
  </select>
</div>
```

---

## 📊 QUICK REFERENCE CARD

### Finance Videos - Use These:
1. **3D Animation** → Main content
2. **Isometric 3D** → Data/infographics
3. **Whiteboard** → Complex concepts
4. **2D Minimal** → Quick tips/shorts
5. **Cinematic** → Premium long-form

### Psychology Videos - Use These:
1. **Anime** → Main content (Psych2Go proven)
2. **2D Minimal** → Deep concepts
3. **Watercolor** → Mental health/healing
4. **Silhouette** → Trauma/sensitive topics
5. **Whiteboard** → Research/studies

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Add Technical DNA to all existing styles
- [ ] Add new styles: Whiteboard, Isometric, Watercolor, Silhouette, Neon
- [ ] Implement Style Anchor injection system
- [ ] Add Niche selector (Finance/Psychology)
- [ ] Update color palette based on niche selection
- [ ] Add style ranking indicators in dropdown
- [ ] Test consistency across 20+ scenes

---

**Document Version:** 1.0
**Last Updated:** December 2024
**Niches Covered:** Personal Finance, Psychology
