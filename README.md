# 🌌 Daily Cosmos

A full-stack space-exploration dashboard. Every day it pulls NASA's Astronomy Picture of the Day, tracks near-Earth asteroids, matches you with "space buddies" based on shared likes, and lets you chat with an AI co-pilot — all wrapped in a glassmorphism, mission-control-themed UI.

**Live app:** [daily-cosmos](https://daily-cosmos-1.onrender.com) *(update with your actual Vercel URL)*

## ✨ Features

- **Daily Astronomy Picture** — fetches NASA's APOD each day and caches it in MongoDB so repeat visits don't re-hit the NASA API.
- **Near-Earth Object watch** — shows asteroids passing Earth today, with size, speed, and hazard status, via NASA's NeoWs API.
- **Likes & rank** — like the daily photo to build up a rank (Cadet → Pilot → Commander).
- **Space Buddies** — a lightweight recommender that matches you with other users who liked the same photos.
- **User search** — fuzzy username search powered by MongoDB Atlas Search.
- **Nova AI Co-Pilot** — an in-app chat assistant powered by Google's Gemini API.
- **Auth** — JWT-based registration/login with bcrypt-hashed passwords.

## 🛠 Tech Stack

**Client**
- React 19 + Vite
- Tailwind CSS
- Axios (with an interceptor that auto-attaches the auth token)

**Server**
- Node.js + Express
- MongoDB + Mongoose (Atlas, with Atlas Search for user lookup)
- JWT + bcrypt for authentication
- Google Generative AI SDK (Gemini)
- NASA Open APIs (APOD + NeoWs)

**Deployment**
- Client → Vercel
- Server → Render

## 📁 Project Structure

```
daily-cosmos/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api.js          # Axios instance + auth interceptor
│       ├── App.jsx         # Main dashboard
│       └── components/     # Login, Profile, UserSearch, Copilot
└── server/                 # Express backend
    ├── index.js            # App entry point + daily APOD route
    ├── middleware/auth.js  # JWT verification middleware
    ├── models/             # Mongoose schemas (User, Post)
    └── routes/             # auth, posts, users, asteroids, copilot
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (with an Atlas Search index named `default` on the `username` field of the `users` collection, for user search)
- API keys: [NASA API](https://api.nasa.gov/) and [Google Gemini](https://aistudio.google.com/app/apikey)

### 1. Clone and install

```bash
git clone https://github.com/CodingMuse5/Daily_Cosmos.git
cd Daily_Cosmos/daily-cosmos
```

**Server**

```bash
cd server
npm install
cp .env.example .env   # then fill in your own values
npm run dev             # starts on http://localhost:5000
```

**Client**

```bash
cd client
npm install
npm run dev              # starts on http://localhost:5173
```

> The client currently points at a deployed API URL in `src/api.js`. To run fully locally, swap the `baseURL` there to `http://localhost:5000/api`.

### 2. Environment variables (server)

Create `server/.env` (see `server/.env.example`):

| Variable         | Description                                  |
|------------------|-----------------------------------------------|
| `MONGO_URI`      | MongoDB Atlas connection string               |
| `NASA_API_KEY`   | Key from api.nasa.gov                         |
| `GEMINI_API_KEY` | Google Gemini API key                         |
| `JWT_SECRET`     | Long random string used to sign auth tokens   |
| `PORT`           | Server port (defaults to 5000)                |

**Never commit `.env`** — it's already gitignored.

## 🔌 API Overview

| Method | Endpoint                  | Auth | Description                                  |
|--------|----------------------------|------|-----------------------------------------------|
| GET    | `/api/daily`               | No   | Today's APOD (cached in Mongo)                |
| GET    | `/api/asteroids`           | No   | Near-Earth objects passing today              |
| POST   | `/api/auth/register`       | No   | Create an account                             |
| POST   | `/api/auth/login`          | No   | Log in, returns a JWT                         |
| GET    | `/api/auth/me`             | Yes  | Current user's profile + like count           |
| PUT    | `/api/posts/like/:date`    | Yes  | Like/unlike the post for a given date         |
| GET    | `/api/posts/favorites`     | Yes  | Posts the current user has liked              |
| GET    | `/api/users/buddies`       | Yes  | Users who liked the same posts as you         |
| PUT    | `/api/users/add/:id`       | Yes  | Add a user as a friend                        |
| GET    | `/api/users/search?q=`     | Yes  | Fuzzy search users by username                |
| POST   | `/api/copilot/ask`         | Yes  | Chat with the Nova AI co-pilot                |

Authenticated requests send the JWT in an `x-auth-token` header (and `Authorization: Bearer <token>`).

## 📄 License

ISC (see `server/package.json`) — update as appropriate.
