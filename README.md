<h1 align="center">🎓 Educational CRM Platform</h1>
<h3 align="center">A Full-Stack MERN Application with AI Chatbot</h3>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"/>
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white"/>
</p>

<p align="center">
  A centralised platform for educational institutes to manage student inquiries, track employee performance, and provide real-time AI-powered assistance — all in one place.
</p>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [AI Chatbot](#-ai-chatbot)
- [Project Timeline](#-project-timeline)
- [Contributing](#-contributing)

---

## 🎯 Problem Statement

Educational institutes and training providers struggle to manage student inquiries efficiently. Without a centralised system:

| Pain Point | Impact |
|---|---|
| **Manual lead tracking** | Sales staff lack a structured way to record and track student registrations |
| **No attribution** | Managers cannot see which employee brought in which student, making performance evaluation impossible |
| **Unverified data** | Fake or mistyped emails waste time with no automated verification |

This platform solves all three with role-based dashboards, optional email verification, and a real-time AI chatbot.

---

## ✨ Features

### 👥 User Roles & Access Control
- **Superadmin** — Full control: manages admins, employees, submissions, and system settings
- **Admin** — Manages employees and submissions; can add students directly or with email verification
- **Employee** — Registers new student leads; can be granted "direct add" privilege to skip verification

### 📝 Student Registration & Email Verification
- Public registration form (name, phone, email)
- Toggleable global email verification (controlled by Superadmin)
- Two-step email verification: a 6-digit code sent via email (Brevo / Gmail SMTP)
- Duplicate email prevention — approved emails block re-registration; pending entries can be overwritten
- Verification codes auto-expire after **5 minutes** (MongoDB TTL index)

### 📊 Submissions Dashboard
- All roles see a searchable table of students (name, phone, email, status, creator)
- Superadmin & Admin can edit or delete any submission; employees can only modify their own
- Search by name, phone, or email
- Pending verification tab (Superadmin only) with bulk delete

### 🧑‍💼 Employee & Admin Management
- Superadmin can create, edit, and delete admin accounts
- Admin can create, edit, and delete employee accounts
- "Direct add" permission toggle — UI updates instantly without page refresh

### 🤖 AI Chatbot *(in progress)*
- Real-time streaming responses via **Socket.io**
- See [AI Chatbot](#-ai-chatbot) section for implementation details

### ⚙️ Global Settings
- Superadmin can toggle public email verification on/off from a dedicated Settings page
- Floating WhatsApp button for instant academy contact

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server, MVC-inspired architecture |
| **MongoDB + Mongoose** | Database with ObjectId references and TTL indexes |
| **JWT** | Authentication stored in `localStorage`; role-based route protection |
| **Nodemailer** | Email sending via Brevo / Gmail SMTP |
| **Socket.io** | Real-time bidirectional streaming for the AI chatbot |

### Frontend
| Technology | Purpose |
|---|---|
| **React.js + Vite** | Fast SPA build with code splitting |
| **React Router v7** | Protected routing with `adminOnly` / `superAdminOnly` guards |
| **Bootstrap 5 (RTL)** | Responsive UI with Arabic RTL support and glassmorphism cards |
| **Axios** | HTTP client with JWT Bearer token interceptor |
| **React Context API** | Global auth state (`AuthContext`) with `useState` and `useEffect` |

---

## 🗄 Database Schema

All relationships use `ObjectId` references. Indexes are applied to frequently queried fields.

```
Users
├── name          String
├── username      String (unique, indexed)
├── password      String (bcrypt hashed)
├── role          Enum: superadmin | admin | employee
└── directAdd     Boolean

Submissions
├── name          String
├── phone         String
├── email         String (indexed)
├── status        Enum: pending | approved | rejected
├── createdBy     ObjectId → Users (indexed)
└── createdAt     Date

VerificationCodes
├── email         String
├── code          String (6-digit)
└── createdAt     Date (TTL index: expires after 5 minutes)

Settings
├── key           String (e.g. "publicVerification")
└── value         Mixed (e.g. true / false)
```

---

## 📁 Project Structure

```
educational-crm/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   │   ├── User.js
│   │   ├── Submission.js
│   │   ├── VerificationCode.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── submissions.js
│   │   ├── employees.js
│   │   └── settings.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── mailer.js
│   ├── socket/
│   │   └── chatbot.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- A Brevo or Gmail SMTP(Simple Mail Transfer Protocol) account for email

### 1. Clone the repository
```bash
git clone https://github.com/your-username/educational-crm.git
cd educational-crm
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Server
PORT=5000
MONGO_URI=mongodb://localhost:27017/educational-crm
JWT_SECRET=your_jwt_secret_here

# Email (Brevo or Gmail SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 3. Install & run the backend
```bash
cd backend
npm install
npm run dev
```

### 4. Install & run the frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📖 API Documentation

The full API is documented in a Postman collection, organized into folders:

| Folder | Endpoints |
|---|---|
| **Auth** | `POST /api/auth/login`, `POST /api/auth/logout` |
| **Submissions** | `GET`, `POST`, `PUT`, `DELETE` `/api/submissions` |
| **Employees** | `GET`, `POST`, `PUT`, `DELETE` `/api/employees` |
| **Settings** | `GET`, `PUT` `/api/settings` |

> Import the `postman_collection.json` file (found in `/docs`) into Postman to explore all endpoints with example requests and responses.

---

## 🔐 User Roles

```
Superadmin
├── Manage admins
├── Manage all submissions (edit / delete)
├── View pending verification tab
├── Toggle global email verification (Settings)
└── Full system access

Admin
├── Manage employees (create / edit / delete)
├── Manage all submissions (edit / delete)
└── Grant "direct add" permission to employees

Employee
├── Register new student leads
└── Edit / delete own submissions only
```

---

## 🤖 AI Chatbot (Pending Idea)

The platform includes a real-time AI chatbot that streams responses to the frontend via **Socket.io**. Two implementation options are under evaluation:

### Option A — Custom Transformer (from scratch in C++)
A fully custom GPT-style Transformer with no external AI libraries:
- Multi-head self-attention with Pre-LayerNorm and GELU activations
- Tied input/output embeddings + sinusoidal positional encoding
- AdamW optimizer, gradient clipping, label smoothing, inverted dropout
- KV-cache for fast token-by-token inference; top-k sampling with configurable temperature
- Scale presets: Small (64-dim, 2 layers) → Medium (128-dim, 4 layers) → Large (256-dim, 6 layers)
- Integration: C++ binary called from a Node.js child process; streamed via Socket.io

### Option B — Third-Party LLM API (OpenAI / Gemini)
- Faster development, more robust language understanding out of the box
- Backend streaming method differs; frontend interface remains identical

> The final approach will be based on project timeline, resource availability, and the desired depth of technical demonstration. Both options will be fully documented in the final submission.

---

## 📅 Project Timeline

| Phase | Weeks | Focus |
|---|---|---|
| **Phase 1** | W1 | Pre-coding & Setup — schema design, repo |
| **Phase 2** | W2–3 | Backend auth — JWT roles, login/logout, email SMTP |
| **Phase 3** | W4–5 | Submissions CRUD, 2-step verification, employee management |
| **Phase 4** | W6–7 | AI chatbot decision, backend + Socket.io, frontend integration |
| **Phase 5** | W7–8 | React + Vite, AuthContext, Bootstrap 5 RTL UI, responsive design |
| **Phase 6** | W9 | Testing, Postman docs, GitHub cleanup, production deployment |

---

## 🤝 Contributing

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit with a descriptive message
git commit -m "feat: add bulk delete for pending submissions"

# Push and open a pull request
git push origin feature/your-feature-name
```

Branch strategy: `main` → `develop` → `feature/*`

---

