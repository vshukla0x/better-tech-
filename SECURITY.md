# Security notes

## No client-side secrets

Better Tech is a static, browser-only app. It needs no API keys, passwords, database credentials, or server secrets. All assets and fonts are served locally. Quiz answers stay in this browser's local storage, which is **not encrypted secret storage**; do not enter passwords, serial numbers, or other sensitive information.

`.env` and its local variants are ignored. `.env.example` is a safe, tracked template with no values. **A variable prefixed `VITE_` is public and can appear in the built JavaScript.** A `.env` file does not make frontend secrets private. Any future secret-bearing integration must run in a separate backend or serverless function.

If a real credential is ever committed, revoke/rotate it first. Ignoring or deleting the file does not remove a secret from Git history. Do not rewrite shared history without coordinating with repository owners.

## Deployment protections

- `vercel.json` configures response headers on Vercel.
- `public/_headers` configures the same headers on Netlify or Cloudflare Pages.
- Other hosts (including GitHub Pages) may ignore these files. Configure equivalent HTTP response headers at that host or reverse proxy and verify the live responses. The files alone do not protect every deployment.
- The Content Security Policy permits local scripts/assets only, blocks application network API requests, embedding, plugins, and form submissions. Inline **style attributes only** are allowed for the quiz progress indicator; inline scripts are not allowed.
- HTTPS deployments use HSTS, no-referrer, nosniff, framing restrictions, restricted browser permissions, and cross-origin opener isolation.
- Vite development/preview defaults bind to localhost, not the local network. Never use the development server as a public production server. Publish only `dist/`, never the project root or `.env`.
- Production source maps are disabled. This is exposure reduction, not a mechanism for hiding browser code or secrets.

## Checks before pushing

```sh
npm audit
npm run lint
npm run build
npm test
git add <reviewed-files>
npm run check:secrets
git diff --cached --stat
```

The secret check scans indexed files for sensitive filenames, common credential patterns, and private machine paths without printing matched secret values. It is a lightweight guardrail, not a complete security audit or a substitute for a maintained secret-scanning service. It does not inspect binary content or old Git history. There is no claim that any application can be made vulnerability-free.

Please do not put credentials or personal information in public issues. For a suspected leak, rotate affected credentials immediately and contact the repository owner privately before posting details.
