// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE SIGNAL WORDS SYSTEM v2.0
// Advanced niche detection with weighted scoring, phrase matching, and disambiguation
// 
// REPLACES: Simple keywords array in NICHE_DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * SIGNAL WEIGHT SYSTEM
 * - 3 = Strong signal (very specific to niche)
 * - 2 = Medium signal (common in niche)
 * - 1 = Weak signal (appears in niche but not exclusive)
 * 
 * PHRASE MATCHING
 * - Phrases are checked BEFORE single words
 * - Phrases get bonus weight (+1)
 * 
 * DISAMBIGUATION
 * - Some words have context rules
 * - Negative signals subtract from score
 */

const NICHE_SIGNALS = {
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // 💰 FINANCE (Personal Finance, Investing, Money Management)
  // ═══════════════════════════════════════════════════════════════════════════════
  finance: {
    name: 'Personal Finance',
    icon: '💰',
    
    // Strong signals (weight 3) - Very specific to finance
    strongSignals: [
      // Money & Currency
      'money', 'dollar', 'cash', 'currency', 'wealth', 'rich', 'millionaire', 'billionaire',
      // Banking
      'bank', 'banking', 'savings account', 'checking account', 'interest rate', 'apr', 'apy',
      // Investing
      'invest', 'investing', 'investment', 'investor', 'portfolio', 'diversify', 'diversification',
      'stock', 'stocks', 'bond', 'bonds', 'etf', 'mutual fund', 'index fund', 'dividend',
      'compound interest', 'capital gains', 'asset allocation', 'rebalancing',
      // Retirement
      'retire', 'retirement', '401k', '401(k)', 'ira', 'roth', 'pension', 'social security',
      // Debt
      'debt', 'loan', 'mortgage', 'credit card', 'interest', 'apr', 'refinance', 'consolidate',
      'pay off debt', 'debt free', 'student loan', 'auto loan', 'personal loan',
      // Budgeting
      'budget', 'budgeting', 'expense', 'spending', 'frugal', 'save money', 'saving money',
      'emergency fund', 'sinking fund', 'zero-based budget', 'envelope system',
      // Income
      'income', 'salary', 'wage', 'paycheck', 'side hustle', 'passive income', 'multiple streams',
      // Tax
      'tax', 'taxes', 'tax return', 'deduction', 'write-off', 'tax bracket', 'irs',
      // Credit
      'credit score', 'credit report', 'fico', 'credit history', 'credit utilization',
      // Crypto/Modern
      'crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'nft',
      // Financial Planning
      'financial', 'finance', 'net worth', 'assets', 'liabilities', 'balance sheet',
      'financial freedom', 'financial independence', 'fire movement', 'early retirement'
    ],
    
    // Medium signals (weight 2) - Common in finance
    mediumSignals: [
      'afford', 'expensive', 'cheap', 'cost', 'price', 'value', 'worth',
      'earn', 'earnings', 'profit', 'loss', 'gain', 'return', 'roi',
      'market', 'economy', 'economic', 'inflation', 'recession', 'growth',
      'payment', 'pay', 'bill', 'bills', 'fee', 'charge',
      'account', 'transfer', 'deposit', 'withdraw', 'transaction',
      'insurance', 'coverage', 'premium', 'deductible',
      'real estate', 'property', 'rent', 'landlord', 'tenant', 'lease',
      'business', 'entrepreneur', 'startup', 'revenue', 'profit margin'
    ],
    
    // Weak signals (weight 1) - Appears but not exclusive
    weakSignals: [
      'goal', 'plan', 'strategy', 'future', 'security', 'freedom',
      'smart', 'decision', 'choice', 'opportunity', 'risk',
      'number', 'calculate', 'math', 'percent', 'percentage'
    ],
    
    // Phrases (checked first, bonus weight)
    phrases: [
      'how to save', 'how to invest', 'how to budget', 'how to make money',
      'pay off', 'build wealth', 'grow wealth', 'financial goals',
      'money management', 'personal finance', 'money tips', 'finance tips',
      'get rich', 'become wealthy', 'make money', 'earn money',
      'credit card debt', 'student loan debt', 'mortgage payment',
      'retirement savings', 'emergency fund', 'rainy day fund',
      'compound interest', 'dollar cost averaging', 'buy and hold',
      'financial advisor', 'financial planner', 'wealth manager',
      'side income', 'extra income', 'passive income streams',
      'tax deduction', 'tax credit', 'tax refund', 'tax season'
    ],
    
    // Negative signals (subtract from score if present)
    negativeSignals: [
      'mental health', 'therapy', 'therapist', 'anxiety disorder', 'depression treatment',
      'workout', 'exercise routine', 'gym membership', 'fitness goal',
      'recipe', 'cooking', 'ingredient', 'meal prep',
      'video game', 'gaming setup', 'playstation', 'xbox'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🧠 PSYCHOLOGY (Mental Health, Relationships, Self-Understanding)
  // ═══════════════════════════════════════════════════════════════════════════════
  psychology: {
    name: 'Psychology',
    icon: '🧠',
    
    strongSignals: [
      // Mental Health Conditions
      'anxiety', 'depression', 'bipolar', 'ocd', 'ptsd', 'adhd', 'add',
      'panic attack', 'panic disorder', 'social anxiety', 'generalized anxiety',
      'borderline', 'bpd', 'narcissist', 'narcissism', 'npd', 'sociopath', 'psychopath',
      'schizophrenia', 'dissociation', 'dissociative', 'trauma', 'traumatic',
      'eating disorder', 'anorexia', 'bulimia', 'binge eating',
      // Therapy & Treatment
      'therapy', 'therapist', 'psychologist', 'psychiatrist', 'counselor', 'counseling',
      'cbt', 'cognitive behavioral', 'dbt', 'emdr', 'psychotherapy', 'mental health',
      // Emotions & Feelings
      'emotion', 'emotional', 'feelings', 'feel', 'feeling',
      'sad', 'sadness', 'angry', 'anger', 'fear', 'scared', 'worried', 'worry',
      'happy', 'happiness', 'joy', 'love', 'hate', 'jealous', 'jealousy', 'envy',
      'guilt', 'guilty', 'shame', 'ashamed', 'embarrassed', 'embarrassment',
      'lonely', 'loneliness', 'isolated', 'isolation',
      // Personality & Identity
      'personality', 'introvert', 'extrovert', 'ambivert', 'mbti', 'enneagram',
      'big five', 'personality type', 'personality trait', 'temperament',
      'self-esteem', 'self-worth', 'self-image', 'identity', 'ego',
      // Relationships
      'relationship', 'attachment', 'attachment style', 'anxious attachment', 'avoidant',
      'codependent', 'codependency', 'toxic relationship', 'gaslighting', 'manipulation',
      'boundaries', 'boundary', 'red flag', 'green flag',
      // Psychology Concepts
      'subconscious', 'unconscious', 'cognitive', 'cognition', 'behavior', 'behavioral',
      'psychology', 'psychological', 'psyche', 'mind', 'mental',
      'defense mechanism', 'projection', 'denial', 'repression', 'rationalization',
      // Healing & Growth
      'heal', 'healing', 'recovery', 'recovering', 'cope', 'coping', 'coping mechanism',
      'self-care', 'self care', 'self-love', 'self love', 'inner child', 'shadow work'
    ],
    
    mediumSignals: [
      'brain', 'neuroscience', 'neurotransmitter', 'dopamine', 'serotonin', 'cortisol',
      'stress', 'stressed', 'stressful', 'overwhelm', 'overwhelmed', 'burnout',
      'trigger', 'triggered', 'triggering', 'sensitive', 'sensitivity',
      'communicate', 'communication', 'conflict', 'argue', 'argument', 'fight',
      'trust', 'trust issues', 'betrayal', 'heartbreak', 'breakup', 'divorce',
      'parent', 'parenting', 'childhood', 'upbringing', 'family dynamic',
      'habit', 'pattern', 'cycle', 'breaking the cycle', 'generational',
      'mindset', 'perspective', 'perception', 'belief', 'limiting belief',
      'struggle', 'suffering', 'pain', 'hurt', 'wound', 'wounded'
    ],
    
    weakSignals: [
      'think', 'thought', 'thinking', 'understand', 'understanding',
      'why', 'reason', 'cause', 'effect', 'impact',
      'change', 'grow', 'growth', 'improve', 'better',
      'sign', 'signs', 'symptom', 'symptoms'
    ],
    
    phrases: [
      'mental health', 'mental illness', 'mental disorder', 'emotional health',
      'how to cope', 'how to heal', 'how to deal with', 'how to overcome',
      'signs of', 'symptoms of', 'types of', 'causes of',
      'attachment style', 'love language', 'personality type',
      'toxic person', 'toxic people', 'toxic relationship', 'red flags',
      'inner child', 'shadow self', 'true self', 'authentic self',
      'self awareness', 'self reflection', 'self improvement',
      'emotional intelligence', 'emotional regulation', 'emotional maturity',
      'fight or flight', 'nervous system', 'vagus nerve',
      'childhood trauma', 'generational trauma', 'complex trauma',
      'why you', 'why do i', 'why does', 'what happens when',
      'psychology of', 'psychology behind', 'science of'
    ],
    
    negativeSignals: [
      'stock market', 'invest money', 'savings account', 'retirement fund',
      'workout routine', 'weight loss', 'muscle gain', 'fitness program',
      'recipe', 'cooking', 'restaurant', 'food review'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 💪 HEALTH & FITNESS
  // ═══════════════════════════════════════════════════════════════════════════════
  health: {
    name: 'Health & Fitness',
    icon: '💪',
    
    strongSignals: [
      // Exercise & Fitness
      'exercise', 'workout', 'work out', 'training', 'train', 'gym', 'fitness',
      'cardio', 'strength training', 'weight training', 'resistance training',
      'hiit', 'crossfit', 'bodybuilding', 'powerlifting', 'calisthenics',
      'running', 'jogging', 'marathon', 'sprint', 'cycling', 'swimming',
      'yoga', 'pilates', 'stretching', 'flexibility', 'mobility',
      // Body & Physique
      'muscle', 'muscles', 'abs', 'biceps', 'triceps', 'chest', 'back', 'legs',
      'body fat', 'lean', 'toned', 'bulk', 'bulking', 'cutting', 'shredded',
      'weight loss', 'lose weight', 'fat loss', 'burn fat', 'calories burned',
      'weight gain', 'gain weight', 'build muscle', 'muscle growth',
      // Nutrition & Diet
      'nutrition', 'nutrient', 'nutrients', 'protein', 'carbs', 'carbohydrates', 'fat',
      'diet', 'dieting', 'keto', 'ketogenic', 'paleo', 'vegan', 'vegetarian',
      'intermittent fasting', 'fasting', 'calorie', 'calories', 'macro', 'macros',
      'supplement', 'supplements', 'vitamins', 'minerals', 'creatine', 'pre-workout',
      // Sleep & Recovery (HEALTH-SPECIFIC)
      'sleep', 'sleeping', 'insomnia', 'sleep quality', 'deep sleep', 'rem sleep',
      'rest', 'recovery', 'rest day', 'muscle recovery', 'soreness',
      'circadian rhythm', 'sleep schedule', 'sleep hygiene', 'melatonin',
      // Health Conditions
      'disease', 'illness', 'sick', 'sickness', 'symptom', 'symptoms',
      'diabetes', 'heart disease', 'blood pressure', 'cholesterol', 'obesity',
      'cancer', 'immune system', 'immunity', 'inflammation', 'chronic',
      // Body Functions
      'metabolism', 'metabolic', 'digestion', 'digestive', 'gut health',
      'hydration', 'water intake', 'electrolytes', 'energy level', 'fatigue',
      // Wellness
      'wellness', 'healthy', 'health', 'wellbeing', 'well-being', 'longevity',
      'doctor', 'physician', 'medical', 'medicine', 'treatment', 'cure'
    ],
    
    mediumSignals: [
      'body', 'physical', 'fit', 'strong', 'strength', 'endurance', 'stamina',
      'routine', 'schedule', 'program', 'plan', 'regiment',
      'meal', 'meals', 'eating', 'eat', 'food', 'foods',
      'habit', 'habits', 'lifestyle', 'daily', 'weekly',
      'morning', 'night', 'routine', 'ritual',
      'goal', 'goals', 'progress', 'results', 'transformation',
      'beginner', 'intermediate', 'advanced', 'level'
    ],
    
    weakSignals: [
      'tip', 'tips', 'advice', 'guide', 'how to',
      'best', 'worst', 'mistake', 'mistakes', 'avoid',
      'start', 'starting', 'begin', 'beginning'
    ],
    
    phrases: [
      'how to lose weight', 'how to build muscle', 'how to get fit',
      'weight loss journey', 'fitness journey', 'transformation',
      'workout routine', 'exercise routine', 'training program',
      'healthy eating', 'clean eating', 'meal prep', 'meal plan',
      'full body workout', 'upper body', 'lower body', 'leg day', 'arm day',
      'burn calories', 'calorie deficit', 'calorie surplus',
      'get in shape', 'stay fit', 'stay healthy',
      'sleep better', 'improve sleep', 'sleep tips', 'good night sleep',
      'boost metabolism', 'speed up metabolism',
      'immune system', 'boost immunity', 'stay healthy',
      'morning routine', 'night routine', 'daily habits',
      'before and after', 'weight loss tips', 'fitness tips'
    ],
    
    negativeSignals: [
      'stock price', 'invest', 'savings', 'retirement', '401k',
      'anxiety disorder', 'depression treatment', 'therapy session',
      'video game', 'gaming', 'playstation', 'xbox'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎮 GAMING
  // ═══════════════════════════════════════════════════════════════════════════════
  gaming: {
    name: 'Gaming',
    icon: '🎮',
    
    strongSignals: [
      // Platforms & Hardware
      'playstation', 'ps5', 'ps4', 'xbox', 'nintendo', 'switch', 'pc gaming',
      'console', 'controller', 'keyboard', 'mouse', 'gaming setup', 'gaming chair',
      'gpu', 'graphics card', 'fps', 'frame rate', 'resolution', '4k gaming',
      // Gaming Types
      'video game', 'videogame', 'game', 'gamer', 'gaming',
      'rpg', 'mmorpg', 'fps game', 'battle royale', 'moba', 'rts', 'sandbox',
      'single player', 'multiplayer', 'co-op', 'pvp', 'pve', 'online game',
      // Gameplay
      'level', 'level up', 'xp', 'experience points', 'skill tree', 'upgrade',
      'quest', 'mission', 'boss', 'boss fight', 'raid', 'dungeon',
      'loot', 'drop', 'rare', 'legendary', 'epic', 'common',
      'spawn', 'respawn', 'checkpoint', 'save point', 'game over',
      'speedrun', 'speedrunning', 'world record', 'wr',
      // Esports & Streaming
      'esports', 'e-sports', 'tournament', 'competitive', 'ranked',
      'stream', 'streaming', 'twitch', 'streamer', 'content creator',
      'lets play', 'gameplay', 'walkthrough', 'playthrough', 'guide',
      // Popular Games/Series
      'minecraft', 'fortnite', 'call of duty', 'cod', 'gta', 'zelda', 'mario',
      'elden ring', 'dark souls', 'pokemon', 'fifa', 'madden', 'nba 2k',
      'league of legends', 'lol', 'valorant', 'apex legends', 'overwatch',
      // Gaming Culture
      'noob', 'pro', 'tryhard', 'casual', 'hardcore', 'meta', 'nerf', 'buff',
      'glitch', 'bug', 'exploit', 'mod', 'modding', 'dlc', 'expansion',
      'easter egg', 'secret', 'hidden', 'unlock', 'achievement', 'trophy'
    ],
    
    mediumSignals: [
      'play', 'playing', 'player', 'players',
      'character', 'avatar', 'skin', 'cosmetic', 'customization',
      'map', 'world', 'open world', 'sandbox',
      'story', 'storyline', 'narrative', 'campaign', 'ending',
      'review', 'rating', 'score', 'tier list', 'ranking',
      'release', 'launch', 'update', 'patch', 'season'
    ],
    
    weakSignals: [
      'fun', 'entertainment', 'hobby', 'free time',
      'best', 'worst', 'top', 'favorite'
    ],
    
    phrases: [
      'video game', 'video games', 'gaming setup', 'gaming pc',
      'how to play', 'how to beat', 'how to get', 'how to unlock',
      'best games', 'worst games', 'top 10 games', 'game of the year',
      'new game', 'upcoming games', 'game release', 'game trailer',
      'tips and tricks', 'pro tips', 'beginner guide', 'advanced guide',
      'boss guide', 'walkthrough guide', 'strategy guide',
      'ranked gameplay', 'competitive gameplay', 'tournament gameplay',
      'live stream', 'gaming stream', 'reaction to', 'first time playing'
    ],
    
    negativeSignals: [
      'invest money', 'stock market', 'retirement',
      'therapy', 'mental health treatment', 'psychologist',
      'workout', 'exercise routine', 'gym session'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 💻 TECHNOLOGY
  // ═══════════════════════════════════════════════════════════════════════════════
  technology: {
    name: 'Technology',
    icon: '💻',
    
    strongSignals: [
      // AI & Machine Learning
      'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
      'neural network', 'gpt', 'chatgpt', 'claude', 'llm', 'large language model',
      'automation', 'automate', 'bot', 'chatbot', 'algorithm',
      // Programming & Development
      'code', 'coding', 'programming', 'developer', 'software', 'app', 'application',
      'python', 'javascript', 'java', 'html', 'css', 'react', 'node',
      'api', 'database', 'server', 'cloud', 'aws', 'azure', 'devops',
      'github', 'git', 'repository', 'open source', 'framework', 'library',
      // Hardware & Devices
      'computer', 'laptop', 'desktop', 'smartphone', 'phone', 'tablet', 'device',
      'processor', 'cpu', 'ram', 'storage', 'ssd', 'hardware', 'specs',
      'iphone', 'android', 'samsung', 'apple', 'google', 'microsoft',
      // Internet & Web
      'internet', 'website', 'web', 'online', 'digital', 'cyber', 'cybersecurity',
      'browser', 'chrome', 'firefox', 'safari', 'download', 'upload',
      'wifi', 'network', 'router', 'bandwidth', 'vpn', 'encryption',
      // Tech Trends
      'startup', 'tech company', 'silicon valley', 'innovation', 'disrupt',
      'virtual reality', 'vr', 'augmented reality', 'ar', 'metaverse',
      'iot', 'internet of things', 'smart home', 'smart device', 'wearable',
      'quantum computing', 'blockchain', '5g', 'tech news', 'gadget'
    ],
    
    mediumSignals: [
      'tech', 'technology', 'digital', 'electronic', 'smart',
      'feature', 'features', 'function', 'tool', 'tools',
      'update', 'upgrade', 'version', 'release', 'beta',
      'review', 'comparison', 'versus', 'vs', 'better',
      'tutorial', 'how to', 'guide', 'setup', 'install'
    ],
    
    weakSignals: [
      'new', 'latest', 'modern', 'advanced', 'future',
      'fast', 'speed', 'performance', 'efficient'
    ],
    
    phrases: [
      'artificial intelligence', 'machine learning', 'deep learning',
      'how to code', 'learn to code', 'coding tutorial',
      'tech review', 'product review', 'gadget review',
      'best apps', 'best software', 'best tools',
      'new technology', 'tech news', 'tech trends',
      'setup guide', 'installation guide', 'tutorial for',
      'ai tools', 'ai apps', 'ai software',
      'smart home', 'home automation', 'iot devices',
      'cybersecurity tips', 'online security', 'privacy tips'
    ],
    
    negativeSignals: [
      'therapy session', 'mental health', 'psychologist',
      'workout routine', 'gym', 'exercise',
      'recipe', 'cooking', 'meal prep'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 📚 EDUCATION
  // ═══════════════════════════════════════════════════════════════════════════════
  education: {
    name: 'Education',
    icon: '📚',
    
    strongSignals: [
      // Academic
      'learn', 'learning', 'study', 'studying', 'student', 'teacher', 'professor',
      'school', 'college', 'university', 'degree', 'diploma', 'certificate',
      'class', 'classroom', 'lecture', 'course', 'curriculum', 'syllabus',
      'exam', 'test', 'quiz', 'assignment', 'homework', 'essay', 'thesis',
      'grade', 'gpa', 'pass', 'fail', 'graduation', 'graduate',
      // Subjects
      'math', 'mathematics', 'algebra', 'calculus', 'geometry', 'statistics',
      'science', 'physics', 'chemistry', 'biology', 'astronomy',
      'history', 'geography', 'literature', 'english', 'language',
      'economics', 'sociology', 'philosophy', 'psychology course',
      // Learning Methods
      'tutorial', 'lesson', 'explanation', 'explain', 'understand', 'concept',
      'teach', 'teaching', 'educate', 'education', 'educational',
      'beginner', 'intermediate', 'advanced', 'basics', 'fundamentals',
      'practice', 'exercise', 'problem', 'solution', 'answer',
      // Skills & Knowledge
      'skill', 'skills', 'knowledge', 'expertise', 'competency',
      'memory', 'memorize', 'remember', 'retain', 'recall',
      'note', 'notes', 'note-taking', 'summarize', 'summary'
    ],
    
    mediumSignals: [
      'book', 'textbook', 'reading', 'read', 'write', 'writing',
      'research', 'researcher', 'academic', 'scholar', 'scholarly',
      'topic', 'subject', 'material', 'content', 'information',
      'method', 'technique', 'approach', 'strategy', 'system'
    ],
    
    weakSignals: [
      'tip', 'tips', 'advice', 'guide', 'how to',
      'improve', 'better', 'master', 'expert'
    ],
    
    phrases: [
      'how to learn', 'how to study', 'how to memorize',
      'study tips', 'learning tips', 'study techniques',
      'explained simply', 'for beginners', 'step by step',
      'online course', 'free course', 'best courses',
      'exam preparation', 'test prep', 'study guide',
      'back to school', 'college tips', 'university life',
      'learn faster', 'study smarter', 'improve grades'
    ],
    
    negativeSignals: [
      'stock market', 'investing', 'retirement',
      'workout', 'gym', 'fitness',
      'video game', 'gaming', 'playstation'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🍳 COOKING & FOOD
  // ═══════════════════════════════════════════════════════════════════════════════
  cooking: {
    name: 'Cooking & Food',
    icon: '🍳',
    
    strongSignals: [
      // Cooking Actions
      'cook', 'cooking', 'bake', 'baking', 'fry', 'frying', 'grill', 'grilling',
      'roast', 'roasting', 'steam', 'steaming', 'boil', 'boiling', 'sauté',
      'chop', 'slice', 'dice', 'mince', 'mix', 'stir', 'whisk', 'blend',
      'marinate', 'season', 'seasoning', 'spice', 'spices', 'herb', 'herbs',
      // Food & Ingredients
      'recipe', 'recipes', 'ingredient', 'ingredients', 'dish', 'meal', 'food',
      'chicken', 'beef', 'pork', 'fish', 'seafood', 'vegetable', 'vegetables',
      'pasta', 'rice', 'bread', 'soup', 'salad', 'sauce', 'dressing',
      'dessert', 'cake', 'cookie', 'pie', 'chocolate', 'ice cream',
      'breakfast', 'lunch', 'dinner', 'brunch', 'snack', 'appetizer',
      // Kitchen & Equipment
      'kitchen', 'chef', 'cook', 'home cook', 'foodie',
      'oven', 'stove', 'pan', 'pot', 'skillet', 'wok', 'knife', 'cutting board',
      'blender', 'mixer', 'food processor', 'instant pot', 'air fryer',
      // Cuisines
      'cuisine', 'italian', 'mexican', 'chinese', 'japanese', 'indian', 'thai',
      'french', 'mediterranean', 'american', 'korean', 'vietnamese',
      // Food Culture
      'restaurant', 'cafe', 'bakery', 'food truck', 'dining', 'eat out',
      'taste', 'flavor', 'delicious', 'yummy', 'tasty', 'savory', 'sweet',
      'foodie', 'food blog', 'food photography', 'mukbang'
    ],
    
    mediumSignals: [
      'eat', 'eating', 'hungry', 'hunger', 'appetite',
      'fresh', 'organic', 'homemade', 'from scratch',
      'quick', 'easy', 'simple', 'minute', 'minutes',
      'serve', 'serving', 'portion', 'plate', 'bowl'
    ],
    
    weakSignals: [
      'make', 'making', 'prepare', 'preparation',
      'favorite', 'best', 'worst', 'top'
    ],
    
    phrases: [
      'how to cook', 'how to make', 'how to bake',
      'recipe for', 'easy recipe', 'quick recipe', 'best recipe',
      'meal prep', 'meal planning', 'weekly meals',
      'cooking tips', 'kitchen tips', 'cooking hacks',
      'what to cook', 'dinner ideas', 'lunch ideas', 'breakfast ideas',
      'food review', 'restaurant review', 'taste test',
      'step by step recipe', 'full recipe', 'complete recipe'
    ],
    
    negativeSignals: [
      'stock market', 'investing', 'retirement fund',
      'workout', 'exercise', 'gym routine',
      'video game', 'gaming setup'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ✈️ TRAVEL
  // ═══════════════════════════════════════════════════════════════════════════════
  travel: {
    name: 'Travel',
    icon: '✈️',
    
    strongSignals: [
      // Travel Actions
      'travel', 'traveling', 'trip', 'vacation', 'holiday', 'getaway',
      'visit', 'visiting', 'explore', 'exploring', 'adventure', 'journey',
      'fly', 'flying', 'flight', 'airport', 'airline', 'plane',
      'drive', 'road trip', 'car rental', 'train', 'cruise', 'ferry',
      // Accommodation
      'hotel', 'hostel', 'airbnb', 'resort', 'motel', 'lodge', 'cabin',
      'booking', 'reservation', 'check in', 'check out', 'stay', 'accommodation',
      // Destinations
      'destination', 'country', 'city', 'town', 'village', 'island', 'beach',
      'mountain', 'national park', 'landmark', 'attraction', 'tourist',
      'europe', 'asia', 'america', 'africa', 'australia', 'caribbean',
      'paris', 'london', 'tokyo', 'new york', 'bali', 'dubai', 'rome',
      // Travel Planning
      'itinerary', 'plan', 'planning', 'budget travel', 'backpacking', 'backpacker',
      'passport', 'visa', 'immigration', 'customs', 'luggage', 'packing',
      'travel insurance', 'travel tips', 'travel guide', 'travel hack',
      // Travel Experiences
      'sightseeing', 'tour', 'guided tour', 'excursion', 'activity', 'experience',
      'local', 'culture', 'cultural', 'heritage', 'tradition', 'authentic',
      'photography', 'photo spot', 'instagram', 'scenic', 'view', 'sunset'
    ],
    
    mediumSignals: [
      'abroad', 'overseas', 'international', 'domestic', 'foreign',
      'wanderlust', 'nomad', 'digital nomad', 'expat',
      'cheap', 'expensive', 'affordable', 'luxury', 'budget',
      'best time', 'season', 'weather', 'climate'
    ],
    
    weakSignals: [
      'place', 'places', 'location', 'area', 'region',
      'beautiful', 'amazing', 'stunning', 'incredible'
    ],
    
    phrases: [
      'travel guide', 'travel tips', 'travel vlog', 'travel blog',
      'places to visit', 'things to do', 'must see', 'bucket list',
      'how to travel', 'where to go', 'when to visit',
      'best hotels', 'best restaurants', 'best attractions',
      'road trip', 'backpacking trip', 'solo travel', 'family vacation',
      'travel on a budget', 'cheap travel', 'luxury travel',
      'packing list', 'what to pack', 'travel essentials'
    ],
    
    negativeSignals: [
      'stock market', 'investing', 'retirement',
      'therapy', 'mental health treatment',
      'workout routine', 'gym', 'exercise program'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 💼 BUSINESS & ENTREPRENEURSHIP
  // ═══════════════════════════════════════════════════════════════════════════════
  business: {
    name: 'Business',
    icon: '💼',
    
    strongSignals: [
      // Business Fundamentals
      'business', 'company', 'corporation', 'enterprise', 'organization',
      'entrepreneur', 'entrepreneurship', 'founder', 'ceo', 'owner',
      'startup', 'small business', 'corporation', 'llc', 'inc',
      // Operations
      'management', 'manager', 'leadership', 'leader', 'executive',
      'strategy', 'strategic', 'planning', 'operation', 'operations',
      'employee', 'staff', 'team', 'hire', 'hiring', 'recruitment',
      'meeting', 'presentation', 'pitch', 'proposal', 'negotiation',
      // Marketing & Sales
      'marketing', 'sales', 'selling', 'customer', 'client', 'consumer',
      'brand', 'branding', 'advertising', 'promotion', 'campaign',
      'lead', 'leads', 'conversion', 'funnel', 'crm', 'b2b', 'b2c',
      'social media marketing', 'content marketing', 'email marketing', 'seo',
      // Finance (Business context)
      'revenue', 'profit', 'loss', 'margin', 'cash flow', 'funding',
      'investor', 'investment', 'venture capital', 'vc', 'angel investor',
      'valuation', 'equity', 'stock option', 'ipo', 'acquisition', 'merger',
      // Industry
      'industry', 'market', 'competition', 'competitor', 'competitive',
      'product', 'service', 'solution', 'innovation', 'disrupt', 'scale'
    ],
    
    mediumSignals: [
      'work', 'job', 'career', 'professional', 'office',
      'project', 'task', 'deadline', 'goal', 'target', 'kpi',
      'success', 'failure', 'growth', 'expand', 'expansion',
      'network', 'networking', 'connection', 'partner', 'partnership'
    ],
    
    weakSignals: [
      'opportunity', 'challenge', 'problem', 'solution',
      'idea', 'concept', 'plan', 'execute'
    ],
    
    phrases: [
      'how to start a business', 'start a company', 'business idea',
      'business plan', 'business model', 'business strategy',
      'marketing strategy', 'sales strategy', 'growth strategy',
      'small business tips', 'entrepreneur tips', 'startup advice',
      'make money online', 'online business', 'side business',
      'leadership skills', 'management skills', 'business skills',
      'raise funding', 'get investors', 'pitch deck'
    ],
    
    negativeSignals: [
      'personal finance', 'savings account', 'retirement fund',
      'therapy', 'mental health', 'psychologist',
      'workout', 'gym', 'fitness routine'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🔥 MOTIVATION & SELF-HELP
  // ═══════════════════════════════════════════════════════════════════════════════
  motivation: {
    name: 'Motivation',
    icon: '🔥',
    
    strongSignals: [
      // Motivation Core
      'motivation', 'motivate', 'motivated', 'inspire', 'inspiration', 'inspirational',
      'success', 'successful', 'achieve', 'achievement', 'accomplish', 'accomplishment',
      'goal', 'goals', 'dream', 'dreams', 'vision', 'purpose', 'mission',
      // Mindset
      'mindset', 'attitude', 'positive', 'positivity', 'optimism', 'optimistic',
      'believe', 'belief', 'confidence', 'confident', 'self-belief',
      'growth mindset', 'fixed mindset', 'winner', 'winning', 'champion',
      // Action & Discipline
      'discipline', 'disciplined', 'consistency', 'consistent', 'perseverance',
      'hustle', 'grind', 'work hard', 'hard work', 'dedication', 'committed',
      'action', 'take action', 'execute', 'do it', 'start', 'begin', 'now',
      'no excuses', 'push through', 'never give up', 'keep going', 'dont quit',
      // Personal Development
      'self-improvement', 'self-development', 'personal growth', 'personal development',
      'better yourself', 'improve yourself', 'level up', 'upgrade', 'transform',
      'potential', 'unlock potential', 'best version', 'best self',
      // Overcoming
      'overcome', 'conquer', 'defeat', 'struggle', 'challenge', 'obstacle',
      'failure', 'fail', 'setback', 'comeback', 'resilience', 'resilient',
      'fear', 'fearless', 'courage', 'brave', 'bold'
    ],
    
    mediumSignals: [
      'life', 'living', 'lifestyle', 'change', 'changing',
      'power', 'powerful', 'strength', 'strong',
      'habit', 'habits', 'routine', 'daily', 'morning',
      'quote', 'quotes', 'wisdom', 'lesson', 'advice'
    ],
    
    weakSignals: [
      'want', 'need', 'desire', 'wish', 'hope',
      'try', 'effort', 'work', 'focus'
    ],
    
    phrases: [
      'how to be successful', 'how to achieve', 'how to stay motivated',
      'motivational speech', 'motivational video', 'motivation monday',
      'success tips', 'success habits', 'habits of successful people',
      'morning routine', 'daily routine', 'productive routine',
      'goal setting', 'set goals', 'achieve goals',
      'never give up', 'dont quit', 'keep pushing',
      'change your life', 'transform your life', 'level up your life',
      'best advice', 'life advice', 'success advice'
    ],
    
    negativeSignals: [
      'stock market', 'investing', 'retirement fund',
      'therapy', 'mental illness', 'depression treatment',
      'workout routine', 'gym membership', 'fitness program',
      'recipe', 'cooking', 'meal prep'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🧘 SPIRITUALITY
  // ═══════════════════════════════════════════════════════════════════════════════
  spirituality: {
    name: 'Spirituality',
    icon: '🧘',
    
    strongSignals: [
      // Spiritual Practices
      'spiritual', 'spirituality', 'spirit', 'soul', 'divine', 'sacred',
      'meditation', 'meditate', 'mindfulness', 'mindful', 'present', 'presence',
      'yoga', 'breathwork', 'breathing', 'mantra', 'chant', 'chanting',
      'prayer', 'pray', 'worship', 'devotion', 'faith', 'belief',
      // Concepts
      'consciousness', 'awareness', 'awakening', 'enlightenment', 'enlightened',
      'universe', 'cosmic', 'universal', 'energy', 'vibration', 'frequency',
      'karma', 'dharma', 'chakra', 'chakras', 'aura', 'third eye',
      'manifest', 'manifestation', 'law of attraction', 'abundance',
      // Inner Work
      'inner peace', 'peace', 'calm', 'serenity', 'tranquility', 'harmony',
      'gratitude', 'grateful', 'thankful', 'appreciation', 'blessing', 'blessed',
      'forgiveness', 'forgive', 'let go', 'release', 'surrender',
      'love', 'unconditional love', 'compassion', 'kindness', 'empathy',
      // Traditions
      'buddhism', 'buddhist', 'hinduism', 'hindu', 'taoism', 'zen',
      'christianity', 'christian', 'islam', 'muslim', 'judaism', 'jewish',
      'new age', 'mysticism', 'esoteric', 'occult', 'astrology', 'tarot'
    ],
    
    mediumSignals: [
      'journey', 'path', 'way', 'truth', 'wisdom',
      'connect', 'connection', 'oneness', 'unity',
      'balance', 'align', 'alignment', 'center', 'ground',
      'intention', 'purpose', 'meaning', 'fulfillment'
    ],
    
    weakSignals: [
      'believe', 'feel', 'sense', 'experience',
      'deep', 'profound', 'powerful', 'beautiful'
    ],
    
    phrases: [
      'spiritual journey', 'spiritual awakening', 'spiritual growth',
      'how to meditate', 'meditation guide', 'guided meditation',
      'mindfulness practice', 'mindful living', 'present moment',
      'law of attraction', 'manifest your dreams', 'abundance mindset',
      'inner peace', 'find peace', 'at peace',
      'raise your vibration', 'high vibration', 'positive energy',
      'chakra healing', 'energy healing', 'crystal healing',
      'gratitude practice', 'gratitude journal', 'daily gratitude'
    ],
    
    negativeSignals: [
      'stock market', 'investing', 'retirement',
      'workout routine', 'gym', 'fitness',
      'video game', 'gaming', 'playstation'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 👨‍👩‍👧‍👦 KIDS & FAMILY
  // ═══════════════════════════════════════════════════════════════════════════════
  kids: {
    name: 'Kids & Family',
    icon: '👨‍👩‍👧‍👦',
    
    strongSignals: [
      // Children
      'kid', 'kids', 'child', 'children', 'baby', 'babies', 'toddler', 'toddlers',
      'infant', 'newborn', 'teenager', 'teen', 'tween', 'youth',
      'boy', 'girl', 'son', 'daughter', 'sibling', 'brother', 'sister',
      // Family
      'family', 'parent', 'parents', 'parenting', 'mom', 'mother', 'dad', 'father',
      'grandma', 'grandpa', 'grandparent', 'grandparents', 'aunt', 'uncle',
      // Parenting
      'raise', 'raising', 'nurture', 'discipline', 'teach', 'educate',
      'bedtime', 'naptime', 'diaper', 'feeding', 'breastfeeding', 'bottle',
      'tantrum', 'behavior', 'misbehave', 'obey', 'listen',
      // Kids Activities
      'play', 'playing', 'playtime', 'playground', 'toy', 'toys', 'game', 'games',
      'cartoon', 'animation', 'disney', 'pixar', 'nickelodeon', 'paw patrol',
      'coloring', 'drawing', 'craft', 'crafts', 'art', 'creative',
      // Education (Kids)
      'nursery', 'preschool', 'kindergarten', 'elementary', 'school',
      'learn', 'learning', 'abc', 'alphabet', 'numbers', 'counting', 'reading',
      // Family Life
      'birthday', 'party', 'celebration', 'holiday', 'christmas', 'easter',
      'vacation', 'family trip', 'family time', 'quality time', 'bonding'
    ],
    
    mediumSignals: [
      'young', 'little', 'small', 'cute', 'adorable',
      'grow', 'growing', 'development', 'milestone',
      'fun', 'funny', 'laugh', 'happy', 'joy',
      'safe', 'safety', 'protect', 'care'
    ],
    
    weakSignals: [
      'home', 'house', 'room', 'bedroom',
      'love', 'loving', 'sweet', 'special'
    ],
    
    phrases: [
      'for kids', 'for children', 'for toddlers', 'for babies',
      'parenting tips', 'parenting advice', 'how to parent',
      'activities for kids', 'games for kids', 'crafts for kids',
      'kids learn', 'educational for kids', 'learning videos',
      'family vlog', 'family fun', 'family activities',
      'mom life', 'dad life', 'parent life',
      'baby shower', 'gender reveal', 'first birthday'
    ],
    
    negativeSignals: [
      'stock market', 'investing', 'retirement',
      'therapy', 'mental illness', 'depression',
      'workout routine', 'gym', 'fitness',
      'video game strategy', 'esports', 'competitive gaming'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🔬 SCIENCE
  // ═══════════════════════════════════════════════════════════════════════════════
  science: {
    name: 'Science',
    icon: '🔬',
    
    strongSignals: [
      // Scientific Method
      'science', 'scientific', 'scientist', 'research', 'researcher',
      'experiment', 'hypothesis', 'theory', 'evidence', 'proof', 'data',
      'study', 'studies', 'journal', 'peer review', 'publication',
      // Physics
      'physics', 'quantum', 'particle', 'atom', 'molecule', 'electron', 'proton',
      'gravity', 'relativity', 'einstein', 'newton', 'force', 'energy', 'mass',
      'light', 'wave', 'radiation', 'electromagnetic', 'nuclear',
      // Chemistry
      'chemistry', 'chemical', 'element', 'compound', 'reaction', 'bond',
      'periodic table', 'acid', 'base', 'organic', 'inorganic',
      // Biology
      'biology', 'biological', 'cell', 'dna', 'gene', 'genetic', 'evolution',
      'organism', 'species', 'ecosystem', 'biodiversity', 'ecology',
      'bacteria', 'virus', 'microbe', 'protein', 'enzyme',
      // Space
      'space', 'astronomy', 'universe', 'galaxy', 'star', 'planet', 'moon',
      'solar system', 'black hole', 'nasa', 'spacex', 'rocket', 'satellite',
      'mars', 'jupiter', 'telescope', 'hubble', 'james webb',
      // Earth Science
      'earth', 'geology', 'climate', 'weather', 'atmosphere', 'ocean',
      'earthquake', 'volcano', 'fossil', 'dinosaur', 'paleontology',
      // Discovery
      'discovery', 'discover', 'breakthrough', 'invention', 'innovate'
    ],
    
    mediumSignals: [
      'nature', 'natural', 'environment', 'environmental',
      'lab', 'laboratory', 'equipment', 'instrument',
      'measure', 'measurement', 'calculate', 'formula',
      'fact', 'facts', 'explain', 'explanation'
    ],
    
    weakSignals: [
      'curious', 'curiosity', 'wonder', 'question',
      'how', 'why', 'what', 'work', 'works'
    ],
    
    phrases: [
      'how does', 'why does', 'what is', 'what are',
      'science explained', 'science behind', 'science of',
      'new discovery', 'new research', 'scientists found',
      'space exploration', 'outer space', 'deep space',
      'climate change', 'global warming', 'environment',
      'human body', 'how the body', 'brain science',
      'quantum physics', 'string theory', 'big bang'
    ],
    
    negativeSignals: [
      'stock market', 'investing', 'retirement',
      'workout routine', 'gym', 'fitness',
      'video game', 'gaming', 'playstation',
      'recipe', 'cooking', 'meal prep'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🏛️ HISTORY
  // ═══════════════════════════════════════════════════════════════════════════════
  history: {
    name: 'History',
    icon: '🏛️',
    
    strongSignals: [
      // Time Periods
      'history', 'historical', 'ancient', 'medieval', 'renaissance', 'modern',
      'century', 'decade', 'era', 'age', 'period', 'bc', 'ad', 'bce', 'ce',
      'prehistoric', 'antiquity', 'classical', 'victorian', 'colonial',
      // Civilizations
      'civilization', 'empire', 'kingdom', 'dynasty', 'republic',
      'roman', 'greek', 'egyptian', 'chinese', 'persian', 'ottoman',
      'mayan', 'aztec', 'inca', 'viking', 'mongol', 'british',
      // Events
      'war', 'battle', 'revolution', 'rebellion', 'conflict', 'invasion',
      'world war', 'civil war', 'cold war', 'crusade', 'conquest',
      'independence', 'declaration', 'treaty', 'alliance',
      // People
      'king', 'queen', 'emperor', 'pharaoh', 'ruler', 'monarch', 'dictator',
      'president', 'general', 'soldier', 'warrior', 'knight',
      'historical figure', 'leader', 'conqueror', 'explorer',
      // Historical Concepts
      'archaeology', 'artifact', 'relic', 'ruins', 'excavation',
      'tradition', 'heritage', 'legacy', 'ancestor', 'descendant',
      'document', 'manuscript', 'archive', 'record', 'chronicle'
    ],
    
    mediumSignals: [
      'past', 'before', 'ago', 'year', 'years',
      'event', 'events', 'happened', 'occurred',
      'change', 'changed', 'transform', 'transformed',
      'culture', 'cultural', 'society', 'social'
    ],
    
    weakSignals: [
      'story', 'stories', 'tale', 'legend',
      'true', 'real', 'fact', 'facts'
    ],
    
    phrases: [
      'history of', 'historical events', 'what happened',
      'ancient history', 'world history', 'american history',
      'rise and fall', 'how did', 'why did',
      'world war 1', 'world war 2', 'civil war', 'cold war',
      'ancient rome', 'ancient greece', 'ancient egypt',
      'middle ages', 'dark ages', 'renaissance period',
      'founding fathers', 'industrial revolution', 'french revolution'
    ],
    
    negativeSignals: [
      'stock market today', 'current investing',
      'workout routine', 'gym', 'fitness',
      'video game', 'gaming', 'playstation',
      'recipe', 'cooking', 'meal prep'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🌟 LIFESTYLE
  // ═══════════════════════════════════════════════════════════════════════════════
  lifestyle: {
    name: 'Lifestyle',
    icon: '🌟',
    
    strongSignals: [
      // Daily Life
      'lifestyle', 'life', 'living', 'daily', 'everyday', 'routine', 'ritual',
      'morning', 'night', 'evening', 'weekend', 'weekday',
      'home', 'house', 'apartment', 'room', 'space', 'decor', 'interior',
      // Personal Style
      'style', 'fashion', 'outfit', 'clothes', 'clothing', 'wardrobe',
      'beauty', 'makeup', 'skincare', 'hair', 'grooming',
      'aesthetic', 'vibe', 'mood', 'atmosphere', 'cozy',
      // Organization
      'organize', 'organization', 'declutter', 'minimalist', 'minimalism',
      'clean', 'cleaning', 'tidy', 'neat', 'order',
      // Social Life
      'friend', 'friends', 'friendship', 'social', 'party', 'gathering',
      'date', 'dating', 'relationship', 'single', 'couple',
      // Self-Care
      'self-care', 'self care', 'pamper', 'relax', 'relaxation', 'unwind',
      'treat yourself', 'me time', 'personal time',
      // Content Types
      'vlog', 'day in my life', 'what i eat', 'get ready with me', 'grwm',
      'haul', 'favorites', 'essentials', 'must-haves', 'recommendations'
    ],
    
    mediumSignals: [
      'day', 'week', 'month', 'year',
      'favorite', 'love', 'like', 'enjoy',
      'try', 'trying', 'new', 'different',
      'update', 'lately', 'recently', 'currently'
    ],
    
    weakSignals: [
      'share', 'sharing', 'show', 'showing',
      'talk', 'talking', 'chat', 'chatting'
    ],
    
    phrases: [
      'day in my life', 'day in the life', 'a day in',
      'morning routine', 'night routine', 'daily routine',
      'get ready with me', 'grwm', 'what i eat in a day',
      'room tour', 'home tour', 'apartment tour',
      'lifestyle tips', 'life hacks', 'life advice',
      'how i', 'what i', 'my favorite', 'my current',
      'self care routine', 'pamper routine', 'reset routine'
    ],
    
    negativeSignals: [
      'stock market', 'investing', 'retirement fund',
      'therapy session', 'mental illness', 'depression treatment',
      'workout program', 'gym membership', 'fitness goal'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// NICHE DETECTION ENGINE v2.0
// Advanced weighted scoring with phrase matching and disambiguation
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detect niche from content using comprehensive signal matching
 * @param {string} content - The text to analyze
 * @returns {object} Detection result with niche, confidence, and details
 */
function detectNicheFromContent(content) {
  if (!content || content.length < 10) {
    return { niche: null, confidence: 0, scores: {}, matchedSignals: {} };
  }
  
  const lowerContent = content.toLowerCase();
  const scores = {};
  const matchedSignals = {};
  
  // Process each niche
  for (const [nicheKey, nicheData] of Object.entries(NICHE_SIGNALS)) {
    let score = 0;
    const matched = {
      phrases: [],
      strong: [],
      medium: [],
      weak: [],
      negative: []
    };
    
    // STEP 1: Check phrases FIRST (highest priority, bonus weight)
    if (nicheData.phrases) {
      for (const phrase of nicheData.phrases) {
        if (lowerContent.includes(phrase.toLowerCase())) {
          score += 4; // Phrase weight = 3 + 1 bonus
          matched.phrases.push(phrase);
        }
      }
    }
    
    // STEP 2: Check strong signals (weight 3)
    if (nicheData.strongSignals) {
      for (const signal of nicheData.strongSignals) {
        // Use word boundary matching for single words
        const regex = signal.includes(' ') 
          ? new RegExp(signal.toLowerCase(), 'gi')
          : new RegExp(`\\b${signal.toLowerCase()}\\b`, 'gi');
        
        const matches = lowerContent.match(regex);
        if (matches) {
          score += 3 * matches.length;
          if (!matched.strong.includes(signal)) {
            matched.strong.push(signal);
          }
        }
      }
    }
    
    // STEP 3: Check medium signals (weight 2)
    if (nicheData.mediumSignals) {
      for (const signal of nicheData.mediumSignals) {
        const regex = signal.includes(' ')
          ? new RegExp(signal.toLowerCase(), 'gi')
          : new RegExp(`\\b${signal.toLowerCase()}\\b`, 'gi');
        
        const matches = lowerContent.match(regex);
        if (matches) {
          score += 2 * matches.length;
          if (!matched.medium.includes(signal)) {
            matched.medium.push(signal);
          }
        }
      }
    }
    
    // STEP 4: Check weak signals (weight 1)
    if (nicheData.weakSignals) {
      for (const signal of nicheData.weakSignals) {
        const regex = signal.includes(' ')
          ? new RegExp(signal.toLowerCase(), 'gi')
          : new RegExp(`\\b${signal.toLowerCase()}\\b`, 'gi');
        
        const matches = lowerContent.match(regex);
        if (matches) {
          score += 1 * matches.length;
          if (!matched.weak.includes(signal)) {
            matched.weak.push(signal);
          }
        }
      }
    }
    
    // STEP 5: Check negative signals (subtract weight)
    if (nicheData.negativeSignals) {
      for (const signal of nicheData.negativeSignals) {
        const regex = signal.includes(' ')
          ? new RegExp(signal.toLowerCase(), 'gi')
          : new RegExp(`\\b${signal.toLowerCase()}\\b`, 'gi');
        
        const matches = lowerContent.match(regex);
        if (matches) {
          score -= 3 * matches.length; // Strong penalty
          matched.negative.push(signal);
        }
      }
    }
    
    // Ensure minimum score of 0
    scores[nicheKey] = Math.max(0, score);
    matchedSignals[nicheKey] = matched;
  }
  
  // Find the highest scoring niche
  let bestNiche = null;
  let bestScore = 0;
  let secondBestScore = 0;
  
  const sortedNiches = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  
  if (sortedNiches.length > 0 && sortedNiches[0][1] > 0) {
    bestNiche = sortedNiches[0][0];
    bestScore = sortedNiches[0][1];
    secondBestScore = sortedNiches[1]?.[1] || 0;
  }
  
  // Calculate confidence based on:
  // 1. Absolute score (higher = more confident)
  // 2. Gap between best and second best (bigger gap = more confident)
  let confidence = 0;
  
  if (bestScore > 0) {
    // Base confidence from score (max 50%)
    const scoreConfidence = Math.min(50, bestScore * 3);
    
    // Gap confidence (max 50%)
    const gap = bestScore - secondBestScore;
    const gapRatio = bestScore > 0 ? gap / bestScore : 0;
    const gapConfidence = Math.min(50, gapRatio * 50);
    
    confidence = Math.round(scoreConfidence + gapConfidence);
    
    // Require minimum score to return a niche
    if (bestScore < 5) {
      bestNiche = null;
      confidence = 0;
    }
  }
  
  return {
    niche: bestNiche,
    confidence: Math.min(95, confidence),
    scores: scores,
    matchedSignals: bestNiche ? matchedSignals[bestNiche] : {},
    allMatches: matchedSignals,
    sortedNiches: sortedNiches.slice(0, 5) // Top 5 niches
  };
}

/**
 * Get niche info with signals
 * @param {string} nicheKey - The niche key
 * @returns {object} Niche configuration
 */
function getNicheSignals(nicheKey) {
  return NICHE_SIGNALS[nicheKey] || null;
}

/**
 * Test niche detection with sample content
 * Useful for debugging
 */
function testNicheDetection(content) {
  const result = detectNicheFromContent(content);
  
  console.log('═══════════════════════════════════════');
  console.log('NICHE DETECTION TEST');
  console.log('═══════════════════════════════════════');
  console.log('Content:', content.substring(0, 100) + '...');
  console.log('');
  console.log('Detected Niche:', result.niche || 'NONE');
  console.log('Confidence:', result.confidence + '%');
  console.log('');
  console.log('Top 5 Niches:');
  result.sortedNiches.forEach(([niche, score], i) => {
    const info = NICHE_SIGNALS[niche];
    console.log(`  ${i+1}. ${info?.icon || '?'} ${niche}: ${score} points`);
  });
  console.log('');
  if (result.niche) {
    console.log('Matched Signals:');
    console.log('  Phrases:', result.matchedSignals.phrases?.slice(0, 5).join(', ') || 'none');
    console.log('  Strong:', result.matchedSignals.strong?.slice(0, 5).join(', ') || 'none');
    console.log('  Medium:', result.matchedSignals.medium?.slice(0, 5).join(', ') || 'none');
    console.log('  Negative:', result.matchedSignals.negative?.join(', ') || 'none');
  }
  console.log('═══════════════════════════════════════');
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT / TEST
// ═══════════════════════════════════════════════════════════════════════════════

// Test cases to verify the system works correctly
const TEST_CASES = [
  { content: "10 Tips for Better Sleep Tonight", expected: "health" },
  { content: "How to Invest Your First $1000 in Stocks", expected: "finance" },
  { content: "Signs You Have Anxiety (And How to Cope)", expected: "psychology" },
  { content: "Easy Chicken Recipe for Beginners", expected: "cooking" },
  { content: "Best Gaming Setup for 2024", expected: "gaming" },
  { content: "How to Study Effectively for Exams", expected: "education" },
  { content: "My Morning Routine and Daily Habits", expected: "lifestyle" },
  { content: "Why the Roman Empire Really Fell", expected: "history" },
  { content: "How Black Holes Work - Space Science", expected: "science" },
  { content: "How to Start a Business with No Money", expected: "business" },
  { content: "Best Places to Visit in Japan", expected: "travel" },
  { content: "Stop Making Excuses and Take Action Now", expected: "motivation" },
  { content: "Guided Meditation for Inner Peace", expected: "spirituality" },
  { content: "Fun Activities for Kids at Home", expected: "kids" }
];

// Run test when loaded (comment out in production)
// TEST_CASES.forEach(test => {
//   const result = detectNicheFromContent(test.content);
//   const pass = result.niche === test.expected;
//   console.log(`${pass ? '✅' : '❌'} "${test.content.substring(0, 40)}..." → ${result.niche} (expected: ${test.expected})`);
// });

console.log('✅ Comprehensive Signal Words System v2.0 loaded');
console.log(`   ${Object.keys(NICHE_SIGNALS).length} niches configured`);
