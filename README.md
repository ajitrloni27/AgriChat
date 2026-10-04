# 🌾 AgriChat – Modern Farmer Community & Agricultural Knowledge Platform

[![MERN Stack](https://img.shields.io/badge/MERN-Fullstack-success?style=for-the-badge&logo=react)](https://github.com/ajitrloni27/AgriChat)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20ಕನ್ನಡ-FF9933?style=for-the-badge)](https://github.com/ajitrloni27/AgriChat)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](https://opensource.org/licenses/ISC)

> **AgriChat** is a production-grade, bilingual (English & Kannada) full-stack MERN platform built to empower farming communities. It connects rural farmers, agronomy scientists, and agricultural administrators for real-time crop disease diagnosis, Mandi commodity pricing, weather forecasts, government scheme alerts, and peer-to-peer knowledge sharing.

---

## 📸 Platform Highlights & Features

### 1. 🌾 Intelligent Agricultural Feed & Discussion
- **Multi-Category Filters:** Crops, Pest Control, Weather Advisories, Market Prices, Government Schemes, Machinery, and General discussions.
- **Crop Tags & Location Tracking:** Filter feed by specific crops (Cotton, Paddy, Arecanut, Maize, Sugarcane, etc.) and Karnataka districts (Haveri, Dharwad, Belagavi, Mandya, etc.).
- **Live Mandi Rates & Regional Weather:** Real-time commodity price widgets and regional rainfall/weather forecast advisories.

### 2. 🌐 Native Bilingual Support (English & ಕನ್ನಡ)
- Instant, zero-reload language switching powered by a centralized client-side translation engine.
- Complete localization for all buttons, badges, forms, empty states, and system notifications.

### 3. ❤️ Social Interactions & Engagement
- **Optimistic Heart Likes:** Instant visual micro-animation with local state updates.
- **Interactive Comments Drawer:** Inline conversation threads with role tags (`🌾 Farmer`, `🎓 Expert`, `🛡️ Admin`).
- **One-Click Share:** Fast clipboard link copy helper for WhatsApp and farmer communities.

### 4. 🛡️ Comprehensive Admin Control Center
- **KPI Metrics Dashboard:** Parallel database aggregation for total farmers, experts, posts, comments, announcements, and suspended accounts.
- **User Moderation Table:** Fast role changer (`farmer` ⇄ `expert` ⇄ `admin`), account suspension toggle (`isBlocked`), and account deletion.
- **Content Moderation Queue:** Review all community posts with instant Pin/Unpin actions and cascade comment deletion.
- **Broadcast Announcements:** Compose and broadcast state-wide pinned notices with image attachments.

### 5. 🔐 Enterprise-Grade Security & Authentication
- **Stateless JWT Authentication:** Secure token signing with configurable expiration and automatic Axios request interceptors.
- **Bcrypt Password Hashing:** 10 salt rounds with pre-save Mongoose lifecycle hooks.
- **CSPRNG Password Reset Workflow:** Cryptographically secure 20-byte random tokens with one-way SHA-256 database hashing and 15-minute expiration windows.
- **Role-Based Access Control (RBAC):** Chained middleware protecting admin, author, and public operations.

---

## 🏗️ Architecture & Technology Stack

```
                                  ┌───────────────────────────┐
                                  │      React 18 + Vite      │
                                  │ (Context API + Lucide +   │
                                  │   Bilingual i18n Engine)  │
                                  └─────────────┬─────────────┘
                                                │ Axios (JWT Interceptor)
                                                ▼
                                  ┌───────────────────────────┐
                                  │     Node.js + Express     │
                                  │ (RBAC Chained Middleware) │
                                  └─────────────┬─────────────┘
                                                │ Mongoose ODM
                                                ▼
                                  ┌───────────────────────────┐
                                  │       MongoDB Database    │
                                  │ (Compound Indexes, Cascade│
                                  │  Deletions, Aggregations) │
                                  └───────────────────────────┘
```

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js 18, Vite, Context API, Vanilla CSS (Agricultural Design System), Lucide Icons, Axios |
| **Backend** | Node.js, Express.js REST API, JSON Web Tokens (JWT), Bcrypt.js, Node.js `crypto` |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM |
| **Testing** | Automated Node.js System & Model Verification Test Suite (`server/test-api.js`) |

---

## 🔌 Complete REST API Reference

### 🔑 Authentication & Profile (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new farmer/expert account with hashed password & JWT |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and return JWT token |
| `GET` | `/api/auth/me` | Private (JWT) | Get current authenticated user profile |
| `PUT` | `/api/auth/profile` | Private (JWT) | Update personal details (Name, Village, District, Language, Avatar) |
| `PUT` | `/api/auth/updatepassword` | Private (JWT) | Change password after verifying current password |
| `POST` | `/api/auth/forgotpassword` | Public | Generate SHA-256 hashed password reset token |
| `PUT` | `/api/auth/resetpassword/:token` | Public | Reset password using unexpired reset token |

### 📝 Posts & Feed (`/api/posts`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | Get paginated feed with category, district, crop & text search filters |
| `POST` | `/api/posts` | Private (JWT) | Author a new community post or expert advisory |
| `GET` | `/api/posts/:id` | Public | Fetch single post with populated author and comments |
| `PUT` | `/api/posts/:id` | Private (Author/Admin) | Update post title, content, category, or tags |
| `DELETE` | `/api/posts/:id` | Private (Author/Admin) | Delete post and cascade delete associated comments |
| `PUT` | `/api/posts/:id/like` | Private (JWT) | Atomic toggle like/unlike for authenticated user |
| `GET` | `/api/posts/user/:userId` | Public | Get all posts authored by a specific user |

### 💬 Comments (`/api/posts/:postId/comments` & `/api/comments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/posts/:postId/comments` | Private (JWT) | Add a comment/advice reply to a post |
| `GET` | `/api/posts/:postId/comments` | Public | Get all comments for a post in chronological order |
| `DELETE` | `/api/comments/:id` | Private (Author/Admin) | Delete a comment |

### 👥 Community Directory (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Public | List all community members with search, role tabs & post counts |
| `GET` | `/api/users/:id` | Public | Get single farmer/expert profile and authored posts feed |

### 🛡️ Admin Panel (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Private (Admin) | Parallel aggregation of platform KPIs, user breakdown & categories |
| `GET` | `/api/admin/users` | Private (Admin) | Comprehensive user listing with status & role filters |
| `PUT` | `/api/admin/users/:id/block` | Private (Admin) | Toggle user account suspension status |
| `PUT` | `/api/admin/users/:id/role` | Private (Admin) | Change user role (`farmer` ⇄ `expert` ⇄ `admin`) |
| `DELETE` | `/api/admin/users/:id` | Private (Admin) | Delete user account with cascade cleanup of posts |
| `GET` | `/api/admin/posts` | Private (Admin) | Moderation queue for all community posts + comment counts |
| `POST` | `/api/admin/announcements` | Private (Admin) | Broadcast an official state-wide pinned announcement |
| `PUT` | `/api/admin/posts/:id/pin` | Private (Admin) | Toggle pin/unpin status for any post |
| `DELETE` | `/api/admin/posts/:id` | Private (Admin) | Moderation delete post with cascade comment cleanup |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance or free [MongoDB Atlas Cluster](https://www.mongodb.com/atlas))

---

### 1. Clone & Setup Repository
```bash
git clone https://github.com/ajitrloni27/AgriChat.git
cd AgriChat
```

---

### 2. Configure Backend Server
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/agrichat
JWT_SECRET=agrichat_super_secret_jwt_key_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

---

### 3. Seed Realistic Agricultural Demo Data
Populate the database with demo farmers, agricultural scientists, admin accounts, and rich agricultural discussions:
```bash
npm run data:seed
```

---

### 4. Run Automated Backend Verification Tests
Verify all schemas, encryption, JWT tokens, and routes:
```bash
npm test
```

---

### 5. Start Backend Server
```bash
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

---

### 6. Configure & Start Frontend Client
In a new terminal window:
```bash
cd ../client
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 👥 Demo Login Credentials

You can test all platform roles immediately using pre-seeded accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **🛡️ Admin** | `admin@agrichat.in` | `Admin@123` | Full access: Analytics dashboard, User moderation, Content moderation, Broadcast announcements |
| **🎓 Expert** | `expert.patil@agrichat.in` | `Expert@123` | Author expert advisories, Pinned advisories, Comment & diagnosis |
| **🌾 Farmer 1** | `basavaraj@agrichat.in` | `Farmer@123` | Community feed authoring, Likes, Comments, Profile management |
| **🌾 Farmer 2** | `manjunath@agrichat.in` | `Farmer@123` | Community discussions, Crop disease queries |

*(One-click quick fill buttons are also available on the Login screen!)*

---

## 🌐 Production Deployment Guide

### Option A: Backend Deployment (Render / Railway)
1. Push this repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET=<Your Cryptographically Strong Secret>`
   - `CLIENT_URL=<Your Deployed Frontend URL>`

### Option B: Frontend Deployment (Vercel / Netlify)
1. Create a new project on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Set **Root Directory** to `client`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Set Environment Variable:
   - `VITE_API_URL=https://<your-backend-render-service>.onrender.com`

---

## 📖 Comprehensive 10-Day Learning Journey
For the complete step-by-step documentation, architecture diagrams, code explanations, and 30+ technical interview questions & answers across all 10 days, see **[PROJECT_JOURNEY.md](./PROJECT_JOURNEY.md)**.

---

## 📄 License
This project is open-source and licensed under the **ISC License**.
