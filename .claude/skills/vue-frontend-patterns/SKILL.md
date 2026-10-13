---
name: vue-frontend-patterns
description: Patterns and conventions for building UI in this Vue 3 + TypeScript + Vite + SCSS job-aggregator frontend. Covers adding pages (state-driven page switching, not routes), splitting pages into section components, scoped component styles, vault-backed shared composables, the search composable, breakpoint helpers and models. Use this skill whenever you create or modify a page, component, section, composable, style, or shared state in this repo, even if the request doesn't mention "patterns". Examples include "add a saved jobs page", "make a job details modal", "restyle the hero", "share filter state between components", "add a stats section", or "make the card responsive".
---

# Vue frontend patterns

This app is a Vue 3 SPA built with `<script setup lang="ts">`, Vite and SCSS. It has a few patterns that differ from a stock Vue app. The biggest are that pages are selected by state rather than routes, and shared state lives in a custom "vault" rather than Pinia. Follow the existing patterns so new code fits in. Read the files named below before changing them.

## Where things go

| Kind                                 | Location                                                           | Example                                      |
| ------------------------------------ | ------------------------------------------------------------------ | -------------------------------------------- |
| Page: a thin composition of sections | `src/pages/`                                                       | `HomePage.vue`                               |
| Page-level section                   | `src/components/sections/`                                         | `HeroSection`, `JobsSection`                 |
| Reusable content block               | `src/components/content/`                                          | `JobCard`, `JobSearchForm`, `JobsEmptyState` |
| Small shared UI primitive            | `src/components/ui/`                                               | `BrandLogo`                                  |
| App shell                            | `src/components/header/`, `src/components/footer/`, `src/layouts/` | `AppHeader`, `DefaultLayout`                 |
| Composition logic                    | `src/composables/`                                                 | `useJobSearch`, `usePages`                   |
| Types and sample data                | `src/models/`                                                      | `job.ts`, `jobs.ts`                          |
| Global SCSS partials                 | `src/assets/style/` (alias `@globalStyle`)                         | `_variables`, `_mixins`, `_animations`       |

Use the `@/` alias for imports from `src`.

## 1. Pages are thin; sections are components

A page only does two things: it calls composables, and it wires their state into section components through props, `v-model` and events. It should contain no large inline markup or styles. Every visually distinct block becomes its own `.vue` file. That way a change to, say, the hero shows up everywhere the hero is used, and the page reads like an outline.

```vue
<!-- src/pages/HomePage.vue -->
<script setup lang="ts">
import HeroSection from "@/components/sections/HeroSection.vue";
import JobsSection from "@/components/sections/JobsSection.vue";
import { useJobSearch } from "@/composables/useJobSearch";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const { criteria, filteredJobs, search, clearSearch } = useJobSearch();
</script>

<template>
  <DefaultLayout>
    <HeroSection v-model="criteria" @search="search" @clear="clearSearch" />
    <JobsSection :jobs="filteredJobs" @clear="clearSearch" />
  </DefaultLayout>
</template>
```

Rules for components:

- **Data in through props or `defineModel`, intent out through `defineEmits`.** Sections and content blocks don't call page composables such as `useJobSearch` themselves. Composable state is per-instance unless it's vault-backed, so a section that called it would get its own disconnected copy. Taking props also keeps the component reusable on other pages.
- **Forward events up rather than handling them in the middle.** `JobsSection` re-emits `clear` from `JobsEmptyState` (`@clear="$emit('clear')"`), and the page decides what clearing means.
- **Prefer a component to a shared class.** If two components need the same styled markup, extract a `ui/` component with props for the variants. For example, `<BrandLogo dot>` and `<BrandLogo muted>` both use `BrandLogo`, and `<BrandLogo compact />` is the footer's smaller logo.
- Use typed macros: `defineProps<{ jobs: Job[] }>()`, and `withDefaults(...)` for optional booleans.
- Non-prop attributes fall through to the root element. For example, `aria-label` on `BrandLogo` lands on its `RouterLink`.

