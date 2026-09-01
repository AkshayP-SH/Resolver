Here is the complete, professional, and slightly fancy README.md for your GitHub repository. 

To use this:
1. Create a `README.md` file in the root of your `resolver/` folder.
2. Copy and paste the markdown below.
3. Create a folder in your project root called `docs/screenshots/` and drop your images there to match the paths!

***

```markdown
<div align="center">

# 📋 Resolver
### Digital Complaint & Resolution Portal

*A streamlined, forum-style issue tracking platform connecting users, support staff, and administrators.*

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Local Setup](#-local-setup) • [Screenshots](#-screenshots)

</div>

---

## 🏢 About The Project

**Resolver** was developed during my internship at **Shnoor International** to solve the common problem of fragmented issue reporting. Traditional helpdesks often feel like "black holes" where users submit tickets and lose visibility into the resolution process. 

Resolver introduces a transparent, GitHub Issues-inspired forum model. All complaints are visible system-wide, allowing users to collaborate, upvote common issues, and track exact status histories with staff explanations. It features strict Role-Based Access Control (RBAC) ensuring Users, Staff, and Admins have precisely the tools they need—nothing more, nothing less.

## ✨ Features

### 👤 For Users (Citizens / Employees)
* **Transparent Tracking:** View all system complaints and track the exact lifecycle of any issue.
* **Collaboration:** Upvote ("Me Too") existing complaints to signal priority to administrators.
* **Audit Trail:** View the complete Status History timeline, reading the exact explanations staff provided when moving a ticket to *In Progress* or *Resolved*.
* **Ownership:** Edit or delete self-filed complaints (only while in the `SUBMITTED` state).

### 🛠️ For Staff (Support Team)
* **Self-Assignment:** Browse the unassigned queue and claim tickets with a single click.
* **Mandatory Accountability:** Changing a ticket's status to *In Progress*, *Resolved*, or *Rejected* triggers a mandatory explanation modal, ensuring transparent communication.
* **Workload Management:** Dedicated dashboard views for "Assigned to Me" vs. "All Complaints".

### 🛡️ For Admins (System Managers)
* **Global Overrides:** Reassign tickets to specific staff members, override priorities, and lock/unlock closed tickets.
* **User Management:** View all registered users and promote/demote roles between User, Staff, and Admin.
* **System Analytics:** High-level overview of pending, in-progress, and unassigned system load.

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Tailwind CSS v4, DaisyUI v5 (Custom Linear/Railway-inspired minimalism) |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Security** | JSON Web Tokens (JWT), bcryptjs password hashing, CORS |

---

<!-- ## 📸 Screenshots

<div align="center">
  <p><strong>Landing Page & Public Interface</strong></p>
  <img src="./docs/screenshots/landing.png" alt="Landing Page" width="800"/>
  
  <br/><br/>
  
  <p><strong>Admin Dashboard & User Management</strong></p>
  <img src="./docs/screenshots/admin-dashboard.png" alt="Admin Dashboard" width="800"/>
  
  <br/><br/>
  
  <p><strong>Complaint Detail & Status Timeline</strong></p>
  <img src="./docs/screenshots/modal-timeline.png" alt="Detail Modal" width="800"/>
</div>

--- -->

## 🚀 Local Setup

To run this project locally, you will need [Node.js](https://nodejs.org/) and a MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/resolver.git
cd resolver
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:3000
```
Start the Vite development server:
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## ☁️ Deployment

This project is architected for easy deployment to modern cloud providers:
* **Frontend:** Vercel
* **Backend:** Render(Node.js environment).
* **Database:** MongoDB Atlas (Free M0 Tier).

*(Note: Ensure `VITE_API_URL` is updated in Vercel/Netlify environment variables to point to your live backend URL, and update CORS settings in `server/index.js` to accept your live frontend domain).*

---

<!-- ## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```text
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

--- -->

## 🤝 Acknowledgements

* Developed as part of the **Shnoor International** Internship Program.
* UI Components powered by [DaisyUI](https://daisyui.com/).
* Icons and Emojis provided by [Heroicons](https://heroicons.com/) and native OS sets.
```