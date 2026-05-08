---
title: Chrome Web Store Publication
status: in_progress
created: 2026-05-08
priority: high
blockedBy: []
blocks: []
---

# Chrome Web Store Publication

Everything required to submit TITANSYS MIND v7.0.0 to the Chrome Web Store.
Security hardening is complete (260507 plan). This plan covers the remaining publication gates.

## Phases

| # | Phase | Type | Status | Est. |
|---|-------|------|--------|------|
| 1 | [Replace Companion Extension IDs](phase-01-replace-extension-ids.md) | Code | `todo` | 15m |
| 2 | [Privacy Policy](phase-02-privacy-policy.md) | Content | `todo` | 30m |
| 3 | [Build & Validate Package](phase-03-build-and-validate-package.md) | Technical | `todo` | 30m |
| 4 | [Store Listing Assets](phase-04-store-listing-assets.md) | Content | `todo` | 2h |
| 5 | [Submit to Chrome Web Store](phase-05-submit-to-store.md) | Process | `todo` | 30m |

**Total estimate:** ~4 hours

## Prerequisites Completed

- ✅ Security hardening (externally_connectable allowlist, keep-alive removed, dangerous header removed)
- ✅ Privacy disclosure UI in Settings tab
- ✅ Branding unified to TITANSYS MIND v7.0.0
- ✅ `build-store-package.ps1` created

## Remaining Blockers

1. **Companion extension IDs** — 4 placeholder strings in `manifest.json` + `background.js` must be replaced with real IDs before the extension is functional
2. **Privacy policy URL** — Required by Chrome Web Store for any extension transmitting user data to third parties
3. **Store listing assets** — Screenshots, descriptions, icons required to create the store listing
4. **Developer account** — $5 one-time fee if not already registered

## Open Questions

1. Do you have a Chrome Web Store Developer account already?
2. Do you have a domain/site to host the privacy policy, or should it be a GitHub page / Google Doc?
3. What are the production extension IDs for TITANSYS SCOPE, TEXT, RADAR, CORE?
