---
title: Phase 5 - Submit to Chrome Web Store
status: todo
priority: high
effort: 30m
---

# Phase 5: Submit to Chrome Web Store

Step-by-step walkthrough of the Chrome Web Store Developer Dashboard submission flow.

## Prerequisites Checklist (all must be done)

- [ ] Phase 1: Placeholder extension IDs replaced with real IDs
- [ ] Phase 2: Privacy policy published at a public URL
- [ ] Phase 3: `titansys-mind-v7.0.0.zip` built and smoke-tested
- [ ] Phase 4: Screenshots captured, descriptions ready
- [ ] Chrome Web Store Developer account active ($5 one-time fee at https://chrome.google.com/webstore/devconsole/register)

---

## Submission Steps

### 1. Open Developer Dashboard

Go to: https://chrome.google.com/webstore/devconsole

Sign in with the Google account that owns the developer account.

### 2. Create New Item

Click **"New item"** → upload `titansys-mind-v7.0.0.zip`.

Chrome will parse the manifest and auto-fill the extension name (`TITANSYS MIND`) and version (`7.0.0`).

### 3. Store Listing Tab

Fill in:

| Field | Value |
|-------|-------|
| Short description | From Phase 4 |
| Detailed description | Long description from Phase 4 |
| Category | Productivity |
| Language | English |
| Screenshots | Upload 1–4 screenshots from Phase 4 |
| Small promo tile | Upload if created (optional) |

### 4. Privacy Tab

| Field | Value |
|-------|-------|
| Privacy policy URL | URL from Phase 2 |
| Single purpose | "AI-powered script and video prompt generation for YouTube creators" |
| Permission justifications | Paste from Phase 4 justification table |
| Data collection | Check: "This extension does not collect or use personal data" is NOT accurate — instead declare: stores API keys locally, sends user content to Anthropic and Google Gemini |

**Data use disclosures to select:**
- ✅ "Personally identifiable information" → No (API keys are not PII in the strict sense, but disclose anyway)
- ✅ "User activity" → No
- ✅ "Financial and payment information" → No
- ✅ "Authentication information" → **Yes** — API keys are stored locally

### 5. Distribution Tab

| Field | Value |
|-------|-------|
| Visibility | Public |
| Distribution | All regions (adjust if needed) |
| Trusted testers | Optional — use to test before going public |

### 6. Review and Submit

Click **"Submit for review"**.

Chrome Web Store review typically takes **1–3 business days** for new extensions. You'll receive an email when approved or if additional information is required.

---

## After Submission

### If Approved
- The extension goes live automatically (or after you click "Publish" depending on your setting)
- Update companion extensions' `externally_connectable` configs to point to the published MIND ID
- Note the final published extension ID — it's now permanent

### If Rejected (Common Reasons & Fixes)

| Rejection Reason | Fix |
|-----------------|-----|
| Policy violation: misleading description | Review description for accuracy |
| Missing privacy policy | Verify Phase 2 URL is accessible |
| Permissions not justified | Add more detail to permission justifications |
| Functionality not working | Re-test with the exact zip that was uploaded |
| `externally_connectable` concerns | Clarify in reviewer notes that it's for a known companion extension suite |

### Reviewer Notes (Recommended)

When submitting, add a note in the "Notes for reviewer" field:

```
This extension is part of the TITANSYS suite. It communicates with companion 
TITANSYS extensions (SCOPE, TEXT, RADAR, CORE) via externally_connectable, 
which is why specific extension IDs are listed in the manifest. 

To test: install the extension, go to Settings, enter a valid Anthropic or 
Gemini API key, then navigate to the Script or VEO Prompts tab to generate content.

No backend server is involved. All AI calls go directly from the browser to 
Anthropic (api.anthropic.com) and Google (generativelanguage.googleapis.com) 
using the user's own API keys.
```

---

## Todo

- [ ] Confirm developer account is active
- [ ] Open Developer Dashboard and create new item
- [ ] Upload `titansys-mind-v7.0.0.zip`
- [ ] Fill in Store Listing tab (descriptions + screenshots)
- [ ] Fill in Privacy tab (policy URL + data declarations)
- [ ] Set distribution to Public
- [ ] Add reviewer notes
- [ ] Submit for review
- [ ] Monitor email for approval / rejection response
