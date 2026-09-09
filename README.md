<p align="center">
  <img src="client/public/favicon.svg" alt="Resolver logo" width="120" />
</p>

# Resolver

Resolver is a digital complaint and resolution portal built for a workplace or organization environment. It allows users to submit complaints, track their lifecycle, collaborate through upvotes and comments, and lets staff and administrators manage assignments, statuses, and user roles through role-based dashboards.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Overview

Resolver was developed as an internship project for Shnoor International with a goal of replacing fragmented complaint handling with a transparent issue tracking system.

The application follows a forum-style model where complaints are visible to the whole system, users can upvote issues they care about, staff can work on assigned complaints, and admins can manage users and overall workflow.

## What the app does

### User experience

- Register and log in with email and password
- Submit new complaints with optional attachments
- View all complaints, filter by status/category/search
- Upvote complaints and add comments
- Edit or delete their own submitted complaints while the complaint is still in the submitted state
- View profile settings and manage email notification preferences
- Request password reset through email

### Staff capabilities

- Access a dedicated staff dashboard
- View all complaints and filter lists
- Self-assign unassigned complaints
- Update complaint status and provide explanations when required
- See complaints assigned to them and manage their workload
- Receive notifications when complaints are assigned or updated

### Admin capabilities

- Access an admin dashboard with system-wide overview stats
- View and manage all complaints
- Reassign complaints to staff
- Override priority and manage assignments
- View registered users and change a user role between user, staff, and admin
- Manage system-level visibility and analytics

## Architecture

The project is split into two main parts:

### Frontend

- React 19
- Vite
- React Router DOM
- Tailwind CSS v4
- DaisyUI
- Client-side theme toggle and dashboard layouts

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT-based authentication using cookies
- bcrypt password hashing
- rate limiting and security middleware
- file upload handling with Multer
- Brevo email API for password resets and alerts

## Folder structure

```text
Resolver/
├── README.md
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AuthShowcase.jsx
│   │   │   ├── ComplaintDetailModal.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── FilterBar.jsx
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
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── vercel.json
│   └── vite.config.js
│
└── server/
    ├── src/
    │   ├── config/
    │   │   └── db.js
    │   ├── middleware/
    │   │   ├── authMiddleware.js
    │   │   ├── rateLimiter.js
    │   │   └── uploadMiddleware.js
    │   ├── models/
    │   │   ├── Comment.js
    │   │   ├── Complaint.js
    │   │   ├── Notification.js
    │   │   └── User.js
    │   ├── routers/
    │   │   ├── auth.router.js
    │   │   ├── comment.router.js
    │   │   ├── complaint.router.js
    │   │   ├── notification.router.js
    │   │   ├── public.router.js
    │   │   └── user.router.js
    │   ├── services/
    │   │   ├── emailService.js
    │   │   └── notificationService.js
    │   └──
    ├── index.js
    ├── package.json
    ├── package-lock.json
    └──
```

## Core data models

### User

Users contain:

- name
- email
- password
- role: user, staff, or admin
- tokenVersion for session invalidation
- emailNotifications preference
- resetToken and resetTokenExpiry for password recovery

### Complaint

Complaints include:

- title
- description
- category
- location
- priority
- createdBy
- assignedTo
- status
- statusHistory
- upvotes
- attachment
- timestamps

### Comment

Comments are linked to a complaint and a user and contain text plus timestamps.

### Notification

Notifications are created for assignment events, status changes, and other alerts. They are stored per user and can be marked as read.

## Main workflows

### Complaint lifecycle

1. User submits a complaint with optional attachment
2. Complaint starts in SUBMITTED state
3. Staff can self-assign or admin can assign a staff member
4. Staff updates complaint status through the complaint modal
5. Status changes are logged in statusHistory with an explanation
6. Notifications are sent to the complaint creator and assigned staff
7. Resolved and rejected complaints are locked from further modification

### Role logic

- Users can create, view, upvote, comment on, and edit their own submitted complaints
- Staff can interact with complaints assigned to them and can self-assign unassigned complaints
- Admins can manage system-wide data, user roles, and complaint assignment

## Environment variables

### Server

Create a `.env` file inside `server/`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/resolver
JWT_SECRET=your_jwt_secret_here
CLIENT_ORIGIN=http://localhost:5173
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender@example.com
NODE_ENV=development
```

### Client

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:3000
```

## Local setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Resolver
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Start the backend

```bash
cd ../server
npm run dev
```

### 5. Start the frontend

Open a second terminal and run:

```bash
cd client
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Useful routes and endpoints

### Public routes

- GET `/api/public/stats`
- GET `/api/public/health`

### Authentication routes

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`

### Complaint routes

- GET `/api/complaints`
- GET `/api/complaints/:id`
- POST `/api/complaints`
- PUT `/api/complaints/:id`
- DELETE `/api/complaints/:id`
- POST `/api/complaints/:id/upvote`
- GET `/api/complaints/:id/attachment`

### Comment routes

- GET `/api/comments/:complaintid`
- POST `/api/comments`

### User routes

- GET `/api/users`
- GET `/api/users/me`
- PUT `/api/users/me`
- PUT `/api/users/me/notifications`
- GET `/api/users/:id`
- PUT `/api/users/:id` (admin only)

### Notification routes

- GET `/api/notifications`
- PUT `/api/notifications/:id/read`
- PUT `/api/notifications/mark-all-read`

## Frontend pages

- Landing page with operational health status and public stats
- Login page
- Register page
- Forgot password page
- Reset password page
- Dashboard page that routes to role-specific dashboards
- Profile page for name, password, and notification settings
- NotFound page

## Deployment notes

The app is structured to be deployed with:

- Frontend: Vercel or similar static hosting
- Backend: Render, Railway, or any Node.js hosting platform
- Database: MongoDB Atlas

Important deployment considerations:

- Update `CLIENT_ORIGIN` in the server environment to match the live frontend URL
- Set `VITE_API_URL` on the frontend to the deployed backend URL
- Ensure the backend allows the frontend origin in CORS configuration
- Configure Brevo API credentials for email delivery in production

## Notes

- The backend uses cookie-based JWT authentication
- The server applies request rate limiting for both general API traffic and authentication traffic
- Attachment uploads are limited to images and PDFs, with a maximum size of 5 MB
- The app uses a single Express entry file and modular routers/services for maintainability

## Credits

- Built as part of the Shnoor International internship project
- Frontend styling and components are powered by Tailwind CSS and DaisyUI
- Email delivery is handled through Brevo

```
