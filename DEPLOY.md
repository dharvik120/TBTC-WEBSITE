Vercel Deployment
-----------------

1. Connect this repository to Vercel (https://vercel.com). Select the Git provider and repo.

2. Build settings (Vercel usually detects Next.js):
   - Build command: `npm run vercel-build`
   - Output directory: (leave empty)

3. Environment variables:
   - Add `DATABASE_URL` (for Prisma) and any other secrets used by the app.
   - If using Prisma, set `POSTINSTALL` or ensure `prisma generate` runs during build.

4. Deploy:
   - Push to the branch connected to Vercel (e.g., `main`) and Vercel will build and publish.
   - Or use the Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel --prod
```

Notes:
- The project already includes a minimal `vercel.json` and a `vercel-build` script.
- If your app requires additional runtime files (uploads, etc.), configure those in Vercel storage or an external bucket.
