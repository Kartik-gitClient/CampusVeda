# PRITHVEDA – Smart Campus Operation Platform (Backend API)

> **Backend:** Node.js REST API powering the PRITHVEDA platform with role-based access, intelligent conflict detection, and approval workflows.

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18.x LTS |
| Framework | Express.js 4.x |
| Database | MongoDB 5.x+ |
| ODM | Mongoose 7.x |
| Auth | JWT (jsonwebtoken) |
| Security | bcryptjs, helmet, cors |
| Validation | express-validator |
| Logging | morgan |
| Dev Tools | nodemon, dotenv |

---

## 🚀 How to Run

### Prerequisites
- [Node.js 18.x LTS](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or a MongoDB Atlas URI)

### Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The server starts on **`http://localhost:5000`**.

### Configuration (`.env`)

Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/prithveda
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
```

---

## 🚧 Status & Pending Tasks
**Completed**:
- Complete REST APIs for Auth, Requests, Resources, Settings, Notifications, Audit, Conflicts, and Approvals.
- Integration with MongoDB.
- Conflict detection algorithmic checks.

**Pending Actions (To-Do)**:
- Create `services/aiService.js` holding **Llama 3.3 70B** logic.
- Implement AI prompt handlers for `suggestConflictResolution` and `generateResourceDocument`.
- Append AI suggestion strings to the `/api/conflicts` return payloads.

---

## 📡 API Endpoints Reference

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login & get JWT token |
| GET | `/me` | Protected | Get current user |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | HOD | Get all users |
| PATCH | `/:id` | Self / HOD | Update user profile |
| DELETE | `/:id` | HOD | Deactivate user |

### Requests (`/api/requests`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | All | Create a new request |
| GET | `/` | Role-filtered | List requests |
| GET | `/:id` | All | Get single request |
| PATCH | `/:id` | Owner | Update draft request |
| POST | `/:id/escalate` | All | Escalate request to HOD |

### Conflicts (`/api/conflicts`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Senior / HOD | List active conflicts |
| PATCH | `/:id/resolve` | Senior / HOD | Resolve a conflict |

### Approvals (`/api/approvals`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/:requestId` | Senior / HOD | Approve / Reject / Conditional |
| GET | `/:requestId` | All | Get approval history |

### Resources (`/api/resources`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | All | List resources |
| POST | `/` | HOD | Create resource |
| GET | `/:id` | All | Get single resource |
| PATCH | `/:id` | HOD | Update resource |
| DELETE | `/:id` | HOD | Deactivate resource |

### Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Self | Get my notifications |
| PATCH | `/:id/read` | Self | Mark as read |

### Analytics (`/api/analytics`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/overview` | Senior / HOD | System overview stats |
| GET | `/requests-trend` | Senior / HOD | Requests per day (7 days) |
| GET | `/conflicts` | Senior / HOD | Conflict frequency by severity/type |
| GET | `/department-usage` | Senior / HOD | Requests broken down by department |

### Audit Logs (`/api/auditlogs`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | HOD | Get immutable system audit trail |

### Settings (`/api/settings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | HOD | Get current settings |
| PATCH | `/` | HOD | Update system settings |

---

## 📁 Folder Architecture

```text
backend/
├── config/          # MongoDB connection
├── models/          # Mongoose schemas (User, Request, Conflict, Approval, Resource, Notification, AuditLog, Settings)
├── controllers/     # Route handlers delegating to services
├── services/        # Core business logic (requestService, conflictService, approvalService, etc.)
├── routes/          # Express routers per module
├── middleware/      # authMiddleware (JWT verify), roleMiddleware (authorize)
├── validators/      # express-validator chains
├── utils/           # ErrorResponse class
├── .env
└── server.js        # App entry point
```

---

*PRITHVEDA Backend – Built for Hackathon Inspection.*
