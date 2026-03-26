# PRITHVEDA – Smart Campus Operation Platform (Frontend)

PRITHVEDA is a modern, production-ready SaaS application designed to streamline and automate campus operations. It provides a robust role-based system for resource requests, conflict detection, and high-level analytics for campus administration. 

## 🌟 Key Features

The frontend is split into three distinct, secure role-based dashboards connected to the Node.js/MongoDB backend:

### 1. Junior Faculty Dashboard
- **Resource Requests:** Create new requests for Rooms, Equipment, or Staff using a strictly validated form (React Hook Form + Zod).
- **Request Tracking:** Monitor the status of pending, approved, or rejected requests in real-time.
- **Overview Analytics:** Quick glance statistics on the total request lifecycle.

### 2. Senior Faculty Dashboard
- **Approval Queue:** A streamlined table interface to review, conditionally approve, or reject incoming junior faculty requests.
- **Conflict Management:** Automated AI-driven conflict highlighting (e.g., Double Bookings, Capacity limits exceeded).
- **Traffic Analytics:** Interactive Line Charts plotting the volume of campus operations requests.

### 3. HOD (Head of Department) Dashboard
- **System Overview:** High-level metrics visualizing resource distribution and inter-departmental loads.
- **Resource Registry:** Manage, add, and monitor the health and status of all facility resources.
- **Settings & Automation:** Toggle capabilities for alerts, auto-documentation, and emergency protocols.
- **Audit Log:** Complete activity logging for system-wide transparency and tracking.

---

## 🚧 Status & Pending Tasks
**Completed**:
- Complete Layouts and Dashboards structure.
- Redux session state and JWT hydration.
- Form components for submission and HOD tables.

**Pending Actions (To-Do)**:
- **AI Integration UI**: Add `[Generate Document]` button in Junior Request form. Add `AI Suggestion` indicators in Senior Conflict Modals.
- **PDF/Email Export**: Add buttons to convert AI generated documents to PDF and email them.
- **Calendar View**: Build a full `Department Calendar` view inside the Junior Dashboard.
- **Standalone Rooms View**: Create a public `/rooms` route displaying a visual card registry of all availability statuses independent of dashboards.

---

## 🧠 Tech Stack

We have chosen a highly scalable, modern ecosystem built around a strict, minimalistic **Black & White** design aesthetic:

- **Core:** React 18 (Vite) + JavaScript
- **Routing:** React Router v6 (Protected nested routes & Role-based redirection)
- **Styling:** Tailwind CSS v3 (Strict B&W theme)
- **State Management:** Redux Toolkit (Secure Session and User State)
- **Server State & Caching:** React Query (@tanstack/react-query)
- **API Communication:** Axios (with automated JWT interceptors)
- **Form Handling:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Icons & Alerts:** Lucide React & React Hot Toast

---

## 🚀 How to Run Locally

### Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy `.env.example` to `.env` pointing to the backend API.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

---

## 📁 Folder Architecture

```text
frontend/
├── src/
│   ├── components/      # Reusable UI elements (Buttons, Inputs, Cards, Modals, Tables)
│   │   ├── Junior/      # Junior Dashboard specific feature widgets
│   │   ├── Senior/      # Senior Dashboard specific feature widgets
│   │   └── HOD/         # HOD Dashboard specific feature widgets
│   ├── layouts/         # Base frames (Sidebar, TopNav, MainLayout)
│   ├── pages/           # High-level route views (Login, JuniorDash, SeniorDash, HODDash)
│   ├── services/        # Axios API fetchers mapping to Backend
│   ├── store/           # Redux Toolkit setup (store.js, authSlice.js)
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Protected routing logic and App root
│   └── main.jsx         # Redux, React-Query, and React DOM Root bindings
├── index.html
├── tailwind.config.js   # Custom Black & White theme palette
└── vite.config.js
```

---

*Designed and Built for the PRITHVEDA Hackathon Inspection.*
