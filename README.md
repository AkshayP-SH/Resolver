<div align="center">
  <img src="client/public/favicon.svg" alt="Resolver Logo" width="120" />
  <h1>Resolver</h1>
  <p><strong>Digital Complaint Management Platform</strong></p>
  <p>
    <img alt="Status" src="https://img.shields.io/badge/Status-Production%20Ready-4CAF50?style=for-the-badge" />
    <img alt="Frontend" src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
    <img alt="Client Build" src="https://img.shields.io/badge/Client-Build%20with%20Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img alt="Backend" src="https://img.shields.io/badge/Backend-Express%205-000000?style=for-the-badge&logo=express&logoColor=white" />
    <img alt="Database" src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img alt="Auth" src="https://img.shields.io/badge/Auth-JWT%20%2B%20Google-111827?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
    <img alt="UI" src="https://img.shields.io/badge/UI-Tailwind%20%2B%20DaisyUI-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img alt="Notifications" src="https://img.shields.io/badge/Notifications-Brevo%20Email-3A7BD5?style=for-the-badge&logo=maildotru&logoColor=white" />
  </p>
</div>

Resolver is a full-stack complaint and issue tracking application built for organizations that need a simple yet powerful way to receive, triage, assign, track, and resolve user-reported issues. The platform is designed around three user roles: <strong>Users</strong>, <strong>Staff</strong>, and <strong>Admins</strong>, each with tailored access and workflows.

The project currently includes a React frontend, an Express + MongoDB backend, a role-based dashboard system, Google sign-in support, password reset flows, email notifications, complaint attachments, and public health/statistics endpoints.

<h2><img src="client/public/readme/features-icon.svg" alt="Features Icon" width="18" style="vertical-align: middle; margin-right: 8px;" /> Built With</h2>

- React 19 + Vite for the client experience
- Express 5 + Node.js for the API layer
- MongoDB with Mongoose for persistence
- JWT authentication with cookie-based session handling
- Google OAuth for social sign-in
- Brevo integration for transactional email notifications
- Tailwind CSS + DaisyUI for the presentation layer
- Multer for complaint attachments and file uploads

---

## Overview

Resolver is designed to help teams manage complaints efficiently from submission to resolution. It supports:

- Complaint creation with optional attachments
- Complaint prioritization and status updates
- Staff self-assignment and assignment workflows
- Admin user management
- Public stats and health monitoring
- Notifications and email alerts
- Theme support and modern UI
- Secure authentication with JWT, cookies, and Google OAuth

---

## Key Features

### User Features
- Register and sign in with email/password
- Sign in with Google account
- Create complaints with title, description, category, location, and priority
- Upload attachments (images and PDFs up to 5MB)
- View all complaints or only their own complaints
- Upvote complaints
- Comment on complaints through the complaint detail workflow
- Receive notifications and email updates when complaint statuses change
- Manage profile, change password, and toggle email notifications
- Access password reset flow via email

### Staff Features
- View all complaints in the system
- See assigned complaints separately
- Self-assign complaints to themselves
- Update status of complaints assigned to them
- Update complaint progress and resolution state
- Receive notifications when assigned or when complaint status changes
- Use filtering, pagination, and search to manage workload

### Admin Features
- View all complaints and user data
- Manage user roles
- Assign complaints to staff members
- Oversee system-wide complaint flow
- Delete complaints fully
- Monitor and support platform activity through dashboards

### Platform Features
- Protected routes and role-aware authorization
- Rate limiting for API usage
- CORS and security middleware
- Health and stats endpoints for monitoring
- Email integration using Brevo
- MongoDB persistence with Mongoose schemas
- Responsive UI for desktop and mobile

---

<h2><img src="client/public/readme/roles-icon.svg" alt="Roles Icon" width="18" style="vertical-align: middle; margin-right: 8px;" /> Role-Based Access</h2>

| Role | What they can do |
| --- | --- |
| User | Register/login, file complaints, upload attachments, view complaints, upvote, manage profile, delete own submitted/rejected complaints |
| Staff | View all complaints, self-assign, update assigned complaints, change statuses, receive notifications |
| Admin | Full access to complaint lifecycle, user management, role updates, global oversight, deletion of complaints |

### Role Rules Implemented in the Backend
- `protect` verifies JWT tokens from `Authorization` header or `token` cookie
- `adminOnly` restricts admin-only endpoints
- Staff can only update complaints assigned to them or self-assign
- Users can only update their own complaints
- Staff cannot delete complaints
- Users can only delete their own complaints while they are still `SUBMITTED` or `REJECTED`

---

<h2><img src="client/public/readme/architecture-icon.svg" alt="Architecture Icon" width="18" style="vertical-align: middle; margin-right: 8px;" /> System Architecture</h2>

### Frontend
The client side is built with:

- React 19
- Vite
- React Router
- Tailwind CSS
- DaisyUI
- Lightweight API wrapper for authenticated requests

### Backend
The server side is built with:

- Express 5
- MongoDB via Mongoose
- JWT-based authentication
- Cookie-based session support
- Multer for attachments
- Helmet, CORS, and rate limiting
- Brevo email integration
- Google OAuth via `google-auth-library`

### Database Models
The backend currently uses these primary models:

