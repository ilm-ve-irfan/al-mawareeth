# Al-Mawareeth

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/client) on your phone (optional)

---

## Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-org/al-mawareeth.git
cd al-mawareeth
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
→ API runs on `http://localhost:3000`

### 3. Setup Mobile
```bash
cd mobile
npm install
npm start
```
→ Press `w` to open in browser or `a` for Android Emulator

---

## Project Structure
```
al-mawareeth/
├── backend/     → Node.js / Express API
└── mobile/      → React Native / Expo App
```

---

## Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start backend in dev mode |
| `npm start` | Start Expo app |
| `npm test` | Run tests |
