# syntax=docker/dockerfile:1.7
FROM node:20-alpine AS base
WORKDIR /app
ENV EXPO_NO_TELEMETRY=1
RUN apk add --no-cache git bash
RUN npm install -g @expo/ngrok@4.1.0

FROM base AS deps
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY mobile/package.json mobile/package.json
RUN npm ci

FROM deps AS dev
ENV NODE_ENV=development
COPY mobile ./mobile
EXPOSE 8081
CMD ["npx", "expo", "start", "--tunnel", "--port", "8081"]
