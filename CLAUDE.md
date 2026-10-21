# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev       # Vite dev server on port 3000 (next free port if taken)
yarn build     # vue-tsc -b type-check, then vite build -> dist/
yarn preview   # serve the production build
docker build -t job-aggregator . && docker run --rm -p 8080:80 job-aggregator   # nginx SPA image
```

- There are no test, lint, or format scripts. ESLint and Prettier are installed and the VS Code settings enable them, but the repo has no ESLint or Prettier config file. `yarn build` is the only automated check, and it is what catches type errors.
- Both `yarn.lock` and `package-lock.json` are committed. The README says to use Yarn, but the Dockerfile runs `npm install`, so keep both lockfiles in sync when you change dependencies.

## Architecture

Vue 3 + TypeScript SPA (Vite, vue-router, `@unhead/vue`, SCSS). The `@` alias maps to `src/` and `@globalStyle` maps to `src/assets/style/`.

**Bootstrap:** `main.ts` → `entry.ts` → `plugins/index.ts` `setupPlugins()`. This installs the vault plugin, the router, and the unhead client, in that order. Register new app-wide plugins in `setupPlugins`.

**Pages are chosen by state, not by routes.** The router has one catch-all route (`/:pathMatch(.*)*`) that renders `views/PageView.vue`. `PageView` renders the header, then `<component :is>` picked from a local `Pages` map of async components, then the footer. The page key comes from `usePages().pageRef`, whose values are the `PageAliases` enum in `utils/pages.ts`. To add a page:

1. Add an alias to `PageAliases`.
2. Add a matching key to the `Pages` map in `PageView.vue`. The key must equal the enum _value_, e.g. `homePage`.
3. Switch to it with `usePages().setPage(...)`.

The URL never changes. `HomePage.vue` wraps itself in `layouts/DefaultLayout.vue`, which now only renders a `<main>` (its `AppHeader`/`AppFooter` imports are unused), so the header and footer come from `PageView` alone.

**Component conventions.** The full playbook, with examples, is in the `vue-frontend-patterns` skill (`.claude/skills/vue-frontend-patterns/SKILL.md`). Keep pages thin. A page only wires composable state into section components; it holds no large inline markup.

- Every distinct section or block goes in its own `.vue` file so that a change to it shows up everywhere it is reused. `HomePage.vue` follows this pattern.
- Page-level sections go in `components/sections/`, e.g. `HeroSection` (collector preferences), `JobFiltersSection`, `JobsSection`.
- Smaller reusable pieces go in `components/content/`, e.g. `JobCard`, `JobFilterForm`, `CollectorPreferencesForm`, `JobsPager`, `JobsEmptyState`, `JobsErrorState`.
- Shared building blocks go in `components/ui/`, e.g. `BrandLogo`; `AppButton`, the only button component (`variant` `primary` | `secondary` | `text`, `icon` for a square glyph button, renders an `<a>` when given `href`, otherwise a `<button>`, other attributes fall through; every variant has the same height, padding and radius and no margins, so parents space buttons with `gap`); `Chip` (small label, `tone` `neutral` | `accent` | `success` | `warning`; job tags, status, work mode, result count); `SectionHeading` (h2 + optional description, `#title` slot, default slot for an aside such as a `Chip`); `StateMessage` (centered icon + title + message + `#action` slot, `tone` `accent` | `danger`; `JobsEmptyState` and `JobsErrorState` wrap it); `Spinner` (sized `1em`, so it matches the text next to it); `FormField` (label + slotted input + optional hint) and `ListField` (comma-separated list input built on `FormField`, no hint). Every form input goes through `FormField`/`ListField`; don't hand-roll label/input markup.
- Components receive data through props or `defineModel` and report back through emits. They don't call page composables themselves.
- Each component owns its styles in `<style lang="scss" scoped>`, including its media queries (the component breakpoint is `max-width: 680px`; `_theme.scss` and `global.scss` use 1024px).
  - Component style blocks don't import any partials. They only use the CSS custom properties from `_theme.scss`, which are global at runtime. Only add `@use '@globalStyle/variables' as *;` if a block genuinely needs a `$` SCSS variable, such as `$breakpoints` in a media query. Never `@use` `mixins` in components: `_mixins.scss` emits the `.col--N`/`.row--N` grid classes at top level, so every import duplicates them.
  - Colors come from the CSS custom properties in `_theme.scss` (`var(--text)`, `--text-muted`, `--background`, `--surface`, `--border`, `--color-accent-1`/`-2`, `--color-secondary`, `--font-family-primary`, `--header-height`, …). The theme is dark.
  - Every size, space, radius, weight, color, shadow and duration comes from a token. Never write a raw number in a component. Tokens are defined as SCSS values in `_variables.scss` and exposed as CSS custom properties in `_theme.scss`, which is what components use: spacing `--space-1`…`--space-8` (4/8/12/16/24/32/48/64px); layout `--page-width` (section content column), `--page-gutter`, `--section-spacing` (vertical padding of a section) and `--panel-padding` (inside cards and panels), all three shrinking below 1024px; shape `--border-width`, `--radius-sm`/`-md`/`-lg`/`-round`, `--shadow-panel`, `--shadow-raised`, `--hover-lift`; controls `--control-height` and `--control-padding-x` (shared by every button and input); icons `--icon-size-sm`/`-md`/`-lg`; type `--font-weight-regular`/`-medium`/`-semibold`/`-bold`/`-black` and `--line-height-relaxed`; color `--color-success`/`-warning`/`-danger`, plus `--color-accent-1-tint` etc. (15% background tints; use `color-mix(in srgb, currentColor var(--tint-strength), transparent)` for a local hue), `--gradient-accent`, `--gradient-accent-subtle`; effects `--opacity-disabled`, `--transition-fast`, `--duration-enter`, `--duration-spin`; sizes `--state-min-height`, `--measure-narrow`. If a value isn't on the scale, use the nearest token. If a genuinely new value is needed in more than one component, add it to `_variables.scss` and `_theme.scss` first. The only literals left in components are structural (`0`, `1`, `100%`, `1em`, grid line numbers, `minmax(0, 1fr)`), the 680px media query (CSS variables don't work in media queries), and JobCard's three local company-mark hues.
  - Components never set `font-size` or `letter-spacing`. Typography comes from the tag: use `h1`/`h2` for titles, including card and empty/error-state titles (sized in `global.scss`; `h3` has no theme size, so don't use it), and `p` for standalone text. Inline `span`s inherit the root size from `_theme.scss`. Labels and hints inside a `<label>` stay `span` because `p` isn't valid there. The one exception is `AppButton`'s `font-size: inherit`, which makes its `<a>` and `<button>` forms match the page size (browsers shrink buttons to ~13px).
  - Lay out multi-field blocks with the theme grid: a `.grid` container (12 columns, 15px gap) plus `col--N` and responsive `col__{xs|sm|md|lg}--N` classes on the children. The responsive classes apply from 481/769/961/1281px up (mobile-first), so they usually replace media queries. `.grid` carries a `20px 0` margin; zero it in a scoped rule when the parent already has padding. `JobFilterForm` is the reference.
  - Use flex only for a single row that needs alignment, such as right-aligned buttons (`.filter-panel__actions`) or an icon next to text. Stack things vertically with `display: grid` and `gap`, not `flex-direction: column` (see `FormField`).
  - `global.scss` holds base element styles, `.grid` and `.button`. There is no global box-sizing reset, `.sr-only`, focus ring or reduced-motion override.
  - There is no global keyframes file. A component that animates declares its own `@keyframes` in its scoped block (e.g. `rise-in` in `JobCard`/`HeroSection`, `spin` in `Spinner`).
  - A style that more than one component needs becomes its own component, not a global class.

**State: the vault (`plugins/vault.ts`).** This replaces Pinia/Vuex. The plugin `provide`s one plain, non-reactive object per app. `initVault<T>(namespace)` returns `get` and `storeAndGet` for that namespace. Use it for composables that hold shared singleton state, following the pattern in `composables/usePages.ts`:

1. Call `get` first.
2. If it returns nothing, create the refs and functions and return `storeAndGet(...)`.

Only stored `ref`/`reactive` values are reactive, and `initVault` uses `inject`, so it only works inside `setup` or another injection context. `PublicMembers<T>` does not actually filter any keys.

**Job search data.** Listings come from the Jobs Listing API (a separate Go service, `go run ./cmd/jobs-api`), which serves an exported `jobs.json` at `VITE_API_URL` (`.env`, default `http://localhost:8000`). Its spec is at `/openapi.json` and Swagger UI at `/docs`.

- `GET /api/jobs` accepts only `limit` (1–500, server default 100), `offset`, `status`, `source`, `company`, `location`, `work_mode` and `q`, and silently ignores anything else. Every filter except `q` is a case-insensitive exact match. Invalid pagination returns 400. The response is `{ total, limit, offset, jobs }`.
- `composables/useJobFilters.ts` filters the collector's latest export through `getJobs`. It holds the query as `filters` (the live form model; the form has one field per parameter) and only calls the API when `applyFilters()` runs, so results change on submit, not as the user types. It also exposes `page`, `loading`, `error`, `goToOffset()` and `clearFilters()`, runs the first request on creation, and discards responses from superseded requests.
- `composables/useCollectorConfig.ts` loads `GET /api/config` and exposes its `preferences` as the hero form model. `save()` sends the whole config back through `updateConfig` (PUT replaces the file) with only `preferences` changed. New preferences only affect results after the next collector run.
- `page` is a `shallowRef`: `ref()` strips the model classes' private fields from the type.
- The composable does _not_ use the vault, so its state is per component instance.
- `models/job.ts` and `models/jobs.ts` are the old sample data and are unused.

**API layer (`src/api/api.ts`).** A small `fetch` wrapper. `request()` prefixes the path with `VITE_API_URL` (via `utils/utils.ts` `getEnvVariable`; `vite.config.ts` loads `VITE_*` vars) and throws an `Error` on non-2xx. The default export holds the services; `jobService.getJobs(query: JobListingQueryModel)` returns a `JobPageModel`. Components reach the API only through composables.

**Models and types.**

- `types/models/jobListings.d.ts` holds every raw API type (`JobListing`, `JobPage`, `JobListingQuery`, …) in one file. Keep it as one file.
- `models/JobService/` holds one read-only class per file (`JobPageModel`, `JobListingModel`, `JobListingAssessmentModel`, `JobListingSourceModel`, `JobListingQueryModel`). Each wraps the raw payload in a `private readonly data` field and exposes it through `getX()` methods (not `get x()` accessors, no setters), with camelCase names, `Date` for timestamps and `readonly` arrays. Nested objects are wrapped in the constructor.
- `JobListingModel.getId()` (`source:source_id`) is unique and is the list key. `JobListingQueryModel.getQueryString()` builds the query string, skipping empty values.
- Descriptions are raw HTML from job boards; `JobCard` shows them as shortened plain text. Don't render them with `v-html`.
- `JobCard` links to the posting twice, through the title and a "View listing" `AppButton`, both opening in a new tab.

**Responsive helpers.** `plugins/breakpoint.ts` exports module-level computed flags (`isMobile`, `isTablet`, `isSmallDevice`, …) driven by one shared `resize` listener. Import them directly; they are not installed as a Vue plugin.

**Styling.**

- Global SCSS (`_variables`, `_theme`, `_mixins`) is imported once through `assets/style/global.scss` in `main.ts`.
- `scss.preprocessorOptions` is empty, so component `<style lang="scss">` blocks must import partials explicitly through `@globalStyle`.
- `src/vite/devSingleCss.ts` is a dev-only Vite plugin (`apply: "serve"`). It collects every transformed `.scss` source, compiles them together with sass, and serves the result as `/@dev-bundled-styles.css`, which it injects into `index.html`.
- Production builds use `cssCodeSplit: false`, so there is a single CSS file.

**Deployment.** Multi-stage Dockerfile: a Node 20 build stage, then nginx. `nginx.conf` falls back to `index.html` for every path. `.env` is committed and copied into the build, so `VITE_API_URL` is baked into the bundle at build time; nginx does not proxy `/api`.
