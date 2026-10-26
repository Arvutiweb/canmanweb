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
- **Output Directory**: leave the default for the Next.js framework preset
- **Install Command**: `npm ci`

Click **"Deploy"**

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
| `vercel.json` | Sets install/build commands; leaves Next.js output handling to Vercel |
| `next.config.mjs` | Enables static export and removes GitHub Pages `basePath`/`assetPrefix` |
| `.vercelignore` | Excludes root-level offline import data, scripts, and documentation from the deployment upload while keeping `src/data` available to the build |

---

## Notes
- **GitHub repo stays the source of truth** - push to main → Vercel auto-deploys
- **Preview deployments** - every PR gets a preview URL
- **No GitHub Actions needed** - Vercel handles build/deploy
- **Static export (`output: 'export'`)** - pages are generated as static HTML, while Vercel's Next.js framework integration handles the build output

---

## Troubleshooting
- **Build fails**: Check Vercel build logs
- **404 on refresh**: Ensure `trailingSlash: true` in next.config.mjs
- **Images not loading**: `images.unoptimized: true` is set
- **Domain not working**: Check DNS with `dig canman.eu` or `nslookup canman.eu`