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

## 🚀 Running Locally

### Prerequisites
- Node.js 18.x LTS
- MongoDB Atlas (Update `MONGO_URI` in `.env`)
- (Optional) Groq/Llama API Key for AI features

### 1. Start Backend
```bash
cd backend
npm install
# Configure environment variables (MONGO_URI, JWT_SECRET, GROQ_API_KEY)
cp .env.example .env 
npm run dev
# → http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔐 Role-Based Access

| Role | Dashboard | Capabilities |
|---|---|---|
| Junior Faculty | `/junior` | Create requests, AI Document Gen, Building Map |
| Senior Faculty | `/senior` | Approve/reject, resolve conflicts, AI suggestions |
| HOD / Admin | `/hod` | Premise Setup, Resource Sync, AI Chatbot, Audit |

---

## 🎯 Implementation Status

### ✅ Completed Features
- **Dynamic Premise Management**: HODs define building layouts; system auto-syncs resources.
- **Building Map**: Real-time visualization of room availability with quick enquiry links.
- **AI Chatbot (Llama 3.3)**: Global context-aware assistant with smart fallback engine.
- **AI Document Generation**: Automated, formal resource request PDFs and email dispatch.
- **Conflict detection**: High-precision detection using Resource IDs and overlapping time windows.
- **Audit Trails**: Complete logging of all administrative actions.

---

## 📡 API Summary

| Module | Base Path | Access |
|---|---|---|
| Auth | `/api/auth` | Public |
| AI Chat | `/api/ai` | Protected |
| Requests | `/api/requests` | Role-filtered |
| Conflicts | `/api/conflicts` | Senior / HOD |
| Premise | `/api/premise` | HOD only |
| Resources | `/api/resources` | All / HOD |
| Analytics | `/api/analytics` | Senior / HOD |

---

*Built for the PRITHVEDA Smart Campus Hackathon — 2026. Updated with premium AI and Mapping features.*
