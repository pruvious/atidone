# Atidone + Pruvious v4

A Nuxt + Pruvious demo hosted on Cloudflare Workers with Cloudflare D1 database.

Based on: https://github.com/atinux/atidone

## Deployment Guide

### Prerequisites

1. A Cloudflare account with Workers enabled
2. Access to Cloudflare dashboard

### Steps

1. **Set Up Databases**

   - Create two D1 databases in your Cloudflare dashboard:
     - `pruvious_atidone`
     - `pruvious_atidone_logs`

2. **Configure wrangler.toml**

   - Copy the `wrangler.toml.example` file to `wrangler.toml`
   - Update the database IDs in `wrangler.toml` with your Cloudflare D1 database IDs

3. **Create Storage**

   - Create an R2 bucket named `pruvious-atidone`
   - Note: This is required by Pruvious even if you don't need file uploads

4. **Build & Deploy**

   ```bash
   pnpm build
   npx wrangler deploy
   ```
