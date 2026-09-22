---
name: Azure Trusted Signing Setup
description: Azure Trusted Signing account details for code-signing MakoBot — resource names, role assignments, and remaining steps
type: reference
originSessionId: 8c37fa20-7f86-4c2f-b1a1-e1f64c22a767
---
## Azure Trusted Signing for MakoBot

- **Azure account:** rsailors@makologics.com (MAKO LOGICS LLC)
- **Subscription:** Free tier, $200 credits, expires May 10, 2026
- **Trusted Signing resource:** makologics
- **Resource group:** makologics-signing
- **Location:** East US
- **Account URI:** https://eus.codesigning.azure.net
- **Role assigned:** Artifact Signing Identity Verifier → Russell Sailors

### Remaining steps:
1. ~~Create Identity Validation~~ DONE — Public Trust, Mako Logics LLC, status: In Progress (submitted 2026-04-10)
2. Microsoft verifies organization (1-7 days)
3. Create Certificate Profile
4. Use SignTool or Azure CLI to sign MakoBot exe/installer
5. Publish signed build (removes Windows SmartScreen warnings)
