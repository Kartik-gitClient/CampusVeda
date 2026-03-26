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

| Role | Dashboard | Capabilities |
|---|---|---|
| Junior Faculty | `/junior` | Create requests, track status |
| Senior Faculty | `/senior` | Approve/reject, resolve conflicts, analytics |
| HOD / Admin | `/hod` | Full system control, audit, settings, resource mgmt |

---

## 🎯 Implementation Status (36-Hour Sprint)

### ✅ Completed Features
- **User Authentication & Roles**: JWT-based login/signup with role-based dashboard redirection.
- **Resource Management**: Core CRUD for facilities and equipment (HOD Dashboard).
- **Request Management**: Junior faculty request submission, status tracking.
- **Conflict Detection**: Backend interceptors for double-booking and capacity overloads.
- **Approval Workflow**: Senior faculty escalation queues with automated availability syncing.
- **Audit Trails & Notifications**: System-wide logging of all approval status changes.

### 🚧 Pending/Left to Do
1. **AI Integration (Llama 3.3)**: 
   - Backend `aiService.js` missing. 
   - Need to implement UI for AI conflict resolution suggestions and automated Resource Document generation.
2. **Export Functionality**: PDF generation and Email dispatch for AI-generated resource documents.
3. **Dedicated Views**:
   - `Department Calendar` view for Junior Dashboard.
   - Dedicated Public-facing `/rooms` view showing current availability and next free times.
4. **Final Integration Polish**: Link all frontend React Query hooks rigorously to the live MongoDB backend routes.

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

*Built for the PRITHVEDA Smart Campus Hackathon — 2026.*
