# syntax=docker/dockerfile:1

# Frontend only: builds the Vue SPA with Node, then serves the static files
# with nginx. The Jobs Listing API is a separate service and is not built here.

ARG NODE_VERSION=24.16.0

################################################################################
# Build stage: install dependencies with npm (production builds use npm;
# Yarn is for local development) and bundle the app into /usr/src/app/dist.
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

# The API base URL is baked into the bundle at build time, so it comes in as a
# build argument instead of from .env (which .dockerignore keeps out of the image).
# Example: docker build --build-arg VITE_API_URL=https://api.example.com .
ARG VITE_API_URL
RUN test -n "$VITE_API_URL" || (echo "Build argument VITE_API_URL is required." >&2 && exit 1)
ENV VITE_API_URL=$VITE_API_URL

# npm ci installs exactly what package-lock.json pins and fails if it is out of
# sync with package.json. The bind mounts avoid copying these files into a layer;
# the cache mount reuses downloaded packages between builds.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

################################################################################
# Runtime stage: only nginx and the built files. No Node, no source, no node_modules.
FROM nginx:alpine AS final

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
