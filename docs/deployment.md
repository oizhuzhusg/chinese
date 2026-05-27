# Deployment Flow

This project follows the same deployment shape as `chem-coach`:

```text
local development -> git push -> Cloudflare Workers Builds -> staging/production Worker
```

## 1. Local

In this Codex desktop workspace, use the bundled Node runtime:

```bash
cd /Users/zhuk/Documents/Codex/chinese-reading-coach
cp .dev.vars.example .dev.vars
/Users/zhuk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/dev-server.mjs 8794
```

Open:

```text
http://localhost:8794
```

If using a normal Node/npm environment:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:8790
```

`OPENAI_API_KEY` stays server-side. The frontend calls Worker API routes and never sees the key.

## 2. Git

Recommended branch flow:

```text
develop -> chinese-reading-coach-staging
main    -> chinese-reading-coach
```

Initialize locally:

```bash
git init
git add .
git commit -m "Initial Chinese Reading Coach MVP"
git branch -M main
git checkout -b develop
```

Add GitHub remote after creating the repository:

```bash
git remote add origin git@github.com:<your-org-or-user>/chinese-reading-coach.git
git push -u origin main
git push -u origin develop
```

## 3. Cloudflare Workers

Deploy once before connecting Git-backed builds:

```bash
npm run deploy:staging
npm run deploy:production
```

This creates or updates:

```text
chinese-reading-coach-staging
chinese-reading-coach
```

## 4. Secrets

Set `OPENAI_API_KEY` on both environments:

```bash
npx wrangler secret put OPENAI_API_KEY --env staging
npx wrangler secret put OPENAI_API_KEY --env production
```

Optional model overrides are regular vars in `wrangler.jsonc`:

```text
OPENAI_MODEL
OPENAI_GENERATION_MODEL
OPENAI_EXPLAIN_MODEL
```

## 5. Cloudflare Workers Builds

Create two Workers Builds connections:

```text
chinese-reading-coach          listens to main
chinese-reading-coach-staging  listens to develop
```

Production build settings:

```text
Repository: <your GitHub repository>
Branch: main
Root directory: /
Build command: npm run check
Deploy command: npm run deploy:production
```

Staging build settings:

```text
Repository: <your GitHub repository>
Branch: develop
Root directory: /
Build command: npm run check
Deploy command: npm run deploy:staging
```

Dashboard path:

```text
Cloudflare Dashboard
-> Workers & Pages
-> chinese-reading-coach
-> Settings
-> Builds
-> Connect
-> GitHub
```

Repeat for `chinese-reading-coach-staging`.

## 6. D1 Persistence

The current MVP stores learner data in browser `localStorage`. D1 schema is already prepared in:

```text
migrations/0001_init.sql
```

When ready:

```bash
npx wrangler d1 create chinese-reading-coach-db
```

Then add the D1 binding to `wrangler.jsonc` and run:

```bash
npx wrangler d1 migrations apply chinese-reading-coach-db --local
npx wrangler d1 migrations apply chinese-reading-coach-db --remote --env staging
npx wrangler d1 migrations apply chinese-reading-coach-db --remote --env production
```
