# The Humor Model Project

A prompt and pipeline testing environment for building humor flavors — the project's own take on
matrix.almostcrackd.ai.

A **humor flavor** is an ordered chain of prompt steps that turns an image into captions. A typical
chain looks like: *describe the image → find something funny about that description → write five
short captions.* Each step carries its own system prompt, user prompt, model, temperature, and
input/output types.

This app is where those chains get built and iterated on. Write the steps, run a real generation
against an image, read what came back, adjust a constraint, run it again. The whole design goal is to
make that loop short.

---

## Features

### Flavor archive (`/`)
- **Search** across flavor slugs and descriptions.
- **Sort** by most recent, oldest, A–Z, Z–A, most steps, or most captions generated.
- **Filter** by active / inactive. A flavor with zero steps is treated as inactive automatically,
  since there is no chain to run.
- **Create** a new flavor from a slug and a description of the comedic style.
- **Duplicate** any flavor — copies it and all of its steps into `<slug>-copy`, which is the fastest
  way to fork a working chain and change one thing.
- **Delete** with a confirmation step.
- A sidebar with live counts of flavors, steps, and captions generated project-wide.

### Flavor detail (`/flavors/[id]`)
- Edit the flavor's slug and description inline.
- The full prompt chain rendered in execution order, each step showing its model, step type, and
  temperature at a glance.
- **Add / edit / delete** steps. Each step exposes: description, LLM model, step type, input type,
  output type, system prompt, user prompt, and temperature.
- **Reorder** steps with up/down controls — the swap is applied optimistically in the UI and
  persisted immediately.

### Test runs
Two ways in, both hitting the real pipeline at `api.almostcrackd.ai`:

- **Test Flavor** — from a flavor's detail page, runs against that flavor.
- **Test Image Pipeline** — from the dashboard sidebar, pick any registered flavor first.

Attach an image, hit execute, and four step indicators light up as the run progresses: presign →
upload → register → generate. Captions land in a Results Output panel. The flavor id is passed
through to the caption call, so you are always testing the chain you just edited.

---

## Design

The interface is deliberately vintage — washed creams, blues, greens, yellows and pinks, plaid
panels, and a Courier Prime typewriter face throughout. The palette lives in `tailwind.config.ts`
under the `vintage` color scale; keep new UI consistent with it.

---

## Tech stack

| | |
| --- | --- |
| Framework | Next.js (App Router) |
| UI | React 19, Tailwind CSS v4, lucide-react, clsx, tailwind-merge |
| Language | TypeScript |
| Data & auth | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| Generation | Crackd REST API (`api.almostcrackd.ai`) |
| Hosting | Vercel |

---

## Getting started

Requires Node 20+ and access to the shared Supabase project.

```bash
npm install
npm run dev          # http://localhost:3000
```

### Environment variables

Create `.env.local` in the project root. Env files are gitignored and are never committed.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon / publishable key |
| `NEXT_PUBLIC_SUPABASE_PROJECT_ID` | Project reference id, client side |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client id (no client secret needed) |
| `SUPABASE_PROJECT_ID` | Project reference id, server side |
| `SUPABASE_ANON_KEY` | Server-side copy of the anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never expose to the browser |

OAuth redirects must match `https://*.vercel.app/auth/callback`. Register the local callback too so
sign-in works in development.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server against the real Supabase project |
| `npm run dev:mock` | Dev server with in-memory fixtures on port 3002 — see [DEMO.md](./DEMO.md) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint |

---

## Demo mode

`npm run dev:mock` runs the app on in-memory fixtures — 8 flavors, 19 steps, a faked Google sign-in,
and an intercepted pipeline that returns captions matching whichever flavor you test. Create, edit,
duplicate, delete and reorder all work for the length of the session; state resets on a hard refresh.
No component code changes, so what you see is the real UI. Details in [DEMO.md](./DEMO.md).

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  flavor archive + project stats + general test
│   ├── flavors/[id]/page.tsx     flavor detail, step chain, per-flavor test
│   ├── login/page.tsx            Google sign-in
│   └── auth/callback/route.ts    OAuth code → session exchange
├── components/
│   ├── HumorFlavorList.tsx       search, sort, filter, grid
│   ├── HumorFlavorCard.tsx       archive card with active toggle
│   ├── CreateFlavorModal.tsx     new flavor
│   ├── DuplicateFlavorModal.tsx  copy a flavor and its steps
│   ├── HumorFlavorStepList.tsx   step chain, reordering, deletion
│   ├── HumorFlavorStepCard.tsx   single step, model/type/temperature badges
│   ├── HumorFlavorStepModal.tsx  step create/edit form
│   ├── TestFlavorModal.tsx       run the pipeline for one flavor
│   ├── GeneralTestModal.tsx      pick any flavor, then run
│   ├── ProjectStats.tsx          flavor / step / caption counts
│   └── ConfirmationModal.tsx     shared destructive-action guard
├── types/database.ts             flavor, step, model, and type definitions
├── utils/supabase/               browser, server, and middleware clients
├── mock/                         demo-mode fixtures and stand-in client
└── middleware.ts                 route protection
schema.sql                        reference copy of the shared database schema
```

---

## Data model

Flavors and steps live in the shared Supabase project. **No new tables were added** — the app works
entirely within the existing schema, and RLS policies are left untouched.

| Table | Used for |
| --- | --- |
| `humor_flavors` | Create, read, update, delete flavors |
| `humor_flavor_steps` | The prompt chain — create, edit, delete, and reorder via `order_by` |
| `humor_flavor_step_types` | Step type options |
| `llm_models` | Model options, including whether temperature is supported |
| `llm_input_types` / `llm_output_types` | Input and output type options per step |
| `captions` | Read-only — per-flavor caption counts and project stats |

---

## Caption pipeline

Test runs call `https://api.almostcrackd.ai` with the signed-in user's Supabase access token as a
bearer token:

1. `POST /pipeline/generate-presigned-url` — returns a `presignedUrl` and a public `cdnUrl`.
2. `PUT <presignedUrl>` — uploads the raw image bytes directly to storage.
3. `POST /pipeline/upload-image-from-url` — registers the `cdnUrl` and returns an `imageId`.
4. `POST /pipeline/generate-captions` — sends `imageId` plus `humorFlavorId` and returns the captions.

Supported image types: JPEG, PNG, WebP, GIF, HEIC.

See [AGENTS.md](./AGENTS.md) for the full API reference and the project's design constraints.

---

## Deployment

Deployed on Vercel. Set every variable from the table above in the project settings, keep
`SUPABASE_SERVICE_ROLE_KEY` server-side only, and register the deployed `/auth/callback` URL in
Supabase Auth.
