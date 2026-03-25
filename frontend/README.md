# PRITHVEDA – Smart Campus Operation Platform (Frontend MVP)

> **Note:** This repository currently contains the **Frontend** application tailored specifically for the Hackathon inspection. The Backend integration instructions will be added in subsequent phases.

PRITHVEDA is a modern, production-ready SaaS application designed to streamline and automate campus operations. It provides a robust role-based system for resource requests, conflict detection, and high-level analytics for campus administration. 

## 🌟 Key Features

The frontend is split into three distinct, secure role-based dashboards:

### 1. Junior Faculty Dashboard
- **Resource Requests:** Create new requests for Rooms, Equipment, or Staff using a strictly validated form (React Hook Form + Zod).
- **Request Tracking:** Monitor the status of pending, approved, or rejected requests in real-time via a responsive data table.
- **Overview Analytics:** Quick glance statistics on the total request lifecycle.

### 2. Senior Faculty Dashboard
- **Approval Queue:** A streamlined table interface to review, conditionally approve, or reject incoming junior faculty requests (with mandatory reasoning for rejections).
- **Conflict Management:** Automated AI-driven conflict highlighting (e.g., Double Bookings, Capacity limits exceeded) with severity levels.
- **Traffic Analytics:** Interactive Line Charts plotting the volume of campus operations requests over the week.

### 3. HOD (Head of Department) Dashboard
- **System Overview:** High-level metrics with Pie and Bar charts visualizing resource distribution and inter-departmental loads.
- **Resource Registry:** A comprehensive table to manage, add, and monitor the health and status of all facility resources.
- **Settings & Automation:** Toggle capabilities for WhatsApp alerts, Auto-Document generation, and Emergency protocol editing.
- **Audit Log:** Complete activity logging for system-wide transparency and tracking.

---

## 🧠 Tech Stack

We have chosen a highly scalable, modern ecosystem built around a strict, minimalistic **Black & White** design aesthetic (merging the reliability of a Government Portal with the modern feel of a SaaS):

- **Core:** React 18 (Vite) + JavaScript
- **Routing:** React Router v6 (Protected nested routes & Role-based redirection)
- **Styling:** Tailwind CSS v3 (Strict B&W theme, `rounded-2xl` cards, soft shadows)
- **State Management:** Redux Toolkit (Secure Session and User State)
- **Server State & Caching:** React Query (@tanstack/react-query)
- **API Communication:** Axios (with automated JWT interceptors)
- **Form Handling:** React Hook Form + Zod (Strict schema validation for inputs)
- **Animations:** Framer Motion (Page transitions, modal pop-ups, tap micro-interactions)
- **Data Visualization:** Recharts (Responsive Line, Bar, and Pie charts)
- **Icons & Alerts:** Lucide React & React Hot Toast

---

## 🚀 How to Run Locally (Hackathon Evaluators)

Follow these instructions to run the frontend application locally:

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16.x or v18+ recommended)
- npm (Node Package Manager)

### Installation & Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173` or `http://localhost:5174`).

---

## 🔐 Testing the Application (Mock Credentials)

Since the backend is mocked for this frontend-specific MVP demonstration, you can seamlessly test the three distinct dashboards by entering specific email addresses on the Login Page. 

> **Password Requirement:** Use any password with **at least 6 characters**.

| Role | Test Email | Redirection |
| :--- | :--- | :--- |
| **Junior Faculty** | `junior@test.com` | `/junior` |
| **Senior Faculty** | `senior@test.com` | `/senior` |
| **HOD / Admin** | `hod@test.com` | `/hod` |

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
│   ├── services/        # Axios interceptors and Mock API logic
│   ├── store/           # Redux Toolkit setup (store.js, authSlice.js)
│   ├── utils/           # Helper functions (Tailwind class merging via `cn`)
│   ├── App.jsx          # Protected routing logic and App root
│   └── main.jsx         # Redux, React-Query, and React DOM Root bindings
├── index.html
├── tailwind.config.js   # Custom Black & White theme palette
└── vite.config.js
```

---

*Designed and Built for the PRITHVEDA Hackathon Inspection.*
