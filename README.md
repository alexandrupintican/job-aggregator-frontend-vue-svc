# Job Aggregator

A responsive job-search application built with **Vue 3**, **TypeScript**, **Vite**, and **SCSS**. Search for opportunities by role, skills, location, and work arrangement. This starter includes a small sample dataset and client-side filtering; it is ready to connect to a live jobs API.

## Features

- ⚡ Vue 3 Composition API and Vite
- 🟦 TypeScript support
- 🎨 SCSS theme variables and reusable styling
- 📱 Responsive job-search interface
- 🔎 Search jobs by keyword, location, and work arrangement
- 🧩 Reusable UI and job-search components
- ♻️ Reusable job-filtering composable
- 🧭 Vue Router navigation
- 🐳 Docker support for containerized deployment
- 🧪 Clearly labeled sample listings for local development

---

## Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| Vue 3 | Frontend framework |
| TypeScript | Static typing |
| Vite | Build tool and development server |
| Vue Router | Client-side routing |
| SCSS | Styling |
| Docker and Nginx | Containerized production deployment |

---

## Project Structure

```text
.
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── style/
│   ├── components/
│   │   ├── content/
│   │   ├── footer/
│   │   ├── header/
│   │   └── ui/
│   ├── composables/
│   ├── layouts/
│   ├── models/
│   ├── pages/
│   ├── plugins/
│   ├── router/
│   ├── App.vue
│   ├── entry.ts
│   └── main.ts
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

### Installation

```bash
git clone https://github.com/alexandrupintican/job-aggregator-frontend-vue-svc.git
cd job-aggregator-frontend-vue-svc
yarn install
```

### Development

```bash
yarn dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`).

### Production Build

```bash
yarn build
yarn preview
```

---

## Docker

Build and run the production container:

```bash
docker build -t job-aggregator .
docker run --rm -p 8080:80 job-aggregator
```

Then open `http://localhost:8080`.

---

## Architecture

- **Pages** provide route-level views.
- **Layouts** compose the shared application shell.
- **Components** contain reusable interface and job-search elements.
- **Composables** encapsulate reusable Composition API logic, including search filtering.
- **Models** define shared application types.
- **Plugins** register app-wide functionality.
- **Router** manages client-side navigation.

Job listings currently come from an in-memory sample dataset in `src/models/jobs.ts`. Search and filters run in the browser; no external job board or API is connected yet.

---

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `yarn dev` | Start the development server |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build |
