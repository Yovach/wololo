FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build


FROM nginx:alpine

ARG PORT=80
ENV NGINX=${PORT}
ENV NGINX_HOST=localhost

EXPOSE ${PORT}

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
