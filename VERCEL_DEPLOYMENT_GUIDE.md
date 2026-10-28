# Vercel Deployment Guide for canman.eu

## Quick Setup (5 minutes)

### 1. Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import `raivoto/canman.github.io` repository
4. Click **"Import"**

### 2. Configure Project Settings
Vercel should auto-detect Next.js. Verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: leave the default; do not set it to `out`
- **Install Command**: `npm ci`

Click **"Deploy"**

### Service request email (Resend)
The "Need Immediate IT Help?" form sends requests through Resend to `canman.systems@gmail.com`.
In Vercel → **Settings** → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_FROM_EMAIL` | A sender address on a domain verified with Resend, e.g. `Canman Website <website@canman.eu>` |

Redeploy after adding these variables. Until both are configured, the form will show an error instead of claiming the request was sent.

### 3. Add Custom Domain: canman.eu
1. In Vercel project dashboard → **Settings** → **Domains**
2. Click **"Add"** → enter `canman.eu`
3. Vercel will show DNS records to configure

### 4. Configure DNS at Your Domain Registrar
Add these records for `canman.eu`:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**If using Cloudflare**: Disable proxy (orange cloud → gray) for these records.

### 5. Verify
- Wait 1-5 minutes for DNS propagation
- Visit `https://canman.eu` - should show your shop

---

## What Changed in This Repo

| File | Purpose |
|------|---------|
| `vercel.json` | Sets install/build commands and leaves output handling to Vercel |
| `next.config.mjs` | Uses the Next.js runtime without GitHub Pages prefixes or static export |

---

## Notes
- **GitHub repo stays the source of truth** - push to main → Vercel auto-deploys
- **Preview deployments** - every PR gets a preview URL
- **No GitHub Actions needed** - Vercel handles build/deploy
- **Next.js runtime** - required for dynamic routes and the service-request email API

---

## Troubleshooting
- **Build fails**: Check Vercel build logs
- **404 on refresh**: Confirm the project uses the Next.js framework preset and default output directory
- **Images not loading**: `images.unoptimized: true` is set
- **Domain not working**: Check DNS with `dig canman.eu` or `nslookup canman.eu`