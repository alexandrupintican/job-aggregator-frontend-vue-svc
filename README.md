# Job Aggregator

A responsive job-search frontend built with **Vue 3**, **TypeScript**, **Vite**, and **SCSS**. It reads live listings from the Jobs Listing API (`GET /api/jobs`) and lets you build the request yourself: every query parameter the endpoint supports has its own field. It also edits the collector's search preferences.

## Features

- ⚡ Vue 3 Composition API and Vite
- 🟦 TypeScript support
- 🔌 Live listings from the Jobs Listing API
- 🔎 Search form that maps 1:1 to the endpoint's query parameters
- 🛠️ Collector preferences form that saves to the API and can trigger a collector run
- 📄 Server-side pagination with Previous / Next controls
- ⏳ Loading, empty, and error states with retry
- 🎨 Dark theme driven by CSS custom properties, with component-scoped styles
- 📱 Responsive layout on a 12-column grid
- 🐳 Docker support for containerized deployment

---

## Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| Vue 3 | Frontend framework |
| TypeScript | Static typing |
| Vite | Build tool and development server |
| Vue Router | Single catch-all route; pages are switched by state |
| @unhead/vue | Per-page `<head>` tags (title, description, Open Graph) |
| SCSS | Styling |
| Docker and Nginx | Containerized production deployment |

---

## Project Structure

```text
.
├── public/
│   └── favicon.svg
├── src/
│   ├── api/              # API service (api.ts): fetch wrapper + jobService
│   ├── assets/
│   │   └── style/        # _variables, _theme (CSS custom properties), _mixins (grid columns), global.scss
│   ├── components/
│   │   ├── content/      # ContentHomepage, JobCard, JobFilterForm, CollectorPreferencesForm, JobsPager, states
│   │   ├── footer/
│   │   ├── header/
│   │   ├── sections/     # HeroSection, JobFiltersSection, JobsSection
│   │   └── ui/           # BrandLogo, AppButton, Chip, SectionHeading, StateMessage, Spinner, FormField, ListField
│   ├── composables/      # useJobFilters, useCollectorConfig, usePages, useLayout
│   ├── layouts/          # DefaultLayout: header, <main>, footer
│   ├── models/
│   │   └── JobService/   # Read-only model classes wrapping API responses
│   ├── pages/            # HomePage: head meta + ContentHomepage
│   ├── plugins/          # vault, breakpoint
│   ├── router/
│   ├── types/
│   │   └── models/       # jobListings.d.ts: raw API response and query types
│   ├── utils/            # enums.ts (PageAliases, LayoutAliases), utils.ts
│   ├── views/            # PageView: picks the page from state
│   ├── App.vue           # Picks the layout from state, renders RouterView inside it
│   ├── AppRender.vue     # Root component: App inside <Suspense>
│   ├── entry.ts          # Creates the app and mounts it once the router is ready
│   └── main.ts           # createCustomApp(): global styles, unhead, vault, router
├── docs/                 # Local notes (gitignored, excluded from the Docker build)
├── .env                  # VITE_API_URL for local development (gitignored)
├── compose.yaml          # Runs the frontend container
├── Dockerfile
├── nginx.conf
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 24+ (the version the Docker build uses)
- Yarn for local development. npm is used for production builds (the Dockerfile runs `npm ci`), so both `yarn.lock` and `package-lock.json` are committed; update both when you change dependencies.
- The Jobs Listing API running locally. From the API repository, `go run ./cmd/jobs-api` serves `output/jobs.json` at `http://127.0.0.1:8000`, with Swagger UI at `/docs` and the spec at `/openapi.json`.

### Installation

```bash
git clone https://github.com/alexandrupintican/job-aggregator-frontend-vue-svc.git
cd job-aggregator-frontend-vue-svc
yarn install
```

### Configuration

For local development, the API base URL is read from `VITE_API_URL` in a local `.env` file (it is gitignored, so create it yourself):

```env
VITE_API_URL=http://localhost:8000
```

The frontend calls the API directly from the browser, so the API must allow cross-origin requests (it currently sends `Access-Control-Allow-Origin: *`).

