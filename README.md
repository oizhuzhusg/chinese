# Chinese Reading Coach

Clean reading tool for a 10-year-old learner starting around Singapore Primary 4 Higher Chinese.

The MVP separates real student progress from tester experiments, lets the learner tap unknown characters or select words in an article, collects vocabulary for review, and adjusts the next reading level from marked words plus reading-comprehension performance.

## Local Run

Static-only demo:

```bash
cd /Users/zhuk/Documents/Codex/chinese-reading-coach/public
python3 -m http.server 8791
```

Open `http://localhost:8791`.

Worker/API mode:

```bash
cd /Users/zhuk/Documents/Codex/chinese-reading-coach
npm install
npm run dev
```

Open `http://localhost:8790`.

No-dependency local API mode, useful in this Codex desktop workspace:

```bash
cd /Users/zhuk/Documents/Codex/chinese-reading-coach
/Users/zhuk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/dev-server.mjs 8793
```

Open `http://localhost:8793`.

Without `OPENAI_API_KEY`, API routes return deterministic demo content so the full learning loop can still be tested.

## Deployment

See [docs/deployment.md](docs/deployment.md) for the full flow:

```text
local development -> git push -> Cloudflare Workers Builds -> staging/production Worker
```

## Roles

- `student`: real learner progress. Level changes and review status are meaningful.
- `tester`: sandbox for parent/tester checks. Data is separate and will not pollute the student profile.

## API

```text
GET  /api/health
POST /api/article/generate
POST /api/vocab/explain
POST /api/level/analyze
```

## Data

`migrations/0001_init.sql` defines the first D1 schema for users, profiles, generated articles, reading sessions, unknown marks, vocabulary, comprehension attempts, and level snapshots.

## Next Steps

- Bind Cloudflare D1 as `DB`.
- Add sync/login endpoints once the local profile UX is settled.
- Add audio playback for pinyin and spoken examples.
- Add parent dashboard views across multiple student profiles.
