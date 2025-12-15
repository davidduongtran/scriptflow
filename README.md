# Script Writer Pro v7.0

AI-Powered YouTube Script & VEO 3 Prompt Generation

## 🚀 What's New in v7.0

### ✨ VEO Prompts Tab (NEW!)
- **Gemini AI Integration** - Generate VEO 3/Flow video prompts using Gemini 2.5 Flash
- **Flow Extend Format** - Scene-by-scene prompts with timing markers, camera specs, SFX/BGM
- **4 Style Dimensions** - Visual Rendering, Content/Genre, Era/World, Special Effects
- **Batch Generation** - Handle 20+ prompts without JSON errors
- **Auto-Calculate Prompts** - Based on script word count (words ÷ 2.5 ÷ 8)
- **One-Click Transfer** - Send generated script directly to VEO tab

### 📝 Script Generation (Existing)
- Claude AI for professional YouTube scripts
- YouTube Analyzer Pro integration
- AI-powered suggestions
- Multiple templates (Universal, Educational, Tutorial, etc.)

## 🔧 Installation

1. Open Chrome → Extensions → Enable "Developer mode"
2. Click "Load unpacked" → Select this folder
3. Click the extension icon to open the side panel

## ⚙️ Setup

### Claude API (for Script Generation)
1. Get API key from [console.anthropic.com](https://console.anthropic.com/)
2. Go to Settings tab → Enter Claude API Key → Save

### Gemini API (for VEO Prompts)
1. Get API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Go to Settings tab → Enter Gemini API Key → Save

## 📖 Usage

### Generate Script → VEO Prompts Workflow

1. **Generate Tab**: Enter topic, select template, click "Generate Script"
2. Click **"🎬 → VEO"** button to transfer script
3. **VEO Prompts Tab**: Adjust style settings, click "Generate All Prompts"
4. Copy prompts to Google Flow/VEO 3

### VEO Style Settings

| Setting | Purpose | Required |
|---------|---------|----------|
| Visual Rendering | Animation style (3D, 2D, Anime, etc.) | ✅ Yes |
| Content/Genre | Educational, Sci-Fi, Comedy, etc. | Optional |
| Era/World | Modern, Futuristic, Medieval, etc. | Optional |
| Special Effects | Neon, Glitch, POV, etc. | Optional |

### Batch Generation (20+ prompts)

For large prompt counts, use Batch Generation to avoid JSON errors:
1. Set prompts to 25+
2. Click individual batch buttons OR "Auto-Generate All Batches"
3. Results auto-combine

## 📁 Files

```
script-writer-pro-v7.0/
├── manifest.json      # Extension config
├── background.js      # Service worker
├── sidepanel.html     # UI structure
├── sidepanel.css      # Styling
├── sidepanel.js       # Main logic
├── icons/             # Extension icons
└── README.md          # This file
```

## 🔗 Integration

- **YouTube Analyzer Pro** → Sends analysis data to Script Writer
- **FlowAutomate** → Can receive scripts (legacy support)

## 📊 Version History

- **v7.0.0** - Added VEO Prompts tab with Gemini integration
- **v6.0.0** - YouTube Analyzer integration, AI suggestions
- **v5.0.0** - Initial Claude-powered script generation

---

Made with ❤️ by David Duong
