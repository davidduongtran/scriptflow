---
title: Chrome Web Store Readiness
status: completed
created: 2026-05-07
completed: 2026-05-07
priority: high
blockedBy: []
blocks: []
---

# Chrome Web Store Readiness

Implements all 7 audit items required for Chrome Web Store submission of TITANSYS MIND v7.0.0.

## Goal

Remove all blockers identified in the security/compliance audit:
fix external messaging wildcard, kill keep-alive hacks, remove dangerous API header,
harden data validation, clean manifest surface, unify architecture packaging,
and add privacy disclosure UI.

## Phases

| # | Phase | Items | Status | Est. |
|---|-------|-------|--------|------|
| 1 | [Security Hardening](phase-01-security-hardening.md) | Items 1, 4, 5 | `completed` | 2h |
| 2 | [Kill Keep-Alive](phase-02-kill-keep-alive.md) | Item 2 | `completed` | 1h |
| 3 | [API Key Hardening](phase-03-api-key-hardening.md) | Item 3 | `completed` | 2h |
| 4 | [Architecture + Privacy UX](phase-04-architecture-privacy.md) | Items 6, 7 | `completed` | 3h |

**Total estimate:** ~8 hours

## Key Dependencies

- Phase 1 must complete before Phase 2 (both touch `background.js` and `manifest.json`)
- Phase 3 depends on Phase 1 (unified API path confirmed)
- Phase 4 is independent — can start after Phase 1

## Files Touched (Overview)

| File | Phases |
|------|--------|
| `manifest.json` | 1, 2 |
| `background.js` | 1, 2, 3 |
| `modules/apiClient.js` | 3 |
| `sidepanel.js` | 3, 4 |
| `sidepanel.html` | 4 |
| `offscreen.html` | 2 (delete) |
| `shared/extensionRegistry.js` | 1 |
| `shared/extensionProtocol.js` | 1 |
| `modules/messaging.js` | 1 |

## Completion Summary

All 4 phases completed successfully. Implemented all 7 audit items:

**Security Hardening (Phase 1)**
- Fixed external messaging wildcard in `manifest.json` (externally_connectable)
- Hardened data validation in shared modules
- Cleaned manifest surface (removed deprecated fields)

**Keep-Alive Removal (Phase 2)**
- Removed persistent background.js keep-alive patterns
- Cleaned event listeners and messaging logic

**API Key Hardening (Phase 3)**
- Removed dangerous `X-API-Key` header from background.js
- Consolidated all API calls through `modules/apiClient.js`
- Unified API endpoint handling

**Architecture + Privacy UX (Phase 4)**
- Created `modules/apiClient.js` for centralized API management
- Added privacy disclosure UI in sidepanel settings
- Created `build-store-package.ps1` for secure packaging

**Files Modified:**
- manifest.json: permissions restructured for compliance
- background.js: keep-alive removed, API calls unified
- sidepanel.js/html: privacy UX added
- modules/apiClient.js: created for consolidated API handling
- shared/extensionRegistry.js, extensionProtocol.js: hardened validation

Extension now meets Chrome Web Store submission requirements.

## Open Questions

1. **Companion extension IDs**: Production IDs for TITANSYS SCOPE, TEXT, RADAR, CORE needed for final `externally_connectable` production allowlist.
2. **SW event dependency**: Confirmed keep-alive removal works without breaking user flows.
