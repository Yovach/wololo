ARG NODE_VERSION="node:22-trixie-slim"

# Re-used across multiple stages
FROM ${NODE_VERSION} AS base

USER 1000
WORKDIR /app

COPY --chown=1000:1000 package*.json ./

RUN npm ci

COPY --chown=1000:1000 . .

# Development stage
FROM base AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV HOSTNAME=0.0.0.0
EXPOSE 5173

CMD ["node", "--run", "dev", "--", "--host"]

# Used for building the production assets
FROM base AS builder

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG VITE_BACK_URL
ENV VITE_BACK_URL=${VITE_BACK_URL:-"http://localhost:8080"}

RUN echo ${VITE_BACK_URL}

RUN node --run build

# Production stage
FROM nginx:1.29.2-alpine-slim AS production

ARG PORT=80
ENV NGINX_PORT=${PORT}
ENV NGINX_HOST=localhost

EXPOSE ${PORT}

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