- `User` — authentication, profile, role, tokens, notification preferences
- `Complaint` — complaints, status history, attachments, assignment, upvotes
- `Comment` — complaint discussion/threading
- `Notification` — in-app notifications

---

## Folder Structure

```text
Resolver/
├── README.md
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AuthShowcase.jsx
│   │   │   ├── ComplaintDetailModal.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── GoogleButton.jsx
│   │   │   ├── GuestRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── NewComplaintForm.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusChangeModal.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── UserDetailModal.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── dashboards/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── StaffDashboard.jsx
│   │   │       └── UserDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── toast.js
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vercel.json
│   └── vite.config.js
│
├── server/
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── rateLimiter.js
│       │   └── uploadMiddleware.js
│       ├── models/
│       │   ├── Comment.js
│       │   ├── Complaint.js
│       │   ├── Notification.js
│       │   └── User.js
│       ├── routers/
│       │   ├── auth.router.js
│       │   ├── comment.router.js
│       │   ├── complaint.router.js
│       │   ├── notification.router.js
│       │   ├── public.router.js
│       │   └── user.router.js
│       └── services/
│           ├── emailService.js
│           └── notificationService.js
└── .git/
```

---

## How the App Works

### Authentication Flow
- Users can register normally or use Google Sign-In
- A JWT is created and returned after successful login
- The token is stored in a cookie and also returned to the client for API authorization
- `protect` middleware checks the token on protected routes
- Logout invalidates the current token by incrementing `tokenVersion`

### Complaint Lifecycle
1. A user creates a complaint with optional attachment
2. Complaint is stored in MongoDB with initial status `SUBMITTED`
3. Admins or staff can assign complaints
4. Staff can update the complaint status as progress happens
5. Notifications are generated when assigned or status changes
6. Email notifications are sent when the user has email notifications enabled
7. Complaint can be viewed, commented on, upvoted, and resolved/rejected

### Public Endpoints
- `/api/public/health` returns server and database connectivity info
- `/api/public/stats` returns resolved complaint count and average resolution time

---

## Environment Variables

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Server (`server/.env`)
```env
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
NODE_ENV=development
```

> Note: In production, `CLIENT_ORIGIN` should point to your deployed frontend domain.

---

<h2><img src="client/public/readme/setup-icon.svg" alt="Setup Icon" width="18" style="vertical-align: middle; margin-right: 8px;" /> Local Setup</h2>

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Resolver.git
cd Resolver
```

### 2. Install dependencies
```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure environment variables
Create `.env` files in both `client` and `server` as shown above.

### 4. Start the backend
```bash
cd server
npm run dev
```

### 5. Start the frontend
```bash
cd client
npm run dev
```

### 6. Open the app
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

---

## Production Deployment

### Vercel + Render
- Deploy the React frontend to Vercel
- Deploy the Express backend to Render
- Host MongoDB on MongoDB Atlas
- Configure the deployed frontend URL in `CLIENT_ORIGIN`
- Set `VITE_API_URL` on the frontend to the deployed backend URL

### Production Checklist
- Set `NODE_ENV=production`
- Configure a strong `JWT_SECRET`
- Add correct `CLIENT_ORIGIN`
- Add valid `BREVO_API_KEY` and `BREVO_SENDER_EMAIL`
- Configure `GOOGLE_CLIENT_ID`
- Ensure CORS allows the live frontend domain
- Make sure MongoDB Atlas allows connections from your deployed backend server

---

## API Notes

### Protected Routes
Routes under:

- `/api/complaints`
- `/api/comments`
- `/api/users`
- `/api/notifications`

require authentication through the `protect` middleware.

### Public Routes
These routes do not require authentication:

- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/google`
- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/auth/logout`
- `/api/public/health`
- `/api/public/stats`

---

## Project Highlights

### UI / UX
The app uses a clean, modern dashboard layout with:

- Sidebar navigation per role
- Notification bell
- Theme toggle
- Protected route handling
- Error boundary for app-level resilience
- Responsive table views and filtering

### Security
Implemented protections include:

- JWT verification
- Token version invalidation on logout/password changes
- Role-based route restrictions
- Rate limiting
- Helmet for HTTP headers
- Input validation through schemas and route checks
- File size/type validation for uploads

### Notifications & Emails
The platform supports:

- In-app notifications stored in MongoDB
- Email delivery via Brevo for password resets and complaint notifications
- Notification preferences per user

---

## Sample User Workflows

### User Workflow
1. Sign up or sign in
2. File complaint with details and optional attachment
3. Track complaint status from dashboard
4. Upvote or comment on issues
5. Receive updates when staff change status or assign the complaint

### Staff Workflow
1. Sign in as staff
2. View all complaints
3. Self-assign complaints from the dashboard
4. Update statuses like `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, or `REJECTED`
5. Respond to assigned tickets with visibility into complaint history

### Admin Workflow
1. Sign in as admin
2. Manage users and roles
3. Assign complaints to staff
4. Review all complaints and resolve escalations
5. Delete inappropriate or duplicate complaints

---

## Credits

- Built as part of the Shnoor International internship project
- Frontend styling and components are powered by Tailwind CSS and DaisyUI
- Email delivery is handled through Brevo

