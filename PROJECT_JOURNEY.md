# 🌾 AgriChat: 10-Day MERN Stack Project Journey & Guide

> **Project Type:** Full-Stack Web Application (Community Platform for Farmers)  
> **Tech Stack:** MongoDB, Express.js, React.js, Node.js (MERN)  
> **Repository:** [AgriChat](https://github.com/ajitrloni27/AgriChat)

---

## 🗺️ 10-Day Progress Tracker

- [x] **Day 1: Project Setup & Database Design** *(Completed)*
- [x] **Day 2: User Authentication (Backend & Frontend)** *(Completed)*
- [x] **Day 3: Profile Management & Forgot Password** *(Completed)*
- [ ] **Day 4: Core Feed & Post CRUD (Backend)**
- [ ] **Day 5: Core Feed & Post CRUD (Frontend)**
- [ ] **Day 6: Social Interactions: Likes & Comments**
- [ ] **Day 7: Community Directory & Multi-language Support (Kannada & English)**
- [ ] **Day 8: Admin Panel - Dashboard & User Management**
- [ ] **Day 9: Admin Panel - Moderation & Announcements**
- [ ] **Day 10: Testing, Documentation & Deployment**

---

# 📅 Day 1: Project Setup & Database Design

## 🎯 Day 1 Objectives
1. Initialize the backend project structure and configure package dependencies.
2. Build an Express web server with health check routes, middleware (CORS, JSON parsing), and environment variable configurations.
3. Configure MongoDB connection using Mongoose ODM with error handling.
4. Design robust database schemas with data validations and relationships:
   - **User Schema** (Name, email, hashed password, role, village, district, language preference, timestamps)
   - **Post Schema** (Content, image URL, author reference, announcement flag, category, likes array, timestamps)
   - **Comment Schema** (Text, author reference, post reference, timestamps)

## 🛠️ Technologies Used & Why

| Technology | What It Is | Why It Is Used in AgriChat |
| :--- | :--- | :--- |
| **Node.js** | JavaScript Runtime Environment | Executes backend code using non-blocking I/O for scalable performance. |
| **Express.js** | Minimalist Web Framework | Simplifies routing, REST API controllers, and middleware chaining. |
| **MongoDB** | NoSQL Document Database | Stores JSON/BSON records flexibly for dynamic farmer feed requirements. |
| **Mongoose** | Object Data Modeling (ODM) | Enforces schema validation, types, default values, and references. |
| **dotenv** | Environment Variable Manager | Keeps secrets (MongoDB URI, JWT secret) out of source control. |
| **cors** | Cross-Origin Middleware | Allows the React frontend to communicate with the Express backend. |
| **nodemon** | Dev Live Reloader | Auto-restarts backend on every file save. |

## 🎤 Day 1 Interview Questions & Answers
- **Q: Why MongoDB instead of MySQL?**  
  *Ans:* MongoDB is a document-oriented NoSQL database that stores data in JSON/BSON format. It handles polymorphic data (nested likes, comments, dynamic crop tags) naturally without complex schema migrations.
- **Q: What is Mongoose?**  
  *Ans:* An ODM (Object Data Modeling) library that defines schemas, validates inputs, and manages relations between models before persisting into MongoDB.

---

# 📅 Day 2: User Authentication (Backend & Frontend)

## 🎯 Day 2 Objectives
1. Implement secure password hashing using **Bcrypt** with automatic pre-save hooks.
2. Generate signed **JSON Web Tokens (JWT)** on successful registration and login.
3. Build authentication middleware (`protect` and `authorize`) to guard private routes.
4. Scaffold the modern **React (Vite)** frontend application inside `client/`.
5. Implement **AuthContext** state management with persistent login via `localStorage`.
6. Design and build responsive **Login** and **Register** views with English / Kannada support.

---

## 🛠️ Technologies Used & Why

| Technology | What It Is | Why It Is Used in AgriChat |
| :--- | :--- | :--- |
| **bcryptjs** | Password Hashing Library | Hashes passwords with 10 salt rounds before saving to MongoDB so plain text is never exposed. |
| **jsonwebtoken (JWT)** | Stateless Token Generator | Issues cryptographically signed tokens containing user ID & role to authenticate API calls without server sessions. |
| **React (Vite)** | Frontend Library & Next-Gen Bundler | Provides ultra-fast Single Page Application (SPA) experience with instant HMR. |
| **Axios & Interceptors** | HTTP Client | Centralized HTTP requests with automatic `Authorization: Bearer <token>` injection on every protected call. |
| **React Context API** | Global State Management | Distributes user profile, login status, and language settings across all components without prop drilling. |
| **Lucide Icons** | Modern SVG Icon Pack | Crisp, accessible icons for agricultural tools, security shields, and user roles. |

---

## 💡 Simple Explanations: Key Concepts

### 1. How Does Password Hashing with Bcrypt Work?
- **Plaintext vs Hash:** A plaintext password like `"mypassword123"` is transformed via a one-way mathematical algorithm into a 60-character scrambled string like `$2a$10$e8...`.
- **Salt:** A random string (salt) is added to the password before hashing. This prevents "Rainbow Table" dictionary attacks.
- **Verification:** When logging in, bcrypt hashes the entered password using the same salt and compares hashes (`bcrypt.compare()`). The original password is never decrypted.

```
User Input ("secret") + Salt (10 rounds) ---> Bcrypt Hash ($2a$10$k3J...) ---> MongoDB
```

### 2. How Does a JSON Web Token (JWT) Work?
A JWT is made of three base64-encoded parts separated by dots (`.`):
$$\text{Header} . \text{Payload} . \text{Signature}$$
1. **Header:** Algorithm used (e.g. `HS256`).
2. **Payload:** User claims (e.g. `{ id: "650a..", role: "farmer" }`).
3. **Signature:** `HMACSHA256(Header + Payload, JWT_SECRET)`.

**Flow:**
```
[ Farmer Login ] ---> POST /api/auth/login ---> Server verifies & signs JWT
[ Browser ] <--- Receives & stores JWT in localStorage <--- Server
[ Future Request ] ---> Header: Bearer <JWT> ---> Server checks signature with secret key
```

---

## 🔌 Day 2 API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new farmer/expert account with hashed password & JWT |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and return JWT token |
| `GET` | `/api/auth/me` | Private (JWT) | Fetch currently authenticated user details |

---

## 📂 Updated Repository Structure

```
AgriChat/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx         # Header with Auth state & Language toggle
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global User & Auth state
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing / Community Overview
│   │   │   ├── Login.jsx          # Login card with quick demo fills
│   │   │   └── Register.jsx       # Registration with role & village fields
│   │   ├── services/
│   │   │   └── api.js             # Axios instance with JWT interceptor
│   │   ├── App.jsx                # Main App wrapper
│   │   └── index.css              # Modern agricultural theme design system
│   └── package.json
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   └── authController.js      # Register, Login, GetMe logic
│   ├── middleware/
│   │   └── authMiddleware.js      # Protect (JWT) & Authorize (RBAC)
│   ├── models/
│   │   ├── User.js                # Pre-save bcrypt hook & JWT generator
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   └── authRoutes.js          # /api/auth router
│   ├── .env
│   ├── package.json
│   └── server.js
├── .gitignore
├── PROJECT_JOURNEY.md             # Complete day-by-day documentation
└── README.md
```

---

## 🎤 Day 2 Interview Questions & Answers

#### **Q1: How does JWT authentication work and why is it stateless?**
> **Answer:** In session-based authentication, the server stores session IDs in memory or Redis. With JWT, the server signs the user data with a secret key into a token and sends it to the client. The client sends this token in the `Authorization: Bearer <token>` header with subsequent requests. The server verifies the cryptographic signature without reading or storing session state in a database, making it stateless and horizontally scalable.

#### **Q2: Why do we hash passwords instead of encrypting them?**
> **Answer:** Encryption is **two-way** (it can be decrypted with a private key). If the encryption key is compromised, all passwords are exposed. Hashing is **one-way** (irreversible). Even database administrators cannot see plaintext passwords. Verification happens by hashing the entered attempt and matching hashes.

#### **Q3: What is the purpose of Axios Request Interceptors?**
> **Answer:** Interceptors allow intercepting outgoing HTTP requests before they are sent. We use it to read `localStorage.getItem('agrichat_token')` and attach the `Authorization` header automatically to all API calls, avoiding repetitive boilerplate code.

---

---

# 📅 Day 3: Profile Management & Forgot Password

## 🎯 Day 3 Objectives
1. Implement **User Profile Update API** (`PUT /api/auth/profile`) for modifying personal details (Name, Village, District, State, Language, Avatar).
2. Implement **Password Update API** (`PUT /api/auth/updatepassword`) for authenticated users with current password verification.
3. Implement **Forgot Password & Reset Token Flow** using Node.js built-in `crypto`:
   - Generate secure random hex reset token (`crypto.randomBytes(20).toString('hex')`).
   - Store one-way SHA-256 hash in MongoDB alongside a 15-minute expiration timestamp.
   - Implement `POST /api/auth/forgotpassword` and `PUT /api/auth/resetpassword/:resettoken`.
4. Build the modern **Profile Management View** (`Profile.jsx`) featuring personal details editing, avatar selection grid, security settings, and bilingual (English/Kannada) interface.
5. Build the **Forgot Password** (`ForgotPassword.jsx`) & **Reset Password** (`ResetPassword.jsx`) views with token copying and instant reset workflows.

---

## 🛠️ Technologies Used & Why

| Technology | What It Is | Why It Is Used in AgriChat |
| :--- | :--- | :--- |
| **Node.js `crypto`** | Built-in Cryptography Module | Generates cryptographically strong random reset tokens and SHA-256 hashes without external overhead. |
| **Bcryptjs (Salting)** | Password Hashing Library | Re-hashes newly chosen passwords with 10 salt rounds before saving to MongoDB. |
| **Mongoose `$gt` Query** | MongoDB Query Operator | Verifies that `resetPasswordExpire` is strictly greater than `Date.now()`, ensuring expired tokens are rejected. |
| **Lucide Icons** | Vector Icon Set | Provides intuitive visual cues (keys, locks, avatars, locations) for farmers across all literacy levels. |
| **Bilingual State Management** | React Context API | Seamlessly toggles form labels and validation messages between English and Kannada. |

---

## 💡 Simple Explanations: Key Concepts

### 1. How Does the Secure Password Reset Workflow Work?
```
1. [ User enters email ] ---> POST /api/auth/forgotpassword
2. [ Server generates random 20-byte token ] ---> e.g. "9a7f3c1b..."
3. [ Server hashes token using SHA-256 ] ---> e.g. "d8e21a..."
4. [ Server saves hashed token & expiry (now + 15m) in MongoDB User document ]
5. [ Server returns token / sends email link to User ]
6. [ User submits new password + token ] ---> PUT /api/auth/resetpassword/:token
7. [ Server hashes incoming token with SHA-256 and finds user where token matches & expiry > now ]
8. [ Server hashes new password via bcrypt, clears reset fields, returns new JWT ]
```

### 2. Why Hash the Reset Token in the Database?
- If the database is compromised, an attacker who obtains plaintext reset tokens could immediately reset any user's password.
- Storing only the SHA-256 hash in the database ensures that only the recipient holding the original token in their email/session can successfully reset their account.

---

## 🔌 Day 3 API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `PUT` | `/api/auth/profile` | Private (JWT) | Update farmer/user profile (name, village, district, state, preferredLanguage, profilePic) |
| `PUT` | `/api/auth/updatepassword` | Private (JWT) | Update account password after verifying `currentPassword` |
| `POST` | `/api/auth/forgotpassword` | Public | Request password reset token for registered email |
| `PUT` | `/api/auth/resetpassword/:resettoken` | Public | Reset account password using unexpired reset token |

---

## 📂 Updated Repository Structure

```
AgriChat/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Header with Profile access & Language toggle
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth, Profile & Password Reset state
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Community Overview
│   │   │   ├── Login.jsx            # Sign In with "Forgot Password" link
│   │   │   ├── Register.jsx         # Registration view
│   │   │   ├── Profile.jsx          # Profile Management & Password update (Day 3)
│   │   │   ├── ForgotPassword.jsx   # Reset token generation view (Day 3)
│   │   │   └── ResetPassword.jsx    # Set new password view (Day 3)
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with Bearer interceptors
│   │   ├── App.jsx                  # Tab-based view router
│   │   └── index.css                # Agricultural theme with Profile layouts
│   └── package.json
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   └── authController.js        # Register, Login, Profile, Password Reset
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification
│   ├── models/
│   │   ├── User.js                  # User schema with reset token generator
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   └── authRoutes.js            # Auth & Profile endpoints
│   ├── .env
│   ├── package.json
│   └── server.js
├── .gitignore
├── PROJECT_JOURNEY.md               # 10-Day Documentation
└── README.md
```

---

## 🎤 Day 3 Interview Questions & Answers

#### **Q1: Why should password reset tokens have an expiration time?**
> **Answer:** If a reset token never expires, an intercepted email or leaked URL could be used months later to compromise the account. A short expiration window (e.g. 15 minutes) limits the attack surface significantly and ensures that the request is only actionable while the user is actively at their computer or phone.

#### **Q2: Why do we use `crypto.randomBytes()` instead of `Math.random()` for reset tokens?**
> **Answer:** `Math.random()` is a pseudo-random number generator (PRNG) that is predictable and not cryptographically secure. `crypto.randomBytes()` utilizes operating system entropy (hardware noise, system interrupts) to generate truly unpredictable cryptographically secure pseudo-random numbers (CSPRNG), preventing attackers from guessing valid reset tokens.

#### **Q3: How does `findByIdAndUpdate` differ from `user.save()` in Mongoose?**
> **Answer:** `findByIdAndUpdate` sends a direct update command to MongoDB, bypassing Mongoose document lifecycle middleware (such as `pre('save')` hooks) unless explicitly configured. `user.save()` executes on a Mongoose document instance and runs all schema validation and `pre('save')` hooks (e.g., automatic bcrypt hashing for modified passwords).

---

## 🏃 How to Run Frontend & Backend

### 1. Backend Server:
```bash
cd server
npm run dev
```
*(Runs on `http://localhost:5000`)*

### 2. Frontend React App:
```bash
cd client
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 🔮 Next Step (Day 4)
- **Core Feed & Post CRUD (Backend):**
  - Post Schema refinement (categories: Pest Control, Market Prices, Weather, Crop Advice).
  - Post Controllers: Create Post, Get All Posts (with category/location filters & pagination), Get Single Post, Update Post, Delete Post.
  - Image attachment handling and author population.

