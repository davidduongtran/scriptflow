---
title: Phase 4 - Store Listing Assets
status: todo
priority: high
effort: 2h
---

# Phase 4: Store Listing Assets

Everything required to create the Chrome Web Store listing. The store will not let you submit without screenshots and descriptions.

## Required Assets

| Asset | Spec | Required |
|-------|------|----------|
| Screenshots | 1280×800px or 640×400px, PNG/JPEG, max 5 | Min 1 (max 5 recommended) |
| Small promo tile | 440×280px PNG | Optional (shown in search) |
| Large promo tile | 920×680px PNG | Optional (featured placement) |
| Extension icons | 16, 48, 128px — already exist | ✅ Done |

---

## Screenshots (Min 1, Recommend 3–4)

Capture from the **packaged extension** (not dev mode) at 1280×800 browser window.

### Suggested shots

| # | Tab | What to Show |
|---|-----|-------------|
| 1 | Script tab | A generated script visible in the output area — shows the core feature |
| 2 | VEO Prompts tab | Generated scene prompts — demonstrates the video prompt capability |
| 3 | Settings tab | API key fields + Data & Privacy section — shows simplicity + trust |
| 4 | Script tab with analyzer data loaded | "Clone Mode" active, data populated — shows TITANSYS integration |

### How to capture at exactly 1280×800

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set custom size: **1280 × 800**
4. Focus the side panel window
5. Use Chrome's built-in screenshot: DevTools → ⋮ → Capture screenshot

Or use the Windows Snipping Tool with the browser resized to 1280×800.

---

## Store Descriptions

### Short Description (≤132 characters)

```
AI YouTube script writer & Google VEO prompt generator. Powered by Claude and Gemini. Free to use with your own API keys.
```
*(121 chars — within limit)*

### Long Description (up to 16,000 chars — SEO + GEO optimized)

```
ScriptFlow — AI YouTube Script Writer & VEO Video Prompt Generator

ScriptFlow is a Chrome extension that generates professional YouTube scripts and Google Flow VEO 3 video prompts directly in your browser, using Claude (Anthropic) and Gemini (Google) with your own API keys.

No subscriptions. No servers. Your content stays yours.

── AI YOUTUBE SCRIPT WRITER ──
• Generate full YouTube scripts in seconds with Claude AI
• 5 script templates: Editorial, Documentary, Tutorial, VSL, YouTube Shorts
• Clone Mode — reverse-engineer top-performing video structures (100% verbatim or 95% creative rewrite)
• AI Suggestions — auto-fill topic, target audience, and hook angle
• Supports Claude Sonnet 4, Claude 3.5 Sonnet, and Claude 3 Opus

── GOOGLE VEO VIDEO PROMPT GENERATOR ──
• Generate Google Flow VEO 3 prompts scene by scene with Gemini AI
• Flow Extend format — timing, camera movement, SFX, and subject descriptions per scene
• 25+ visual style dimensions: cinematography style, mood, color palette, environment, and more
• Batch generation for 20+ scenes without rate-limit errors
• Supports Gemini 2.5 Flash, Gemini 2.0 Flash, and Gemini 1.5 Pro

── PROMPT QUALITY AUDIT ──
• Score your AI prompts before generating
• Identify weak or vague language with one click
• Auto-fix suggestions to improve output quality
• Export audit reports as JSON, Markdown, or PDF

── PRIVACY-FIRST DESIGN ──
• Bring your own Claude and Gemini API keys
• Zero data sent to our servers — all AI calls go directly from your browser to Anthropic and Google
• API keys and generated content stored locally on your device only
• Clear all local data any time from Settings

── WHO IS THIS FOR? ──
ScriptFlow is built for:
• YouTube content creators who want faster script production
• Video producers working with Google Flow VEO 3
• Marketing teams generating video ad scripts at scale
• Educators and course creators structuring long-form video content
• Faceless YouTube channel operators using AI video workflows

── REQUIREMENTS ──
• Anthropic API key for script generation — get one at console.anthropic.com
• Google Gemini API key for VEO prompts — get one at ai.google.dev
• API usage is billed directly by Anthropic / Google at standard rates

ScriptFlow replaces hours of manual scriptwriting and prompt engineering with a focused, browser-native AI workflow — no copy-pasting between tabs, no third-party platforms, no data leaving your browser.
```

---

## Permission Justifications

Chrome Web Store requires written justification for sensitive permissions. Prepare these:

| Permission | Justification |
|------------|--------------|
| `storage` | Stores user API keys, settings, and generated content locally on-device |
| `sidePanel` | The extension's entire UI is presented as a side panel for non-intrusive workflow integration |

No other permissions are declared — this is a clean, minimal surface.

---

## Category & Metadata

| Field | Value |
|-------|-------|
| Category | `Productivity` |
| Language | English |
| Visibility | Public |
| Regions | All regions (or restrict if needed) |
| Maturity | General audience |

---

## Todo

- [ ] Capture Screenshot 1: Script tab with generated output
- [ ] Capture Screenshot 2: VEO Prompts tab with generated prompts
- [ ] Capture Screenshot 3: Settings tab showing privacy section
- [ ] (Optional) Capture Screenshot 4: Clone Mode with analyzer data
- [ ] (Optional) Design small promo tile 440×280px
- [ ] Finalize short description (pick preferred version)
- [ ] Review and adjust long description if needed
- [ ] Have permission justification text ready to paste
