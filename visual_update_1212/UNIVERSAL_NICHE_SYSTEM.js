// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSAL NICHE SYSTEM v1.0
// Expandable niche support with AI-powered style suggestion
// 
// INTEGRATION: Add to sidepanel.js after VISUAL_STYLE_SPECS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * NICHE CONFIGURATION DATABASE
 * 
 * Structure:
 * - Core Niches: Full optimization (rankings, colors, keywords, content matching)
 * - Extended Niches: Basic optimization (colors, general rankings)
 * - Custom Niches: AI-powered suggestions based on content analysis
 */
const NICHE_DATABASE = {
  // ═══════════════════════════════════════════════════════════════════════════
  // CORE NICHES (Fully Optimized)
  // ═══════════════════════════════════════════════════════════════════════════
  
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
    contentSignals: {
      educational: ['explain', 'how to', 'guide', 'tips', 'strategy'],
      storytelling: ['journey', 'story', 'transformation', 'success', 'failure'],
      data: ['chart', 'graph', 'statistics', 'numbers', 'percentage']
    },
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
    contentSignals: {
      emotional: ['feel', 'emotion', 'heart', 'struggle', 'heal'],
      analytical: ['study', 'research', 'science', 'brain', 'cognitive'],
      relatable: ['you', 'your', 'we', 'us', 'relate']
    },
    defaultPalette: 'calm'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXTENDED NICHES (Basic Optimization)
  // ═══════════════════════════════════════════════════════════════════════════

  gaming: {
    name: 'Gaming',
    icon: '🎮',
    tier: 'extended',
    topStyles: ['3D Animation', 'Pixel Art', 'Anime', 'Neon Cyberpunk', 'Comic Book'],
    colorPalettes: {
      default: { colors: ['#7C4DFF', '#00E676', '#FF4081'], name: 'Gaming Vibrant' },
      retro: { colors: ['#FFD600', '#00BCD4', '#E91E63'], name: 'Retro Arcade' },
      esports: { colors: ['#212121', '#00E5FF', '#FF1744'], name: 'Esports Dark' }
    },
    keywords: ['game', 'gaming', 'player', 'gamer', 'stream', 'esport', 'console', 'pc', 'playstation', 'xbox', 'nintendo', 'fps', 'rpg', 'mmo'],
    defaultPalette: 'default'
  },

  technology: {
    name: 'Technology',
    icon: '💻',
    tier: 'extended',
    topStyles: ['Isometric 3D', '3D Animation', 'Neon Cyberpunk', 'Low-Poly', 'Cinematic'],
    colorPalettes: {
      default: { colors: ['#2196F3', '#00BCD4', '#FFFFFF'], name: 'Tech Blue' },
      dark: { colors: ['#121212', '#00E5FF', '#7C4DFF'], name: 'Tech Dark' },
      clean: { colors: ['#FFFFFF', '#607D8B', '#2196F3'], name: 'Minimalist Tech' }
    },
    keywords: ['tech', 'technology', 'software', 'hardware', 'ai', 'artificial intelligence', 'robot', 'computer', 'phone', 'app', 'code', 'programming', 'developer'],
    defaultPalette: 'default'
  },

  education: {
    name: 'Education',
    icon: '📚',
    tier: 'extended',
    topStyles: ['Whiteboard', '2D Minimal', '3D Animation', 'Isometric 3D', '2D Animation'],
    colorPalettes: {
      default: { colors: ['#1565C0', '#FFC107', '#FFFFFF'], name: 'Academic' },
      friendly: { colors: ['#4CAF50', '#FF9800', '#03A9F4'], name: 'Friendly Learning' },
      serious: { colors: ['#37474F', '#ECEFF1', '#1976D2'], name: 'Professional' }
    },
    keywords: ['learn', 'teach', 'education', 'school', 'university', 'student', 'course', 'tutorial', 'lesson', 'study', 'knowledge', 'skill'],
    defaultPalette: 'default'
  },

  health: {
    name: 'Health & Fitness',
    icon: '💪',
    tier: 'extended',
    topStyles: ['Cinematic', '3D Animation', 'Photorealistic', '2D Minimal', 'Documentary'],
    colorPalettes: {
      default: { colors: ['#4CAF50', '#FF5722', '#FFFFFF'], name: 'Active Energy' },
      calm: { colors: ['#81C784', '#90CAF9', '#FFFFFF'], name: 'Wellness' },
      intense: { colors: ['#F44336', '#212121', '#FFFFFF'], name: 'Intense Workout' }
    },
    keywords: ['health', 'fitness', 'workout', 'exercise', 'diet', 'nutrition', 'weight', 'muscle', 'gym', 'yoga', 'meditation', 'wellness', 'body'],
    defaultPalette: 'default'
  },

  cooking: {
    name: 'Cooking & Food',
    icon: '🍳',
    tier: 'extended',
    topStyles: ['Cinematic', 'Photorealistic', '3D Animation', 'Watercolor', 'Stop Motion'],
    colorPalettes: {
      default: { colors: ['#FF5722', '#FFC107', '#4CAF50'], name: 'Appetizing Warm' },
      elegant: { colors: ['#212121', '#FFD700', '#FFFFFF'], name: 'Gourmet' },
      fresh: { colors: ['#4CAF50', '#FFEB3B', '#F44336'], name: 'Fresh & Healthy' }
    },
    keywords: ['cook', 'recipe', 'food', 'meal', 'kitchen', 'chef', 'ingredient', 'dish', 'bake', 'restaurant', 'eat', 'taste', 'delicious'],
    defaultPalette: 'default'
  },

  travel: {
    name: 'Travel',
    icon: '✈️',
    tier: 'extended',
    topStyles: ['Cinematic', 'Photorealistic', 'Documentary', 'Watercolor', '3D Animation'],
    colorPalettes: {
      default: { colors: ['#03A9F4', '#FF9800', '#4CAF50'], name: 'Adventure' },
      wanderlust: { colors: ['#FF7043', '#FFC107', '#26A69A'], name: 'Wanderlust' },
      luxury: { colors: ['#212121', '#FFD700', '#FFFFFF'], name: 'Luxury Travel' }
    },
    keywords: ['travel', 'trip', 'vacation', 'destination', 'explore', 'adventure', 'flight', 'hotel', 'tourist', 'backpack', 'country', 'city', 'beach'],
    defaultPalette: 'default'
  },

  business: {
    name: 'Business & Entrepreneurship',
    icon: '💼',
    tier: 'extended',
    topStyles: ['3D Animation', 'Cinematic', 'Isometric 3D', '2D Minimal', 'Documentary'],
    colorPalettes: {
      default: { colors: ['#1565C0', '#37474F', '#FFFFFF'], name: 'Corporate' },
      startup: { colors: ['#7C4DFF', '#00BCD4', '#FFFFFF'], name: 'Startup Energy' },
      executive: { colors: ['#212121', '#C9A227', '#FFFFFF'], name: 'Executive' }
    },
    keywords: ['business', 'entrepreneur', 'startup', 'company', 'ceo', 'founder', 'marketing', 'sales', 'client', 'customer', 'revenue', 'profit', 'growth'],
    defaultPalette: 'default'
  },

  lifestyle: {
    name: 'Lifestyle',
    icon: '🌟',
    tier: 'extended',
    topStyles: ['Cinematic', '3D Animation', 'Watercolor', 'Photorealistic', 'Anime'],
    colorPalettes: {
      default: { colors: ['#E91E63', '#9C27B0', '#FFFFFF'], name: 'Lifestyle Pink' },
      minimal: { colors: ['#ECEFF1', '#607D8B', '#FFFFFF'], name: 'Minimal Aesthetic' },
      warm: { colors: ['#FF7043', '#FFC107', '#FFCCBC'], name: 'Warm Cozy' }
    },
    keywords: ['lifestyle', 'life', 'daily', 'routine', 'habit', 'morning', 'productivity', 'minimalist', 'aesthetic', 'vlog', 'day'],
    defaultPalette: 'default'
  },

  motivation: {
    name: 'Motivation & Self-Help',
    icon: '🔥',
    tier: 'extended',
    topStyles: ['Cinematic', '3D Animation', 'Silhouette', '2D Minimal', 'Documentary'],
    colorPalettes: {
      default: { colors: ['#FF5722', '#FFC107', '#212121'], name: 'Fire & Energy' },
      calm: { colors: ['#26A69A', '#FFE082', '#FFFFFF'], name: 'Calm Motivation' },
      dark: { colors: ['#212121', '#FFD700', '#FFFFFF'], name: 'Dark Motivation' }
    },
    keywords: ['motivation', 'inspire', 'success', 'goal', 'dream', 'hustle', 'grind', 'discipline', 'mindset', 'quote', 'believe', 'achieve', 'winner'],
    defaultPalette: 'default'
  },

  spirituality: {
    name: 'Spirituality',
    icon: '🧘',
    tier: 'extended',
    topStyles: ['Watercolor', 'Abstract', '2D Minimal', 'Silhouette', 'Anime'],
    colorPalettes: {
      default: { colors: ['#9C27B0', '#E1BEE7', '#FFFFFF'], name: 'Spiritual Purple' },
      nature: { colors: ['#4CAF50', '#FFC107', '#795548'], name: 'Earth & Spirit' },
      cosmic: { colors: ['#1A237E', '#7C4DFF', '#E1BEE7'], name: 'Cosmic' }
    },
    keywords: ['spiritual', 'meditation', 'mindfulness', 'zen', 'soul', 'universe', 'energy', 'chakra', 'manifest', 'gratitude', 'peace', 'consciousness'],
    defaultPalette: 'default'
  },

  kids: {
    name: 'Kids & Family',
    icon: '👨‍👩‍👧‍👦',
    tier: 'extended',
    topStyles: ['2D Animation', '3D Animation', 'Claymation', 'Paper Cutout', 'Pixel Art'],
    colorPalettes: {
      default: { colors: ['#FF4081', '#00BCD4', '#FFEB3B'], name: 'Playful Bright' },
      pastel: { colors: ['#F8BBD9', '#B3E5FC', '#DCEDC8'], name: 'Soft Pastel' },
      primary: { colors: ['#F44336', '#2196F3', '#FFEB3B'], name: 'Primary Colors' }
    },
    keywords: ['kids', 'children', 'family', 'parent', 'baby', 'toddler', 'child', 'play', 'fun', 'cartoon', 'nursery', 'educational'],
    defaultPalette: 'default'
  },

  science: {
    name: 'Science',
    icon: '🔬',
    tier: 'extended',
    topStyles: ['3D Animation', 'Isometric 3D', 'Documentary', 'Whiteboard', 'Photorealistic'],
    colorPalettes: {
      default: { colors: ['#00BCD4', '#4CAF50', '#FFFFFF'], name: 'Science Blue-Green' },
      space: { colors: ['#1A237E', '#7C4DFF', '#FFFFFF'], name: 'Space Science' },
      biology: { colors: ['#4CAF50', '#8BC34A', '#FFFFFF'], name: 'Life Science' }
    },
    keywords: ['science', 'scientist', 'research', 'experiment', 'physics', 'chemistry', 'biology', 'space', 'universe', 'planet', 'atom', 'molecule', 'discovery'],
    defaultPalette: 'default'
  },

  history: {
    name: 'History',
    icon: '🏛️',
    tier: 'extended',
    topStyles: ['Cinematic', 'Documentary', 'Oil Painting', '2D Minimal', '3D Animation'],
    colorPalettes: {
      default: { colors: ['#795548', '#FFC107', '#ECEFF1'], name: 'Historical Sepia' },
      ancient: { colors: ['#8D6E63', '#FFE082', '#D7CCC8'], name: 'Ancient' },
      war: { colors: ['#37474F', '#F44336', '#ECEFF1'], name: 'War History' }
    },
    keywords: ['history', 'historical', 'ancient', 'war', 'civilization', 'empire', 'king', 'queen', 'century', 'era', 'battle', 'revolution'],
    defaultPalette: 'default'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT CHARACTERISTICS SYSTEM
// Universal style matching based on content type, not niche
// ═══════════════════════════════════════════════════════════════════════════════

const CONTENT_CHARACTERISTICS = {
  // Content Type → Best Styles
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
    },
    professional_corporate: {
      styles: ['Cinematic', '3D Animation', 'Documentary', '2D Minimal'],
      signals: ['business', 'professional', 'corporate', 'company', 'enterprise', 'executive'],
      colorMood: 'professional'
    },
    playful_fun: {
      styles: ['2D Animation', '3D Animation', 'Pixel Art', 'Claymation', 'Pop Art'],
      signals: ['fun', 'funny', 'play', 'game', 'joke', 'laugh', 'silly', 'entertaining'],
      colorMood: 'vibrant'
    }
  },
  
  // Color Mood Templates
  colorMoods: {
    professional: ['#1565C0', '#37474F', '#FFFFFF'],
    emotional: ['#E91E63', '#9C27B0', '#FFC107'],
    analytical: ['#2196F3', '#607D8B', '#FFFFFF'],
    therapeutic: ['#E1BEE7', '#B2DFDB', '#FFF8E1'],
    energetic: ['#FF5722', '#FFC107', '#F44336'],
    calm: ['#90CAF9', '#A5D6A7', '#FFFFFF'],
    futuristic: ['#00E5FF', '#7C4DFF', '#121212'],
    warm: ['#FF7043', '#FFC107', '#795548'],
    vibrant: ['#E91E63', '#00BCD4', '#FFEB3B']
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// INTELLIGENT STYLE SUGGESTION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Universal Style Suggester
 * Works for ANY niche by analyzing content characteristics
 * 
 * @param {string} scriptContent - The script or topic text
 * @param {string} selectedNiche - User-selected niche (optional)
 * @returns {object} Comprehensive style suggestion
 */
function suggestStyleUniversal(scriptContent, selectedNiche = null) {
  const lowerContent = scriptContent.toLowerCase();
  
  // STEP 1: Detect niche if not provided
  let detectedNiche = selectedNiche;
  let nicheConfidence = 100;
  
  if (!detectedNiche) {
    const nicheDetection = detectNicheFromContent(lowerContent);
    detectedNiche = nicheDetection.niche;
    nicheConfidence = nicheDetection.confidence;
  }
  
  // STEP 2: Analyze content characteristics
  const contentAnalysis = analyzeContentCharacteristics(lowerContent);
  
  // STEP 3: Get niche-specific recommendations
  const nicheConfig = NICHE_DATABASE[detectedNiche];
  
  // STEP 4: Combine niche + content type for final recommendation
  let recommendedStyles = [];
  let recommendedPalette = null;
  
  if (nicheConfig) {
    // Known niche: Use niche top styles + content type adjustment
    recommendedStyles = adjustStylesForContentType(nicheConfig.topStyles, contentAnalysis);
    recommendedPalette = nicheConfig.colorPalettes[nicheConfig.defaultPalette];
  } else {
    // Unknown niche: Pure content-based recommendation
    recommendedStyles = contentAnalysis.recommendedStyles;
    recommendedPalette = { 
      colors: CONTENT_CHARACTERISTICS.colorMoods[contentAnalysis.colorMood],
      name: `${contentAnalysis.primaryType} palette`
    };
  }
  
  // STEP 5: Build final recommendation
  const primaryStyle = recommendedStyles[0];
  const styleSpec = VISUAL_STYLE_SPECS[primaryStyle] || VISUAL_STYLE_SPECS['3D Animation'];
  
  return {
    // Primary recommendation
    suggestedStyle: primaryStyle,
    confidence: calculateOverallConfidence(nicheConfidence, contentAnalysis.confidence),
    
    // Alternatives
    alternativeStyles: recommendedStyles.slice(1, 4),
    
    // Niche info
    detectedNiche: detectedNiche,
    nicheConfig: nicheConfig,
    nicheConfidence: nicheConfidence,
    
    // Content analysis
    contentType: contentAnalysis.primaryType,
    contentSignals: contentAnalysis.matchedSignals,
    
    // Style details
    technicalDNA: styleSpec.technicalDNA,
    colorPalette: recommendedPalette,
    colorMood: contentAnalysis.colorMood,
    
    // Human-readable reason
    reason: generateSuggestionReason(primaryStyle, detectedNiche, contentAnalysis)
  };
}

/**
 * Detect niche from content using keyword matching
 */
function detectNicheFromContent(content) {
  const scores = {};
  
  for (const [nicheKey, nicheConfig] of Object.entries(NICHE_DATABASE)) {
    const matches = nicheConfig.keywords.filter(kw => content.includes(kw));
    scores[nicheKey] = {
      score: matches.length,
      matches: matches
    };
  }
  
  // Find best match
  let bestNiche = 'general';
  let bestScore = 0;
  
  for (const [niche, data] of Object.entries(scores)) {
    if (data.score > bestScore) {
      bestScore = data.score;
      bestNiche = niche;
    }
  }
  
  // Calculate confidence
  const confidence = Math.min(95, Math.round((bestScore / 5) * 100));
  
  return {
    niche: bestScore >= 2 ? bestNiche : null, // Need at least 2 matches
    confidence: confidence,
    allScores: scores
  };
}

/**
 * Analyze content characteristics for style matching
 */
function analyzeContentCharacteristics(content) {
  const typeScores = {};
  let matchedSignals = [];
  
  for (const [typeName, typeConfig] of Object.entries(CONTENT_CHARACTERISTICS.contentTypes)) {
    const matches = typeConfig.signals.filter(signal => content.includes(signal));
    typeScores[typeName] = {
      score: matches.length,
      matches: matches,
      styles: typeConfig.styles,
      colorMood: typeConfig.colorMood
    };
    
    if (matches.length > 0) {
      matchedSignals.push(...matches);
    }
  }
  
  // Find primary content type
  let primaryType = 'educational_explainer'; // Default
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
    colorMood: primaryConfig.colorMood,
    matchedSignals: [...new Set(matchedSignals)], // Unique signals
    allScores: typeScores
  };
}

/**
 * Adjust niche styles based on content type
 */
function adjustStylesForContentType(nicheStyles, contentAnalysis) {
  // If content type strongly suggests different styles, blend them
  const contentStyles = contentAnalysis.recommendedStyles;
  
  // Find overlap
  const overlap = nicheStyles.filter(s => contentStyles.includes(s));
  
  if (overlap.length >= 2) {
    // Good overlap - prioritize overlap styles
    const remaining = nicheStyles.filter(s => !overlap.includes(s));
    return [...overlap, ...remaining].slice(0, 5);
  } else {
    // Weak overlap - alternate between niche and content styles
    const blended = [];
    for (let i = 0; i < 5; i++) {
      if (i % 2 === 0 && nicheStyles[Math.floor(i/2)]) {
        blended.push(nicheStyles[Math.floor(i/2)]);
      } else if (contentStyles[Math.floor(i/2)]) {
        blended.push(contentStyles[Math.floor(i/2)]);
      }
    }
    return [...new Set(blended)].slice(0, 5);
  }
}

/**
 * Calculate overall confidence score
 */
function calculateOverallConfidence(nicheConfidence, contentConfidence) {
  // Weighted average: niche detection is less critical than content analysis
  return Math.round((nicheConfidence * 0.4) + (contentConfidence * 0.6));
}

/**
 * Generate human-readable suggestion reason
 */
function generateSuggestionReason(style, niche, contentAnalysis) {
  const nicheConfig = NICHE_DATABASE[niche];
  const nicheName = nicheConfig?.name || 'General';
  const contentType = contentAnalysis.primaryType.replace(/_/g, ' ');
  
  const styleReasons = {
    '3D Animation': 'Professional quality with high engagement potential',
    'Anime': 'Emotionally expressive and highly relatable for audiences',
    'Whiteboard': 'Proven high retention for educational content',
    'Isometric 3D': 'Perfect for data visualization and process explanation',
    '2D Minimal': 'Clean, modern aesthetic for thoughtful content',
    'Cinematic': 'Authority positioning with premium feel',
    'Watercolor': 'Therapeutic and calming for sensitive topics',
    'Silhouette': 'Universal representation for relatable content',
    'Neon Cyberpunk': 'Futuristic aesthetic for tech-forward content',
    'Pixel Art': 'Nostalgic appeal for gaming and retro content',
    'Documentary': 'Authentic feel for credibility-focused content'
  };
  
  const reason = styleReasons[style] || 'Versatile style matching your content';
  
  return `${style} recommended for ${nicheName} content (${contentType}): ${reason}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI INTEGRATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all available niches for dropdown
 */
function getAllNiches() {
  return Object.entries(NICHE_DATABASE).map(([key, config]) => ({
    value: key,
    label: `${config.icon} ${config.name}`,
    tier: config.tier
  }));
}

/**
 * Get top styles for any niche
 */
function getTopStylesForNiche(nicheKey) {
  const config = NICHE_DATABASE[nicheKey];
  if (!config) {
    // Fallback to universal recommendation
    return ['3D Animation', 'Cinematic', '2D Minimal', 'Whiteboard', 'Anime'];
  }
  return config.topStyles;
}

/**
 * Get color palette for niche
 */
function getNicheColorPalette(nicheKey, paletteName = null) {
  const config = NICHE_DATABASE[nicheKey];
  if (!config) {
    return { colors: ['#2196F3', '#4CAF50', '#FFFFFF'], name: 'Default' };
  }
  
  const palette = paletteName 
    ? config.colorPalettes[paletteName] 
    : config.colorPalettes[config.defaultPalette];
    
  return palette || config.colorPalettes[Object.keys(config.colorPalettes)[0]];
}

/**
 * Update style rankings display based on selected niche
 */
function updateNicheRankings(nicheKey) {
  const topStyles = getTopStylesForNiche(nicheKey);
  const styleSelect = document.getElementById('veoVisualStyle');
  
  if (!styleSelect) return;
  
  // Update option labels with rankings
  Array.from(styleSelect.options).forEach(option => {
    const styleName = option.value;
    const rank = topStyles.indexOf(styleName);
    
    if (rank !== -1) {
      // Style is in top 5 for this niche
      const rankLabel = `#${rank + 1}`;
      if (!option.text.includes('#')) {
        option.text = `${option.text} (${rankLabel})`;
      } else {
        option.text = option.text.replace(/\(#\d+\)/, `(${rankLabel})`);
      }
    } else {
      // Remove ranking if not in top 5
      option.text = option.text.replace(/\s*\(#\d+\)/, '');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-APPLY INTEGRATION
// Call this when script/topic changes to auto-suggest style
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Auto-apply suggested style to UI
 * Call this when user enters/changes topic
 */
function autoApplyStyleSuggestion(scriptContent) {
  if (!scriptContent || scriptContent.length < 20) return null;
  
  const selectedNiche = document.getElementById('contentNiche')?.value;
  const suggestion = suggestStyleUniversal(scriptContent, selectedNiche);
  
  // Only auto-apply if confidence is high enough
  if (suggestion.confidence >= 50) {
    const styleSelect = document.getElementById('veoVisualStyle');
    if (styleSelect && !state.styleManuallySet) {
      styleSelect.value = suggestion.suggestedStyle;
      
      // Update preview
      updateStylePreview();
      
      // Log suggestion
      console.log('🎨 Auto-suggested style:', suggestion);
      
      // Show notification
      veoLog(`🎨 Suggested: ${suggestion.suggestedStyle} (${suggestion.confidence}% confidence)`, 'info');
    }
  }
  
  return suggestion;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Export for use in other modules
// export { NICHE_DATABASE, CONTENT_CHARACTERISTICS, suggestStyleUniversal, getAllNiches, getTopStylesForNiche, getNicheColorPalette, autoApplyStyleSuggestion };
