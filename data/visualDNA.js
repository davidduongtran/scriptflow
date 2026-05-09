/**
 * ScriptFlow - Visual DNA Database
 * VEO-Safe transformations for famous people, brands, and copyrighted content
 * 
 * Pattern: [Physical traits] + [Iconic outfit/props] + [Signature context] + [Signature pose/expression]
 * 
 * @version 1.0.0
 */

const VISUAL_DNA_DATABASE = {

    // ═══════════════════════════════════════════════════════════════════════════════
    // TECH LEADERS
    // ═══════════════════════════════════════════════════════════════════════════════

    'elon musk': {
        visualDNA: 'tall man with short dark hair, wearing a black t-shirt, standing beside a rocket or electric car, arms crossed with confident smirk',
        category: 'tech',
        keywords: ['musk', 'elon', 'tesla ceo', 'spacex founder']
    },

    'steve jobs': {
        visualDNA: 'slender man with round glasses and short gray hair, wearing a black turtleneck and blue jeans, holding a sleek smartphone, intense focused gaze',
        category: 'tech',
        keywords: ['jobs', 'apple founder', 'steve']
    },

    'bill gates': {
        visualDNA: 'man with glasses and short gray hair, wearing a casual sweater, gesturing while explaining something, friendly smile',
        category: 'tech',
        keywords: ['gates', 'microsoft founder']
    },

    'mark zuckerberg': {
        visualDNA: 'young man with curly brown hair, wearing a gray t-shirt, sitting in a modern office with blue accents, neutral expression',
        category: 'tech',
        keywords: ['zuckerberg', 'zuck', 'facebook founder', 'meta ceo']
    },

    'jeff bezos': {
        visualDNA: 'bald muscular man in casual clothing, standing in a warehouse with boxes, confident stance with hands on hips',
        category: 'tech',
        keywords: ['bezos', 'amazon founder']
    },

    'tim cook': {
        visualDNA: 'tall silver-haired man in a dark shirt, standing on a stage with minimalist backdrop, calm composed expression',
        category: 'tech',
        keywords: ['cook', 'apple ceo']
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // INVESTORS & BUSINESS
    // ═══════════════════════════════════════════════════════════════════════════════

    'warren buffett': {
        visualDNA: 'elderly man with glasses holding a cola drink, wearing a suit, surrounded by financial documents, warm grandfatherly smile',
        category: 'business',
        keywords: ['buffett', 'oracle of omaha', 'berkshire']
    },

    'ray dalio': {
        visualDNA: 'gray-haired man in business casual, sitting in meditation pose, calm and reflective expression',
        category: 'business',
        keywords: ['dalio', 'bridgewater']
    },

    'charlie munger': {
        visualDNA: 'elderly man with large glasses, sitting in leather chair with books, wise thoughtful expression',
        category: 'business',
        keywords: ['munger']
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // SPORTS LEGENDS
    // ═══════════════════════════════════════════════════════════════════════════════

    'michael jordan': {
        visualDNA: 'tall athletic Black man in red basketball jersey number 23, mid-air with arm extended as if dunking, tongue out in concentration',
        category: 'sports',
        keywords: ['jordan', 'mj', 'air jordan', 'his airness']
    },

    'lebron james': {
        visualDNA: 'tall muscular Black man with headband, wearing basketball jersey, powerful dunking pose with intense expression',
        category: 'sports',
        keywords: ['lebron', 'king james', 'lbj']
    },

    'cristiano ronaldo': {
        visualDNA: 'athletic man with styled dark hair, wearing soccer jersey, arms spread wide in celebration pose after scoring',
        category: 'sports',
        keywords: ['ronaldo', 'cr7', 'cristiano']
    },

    'lionel messi': {
        visualDNA: 'shorter athletic man with beard, wearing blue and white striped jersey, dribbling a soccer ball with focused expression',
        category: 'sports',
        keywords: ['messi', 'leo messi']
    },

    'serena williams': {
        visualDNA: 'powerful athletic Black woman in tennis outfit, mid-serve with racket raised high, fierce determined expression',
        category: 'sports',
        keywords: ['serena', 'williams sisters']
    },

    'tiger woods': {
        visualDNA: 'athletic Black man in red polo shirt and golf cap, mid-swing with golf club, focused intense gaze',
        category: 'sports',
        keywords: ['tiger', 'woods']
    },

    'usain bolt': {
        visualDNA: 'tall athletic Black man in running gear, signature lightning bolt pose with finger pointing to sky, joyful expression',
        category: 'sports',
        keywords: ['bolt', 'usain', 'fastest man']
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // ENTERTAINMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    'oprah winfrey': {
        visualDNA: 'elegant Black woman in flowing dress on talk show stage with audience, warm welcoming gesture with open arms',
        category: 'entertainment',
        keywords: ['oprah', 'winfrey']
    },

    'taylor swift': {
        visualDNA: 'blonde woman in sparkly outfit performing on massive concert stage with thousands of fans, confident performance pose',
        category: 'entertainment',
        keywords: ['taylor', 'swift', 't-swift']
    },

    'beyoncé': {
        visualDNA: 'glamorous Black woman with flowing hair in elaborate costume, performing powerful dance move on stage with dramatic lighting',
        category: 'entertainment',
        keywords: ['beyonce', 'queen bey', 'bey']
    },

    'drake': {
        visualDNA: 'Black man with beard wearing designer clothing, on stage with microphone, pointing at crowd with charismatic smile',
        category: 'entertainment',
        keywords: ['drake', 'drizzy', 'champagne papi']
    },

    'kanye west': {
        visualDNA: 'Black man with unique fashion, standing in minimalist setting with artistic backdrop, serious introspective expression',
        category: 'entertainment',
        keywords: ['kanye', 'ye', 'yeezy']
    },

    'ellen degeneres': {
        visualDNA: 'blonde woman in casual blazer, standing in colorful talk show setting, dancing with playful expression',
        category: 'entertainment',
        keywords: ['ellen']
    },

    'tom hanks': {
        visualDNA: 'friendly man with graying hair in casual attire, warm genuine smile, approachable demeanor',
        category: 'entertainment',
        keywords: ['hanks', 'tom']
    },

    'dwayne johnson': {
        visualDNA: 'muscular bald man with tribal tattoo on shoulder, wearing black t-shirt, raised eyebrow with charming smile',
        category: 'entertainment',
        keywords: ['the rock', 'dwayne', 'rock johnson']
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // HISTORICAL FIGURES
    // ═══════════════════════════════════════════════════════════════════════════════

    'albert einstein': {
        visualDNA: 'elderly man with wild white hair and mustache, wearing rumpled sweater, writing equations on chalkboard, deeply thoughtful expression',
        category: 'historical',
        keywords: ['einstein', 'albert']
    },

    'steve wozniak': {
        visualDNA: 'bearded man with friendly demeanor, holding circuit board, enthusiastic excited expression',
        category: 'tech',
        keywords: ['wozniak', 'woz']
    },

    'martin luther king': {
        visualDNA: 'dignified Black man in suit at podium, addressing large crowd, passionate inspiring gesture with raised hand',
        category: 'historical',
        keywords: ['mlk', 'king', 'martin luther']
    },

    'gandhi': {
        visualDNA: 'thin elderly Indian man in simple white cloth, round glasses, walking with wooden staff, peaceful serene expression',
        category: 'historical',
        keywords: ['mahatma', 'gandhi']
    },

    'nelson mandela': {
        visualDNA: 'elderly Black man with gray hair in colorful traditional shirt, warm smile with fist raised in solidarity',
        category: 'historical',
        keywords: ['mandela', 'madiba']
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // POLITICAL FIGURES
    // ═══════════════════════════════════════════════════════════════════════════════

    'barack obama': {
        visualDNA: 'tall Black man with graying hair in suit, speaking at podium, confident hopeful expression with characteristic hand gesture',
        category: 'political',
        keywords: ['obama', 'barack']
    },

    'donald trump': {
        visualDNA: 'man with distinctive blonde hair in dark suit with long red tie, thumbs up gesture, confident expression',
        category: 'political',
        keywords: ['trump', 'donald']
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // AUTHORS & THOUGHT LEADERS
    // ═══════════════════════════════════════════════════════════════════════════════

    'jordan peterson': {
        visualDNA: 'man with graying hair in suit, gesturing while explaining, intense focused expression',
        category: 'thought_leader',
        keywords: ['peterson', 'dr peterson']
    },

    'joe rogan': {
        visualDNA: 'bald muscular man in casual t-shirt, sitting in podcast studio with microphones, engaged listening expression',
        category: 'entertainment',
        keywords: ['rogan', 'joe']
    },

    'gary vaynerchuk': {
        visualDNA: 'energetic man with dark hair, casual streetwear, speaking intensely with animated hand gestures',
        category: 'business',
        keywords: ['gary vee', 'garyvee', 'vaynerchuk']
    },

    'tony robbins': {
        visualDNA: 'tall imposing man with broad smile, on stage with audience, powerful motivational gesture',
        category: 'thought_leader',
        keywords: ['robbins', 'tony']
    },

    'simon sinek': {
        visualDNA: 'man with warm smile in casual blazer, speaking with whiteboard behind, thoughtful explanatory gestures',
        category: 'thought_leader',
        keywords: ['sinek', 'simon']
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // BRANDS & TRADEMARKS
    // ═══════════════════════════════════════════════════════════════════════════════

    'iphone': {
        visualDNA: 'sleek smartphone with rounded corners and minimal bezels, premium metallic finish',
        category: 'brand',
        keywords: ['apple phone', 'ios device']
    },

    'tesla': {
        visualDNA: 'futuristic electric sedan with minimalist design, falcon-wing doors, charging at modern station',
        category: 'brand',
        keywords: ['tesla car', 'model s', 'model 3', 'model x', 'model y']
    },

    'nike': {
        visualDNA: 'athletic shoes with curved swoosh symbol, dynamic sports imagery',
        category: 'brand',
        keywords: ['nike shoes', 'just do it', 'air jordan shoes']
    },

    'coca-cola': {
        visualDNA: 'iconic curved glass bottle with dark fizzy beverage, condensation droplets',
        category: 'brand',
        keywords: ['coke', 'coca cola']
    },

    'mcdonalds': {
        visualDNA: 'golden arches logo, red and yellow color scheme, fast food restaurant',
        category: 'brand',
        keywords: ['mcd', 'mcdonalds', 'mickey d']
    },

    'starbucks': {
        visualDNA: 'green and white coffee cup with circular mermaid logo, cozy cafe setting',
        category: 'brand',
        keywords: ['starbucks coffee']
    },

    'amazon': {
        visualDNA: 'brown delivery boxes stacked, modern warehouse with conveyor belts',
        category: 'brand',
        keywords: ['amazon box', 'prime']
    },

    'google': {
        visualDNA: 'colorful letters in blue red yellow green, modern tech office setting',
        category: 'brand',
        keywords: ['google search', 'alphabet']
    },

    'microsoft': {
        visualDNA: 'four-color square logo in red green blue yellow, modern office environment',
        category: 'brand',
        keywords: ['windows', 'microsoft office']
    },

    'apple': {
        visualDNA: 'bitten fruit silhouette logo, minimalist premium technology devices',
        category: 'brand',
        keywords: ['apple inc', 'apple computer']
    },

    'ferrari': {
        visualDNA: 'sleek red Italian sports car with prancing horse emblem, racing on track',
        category: 'brand',
        keywords: ['ferrari car']
    },

    'rolex': {
        visualDNA: 'luxury wristwatch with crown emblem, gold and steel finish, elegant design',
        category: 'brand',
        keywords: ['rolex watch']
    },

    'louis vuitton': {
        visualDNA: 'leather handbag with monogram pattern, luxury fashion boutique setting',
        category: 'brand',
        keywords: ['lv', 'vuitton']
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // FICTIONAL CHARACTERS (Copyright-sensitive)
    // ═══════════════════════════════════════════════════════════════════════════════

    'mickey mouse': {
        visualDNA: 'cartoon mouse character with large round ears, red shorts, white gloves, cheerful waving pose',
        category: 'fictional',
        keywords: ['mickey', 'disney mouse']
    },

    'spider-man': {
        visualDNA: 'superhero in red and blue bodysuit with web pattern, swinging between buildings, dynamic action pose',
        category: 'fictional',
        keywords: ['spiderman', 'spider man', 'peter parker']
    },

    'batman': {
        visualDNA: 'dark superhero with cape and cowl, standing on rooftop at night, brooding silhouette against moon',
        category: 'fictional',
        keywords: ['dark knight', 'bruce wayne']
    },

    'superman': {
        visualDNA: 'superhero in blue costume with red cape, flying pose with fist forward, confident heroic expression',
        category: 'fictional',
        keywords: ['man of steel', 'clark kent']
    },

    'iron man': {
        visualDNA: 'red and gold armored suit with glowing chest piece, hovering with repulsors active',
        category: 'fictional',
        keywords: ['tony stark', 'ironman']
    },

    'darth vader': {
        visualDNA: 'tall figure in black armor and flowing cape, helmet with breath mask, red glowing sword',
        category: 'fictional',
        keywords: ['vader', 'sith lord']
    },

    'harry potter': {
        visualDNA: 'young wizard with round glasses and lightning-bolt scar, wearing robe and holding wooden wand',
        category: 'fictional',
        keywords: ['potter', 'boy wizard']
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION & TRANSFORMATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detect famous people, brands, or copyrighted content in text
 * @param {string} text - Text to scan
 * @returns {Object} { detected: boolean, matches: Array<{name, visualDNA, category}> }
 */
function detectFamousCast(text) {
    if (!text) return { detected: false, matches: [] };

    const lowerText = text.toLowerCase();
    const matches = [];
    const foundNames = new Set();

    for (const [name, data] of Object.entries(VISUAL_DNA_DATABASE)) {
        // Check main name
        if (lowerText.includes(name) && !foundNames.has(name)) {
            matches.push({
                originalName: name,
                visualDNA: data.visualDNA,
                category: data.category
            });
            foundNames.add(name);
            continue;
        }

        // Check aliases/keywords
        for (const keyword of data.keywords || []) {
            if (lowerText.includes(keyword.toLowerCase()) && !foundNames.has(name)) {
                matches.push({
                    originalName: name,
                    visualDNA: data.visualDNA,
                    category: data.category,
                    matchedKeyword: keyword
                });
                foundNames.add(name);
                break;
            }
        }
    }

    return {
        detected: matches.length > 0,
        matches: matches,
        count: matches.length
    };
}

/**
 * Apply VEO-Safe transformation to text
 * Replaces famous names with their Visual DNA descriptions
 * @param {string} text - Original text
 * @param {Array} matches - Matches from detectFamousCast
 * @returns {string} Transformed text
 */
function applyVEOSafeTransform(text, matches) {
    if (!text || !matches || matches.length === 0) return text;

    let transformedText = text;

    for (const match of matches) {
        // Create regex to match the name (case insensitive, word boundary)
        const nameRegex = new RegExp(`\\b${escapeRegex(match.originalName)}\\b`, 'gi');

        // Also match keywords
        if (match.matchedKeyword) {
            const keywordRegex = new RegExp(`\\b${escapeRegex(match.matchedKeyword)}\\b`, 'gi');
            transformedText = transformedText.replace(keywordRegex, match.visualDNA);
        }

        transformedText = transformedText.replace(nameRegex, match.visualDNA);
    }

    return transformedText;
}

/**
 * Escape special regex characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get summary of detected famous cast for UI notification
 * @param {Array} matches - Matches from detectFamousCast
 * @returns {string} Human-readable summary
 */
function getFamousCastSummary(matches) {
    if (!matches || matches.length === 0) return '';

    const categories = {};
    matches.forEach(m => {
        if (!categories[m.category]) categories[m.category] = [];
        categories[m.category].push(m.originalName);
    });

    const parts = [];
    for (const [cat, names] of Object.entries(categories)) {
        const catLabel = {
            'tech': '💻 Tech',
            'business': '💼 Business',
            'sports': '⚽ Sports',
            'entertainment': '🎬 Entertainment',
            'historical': '📜 Historical',
            'political': '🏛️ Political',
            'thought_leader': '🎤 Thought Leaders',
            'brand': '🏷️ Brands',
            'fictional': '🦸 Fictional'
        }[cat] || cat;

        parts.push(`${catLabel}: ${names.map(n => capitalizeFirst(n)).join(', ')}`);
    }

    return parts.join(' | ');
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Export for use in ScriptFlow
window.VEO_SAFE = {
    database: VISUAL_DNA_DATABASE,
    detectFamousCast,
    applyVEOSafeTransform,
    getFamousCastSummary,
    VERSION: '1.0.0'
};

console.log('✅ VEO-Safe Visual DNA Database loaded:', Object.keys(VISUAL_DNA_DATABASE).length, 'entries');
