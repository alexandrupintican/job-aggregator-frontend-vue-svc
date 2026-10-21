---
name: vue-frontend-patterns
description: Patterns and conventions for building UI in this Vue 3 + TypeScript + Vite + SCSS job-aggregator frontend. Covers adding pages (state-driven page switching, not routes), splitting pages into section components, scoped component styles, vault-backed shared composables, the API-backed search composable, the API service and read-only model classes, and breakpoint helpers. Use this skill whenever you create or modify a page, component, section, composable, style, or shared state in this repo, even if the request doesn't mention "patterns". Examples include "add a saved jobs page", "make a job details modal", "restyle the hero", "share filter state between components", "add a stats section", or "make the card responsive".
---

# Vue frontend patterns

This app is a Vue 3 SPA built with `<script setup lang="ts">`, Vite and SCSS. It has a few patterns that differ from a stock Vue app. The biggest are that pages are selected by state rather than routes, and shared state lives in a custom "vault" rather than Pinia. Follow the existing patterns so new code fits in. Read the files named below before changing them.

## Where things go

| Kind | Location | Example |
| --- | --- | --- |
| Page: a thin composition of sections | `src/pages/` | `HomePage.vue` |
| Page-level section | `src/components/sections/` | `HeroSection`, `JobFiltersSection`, `JobsSection` |
| Reusable content block | `src/components/content/` | `JobCard`, `JobFilterForm`, `CollectorPreferencesForm`, `JobsPager`, `JobsEmptyState`, `JobsErrorState` |
| Small shared UI primitive | `src/components/ui/` | `BrandLogo`, `TextButton`, `PrimaryButton`, `Spinner`, `FormField`, `ListField` |
| App shell | `src/components/header/`, `src/components/footer/`, `src/layouts/` | `AppHeader`, `DefaultLayout` |
| Composition logic | `src/composables/` | `useJobFilters`, `useCollectorConfig`, `usePages` |
| API service | `src/api/` | `api.ts` (`jobService.getJobs`) |
| Read-only model classes, one per file | `src/models/JobService/` | `JobPageModel`, `JobListingModel`, `JobListingQueryModel` |
| Raw API types, all in one file | `src/types/models/jobListings.d.ts` | `JobListing`, `JobPage`, `JobListingQuery` |
| Global SCSS partials | `src/assets/style/` (alias `@globalStyle`) | `_variables`, `_theme`, `_mixins`, `global.scss` |

Use the `@/` alias for imports from `src`.

## 1. Pages are thin; sections are components

A page only does two things: it calls composables, and it wires their state into section components through props, `v-model` and events. It should contain no large inline markup or styles. Every visually distinct block becomes its own `.vue` file. That way a change to, say, the hero shows up everywhere the hero is used, and the page reads like an outline.

```vue
<!-- src/pages/HomePage.vue -->
<script setup lang="ts">
import JobFiltersSection from "@/components/sections/JobFiltersSection.vue";
import JobsSection from "@/components/sections/JobsSection.vue";
import { useJobFilters } from "@/composables/useJobFilters";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const {
  filters,
  page,
  loading,
  error,
  applyFilters,
  goToOffset,
  clearFilters,
} = useJobFilters();
</script>

<template>
  <DefaultLayout>
    <JobFiltersSection
      v-model="filters"
      @apply="applyFilters"
      @clear="clearFilters"
    />
    <JobsSection
      :error="error"
      :loading="loading"
      :page="page"
      @clear="clearFilters"
      @page="goToOffset"
      @retry="applyFilters"
    />
  </DefaultLayout>
</template>
```

Rules for components:

- **Data in through props or `defineModel`, intent out through `defineEmits`.** Sections and content blocks don't call page composables such as `useJobFilters` themselves. Composable state is per-instance unless it's vault-backed, so a section that called it would get its own disconnected copy. Taking props also keeps the component reusable on other pages.
- **Forward events up rather than handling them in the middle.** `JobsSection` re-emits `clear` from `JobsEmptyState`, `retry` from `JobsErrorState` and `page` (the new offset) from `JobsPager`, and the page decides what each one means.
- **Prefer a component to a shared class.** If two components need the same styled markup, extract a `ui/` component with props for the variants. For example, `<BrandLogo compact />` is the footer's smaller logo, `PrimaryButton` is the filled call-to-action used for Apply filters, Save preferences and View listing (pass `href` for a link; `target`, `rel` and `aria-label` fall through), and `TextButton` is the link-style button shared by `JobsEmptyState` ("Clear your search") and `JobsErrorState` ("Try again").
- Use typed macros: `defineProps<{ job: JobListingModel }>()`, and `withDefaults(...)` for optional booleans.
- Non-prop attributes fall through to the root element. For example, `aria-label` on `BrandLogo` lands on its `RouterLink`.

