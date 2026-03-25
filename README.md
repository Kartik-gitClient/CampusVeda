# 🏛️ PRITHVEDA – Smart Campus Operation Platform (SCOP)

> A production-ready, role-based Smart Campus Operation Platform for managing resource requests, approvals, conflict detection, and analytics across academic departments.

---

## 📁 Project Structure

```
campusVeda/
├── frontend/          # React 18 + Vite + Tailwind CSS (SaaS Dashboard UI)
└── backend/           # Node.js + Express + MongoDB (REST API)
```

---

## 🧠 Tech Stack Overview

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| React Router v6 | Client-side routing |
| Tailwind CSS v3 | Styling (strict B&W theme) |
| Redux Toolkit | Global auth/session state |
| React Query | Server state & caching |
| Axios | HTTP client with JWT interceptors |
| React Hook Form + Zod | Form validation |
| Framer Motion | Animations & transitions |
| Recharts | Analytics charts |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Tech | Purpose |
|---|---|
| Node.js 18 LTS | Runtime |
| Express.js 4.x | REST API framework |
| MongoDB + Mongoose | Database & ODM |
| JWT + bcryptjs | Auth & password hashing |
| express-validator | Input validation |
| Helmet, CORS, Morgan | Security & logging |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18.x LTS
- MongoDB running locally (or Atlas URI)

### 1. Start Backend

```bash
cd backend
npm install
# Copy and configure environment variables
cp .env.example .env
npm run dev
# → http://localhost:5000
```

### 2. Start Frontend

```bash
cd frontend
npm install
# Copy and configure environment variables
cp .env.example .env
npm run dev
# → http://localhost:5173
```

---

## 🔐 Role-Based Access

| Role | Email (Demo) | Dashboard |
|---|---|---|
| Junior Faculty | `junior@test.com` | `/junior` – Create requests, track status |
| Senior Faculty | `senior@test.com` | `/senior` – Approve/reject, conflicts, analytics |
| HOD / Admin | `hod@test.com` | `/hod` – Full system control, audit, settings |

> **Password:** Any 6+ character string for demo mode.  
> The login page **automatically tries the real backend first**, and falls back to a local demo session if the backend is offline.

---

## 📡 API Summary

| Module | Base Path | Access |
|---|---|---|
| Auth | `/api/auth` | Public |
| Users | `/api/users` | Protected |
| Requests | `/api/requests` | Role-filtered |
| Conflicts | `/api/conflicts` | Senior / HOD |
| Approvals | `/api/approvals` | Senior / HOD |
| Resources | `/api/resources` | All / HOD |
| Notifications | `/api/notifications` | Self |
| Audit Logs | `/api/auditlogs` | HOD only |
| Analytics | `/api/analytics` | Senior / HOD |
| Settings | `/api/settings` | HOD only |

Full API docs: [`backend/README.md`](./backend/README.md)

---

## 🎯 Key Features

- ✅ Role-based dashboards (Junior → Senior → HOD escalation chain)
- ✅ Full request lifecycle: `draft → submitted → checking → approved/rejected → escalated → resolved`
- ✅ Intelligent conflict detection (double-booking, overlapping resources)
- ✅ Approval workflow with mandatory rejection reasons
- ✅ System-wide Audit Trail (immutable logs)
- ✅ MongoDB aggregation-powered analytics
- ✅ JWT authentication with secure localStorage hydration
- ✅ Black & White minimalistic SaaS design system

---

*Built for the PRITHVEDA Smart Campus Hackathon — 2026.*
