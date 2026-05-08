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
AI Script & Prompt Generation for YouTube — create scripts with Claude and VEO prompts with Gemini.
```
*(96 chars — within limit)*

Alternative (more feature-focused):
```
Generate YouTube scripts with Claude AI and VEO video prompts with Gemini. Part of TITANSYS suite.
```
*(99 chars)*

### Long Description (up to 16,000 chars — aim for 300–600 words)

```
TITANSYS MIND — AI Script & Prompt Generation

Create professional YouTube scripts and Google Flow VEO 3 video prompts directly in your browser, powered by Claude (Anthropic) and Gemini (Google) using your own API keys.

── SCRIPT GENERATION ──
• Claude AI integration — multiple templates: Editorial, Documentary, Tutorial, VSL, Shorts
• Clone Mode — analyze top-performing videos and reproduce their structure (100% verbatim or 95% creative)
• Auto-populate fields from TITANSYS SCOPE / TEXT analyzer data
• AI Suggestions — auto-fill topic, audience, and angle from analyzed content

── VEO PROMPT GENERATION ──
• Gemini AI integration for Google Flow VEO 3 prompts
• Flow Extend format — scene-by-scene with timing, camera moves, and SFX descriptions
• 25+ visual style dimensions (cinematography, mood, color, subject, environment)
• Batch generation — handle 20+ scenes without timeouts

── ASSESSMENT & AUDIT ──
• Prompt quality scoring — identify weak prompts before you generate
• One-click auto-fix suggestions
• Export reports as JSON, Markdown, or PDF

── SETTINGS & PRIVACY ──
• Bring your own API keys — nothing is stored on our servers
• All AI calls go directly from your browser to Anthropic / Google
• Clear all local data any time from the Settings tab

── TITANSYS SUITE INTEGRATION ──
Works seamlessly with other TITANSYS extensions:
• Receives video analysis from TITANSYS SCOPE and TITANSYS TEXT
• Sends VEO prompts to TITANSYS CORE for automation

── REQUIREMENTS ──
• Anthropic API key (console.anthropic.com) for script generation
• Google Gemini API key (ai.google.dev) for VEO prompt generation
• API usage is billed by Anthropic / Google at their standard rates

Built for YouTube creators, video producers, and content teams who want AI-powered scripting without sacrificing control over their workflow.
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