## 2. Styles live in the component, scoped

Each component owns its styles in a scoped SCSS block in the same file. That includes its own media queries.

```vue
<style lang="scss" scoped>
.jobs-section {
  width: calc(100% - 48px);
  margin-inline: auto;
  padding-top: 67px;
  color: var(--text);
}

@media (max-width: 680px) {
  .jobs-section {
    width: calc(100% - 36px);
  }
}
</style>
```

- **Don't import partials by default.** Components style themselves with the theme's CSS custom properties, which need no import, so style blocks start straight with rules. `scss.preprocessorOptions` injects nothing, so if a block genuinely needs a `$` SCSS variable, add `@use "@globalStyle/variables" as *;` to that block only. Never `@use` `mixins` in a component: `_mixins.scss` emits the grid `.col--N`/`.row--N` classes, so each import duplicates them.
- **Use the theme tokens.** `_theme.scss` exposes the palette as CSS custom properties on `:root`. Prefer them over raw `$` values: `--text`, `--text-muted`, `--background`, `--surface` (cards and panels), `--border`, `--color-accent-1` (primary actions and links), `--color-accent-2` (hover), `--color-secondary`, `--color-white`, `--font-family-primary`, plus `--header-height`, `--footer-height` and `--content-height`. The theme is dark. Write one-off tints as `color-mix(in srgb, var(--color-accent-1) 15%, transparent)` or as low-alpha `rgba`.
- **Don't set `font-size` or `letter-spacing` in components.** Typography comes from the HTML tag. Titles are `h1`/`h2`, sized in `global.scss`; that includes card and empty/error-state titles. Don't use `h3`, which has no theme size. Standalone text is `p`. Inline `span`s inherit the root size from `_theme.scss`. Labels and hints inside a `<label>` stay `span`, because `p` isn't valid there. If something needs a new size, add a tag rule to the theme rather than a component override. The one exception is `font-size: inherit` in `PrimaryButton`, which makes its `<a>` and `<button>` forms match, because browsers render buttons at ~13px.
- **Lay out blocks with the theme grid; use flex only when it's needed.** Put `.grid` (12 columns, 15px gap, from `global.scss`) on the container and column classes on the children: `col--N` everywhere, plus responsive `col__xs--N`, `col__sm--N`, `col__md--N` and `col__lg--N`. The responsive classes are mobile-first and apply from 481, 769, 961 and 1281px up, so they usually replace hand-written media queries. `.grid` has a `20px 0` margin; zero it with a scoped rule when the parent already pads. Classes on a child component fall through to its root, so `<FormField class="col--12 col__md--3">` works. Keep flex for a single row that needs alignment, such as right-aligned buttons. Stack things vertically with `display: grid; gap`, not `flex-direction: column`.

  ```vue
  <div class="filter-panel__grid grid">
    <FormField class="col--12 col__sm--6" label="Search" name="q">…</FormField>
    <FormField class="col--12 col__xs--6 col__md--3" label="Company" name="company">…</FormField>
    <div class="filter-panel__actions col--12 col__md--8">…buttons…</div>
  </div>
  ```

- **Every form input goes through `FormField` (or `ListField` for comma-separated lists).** Don't hand-roll label and input markup. `FormField` provides the label, the input styling and an optional `hint`. `ListField` passes no hint.
- **Component breakpoints are `max-width` 900px and 680px.** The 680px breakpoint is the mobile layout. `global.scss` scales the root font and headings at 1024px. Prefer the grid's responsive column classes over new media queries.
- **Name classes BEM-style after the component**, e.g. `.job-card`, `.job-card__title-row`, `.job-card__company-mark--peach`. Modifier classes can come from data: ``:class="`job-card__status--${status}`"``.
- **Keep `src/assets/style/global.scss` global-only.** It holds base element styles plus the `.grid` and `.button` helpers. Don't add component classes to it. It has no box-sizing reset, so set `box-sizing: border-box` on anything that combines `width: 100%` with padding.
- **Declare keyframes in the component that uses them.** There is no global keyframes file, so put `@keyframes rise-in { … }` in the same scoped block.
- Scoped styles don't reach into child components. To restyle a child, give it a prop or variant rather than using `:deep()`.