### Development

```bash
yarn dev
```

The dev server runs on `http://localhost:3000`. If that port is taken, Vite picks the next free one and prints it.

### Production Build

```bash
yarn build
yarn preview
```

`yarn build` type-checks with `vue-tsc` and then bundles. It is the only automated check; there are no test or lint scripts.

---

## Docker

The image contains the frontend only: Node builds the app, then nginx serves the static files. The Jobs Listing API is a separate service that you run and deploy on its own.

`VITE_API_URL` is baked into the bundle at build time, and `.env` is not copied into the image, so the URL is passed as a build argument. The build fails if it is missing.

With Compose (reads `VITE_API_URL` from your shell, falling back to the local `.env`):

```bash
docker compose up --build
VITE_API_URL=https://api.example.com docker compose up --build   # production URL
```

With plain Docker:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t job-aggregator .
docker run --rm -p 8080:80 job-aggregator
```

Then open `http://localhost:8080`. The URL is resolved in the visitor's browser, so it must be the API's public address. Changing it means rebuilding the image.

---

## Using the search

The search form exposes every query parameter of `GET /api/jobs`. Each field maps to one parameter:

| Field | Parameter | Behaviour |
| ----- | --------- | --------- |
| Search | `q` | Searches title, company, description, and location |
| Location | `location` | Case-insensitive exact match |
| Company | `company` | Case-insensitive exact match |
| Source | `source` | Case-insensitive exact match, e.g. `ashby:n8n` |
| Status | `status` | Case-insensitive exact match, e.g. `match` or `review` |
| Work mode | `work_mode` | Case-insensitive exact match, e.g. `remote` |
| Limit | `limit` | Page size, 1–500 (the form starts at 20) |
| Offset | `offset` | Number of listings to skip |

- A request is only sent when you press **Apply filters**, not while you type. Empty fields are left out of the query.
- **Previous / Next** change `offset` by `limit` and re-run the search. **Apply filters** sends the current `offset` as-is; it does not reset it to 0.
- **Reset** restores the defaults and reloads the first page.
- Each job card links to the original posting through its title and its **View listing** button, both opening in a new tab. Descriptions are shown as shortened plain text.

---

## Architecture

- **Bootstrap**: `index.html` loads `entry.ts`, which calls `createCustomApp()` from `main.ts` and mounts the app once the router is ready.
- **Layouts** wrap every page. `App.vue` picks the layout from state (`useLayout`) and renders the router view inside it. `DefaultLayout` provides the header, `<main>` and footer.
- **Pages** set their own `<head>` tags with `useHead()` and render one content component (`HomePage` → `ContentHomepage`), which composes the section components. The router has a single catch-all route; `views/PageView.vue` picks the page from state (`usePages`), so the URL never changes.
- **Components** are split into `sections/` (page-level blocks), `content/` (reusable blocks), and `ui/` (small shared primitives). Each owns its scoped styles. Colors, spacing, radii, weights, shadows and durations all come from design tokens in `assets/style/_variables.scss`, exposed as CSS custom properties in `_theme.scss` (no raw numbers in components), text size comes from the HTML tag (`h1`/`h2`/`p`) rather than per-component `font-size`, and layouts use the global 12-column `.grid` with `col--N` / `col__{xs,sm,md,lg}--N` classes.
- **Composables** hold the logic. `useJobFilters` keeps the filters bound to the form, calls the API when they are applied, and exposes the current page, loading, and error state. `useCollectorConfig` loads and saves the collector preferences.
- **API** (`src/api/api.ts`) wraps `fetch`, prefixes requests with `VITE_API_URL`, and exposes `jobService.getJobs(query)`.
- **Models** (`src/models/JobService/`) are read-only classes around API responses (`JobPageModel`, `JobListingModel`, …) with `getX()` methods. `JobListingQueryModel` builds the query string.
- **Types** (`src/types/models/jobListings.d.ts`) describe the raw API payloads.
- **Plugins** hold app-wide functionality: the `vault` used for shared state (installed in `createCustomApp()`) and the `breakpoint` flags.

---

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `yarn dev` | Start the development server |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build |
