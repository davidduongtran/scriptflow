---
title: Phase 2 - Privacy Policy
status: todo
priority: critical
effort: 30m
---

# Phase 2: Privacy Policy

Chrome Web Store **requires** a publicly accessible privacy policy URL for any extension that collects, transmits, or stores user data. TITANSYS MIND does all three.

## What Must Be Covered

| Data | Where It Goes | Must Disclose |
|------|--------------|---------------|
| Claude API key | Stored locally in `chrome.storage.local` | ✅ |
| Gemini API key | Stored locally in `chrome.storage.local` | ✅ |
| Script prompts & analyzer content | Sent to Anthropic API | ✅ |
| VEO prompts & script content | Sent to Google Gemini API | ✅ |
| Analyzer data from companion extensions | Stored locally, optionally included in AI prompts | ✅ |
| Generation history | Stored locally | ✅ |

## Hosting Options (Pick One)

| Option | Effort | Recommended If |
|--------|--------|----------------|
| GitHub Gist (public) | 5 min | No website exists |
| GitHub Pages (`/privacy`) | 10 min | You have a GitHub repo |
| Google Sites / Google Doc (published) | 5 min | Quickest path |
| Own domain (`titansys.io/privacy`) | 30 min | Best for professional listing |

## Privacy Policy Template

Use this as the base. Fill in `[YOUR NAME / COMPANY]` and `[CONTACT EMAIL]`:

---

**Privacy Policy — TITANSYS MIND**
*Last updated: May 2026*

**TITANSYS MIND** is a Chrome extension for AI-assisted script and video prompt generation.

**Data We Do NOT Collect**
We do not operate servers. We do not collect, store, or process any personal data on our end.

**Data Stored Locally (on your device)**
The extension stores the following data in Chrome's local storage on your device only:
- Your Anthropic (Claude) and Google Gemini API keys
- Analyzer data received from companion TITANSYS extensions
- Generated scripts and VEO prompts (history)
- Your settings and preferences

This data never leaves your device except as described below.

**Data Sent to Third-Party AI Providers**
When you generate scripts or prompts, your input content is sent directly from your browser to:
- **Anthropic** (api.anthropic.com) — for script generation via the Claude API
- **Google** (generativelanguage.googleapis.com) — for VEO prompt generation via the Gemini API

These requests use your own API keys. We are not a party to these transmissions. Refer to [Anthropic's Privacy Policy](https://www.anthropic.com/privacy) and [Google's Privacy Policy](https://policies.google.com/privacy) for how they handle your data.

**Data Shared with Companion Extensions**
The extension communicates with other TITANSYS extensions installed on your device (TITANSYS SCOPE, TEXT, RADAR, CORE) to pass analyzer data and generated content between them. This communication is local, device-to-device only, using Chrome's extension messaging API.

**Data Retention**
All locally stored data remains on your device until you clear it (via the "Clear All Local Data" button in Settings) or uninstall the extension.

**Changes**
We may update this policy. Continued use of the extension after changes constitutes acceptance.

**Contact**
[YOUR NAME / COMPANY] — [CONTACT EMAIL]

---

## Steps

1. Choose a hosting option above
2. Publish the policy with your name/email filled in
3. Copy the public URL
4. Add the URL to the Chrome Web Store listing (Developer Dashboard → Privacy tab)
5. Also add it to `manifest.json` under `"homepage_url"` if you want it visible in the extension details

## Todo

- [ ] Choose hosting platform
- [ ] Publish the privacy policy with contact info filled in
- [ ] Copy the public URL for use in Phase 5 (store submission)
