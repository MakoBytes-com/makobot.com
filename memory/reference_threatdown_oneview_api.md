---
name: reference-threatdown-oneview-api
description: "ThreatDown OneView API access — creds path, Mako account IDs, SA + exclusion endpoints, and the 2026-08-14 FP cleanup state"
metadata: 
  node_type: memory
  type: reference
  originSessionId: b1dc3f61-edc1-487b-853c-9ba8234431d3
  modified: 2026-08-14T20:30:19.329Z
---

# ThreatDown OneView API (MSP endpoint security)

**MSP stack note (2026-08-14):** Mako Logics switched patch management to
**Atera** (RMM) — first fleet-wide patch run the evening of 2026-08-14.
ThreatDown's paid Patch Management tier is NOT needed. The free Vulnerability
Assessment module (still to be enabled on the 14 sites, console-only toggle)
is the verification layer: after Atera patch runs, sweep `/nebula/v1/cve`
per site and report the before/after drop from the 3,542 baseline
(18 critical / 1,413 high as of 2026-08-14). No Atera API credentials held yet.

Set up 2026-08-14 so FP "Suspicious Activity" flags on Mako machines get fixed via
API instead of Russell clicking through the console.

- **Creds:** `C:\Users\Russell.Sailors\.makologics\threatdown-oneview.env`
  (OAuth2 client, scope read+write, created in OneView → Integrate → Add +).
- **Token:** POST `https://api.malwarebytes.com/oneview/oauth2/token`, Basic
  base64(id:secret), `grant_type=client_credentials&scope=read write`.
- **Mako Logics nebula account id:** `c3a9b827-5e02-4b7a-97f8-c2c4a8202e96`
  (`accountid` header on all `/nebula/v1/*` calls). NFR site:
  `6b2f07e2-6a2c-4d6a-a95d-cd670d321667`. Sites list: GET `/oneview/v1/sites`.
- **Key routes:** GET `/nebula/v1/sa?page_size=100` (open = status "detected");
  PUT `/nebula/v1/endpoints/{machine_id}/sa/{sa_id}/close` with body `{}`;
  POST `/nebula/v1/exclusions`. OpenAPI: `https://cloud.malwarebytes.com/api/v2/nebula/docs`.
- **Runbook scripts:** `C:\Users\Russell.Sailors\.makologics\td-drain.py`, `td-fix.py`.
- **2026-08-14 cleanup:** 63 FP SAs closed (Claude Code ×13, CurseForge ×46,
  [retired project] SDK ×2, Codex ×1, node ×1). 4 standing SA-only exclusions on the Mako
  Logics account: Claude Code ext binary, [retired project] SDK claude.exe, Codex ext
  binary, CurseForge. node.exe deliberately not excluded. Client tenants never
  touched without per-site authorization.
- **Gotchas:** close endpoint 400s on empty body (send `{}`); closing surfaces
  older items page-by-page — loop until 0; Windows Python `\r` corrupts bash
  `while read` URLs (curl 000); jobs/bulk API only does scans — agent
  restart/update is console-only (Manage → Endpoints → machine → Actions).
- **Client-site outcomes 2026-08-14 (Russell-authorized):** VSO ×2 closed
  (their internal "VSO Feature Tracker" launch.bat off \\mon-prod10 ENG share
  — if it re-flags, offer VSO-tenant exclusion for that UNC path);
  Pro-Surve LGC-PROD01 closed (interactive PS + whoami/priv + Add-Type +
  SMB/VSS = david.barrish, Pro-Surve IT — CONFIRMED LEGIT by Russell).
  Every SA queue across all 15 sites verified 0 open. Left for console:
  PROSURVE-LTP79 EDR_ERROR_EVENTLOOP (agent update pending) + Browser Guard
  drift on 6 Buffalo Seal PCs and 1 VSO PC (BG_EXTENSION_NOT_INSTALLED /
  BG_REGISTRY_CONFLICT). Fleet sweep script: `td-fleet-status.py`.

See [[session-summary]] and the proposed MakoBot skill
`threatdown-sa-false-positive-triage` for the full procedure.
