# syntax=docker/dockerfile:1.7
FROM node:20-alpine AS base
WORKDIR /app
ENV CI=true

FROM base AS deps
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY mobile/package.json mobile/package.json
RUN npm ci

FROM deps AS dev
ENV NODE_ENV=development
COPY backend ./backend
EXPOSE 3000
CMD ["npm", "run", "dev", "-w", "backend"]

FROM deps AS build
COPY backend ./backend
RUN npm run build -w backend

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY mobile/package.json mobile/package.json
RUN npm ci --omit=dev
COPY --from=build /app/backend/dist ./backend/dist
EXPOSE 3000
CMD ["node", "backend/dist/index.js"]
