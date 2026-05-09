/**
 * ScriptFlow - Niche Signals Data v2.0
 * Weighted Scoring System for Niche Detection
 * Strong signals (×3), Medium (×2), Phrases (×4 bonus), Negative (penalty)
 * 
 * @module data/nicheSignals
 */
(function (TITAN) {
    'use strict';

    TITAN.nicheSignals = {
        finance: {
            name: 'Personal Finance',
            icon: '💰',
            strongSignals: ['money', 'dollar', 'cash', 'wealth', 'rich', 'millionaire', 'bank', 'savings account', 'interest rate', 'invest', 'investing', 'investment', 'portfolio', 'stock', 'stocks', 'bond', 'etf', 'mutual fund', 'dividend', 'compound interest', 'retire', 'retirement', '401k', 'ira', 'roth', 'pension', 'debt', 'loan', 'mortgage', 'credit card', 'budget', 'budgeting', 'expense', 'frugal', 'save money', 'emergency fund', 'income', 'salary', 'passive income', 'side hustle', 'tax', 'taxes', 'credit score', 'crypto', 'bitcoin', 'financial freedom', 'net worth'],
            mediumSignals: ['afford', 'expensive', 'cheap', 'cost', 'price', 'value', 'earn', 'profit', 'loss', 'return', 'roi', 'market', 'economy', 'inflation', 'payment', 'bill', 'insurance', 'real estate', 'rent'],
            phrases: ['how to save', 'how to invest', 'how to budget', 'pay off debt', 'build wealth', 'make money', 'personal finance', 'financial goals', 'retirement savings', 'compound interest'],
            negativeSignals: ['mental health', 'therapy', 'workout', 'exercise routine', 'recipe', 'cooking', 'video game']
        },
        psychology: {
            name: 'Psychology',
            icon: '🧠',
            strongSignals: ['anxiety', 'depression', 'bipolar', 'ocd', 'ptsd', 'adhd', 'panic attack', 'narcissist', 'narcissism', 'trauma', 'therapy', 'therapist', 'psychologist', 'psychiatrist', 'counselor', 'cbt', 'mental health', 'emotion', 'emotional', 'feelings', 'sad', 'angry', 'fear', 'guilt', 'shame', 'lonely', 'loneliness', 'personality', 'introvert', 'extrovert', 'mbti', 'self-esteem', 'self-worth', 'relationship', 'attachment', 'toxic relationship', 'gaslighting', 'manipulation', 'boundaries', 'psychology', 'subconscious', 'defense mechanism', 'heal', 'healing', 'self-care', 'inner child'],
            mediumSignals: ['brain', 'dopamine', 'serotonin', 'cortisol', 'stress', 'overwhelm', 'burnout', 'trigger', 'trust issues', 'breakup', 'childhood', 'mindset', 'belief', 'struggle', 'pain'],
            phrases: ['mental health', 'how to cope', 'how to heal', 'signs of', 'attachment style', 'love language', 'toxic person', 'emotional intelligence', 'childhood trauma', 'psychology of'],
            negativeSignals: ['stock market', 'invest money', 'workout routine', 'weight loss', 'recipe', 'cooking']
        },
        health: {
            name: 'Health & Fitness',
            icon: '💪',
            strongSignals: ['exercise', 'workout', 'work out', 'training', 'gym', 'fitness', 'cardio', 'strength training', 'hiit', 'yoga', 'pilates', 'muscle', 'abs', 'weight loss', 'lose weight', 'fat loss', 'burn fat', 'calories', 'weight gain', 'build muscle', 'nutrition', 'protein', 'carbs', 'diet', 'keto', 'fasting', 'supplement', 'vitamins', 'sleep', 'sleeping', 'insomnia', 'sleep quality', 'deep sleep', 'rem sleep', 'rest', 'recovery', 'circadian rhythm', 'melatonin', 'tired', 'fatigue', 'energy level', 'disease', 'diabetes', 'blood pressure', 'metabolism', 'hydration', 'wellness', 'healthy', 'health'],
            mediumSignals: ['body', 'physical', 'fit', 'strong', 'endurance', 'routine', 'meal', 'eating', 'habit', 'lifestyle', 'morning', 'night', 'goal', 'progress', 'transformation'],
            phrases: ['how to lose weight', 'how to build muscle', 'workout routine', 'healthy eating', 'meal prep', 'sleep better', 'improve sleep', 'sleep tips', 'boost metabolism', 'morning routine'],
            negativeSignals: ['stock price', 'invest', 'savings', 'retirement', 'anxiety disorder', 'therapy session', 'video game']
        },
        gaming: {
            name: 'Gaming',
            icon: '🎮',
            strongSignals: ['playstation', 'ps5', 'ps4', 'xbox', 'nintendo', 'switch', 'pc gaming', 'console', 'controller', 'video game', 'gamer', 'gaming', 'rpg', 'mmorpg', 'battle royale', 'moba', 'multiplayer', 'pvp', 'level up', 'xp', 'boss fight', 'raid', 'loot', 'speedrun', 'esports', 'tournament', 'twitch', 'streamer', 'gameplay', 'walkthrough', 'minecraft', 'fortnite', 'call of duty', 'gta', 'zelda', 'pokemon', 'elden ring', 'league of legends', 'valorant', 'apex legends'],
            mediumSignals: ['play', 'player', 'character', 'skin', 'map', 'story', 'campaign', 'review', 'update', 'patch', 'season'],
            phrases: ['video game', 'gaming setup', 'how to play', 'how to beat', 'best games', 'tips and tricks', 'pro tips'],
            negativeSignals: ['invest money', 'therapy', 'workout', 'exercise routine']
        },
        technology: {
            name: 'Technology',
            icon: '💻',
            strongSignals: ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'chatgpt', 'claude', 'llm', 'automation', 'code', 'coding', 'programming', 'developer', 'software', 'app', 'python', 'javascript', 'api', 'database', 'cloud', 'github', 'computer', 'laptop', 'smartphone', 'iphone', 'android', 'internet', 'website', 'cybersecurity', 'vpn', 'virtual reality', 'vr', 'metaverse', 'blockchain', '5g', 'gadget', 'tech'],
            mediumSignals: ['digital', 'smart', 'feature', 'tool', 'update', 'upgrade', 'version', 'tutorial', 'setup', 'install'],
            phrases: ['artificial intelligence', 'how to code', 'tech review', 'best apps', 'new technology', 'ai tools'],
            negativeSignals: ['therapy session', 'workout routine', 'recipe', 'cooking']
        },
        education: {
            name: 'Education',
            icon: '📚',
            strongSignals: ['learn', 'learning', 'study', 'studying', 'student', 'teacher', 'school', 'college', 'university', 'degree', 'class', 'lecture', 'course', 'exam', 'test', 'assignment', 'homework', 'grade', 'gpa', 'math', 'science', 'physics', 'chemistry', 'biology', 'history', 'tutorial', 'lesson', 'explain', 'concept', 'teach', 'education', 'beginner', 'fundamentals', 'practice', 'skill', 'knowledge', 'memory', 'memorize'],
            mediumSignals: ['book', 'textbook', 'reading', 'research', 'topic', 'subject', 'information', 'method', 'technique'],
            phrases: ['how to learn', 'how to study', 'study tips', 'step by step', 'for beginners', 'online course', 'exam preparation'],
            negativeSignals: ['stock market', 'workout', 'gym', 'video game']
        },
        cooking: {
            name: 'Cooking & Food',
            icon: '🍳',
            strongSignals: ['cook', 'cooking', 'bake', 'baking', 'fry', 'grill', 'roast', 'recipe', 'ingredient', 'dish', 'meal', 'food', 'chicken', 'beef', 'vegetable', 'pasta', 'rice', 'soup', 'salad', 'dessert', 'cake', 'breakfast', 'lunch', 'dinner', 'kitchen', 'chef', 'oven', 'pan', 'blender', 'air fryer', 'cuisine', 'italian', 'mexican', 'chinese', 'restaurant', 'taste', 'flavor', 'delicious'],
            mediumSignals: ['eat', 'eating', 'hungry', 'fresh', 'homemade', 'quick', 'easy', 'serve', 'portion'],
            phrases: ['how to cook', 'how to make', 'recipe for', 'easy recipe', 'meal prep', 'cooking tips'],
            negativeSignals: ['stock market', 'workout', 'exercise', 'video game']
        },
        travel: {
            name: 'Travel',
            icon: '✈️',
            strongSignals: ['travel', 'traveling', 'trip', 'vacation', 'holiday', 'visit', 'explore', 'adventure', 'flight', 'airport', 'airline', 'road trip', 'hotel', 'airbnb', 'resort', 'destination', 'country', 'city', 'beach', 'mountain', 'national park', 'tourist', 'europe', 'asia', 'paris', 'london', 'tokyo', 'bali', 'itinerary', 'passport', 'visa', 'luggage', 'packing', 'sightseeing', 'tour', 'photography'],
            mediumSignals: ['abroad', 'overseas', 'international', 'wanderlust', 'nomad', 'cheap', 'luxury', 'budget'],
            phrases: ['travel guide', 'travel tips', 'places to visit', 'things to do', 'bucket list', 'road trip', 'packing list'],
            negativeSignals: ['stock market', 'therapy', 'workout routine']
        },
        business: {
            name: 'Business',
            icon: '💼',
            strongSignals: ['business', 'company', 'entrepreneur', 'startup', 'founder', 'ceo', 'management', 'leadership', 'strategy', 'employee', 'hire', 'recruitment', 'meeting', 'pitch', 'marketing', 'sales', 'customer', 'client', 'brand', 'advertising', 'lead', 'conversion', 'revenue', 'profit', 'funding', 'investor', 'venture capital', 'valuation', 'equity', 'ipo', 'acquisition', 'industry', 'market', 'competition', 'product', 'service', 'innovation', 'scale'],
            mediumSignals: ['work', 'job', 'career', 'professional', 'project', 'deadline', 'goal', 'target', 'kpi', 'success', 'growth', 'network', 'partner'],
            phrases: ['how to start a business', 'business plan', 'marketing strategy', 'entrepreneur tips', 'make money online', 'raise funding'],
            negativeSignals: ['personal finance', 'therapy', 'workout', 'gym']
        },
        motivation: {
            name: 'Motivation',
            icon: '🔥',
            strongSignals: ['motivation', 'motivate', 'inspire', 'inspiration', 'success', 'successful', 'achieve', 'achievement', 'goal', 'dream', 'vision', 'purpose', 'mindset', 'positive', 'believe', 'confidence', 'growth mindset', 'discipline', 'consistency', 'perseverance', 'hustle', 'grind', 'work hard', 'dedication', 'action', 'no excuses', 'never give up', 'self-improvement', 'personal growth', 'level up', 'potential', 'best version', 'overcome', 'failure', 'setback', 'resilience', 'courage'],
            mediumSignals: ['life', 'change', 'power', 'strength', 'habit', 'routine', 'daily', 'quote', 'wisdom', 'advice'],
            phrases: ['how to be successful', 'motivational speech', 'success tips', 'success habits', 'goal setting', 'never give up', 'change your life'],
            negativeSignals: ['stock market', 'therapy', 'mental illness', 'workout routine', 'recipe']
        },
        spirituality: {
            name: 'Spirituality',
            icon: '🧘',
            strongSignals: ['spiritual', 'spirituality', 'spirit', 'soul', 'divine', 'meditation', 'meditate', 'mindfulness', 'mindful', 'yoga', 'breathwork', 'mantra', 'prayer', 'faith', 'consciousness', 'awakening', 'enlightenment', 'universe', 'energy', 'vibration', 'frequency', 'karma', 'chakra', 'manifest', 'manifestation', 'law of attraction', 'abundance', 'inner peace', 'peace', 'gratitude', 'grateful', 'forgiveness', 'love', 'compassion', 'buddhism', 'hinduism', 'zen', 'astrology', 'tarot'],
            mediumSignals: ['journey', 'path', 'wisdom', 'connect', 'connection', 'balance', 'align', 'intention', 'purpose', 'meaning'],
            phrases: ['spiritual journey', 'how to meditate', 'guided meditation', 'mindfulness practice', 'law of attraction', 'inner peace', 'gratitude practice'],
            negativeSignals: ['stock market', 'workout routine', 'video game']
        },
        kids: {
            name: 'Kids & Family',
            icon: '👨‍👩‍👧‍👦',
            strongSignals: ['kid', 'kids', 'child', 'children', 'baby', 'babies', 'toddler', 'teenager', 'teen', 'family', 'parent', 'parenting', 'mom', 'mother', 'dad', 'father', 'grandma', 'grandpa', 'raise', 'raising', 'nurture', 'bedtime', 'diaper', 'tantrum', 'play', 'playing', 'toy', 'toys', 'cartoon', 'disney', 'coloring', 'craft', 'nursery', 'preschool', 'kindergarten', 'abc', 'alphabet', 'birthday', 'party'],
            mediumSignals: ['young', 'little', 'cute', 'adorable', 'grow', 'development', 'fun', 'happy', 'safe', 'care'],
            phrases: ['for kids', 'for children', 'parenting tips', 'activities for kids', 'family fun', 'mom life', 'dad life'],
            negativeSignals: ['stock market', 'therapy', 'mental illness', 'workout routine', 'esports']
        },
        science: {
            name: 'Science',
            icon: '🔬',
            strongSignals: ['science', 'scientific', 'scientist', 'research', 'experiment', 'hypothesis', 'theory', 'evidence', 'data', 'study', 'physics', 'quantum', 'particle', 'atom', 'gravity', 'relativity', 'chemistry', 'chemical', 'element', 'reaction', 'biology', 'cell', 'dna', 'gene', 'evolution', 'ecosystem', 'space', 'astronomy', 'universe', 'galaxy', 'star', 'planet', 'black hole', 'nasa', 'spacex', 'earth', 'climate', 'ocean', 'earthquake', 'volcano', 'dinosaur', 'discovery'],
            mediumSignals: ['nature', 'environment', 'lab', 'laboratory', 'measure', 'formula', 'fact', 'explain'],
            phrases: ['how does', 'why does', 'science explained', 'science behind', 'new discovery', 'space exploration', 'climate change'],
            negativeSignals: ['stock market', 'workout routine', 'video game', 'recipe']
        },
        history: {
            name: 'History',
            icon: '🏛️',
            strongSignals: ['history', 'historical', 'ancient', 'medieval', 'renaissance', 'century', 'era', 'civilization', 'empire', 'kingdom', 'dynasty', 'roman', 'greek', 'egyptian', 'war', 'battle', 'revolution', 'world war', 'civil war', 'cold war', 'independence', 'treaty', 'king', 'queen', 'emperor', 'pharaoh', 'president', 'general', 'soldier', 'archaeology', 'artifact', 'ruins', 'heritage', 'ancestor'],
            mediumSignals: ['past', 'ago', 'event', 'happened', 'change', 'culture', 'society'],
            phrases: ['history of', 'what happened', 'ancient history', 'world history', 'rise and fall', 'world war', 'ancient rome'],
            negativeSignals: ['stock market today', 'workout routine', 'video game', 'recipe']
        },
        lifestyle: {
            name: 'Lifestyle',
            icon: '🌟',
            strongSignals: ['lifestyle', 'life', 'living', 'daily', 'everyday', 'routine', 'ritual', 'morning', 'night', 'home', 'house', 'apartment', 'room', 'decor', 'style', 'fashion', 'outfit', 'beauty', 'makeup', 'skincare', 'hair', 'aesthetic', 'vibe', 'cozy', 'organize', 'declutter', 'minimalist', 'clean', 'cleaning', 'friend', 'social', 'date', 'dating', 'self-care', 'pamper', 'relax', 'vlog', 'day in my life', 'haul', 'favorites'],
            mediumSignals: ['day', 'week', 'favorite', 'love', 'enjoy', 'try', 'new', 'update', 'recently'],
            phrases: ['day in my life', 'morning routine', 'night routine', 'get ready with me', 'room tour', 'home tour', 'self care routine'],
            negativeSignals: ['stock market', 'therapy session', 'workout program']
        }
    };

    // Legacy global alias for backward compatibility
    window.NICHE_SIGNALS = TITAN.nicheSignals;

    console.log('✅ TITAN.nicheSignals loaded - 15 niches with weighted signals');

})(window.TITAN = window.TITAN || {});
