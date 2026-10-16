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
│   │   ├── content/      # JobCard, JobFilterForm, CollectorPreferencesForm, JobsPager, states
│   │   ├── footer/
│   │   ├── header/
│   │   ├── sections/     # HeroSection, JobFiltersSection, JobsSection
│   │   └── ui/           # BrandLogo, PrimaryButton, TextButton, Spinner, FormField, ListField
│   ├── composables/      # useJobFilters, useCollectorConfig, usePages
│   ├── layouts/
│   ├── models/
│   │   └── JobService/   # Read-only model classes wrapping API responses
│   ├── pages/
│   ├── plugins/
│   ├── router/
│   ├── types/
│   │   └── models/       # jobListings.d.ts: raw API response and query types
│   ├── utils/
│   ├── views/
│   ├── App.vue
│   ├── entry.ts
│   └── main.ts
├── .env                  # VITE_API_URL
├── Dockerfile
├── nginx.conf
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn (recommended), or npm
- The Jobs Listing API running locally. From the API repository, `go run ./cmd/jobs-api` serves `output/jobs.json` at `http://127.0.0.1:8000`, with Swagger UI at `/docs` and the spec at `/openapi.json`.

### Installation

```bash
git clone https://github.com/alexandrupintican/job-aggregator-frontend-vue-svc.git
cd job-aggregator-frontend-vue-svc
yarn install
```

### Configuration

The API base URL is read from `VITE_API_URL` in `.env`:

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

Build and run the production container:

```bash
docker build -t job-aggregator .
docker run --rm -p 8080:80 job-aggregator
```

Then open `http://localhost:8080`.

`VITE_API_URL` is baked in at build time from `.env`, so the image calls whatever URL that file holds (by default `http://localhost:8000`, resolved in the visitor's browser). Change `.env` before building to point the image at a different API.

---

## Using the search

The search form exposes every query parameter of `GET /api/jobs`. Each field is labelled with its parameter name:

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

- **Pages** are thin compositions of section components. The router has a single catch-all route; `views/PageView.vue` picks the page from state (`usePages`), so the URL never changes.
- **Components** are split into `sections/` (page-level blocks), `content/` (reusable blocks), and `ui/` (small shared primitives). Each owns its scoped styles. Colors come from the CSS custom properties in `assets/style/_theme.scss`, text size comes from the HTML tag (`h1`/`h2`/`p`) rather than per-component `font-size`, and layouts use the global 12-column `.grid` with `col--N` / `col__{xs,sm,md,lg}--N` classes.
- **Composables** hold the logic. `useJobFilters` keeps the filters bound to the form, calls the API when they are applied, and exposes the current page, loading, and error state. `useCollectorConfig` loads and saves the collector preferences.
- **API** (`src/api/api.ts`) wraps `fetch`, prefixes requests with `VITE_API_URL`, and exposes `jobService.getJobs(query)`.
- **Models** (`src/models/JobService/`) are read-only classes around API responses (`JobPageModel`, `JobListingModel`, …) with `getX()` methods. `JobListingQueryModel` builds the query string.
- **Types** (`src/types/models/jobListings.d.ts`) describe the raw API payloads.
- **Plugins** register app-wide functionality, including the `vault` used for shared state.

---

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `yarn dev` | Start the development server |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build |
