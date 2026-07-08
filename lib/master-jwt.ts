// Read-only fleet-reporting JWT verify helper for makobot.com's
// /api/master/* endpoints. The master control plane (portal.makoai.studio)
// signs a short-lived RS256 JWT with a per-endpoint scope and audience =
// this client's CLIENT_ID. We verify against MASTER_PUBLIC_KEY and fail
// closed on any mismatch. Algorithm is pinned to RS256 (no "alg":"none"
// downgrade), audience is required, and the scope must match exactly.
import { importSPKI, jwtVerify, type JWTPayload } from "jose";

export type VerifiedMasterToken = JWTPayload & { scope: string; client_id?: string };

export async function verifyMasterToken(token: string, requiredScope?: string): Promise<VerifiedMasterToken> {
  const pemRaw = process.env.MASTER_PUBLIC_KEY;
  if (!pemRaw) throw new Error("MASTER_PUBLIC_KEY env var is not set");
  const pem = pemRaw.replace(/\\n/g, "\n").trim();
  const aud = (process.env.CLIENT_ID ?? "").trim();
  if (!aud) throw new Error("CLIENT_ID env var is not set");
  const key = await importSPKI(pem, "RS256");
  const { payload } = await jwtVerify(token, key, { audience: aud, algorithms: ["RS256"] });
  const verified = payload as VerifiedMasterToken;
  if (requiredScope && verified.scope !== requiredScope) throw new Error("scope mismatch");
  return verified;
}
