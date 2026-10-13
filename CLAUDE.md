# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev       # Vite dev server on 0.0.0.0:3000 (vite.config.ts sets port 3000; the README's 5173 is outdated)
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
2. Add a matching key to the `Pages` map in `PageView.vue`. The key must equal the enum *value*, e.g. `homePage`.
3. Switch to it with `usePages().setPage(...)`.

The URL never changes. Note that `HomePage.vue` also wraps itself in `layouts/DefaultLayout.vue`, which renders `AppHeader`/`AppFooter` too, so the header and footer currently render twice.

**Component conventions.** The full playbook, with examples, is in the `vue-frontend-patterns` skill (`.claude/skills/vue-frontend-patterns/SKILL.md`). Keep pages thin. A page only wires composable state into section components; it holds no large inline markup.
- Every distinct section or block goes in its own `.vue` file so that a change to it shows up everywhere it is reused. `HomePage.vue` follows this pattern.
- Page-level sections go in `components/sections/`, e.g. `HeroSection`, `JobsSection`, `ClosingSection`.
- Smaller reusable pieces go in `components/content/`, e.g. `JobCard`, `JobSearchForm`, `JobsEmptyState`.
- Shared building blocks go in `components/ui/`, e.g. `BrandLogo`, `SectionEyebrow`.
- Components receive data through props or `defineModel` and report back through emits. They don't call page composables themselves.
- Each component owns its styles in `<style lang="scss" scoped>`, including its media queries (breakpoints are 1400/900/680px).
  - Each component starts its style block with `@use '@globalStyle/variables' as *;`, plus `mixins` when needed.
  - `main.scss` only holds the reset, base element styles, `.sr-only` and the reduced-motion override.
  - Keyframes live in `_animations.scss`. The `rise-in` animation is global, so scoped blocks can reference it.
  - A style that more than one component needs becomes its own component, not a global class.

**State: the vault (`plugins/vault.ts`).** This replaces Pinia/Vuex. The plugin `provide`s one plain, non-reactive object per app. `initVault<T>(namespace)` returns `get` and `storeAndGet` for that namespace. Use it for composables that hold shared singleton state, following the pattern in `composables/usePages.ts`:
1. Call `get` first.
2. If it returns nothing, create the refs and functions and return `storeAndGet(...)`.

Only stored `ref`/`reactive` values are reactive, and `initVault` uses `inject`, so it only works inside `setup` or another injection context. `PublicMembers<T>` does not actually filter any keys.

**Job search data.** Listings are static sample data in `models/jobs.ts`, typed by `models/job.ts`. `composables/useJobSearch.ts` filters them on the client. It keeps two copies of the criteria: `criteria` is the live form model, and `submittedCriteria` only updates when `search()` is called. Results therefore change on submit, not as the user types. This composable does *not* use the vault, so its state is per component instance. Nothing calls the backend yet. `utils/utils.ts` `getEnvVariable` reads `import.meta.env` (e.g. `VITE_API_URL`), and `vite.config.ts` loads `VITE_*` env vars.

**API layer (`src/api/`).** This is a skeleton built on native `fetch`; nothing calls it yet.
- `client.ts` exports `apiClient` (get, post, put, patch and delete).
- The client prefixes paths with `VITE_API_URL` and serializes query params, skipping empty values.
- Bodies are JSON-encoded unless they are `FormData`.
- Requests time out after 15s by default and also accept a caller's `AbortSignal`.
- The JSON (or text) response is parsed, and any non-2xx status throws `ApiError(status, url, payload)`.
- Each resource gets its own module, typed with `models/` types, e.g. `jobs.ts` exports `jobsApi.search` and `jobsApi.getById`. Its endpoint paths are placeholders.
- `index.ts` re-exports everything.
- Components call these modules through composables, never `fetch` directly.

**Responsive helpers.** `plugins/breakpoint.ts` exports module-level computed flags (`isMobile`, `isTablet`, `isSmallDevice`, …) driven by one shared `resize` listener. Import them directly; they are not installed as a Vue plugin.

**Styling.**
- Global SCSS (`_variables`, `_mixins`, `_animations`) is imported once through `assets/style/main.scss` in `main.ts`.
- `scss.preprocessorOptions` is empty, so component `<style lang="scss">` blocks must import partials explicitly through `@globalStyle`.
- `src/vite/devSingleCss.ts` is a dev-only Vite plugin (`apply: "serve"`). It collects every transformed `.scss` source, compiles them together with sass, and serves the result as `/@dev-bundled-styles.css`, which it injects into `index.html`.
- Production builds use `cssCodeSplit: false`, so there is a single CSS file.

**Deployment.** Multi-stage Dockerfile: a Node 20 build stage, then nginx. `nginx.conf` falls back to `index.html` for every path.
