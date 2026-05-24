# TaskFlow — MERN Task Manager

A production-ready, modern task management application built with MongoDB, Express.js, React (Vite), and Node.js. Features JWT authentication, full CRUD task management, advanced filtering & pagination, and a real-time dashboard.

## Features

- 🔐 **Authentication** — Register/Login with JWT & bcrypt
- ✅ **Task CRUD** — Create, read, update, delete tasks
- 🏷️ **Status & Priority** — Pending / In Progress / Completed × Low / Medium / High
- 🔍 **Filtering & Pagination** — Filter by status/priority with paginated results
- 📊 **Dashboard** — Overview stats with task counts by status
- 🎨 **Dark Glassmorphism UI** — Modern design with micro-animations
- 🛡️ **Security** — Helmet, CORS, rate limiting, input validation (Zod)

## Tech Stack

| Layer     | Technology                              |
|-----------|----------------------------------------|
| Database  | MongoDB + Mongoose                     |
| Backend   | Node.js, Express.js                    |
| Frontend  | React 19, Vite                         |
| Styling   | Tailwind CSS v4                        |
| Auth      | JSON Web Tokens, bcryptjs              |
| Validation| Zod                                    |

## Quick Start

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on `localhost:27017` (or a remote URI)

### 1. Clone & Install

```bash
# Backend
cd server
cp .env.example .env   # Edit .env with your MongoDB URI & JWT secret
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## API Endpoints

| Method | Endpoint            | Auth | Description              |
|--------|---------------------|------|--------------------------|
| POST   | /api/auth/register  | No   | Register a new user      |
| POST   | /api/auth/login     | No   | Login & get JWT          |
| GET    | /api/auth/me        | Yes  | Get current user         |
| GET    | /api/tasks          | Yes  | List tasks (filtered)    |
| POST   | /api/tasks          | Yes  | Create a task            |
| GET    | /api/tasks/stats    | Yes  | Get task statistics      |
| GET    | /api/tasks/:id      | Yes  | Get task by ID           |
| PUT    | /api/tasks/:id      | Yes  | Update a task            |
| DELETE | /api/tasks/:id      | Yes  | Delete a task            |

## Architecture

```
Route → Validation (Zod) → Controller → Service → Model
                                    ↓
                           Error Middleware (centralized)
```

## License

MIT
