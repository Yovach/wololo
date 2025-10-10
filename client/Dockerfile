FROM node:22-trixie-slim AS builder

WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG VITE_BACK_URL="http://localhost:8080"
ENV VITE_BACK_URL=${VITE_BACK_URL}

RUN node --run build

FROM nginx:1.29.2-alpine-slim

ARG PORT=80
ENV NGINX_PORT=${PORT}
ENV NGINX_HOST=localhost

EXPOSE ${PORT}

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