## 2. Styles live in the component, scoped

Each component owns its styles in a scoped SCSS block in the same file. That includes its own media queries.

```vue
<style lang="scss" scoped>
@use "@globalStyle/variables" as *;
@use "@globalStyle/mixins" as *; /* only if you use content-width / focus-ring */

.jobs-section {
  @include content-width;
  padding-top: 67px;
}

@media (max-width: 680px) {
  .jobs-section {
    width: min(calc(100% - 36px), $content-width);
  }
}
</style>
```

- **Import the partials yourself.** `scss.preprocessorOptions` doesn't inject anything automatically, so every block that uses `$color-*`, `$font-*` or `$content-width` needs the `@use` line.
- **Use the existing tokens.** Colors are `$color-ink`, `$color-muted`, `$color-green`, `$color-green-dark`, `$color-lime`, `$color-paper`, `$color-white` and `$color-border`. Fonts are `$font-display` (serif headings) and `$font-body`. Mixins are `content-width` and `focus-ring`. One-off tints are written inline as hex, as the existing components do.
- **Breakpoints in CSS are 1400px, 900px and 680px.** The `max-width: 680px` breakpoint is the mobile layout.
- **Name classes BEM-style after the component**, e.g. `.job-card`, `.job-card__title-row`, `.job-card__company-mark--peach`. Modifier classes can come from data: ``:class="`job-card__company-mark--${job.color}`"``.
- **Keep `src/assets/style/main.scss` global-only.** It holds the reset, base element styles, `.sr-only` and the reduced-motion override. Don't add component classes to it.
- **Put keyframes in `_animations.scss`.** They're global, so scoped blocks can reference them, e.g. `animation: rise-in 350ms ease both`.
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

If the state is local to one component tree, don't use the vault. A plain composable like `useJobSearch` is the right tool there.

## 5. Plain composables

`src/composables/useJobSearch.ts` is the model for a non-shared composable. It's a named export that returns refs, computeds and functions, and takes optional inputs with defaults (`listings: Job[] = jobs`). It keeps **draft vs submitted** state: `criteria` is the live form model bound with `v-model`, and `submittedCriteria` only changes when `search()` runs. So `filteredJobs` updates on submit, not on every keystroke. Keep that split if you extend search. Instant filtering would be a behavior change to raise with the user.

Data is currently the static sample set in `src/models/jobs.ts`, typed by `src/models/job.ts`, and nothing calls the backend yet. When you add one, add or extend a resource module in `src/api/`, e.g. `jobsApi` in `src/api/jobs.ts`, built on `apiClient` from `src/api/client.ts`. Call it from a composable, not from a component, and handle `ApiError` there. Put new domain types in `src/models/`. Read environment values through `getEnvVariable` in `src/utils/utils.ts`; only `VITE_`-prefixed variables reach the client.

## 6. Responsive logic in script

For layout decisions CSS can't make, such as rendering a different component on mobile, import the computed flags from `src/plugins/breakpoint.ts`:

```ts
import { isMobile, isSmallDevice } from "@/plugins/breakpoint";
```

They share one module-level `resize` listener and aren't installed as a Vue plugin. Their breakpoints (640/768/1024/1280/1536) are separate from the CSS breakpoints in pattern 2. For purely visual changes, prefer CSS media queries.

## Code style

- Match the file you're in. Components, models and `useJobSearch` use single quotes and no semicolons. The plugins, router, vault, `usePages` and `PageView` use double quotes and semicolons. Don't reformat files you aren't otherwise changing.
- Templates use PascalCase component tags. Use `aria-hidden="true"` on decorative glyphs and an `aria-label` or `.sr-only` text on icon-only controls, as the existing components do.

## Checking your work

```bash
npx vue-tsc -b      # type-check (noEmit, writes nothing into src/)
npx vite build      # bundle
```

`yarn build` runs both. If you start the dev server, it runs on port 3000. Look at the change at desktop width and below 680px.
