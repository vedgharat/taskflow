# TaskFlow — Modern MERN Task Manager

A production-ready, highly polished, and utilitarian task management application built with MongoDB, Express.js, React 19 (Vite), and Node.js. Designed with a hand-crafted, premium SaaS aesthetic (Vercel/Linear-inspired), supporting high-contrast Light and Dark modes.

## 🚀 Live Cloud Deployments

* **Frontend Client (Vercel)**: [https://client-gamma-lovat.vercel.app](https://client-gamma-lovat.vercel.app)
* **Backend API Gateway (Render)**: [https://taskflow-api-vslk.onrender.com](https://taskflow-api-vslk.onrender.com)
* **GitHub Repository**: [https://github.com/vedgharat/taskflow](https://github.com/vedgharat/taskflow)

---

## ✨ Features

### 1. 📋 Kanban Board View
- Drag-and-drop task columns (Pending, In Progress, Completed) utilizing native HTML5 APIs.
- Hover states and tactile border highlighting during drag actions with instant backend status synchronization.

### 2. 🔍 Real-Time Search & Sorting
- Dynamic search functionality querying both task `titles` and `descriptions` instantly.
- Multi-dimensional sorting on Due Date, Creation Date, or Priority Level utilizing backend pre-computed sorting ranks.

### 3. 🏷️ Categories & Custom Tags
- Create, append, and dismiss tags directly within the task editor.
- Mapped to indexed database fields to allow fast filtering by tags on the dashboard and task boards.

### 4. 🔗 Subtasks Checklist & Progress Bars
- Manage nested checklists inside tasks to track progress.
- Task cards feature collapsible lists and progress percentage bars. Checking off items directly on cards updates the cloud database in real-time.

### 5. 🌗 Profile Settings & Dark Mode
- Tabbed settings panel supporting secure profile detail edits (name, email) and secure password changers.
- Seamless Dark Mode toggle persisted across page refreshes via `localStorage` and CSS variables.

### 6. 📅 Monthly Calendar View & Reminders
- Monthly grid calendar layout showing all due tasks. Click any day to quick-create tasks with pre-filled due dates.
- High-priority overdue and due-today alarm callouts prominently displayed on the workspace dashboard.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Database** | MongoDB Atlas Cloud Database + Mongoose ODM |
| **Backend** | Node.js, Express.js (Modular Route → Controller → Service → Model architecture) |
| **Frontend** | React 19, Vite, React Router v7 |
| **Styling** | Vanilla CSS + Tailwind CSS v4 |
| **Auth & Security** | JSON Web Tokens (JWT), bcryptjs, Helmet, Express-Rate-Limit, CORS |
| **Validation** | Zod Schema Constraints |
| **Deployment** | Vercel (Frontend Client), Render + Docker containers (Backend API) |

---

## ⚙️ Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally on `localhost:27017` (for development)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/vedgharat/taskflow.git
cd taskflow

# Install Backend Dependencies
cd server
cp .env.example .env   # Edit .env with your local secrets
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 2. Run Local Development Servers
```bash
# Terminal 1 — Backend API
cd server
npm run dev

# Terminal 2 — Frontend client
cd client
npm run dev
```
- Development Backend: `http://localhost:5001`
- Development Frontend: `http://localhost:5173`

---

## 🔑 Environment Variables Configuration

### Backend (`server/.env`)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=change_me_to_a_strong_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5001/api # Points to Render backend URL in production
```

---

## 📡 API Endpoints Architecture

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | No | Register a new account |
| **POST** | `/api/auth/login` | No | Authenticate credentials & retrieve token |
| **GET** | `/api/auth/me` | Yes | Retrieve current session details |
| **PUT** | `/api/auth/profile` | Yes | Securely edit profile details / passwords |
| **GET** | `/api/tasks` | Yes | List user tasks (supports search, sort, tags) |
| **POST** | `/api/tasks` | Yes | Create a new task |
| **GET** | `/api/tasks/stats` | Yes | Get task status statistics |
| **GET** | `/api/tasks/:id` | Yes | Get task by ID |
| **PUT** | `/api/tasks/:id` | Yes | Update a task (CORS verified) |
| **DELETE** | `/api/tasks/:id` | Yes | Delete a task |

---

## 📁 Infrastructure Blueprints
The repository is fully optimized for one-click production cloud deployment using standard blueprints:
* **Vercel Client Configuration**: [client/vercel.json](file:///Users/vedgharat/Projects/taskflow/client/vercel.json) (enforces Single Page App route rewrites to prevent 404s).
* **Render Service Containerization**: [server/Dockerfile](file:///Users/vedgharat/Projects/taskflow/server/Dockerfile) (multi-stage optimized Alpine container configuration).
* **Render Infrastructure-as-Code Spec**: [render.yaml](file:///Users/vedgharat/Projects/taskflow/render.yaml) (defines variables, port configuration, and container parameters).

---

## 🛡️ Architecture Paradigm
The backend follows SDE-2 clean separation of concerns:
```text
Route Mapping → Zod Schema Validator → Controller → Business Service → Mongoose Model
                                                                ↓
                                                     Centralized Error Handler
```

---

## License
MIT