## 3. Adding a page: state-driven, not routed

The router has one catch-all route that renders `src/views/PageView.vue`. `PageView` picks which page to show from `usePages().pageRef`, and the URL doesn't change. To add a page:

1. Add an alias in `src/utils/pages.ts`:
   ```ts
   export enum PageAliases {
     HOME_PAGE = "homePage",
     SAVED_JOBS_PAGE = "savedJobsPage",
   }
   ```
2. Register it in the `Pages` map in `src/views/PageView.vue`. The key must equal the enum _value_:
   ```ts
   const Pages = {
     homePage: defineAsyncComponent(() => import("@/pages/HomePage.vue")),
     savedJobsPage: defineAsyncComponent(
       () => import("@/pages/SavedJobsPage.vue"),
     ),
   };
   ```
3. Create `src/pages/SavedJobsPage.vue` as a thin page made of section components (pattern 1).
4. Navigate with `usePages().setPage(PageAliases.SAVED_JOBS_PAGE)`.

Don't add a new route to `src/router/index.ts` for an ordinary page. If the user explicitly wants real URLs, such as deep links or the back button, point out that this is an architectural change and confirm it first.

A known quirk: `PageView` renders `AppHeader`/`AppFooter`, and `HomePage` _also_ wraps itself in `DefaultLayout`, which renders them again. Don't copy that double wrapping into new pages without checking with the user how they want the layout resolved.

## 4. Shared state: the vault

`src/plugins/vault.ts` stands in for Pinia or Vuex. It's one plain object per app, reached through `inject`, and split into namespaces by `initVault<T>(key)`. Use it when several components need the _same_ instance of a composable's state, or when state must survive a page switch. Follow `src/composables/usePages.ts`:

```ts
import { initVault } from "@/plugins/vault";
import { ref, Ref } from "vue";

type Vault = {
  useSavedJobs: {
    savedIds: Ref<string[]>;
    toggle(id: string): void;
  };
};

export default function useSavedJobs() {
  const storage = initVault<Vault>("useSavedJobs");
  const existing = storage.get("useSavedJobs");

  if (existing) {
    return existing;
  }

  const savedIds = ref<string[]>([]);

  function toggle(id: string): void {
    savedIds.value = savedIds.value.includes(id)
      ? savedIds.value.filter((saved) => saved !== id)
      : [...savedIds.value, id];
  }

  return storage.storeAndGet("useSavedJobs", { savedIds, toggle });
}
```

Things that will bite you:

- **Always check `get` first.** `storeAndGet` overwrites unconditionally, so calling it without the check resets the state for every consumer.
- **Store refs or reactive objects.** The vault itself isn't reactive, so a plain value you store never triggers a re-render.
- **Use it only in an injection context.** `initVault` calls `inject`, so it works inside `setup` or another composable called from `setup`. It doesn't work in router guards or plain modules.
- **Use one unique namespace per composable.** By convention the namespace string is the composable's name.

If the state is local to one component tree, don't use the vault. A plain composable like `useJobFilters` is the right tool there.

## 5. Plain composables

`src/composables/useJobFilters.ts` is the model for a non-shared composable. It's a named export that returns refs, computeds and functions. It keeps **draft vs sent** state: `filters` (a `JobListingQuery`) is the live form model bound with `v-model`, and a request only goes out when `applyFilters()` runs. Results only change on submit, not on every keystroke. Keep that split if you extend filtering. Filtering as you type would be a behavior change to raise with the user.

What it returns:

- `filters`: the form model. `clearFilters()` resets it to the defaults (`limit: 20`, `offset: 0`, empty strings) and filters again.
- `page`: a `JobPageModel | null` held in a **`shallowRef`**. Use `shallowRef` for the model classes. `ref()` deep-unwraps them and its type drops their private fields, which breaks assignment to `JobPageModel`. The instances are read-only anyway, so deep reactivity buys nothing.
- `loading` and `error` (a message string or `null`).
- `applyFilters()`, and `goToOffset(offset)`, which writes `offset` into `filters` and applies them.

Requests are numbered, and only the latest one may write `page`, `loading` or `error`, so a slow earlier response can't overwrite a newer one. The composable runs the first search when it's created.

## 6. API service and model classes

All backend access goes through `src/api/api.ts`. Its default export holds the services, e.g. `api.jobService.getJobs(query)`.

- `request()` prefixes the path with `VITE_API_URL` and throws an `Error` on any non-2xx status. The URL is read through `getEnvVariable` in `src/utils/utils.ts`, and only `VITE_`-prefixed variables reach the client.
- `getJobs(query: JobListingQueryModel)` calls `${JOBS_ENDPOINT}${query.getQueryString()}` and wraps the JSON in a `JobPageModel`.
- Call services from a composable, never from a component, and turn errors into state there.
- The endpoint accepts only `limit`, `offset`, `status`, `source`, `company`, `location`, `work_mode` and `q`, and silently ignores any other parameter. `status`, `source`, `company`, `location` and `work_mode` are case-insensitive exact matches. An out-of-range `limit` or `offset` returns a 400. The spec is at `/openapi.json` on the API host.

Responses are wrapped in **read-only model classes** in `src/models/JobService/`:

- There's one class per file, named `<thing>Model`: `JobPageModel`, `JobListingModel`, `JobListingAssessmentModel`, `JobListingSourceModel` and `JobListingQueryModel`.
- The constructor takes the raw payload type from `src/types/models/jobListings.d.ts` and keeps it in a `private readonly data` field.
- Values are exposed through **`getX()` methods, not `get x()` accessors, and there are no setters**. Names are camelCase (`getWorkMode()` for `work_mode`). Date strings come back as `Date` (`getPublishedAt()`), and lists come back as `readonly` arrays.
- Nested objects are wrapped once, in the constructor. `JobPageModel` builds `JobListingModel`s, which build their assessment and source models.
- `JobListingModel.getId()` returns `source:source_id`. It's unique across listings, so use it as the `v-for` key.
- `JobListingQueryModel` is built from the form's `JobListingQuery`. `getQueryString()` produces the query string and leaves out empty values.

Raw payload types stay together in the single file `src/types/models/jobListings.d.ts`. Don't split it into one file per type.

Listing descriptions are raw HTML from the job boards. Don't render them with `v-html`; `JobCard` turns them into shortened plain text.

`src/models/job.ts` and `src/models/jobs.ts` hold the old sample data and are no longer used.

## 7. Responsive logic in script

For layout decisions CSS can't make, such as rendering a different component on mobile, import the computed flags from `src/plugins/breakpoint.ts`:

```ts
import { isMobile, isSmallDevice } from "@/plugins/breakpoint";
```

They share one module-level `resize` listener and aren't installed as a Vue plugin. Their breakpoints (640/768/1024/1280/1536) are separate from the CSS breakpoints in pattern 2. For purely visual changes, prefer CSS media queries.

## Code style

- Match the file you're in, because the codebase mixes two styles.
  - Single quotes and no semicolons: `useJobFilters`, `JobCard`, `JobsPager`, `JobsEmptyState`, `JobsErrorState` and `AppHeader`.
  - Double quotes and semicolons: `api.ts`, the `JobService` models, `HomePage`, `HeroSection`, `JobsSection`, `JobFilterForm`, `AppFooter`, the plugins, router, vault, `usePages` and `PageView`.
  - Don't reformat files you aren't otherwise changing.
- Templates use PascalCase component tags. Use `aria-hidden="true"` on decorative glyphs and an `aria-label` on icon-only controls, as the existing components do.

## Checking your work

```bash
npx vue-tsc -b      # type-check (noEmit, writes nothing into src/)
npx vite build      # bundle
```

`yarn build` runs both. If you start the dev server, it runs on port 3000. Search results need the Jobs Listing API running at `VITE_API_URL`, which comes from `.env` and defaults to `http://localhost:8000`. Look at the change at desktop width and below 680px.
