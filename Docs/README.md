# Al-Mawareeth

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2
- For running on a physical device or emulator: [Expo Go](https://expo.dev/client) on your phone, or Android Studio / Xcode on the host

> Mobile native builds (`expo run:android`, `expo run:ios`) still require Android Studio or Xcode on the host. Docker only covers the API and the Metro/Expo dev server.

---

## Getting Started (Docker)

### 1. Clone the Repo

```bash
git clone https://github.com/ilm-ve-irfan/al-mawareeth.git
cd al-mawareeth
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

### 3. Start everything

```bash
docker compose up --build
```

This starts:

- **`backend`** — Express API on `http://localhost:3000`
- **`mobile`** — Expo dev server (Metro) on port `8081`, started with `--tunnel` so Expo Go on your phone can reach it without LAN configuration

Open Expo Go and scan the QR code printed by the `mobile` service to load the app.

### Useful Docker commands

| Command                                        | Description                                     |
| ---------------------------------------------- | ----------------------------------------------- |
| `docker compose up backend`                    | Start only the backend                          |
| `docker compose up mobile`                     | Start only the mobile dev server                |
| `docker compose run --rm backend npm test`     | Run backend tests                               |
| `docker compose run --rm mobile npm test`      | Run mobile tests                                |
| `docker compose down`                          | Stop and remove containers                      |
| `docker compose down -v`                       | Stop, remove containers and named volumes       |

---

## Running natively (fallback)

Useful when you need to run an Android emulator, iOS simulator, or a native build.

### Backend

```bash
npm install
cp backend/.env.example backend/.env
npm run dev -w backend
```

→ API runs on `http://localhost:3000`

### Mobile

```bash
npm install
npm start -w mobile
```

Then press `a` to open the Android emulator or `i` for the iOS simulator, or scan the QR code with Expo Go.

---

## Project Structure

```
al-mawareeth/
├── backend/             → Node.js / Express API (TypeScript)
├── mobile/              → React Native / Expo app
├── docker-compose.yml   → Local dev orchestration
└── Docs/                → Project and team docs
```
