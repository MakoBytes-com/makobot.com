---
name: Email setup runbook — adding cPanel email to a domain on Cloudflare DNS
description: How to add IMAP/SMTP email on host10.makologics.com (cPanel/WHM) to a domain whose DNS lives on Cloudflare. Proven across makobot.com, makobytes.com, [retired project].ai, toppaws.com during the 2026-04-19 batch setup.
type: reference
originSessionId: facd7558-d57b-4425-b28b-d638713ac79e
---
# Mail server
- **Hostname:** `host10.makologics.com` (IP `72.52.251.108`)
- **WHM URL:** https://host10.makologics.com:2087
- **cPanel URL (per-account):** https://host10.makologics.com:2083
- **Webmail:** https://host10.makologics.com:2096
- **Reverse DNS (PTR):** validly points `72.52.251.108 → host10.makologics.com`
- **Default mail HELO cPanel uses:** `host10.makologics.com` (regardless of sending domain)

# Client settings for any domain hosted there
- **IMAP:** `host10.makologics.com`, port **993**, SSL/TLS, username = full email address
- **SMTP:** `host10.makologics.com`, port **465** (SSL) or **587** (STARTTLS), username = full email address

# Procedure for a new domain

## Step 1 — WHM (Russell does)
https://host10.makologics.com:2087 → **Create a New Account**
- Domain: the new domain
- Username: short alias (e.g. `makobot`, `[retired project]`)
- Password: strong
- Email: `admin@<domain>`
- Package: **Mako Enterprise 2006**
- Mail Routing: **Local Mail Exchanger** (default)
- **DNS Settings:**
  - ✅ **Check** "Use the nameservers specified at the Domain's Registrar. (Ignore locally specified nameservers.)" — because Russell's domains use Cloudflare nameservers, not the server's ns1/ns2.makologics.com
  - ✅ **Check** "Enable SPF"
  - ✅ **Check** "Enable DMARC" (default)
  - ❌ **Leave unchecked** "Overwrite any existing DNS zones"
- Click **Create**

## Step 2 — Fetch DKIM from cPanel (Russell does)
Switch to the new account's cPanel → **Email Deliverability** → find the domain → **Manage** → copy the DKIM **Value** field (it's long, ~400 chars).

## Step 3 — Add 4 records to Cloudflare (done via API token)
Use the Cloudflare token stored in `reference_cloudflare_api_token.md`. For each new domain, add:

| Type | Name | Content | Priority |
|---|---|---|---|
| MX | `<domain>` | `host10.makologics.com` | 0 |
| TXT | `<domain>` | `v=spf1 +mx +a +ip4:72.52.251.108 ~all` | — |
| TXT | `default._domainkey.<domain>` | `<DKIM value from cPanel>` | — |
| TXT | `_dmarc.<domain>` | `v=DMARC1; p=none;` | — |

SPF starts at `~all` (soft fail — monitoring). Tighten to `-all` only after weeks of clean DMARC reports.
DMARC starts at `p=none` (monitor). Tighten to `p=quarantine` or `p=reject` only after DMARC aggregate reports show no legitimate mail being flagged.

## Step 4 — Verify
- Public DNS: `dig +short MX <domain>` etc from multiple resolvers
- cPanel Email Deliverability page for the domain → all 4 rows green (may need hard refresh Ctrl+F5 to beat cPanel's internal cache)
- Send Gmail → `admin@<domain>`, check it arrives in webmail
- Send webmail → Gmail, check it arrives in Inbox (not Spam). Open original, confirm `dkim=pass`, `spf=pass`, `dmarc=pass`

## Gotchas
- **Don't send test email to the wrong TLD.** Russell once sent a test to `admin@[retired project].com` when the real domain is `admin@[retired project].ai`. `.com` exists and is owned by someone else — the bounce looked like a real mail-server failure but was actually delivery to the wrong domain entirely.
- **Existing domains (like makobytes.com) may have pre-existing cPanel records in Cloudflare from earlier attempts.** Before touching DKIM, confirm the old cPanel account still exists — otherwise the DKIM public key in DNS may have no matching private key on the server. If the account still exists, **keep** the existing DKIM + SPF records; only fix the broken MX and add DMARC.
- **A domain pointing at Vercel (CNAME to `vercel-dns-*.com`) with MX pointing at the same root name = mail drops on the floor.** Vercel's IP doesn't run SMTP. Always MX to the real mail server.
- **Negative DNS cache is real.** After adding a record, 1.1.1.1 may still return `(none)` for 1-5 minutes. Verify via multiple resolvers or just wait.

# Domains configured (2026-04-19)
All 5 verified working end-to-end:
- `admin@makobot.com` — MX direct to host10.makologics.com
- `admin@makobytes.com` — MX direct; reused existing DKIM from old cPanel account
- `admin@[retired project].ai` — MX direct
- `admin@toppaws.com` — MX direct
- `admin@aipromptshive.com` — **different pattern**: cPanel wrote MX → `mail.aipromptshive.com` which is Cloudflare-proxied. CF auto-creates a shadow `_dc-mx.<hash>.<domain>` that unproxies to host10's IP (72.52.251.108), so external mail servers route around the CDN. If a domain arrives with this pre-wired, leave it alone; don't try to "normalize" by flipping MX to host10 directly — the shadow handles delivery cleanly and changing it may trigger DKIM/SPF re-propagation.

# Domains Russell explicitly skipped
- `buffalosealandgasket.com` — temp customer demo
- `woodlandsfamilypsychiatry.com` — temp customer demo (also no GitHub repo exists)

# Domain to leave alone entirely
- `makologics.com` — his working business email, already on a different setup (arsmtp filter → Microsoft 365). Never touch.
