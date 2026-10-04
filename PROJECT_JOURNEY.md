# 🌾 AgriChat: 10-Day MERN Stack Project Journey & Guide

> **Project Type:** Full-Stack Web Application (Community Platform for Farmers)  
> **Tech Stack:** MongoDB, Express.js, React.js, Node.js (MERN)  
> **Repository:** [AgriChat](https://github.com/ajitrloni27/AgriChat)

---

## 🗺️ 10-Day Progress Tracker

- [x] **Day 1: Project Setup & Database Design** *(Completed)*
- [x] **Day 2: User Authentication (Backend & Frontend)** *(Completed)*
- [x] **Day 3: Profile Management & Forgot Password** *(Completed)*
- [x] **Day 4: Core Feed & Post CRUD (Backend)** *(Completed)*
- [x] **Day 5: Core Feed & Post CRUD (Frontend)** *(Completed)*
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

---

# 📅 Day 4: Core Feed & Post CRUD (Backend)

## 🎯 Day 4 Objectives
1. Refine the **Post Schema** (`server/models/Post.js`) with title, categories, target crop, hashtags, author ObjectId reference, location metadata, and announcement flags.
2. Build comprehensive **Post Controllers** (`server/controllers/postController.js`) covering:
   - `createPost`: Authenticated post authoring with role-based announcement permissions.
   - `getPosts`: Multi-parameter filtering (Category, Crop, District, Search text regex, Pagination, Sorting by Newest/Popular).
   - `getPostById`: Single post fetching with author population and nested comment retrieval.
   - `updatePost`: Author and Admin authorized modifications.
   - `deletePost`: Cascade deletion of posts and their associated comments.
   - `getUserPosts`: Author-specific profile timeline queries.
3. Secure and expose endpoints via Express Router (`server/routes/postRoutes.js`) mounted on `/api/posts`.
4. Create a comprehensive database **Seeder Script** (`server/seeder.js`) with realistic agricultural posts (MSP announcements, BT cotton pest alerts, expert advice, and weather warnings).

---

## 🛠️ Technologies Used & Why

| Technology | What It Is | Why It Is Used in AgriChat |
| :--- | :--- | :--- |
| **Mongoose `populate()`** | Reference Resolution | Joins user details (name, role, village, district, avatar) to post documents seamlessly without manual foreign key queries. |
| **MongoDB Aggregation Pipeline** | Multi-stage Data Processing (`$group`, `$match`) | Aggregates real-time comment counts across all feed posts in a single, high-performance database query. |
| **Regex Case-Insensitive Search (`$regex`, `$options: 'i'`)** | Text Pattern Matcher | Enables flexible search over post titles, body content, crop tags, and district locations. |
| **Cascade Delete Pattern** | Data Integrity Pattern | Ensures that when a post is removed, all associated comments are automatically cleaned up (`Comment.deleteMany`). |
| **Compound Indexing** | MongoDB Performance Index | Optimizes feed querying ordered by announcement flags (`isAnnouncement: -1`) and creation time (`createdAt: -1`). |

---

## 💡 Simple Explanations: Key Concepts

### 1. How Does Reference Population Work in Mongoose?
- In MongoDB, a Post document stores only the Author's `_id` (`author: ObjectId("650a...")`).
- Calling `.populate('author', 'name role village district profilePic')` tells Mongoose to automatically look up the corresponding record in the `users` collection and replace the ID with the selected user fields before returning the response.

```
Post Document in DB:
{ _id: "p1", title: "Pest Attack", author: ObjectId("u1") }

After .populate('author', 'name role'):
{ _id: "p1", title: "Pest Attack", author: { name: "Basavaraj", role: "farmer" } }
```

### 2. How Does Feed Pagination Work?
- `page`: The current page requested (e.g. Page 2).
- `limit`: Number of posts per page (e.g. 10).
- `skip`: Calculated as `(page - 1) * limit` (e.g. `(2 - 1) * 10 = 10` posts skipped).

---

## 🔌 Day 4 API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/posts` | Private (JWT) | Create a new community post / announcement |
| `GET` | `/api/posts` | Public | Get paginated feed with search, category, and crop filters |
| `GET` | `/api/posts/:id` | Public | Get single post details with populated author & comments |
| `PUT` | `/api/posts/:id` | Private (Author / Admin) | Update title, content, crop, category, or tags |
| `DELETE` | `/api/posts/:id` | Private (Author / Admin) | Delete post and cascade delete its comments |
| `GET` | `/api/posts/user/:userId` | Public | Get all posts authored by a specific user |

---

## 📂 Updated Repository Structure

```
AgriChat/
├── client/
│   ├── src/
│   │   ├── components/Navbar.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js        # Post CRUD, filters, pagination (Day 4)
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js                  # Enhanced Post schema with virtuals (Day 4)
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js            # /api/posts REST router (Day 4)
│   ├── seeder.js                    # Database demo seeder (Day 4)
│   ├── .env
│   ├── package.json
│   └── server.js                    # Mounts /api/posts router (Day 4)
├── .gitignore
├── PROJECT_JOURNEY.md               # 10-Day Complete Guide
└── README.md
```

---

## 🎤 Day 4 Interview Questions & Answers

#### **Q1: What is the N+1 query problem and how does Mongoose `populate` handle it?**
> **Answer:** The N+1 problem occurs when querying a list of $N$ posts and then firing $N$ individual database queries to fetch the author for each post. Mongoose solves this by collecting all distinct `author` IDs from the retrieved posts and issuing a single batch query (`User.find({ _id: { $in: authorIds } })`), joining the results in application memory efficiently.

#### **Q2: Why should we use MongoDB Compound Indexes for the post feed?**
> **Answer:** AgriChat sorts posts by pinned announcements first and then by newest creation date (`{ isAnnouncement: -1, createdAt: -1 }`). A compound index on these two fields allows the database engine to locate and return the sorted documents directly from the B-Tree index without performing an in-memory collection sort, drastically reducing response times at scale.

#### **Q3: How do we enforce Role-Based Access Control (RBAC) when modifying or deleting posts?**
> **Answer:** Before executing `post.save()` or `Post.findByIdAndDelete()`, the controller inspects `post.author.toString() === req.user.id || req.user.role === 'admin'`. If neither condition is met, it halts execution and returns an HTTP `403 Forbidden` status.

---

---

# 📅 Day 5: Core Feed & Post CRUD (Frontend)

## 🎯 Day 5 Objectives
1. Build the modern **Farmer Community Feed View** (`client/src/pages/Feed.jsx`):
   - Dynamic category filter pill navigation (All, Crops, Pest Control, Weather, Market Prices, Govt Schemes, Machinery, General).
   - Real-time search bar (text pattern match across titles, body, crops, and tags) and sorting controls (Newest, Most Liked, Oldest).
   - District-specific Karnataka agricultural location filter.
   - Sidebar widgets with live Mandi & MSP commodity prices and regional weather forecast alerts.
2. Build the **Post Creation Modal & Composer** (`client/src/components/CreatePostModal.jsx`):
   - Fast crop suggestion pills (Cotton, Paddy, Arecanut, Maize, Sugarcane, Tomato, Chilli, Wheat).
   - Farm image attachment support with quick presets.
   - Tag token input and official pinned announcement toggle for Admins & Experts.
3. Build the **Post Card Component** (`client/src/components/PostCard.jsx`):
   - Displays author badge, role tag (`🌾 Farmer`, `🎓 Expert`, `🛡️ Admin`), location, pinned announcement banner, category/crop pills, media preview, tags, and timestamps.
   - Owner-restricted Edit and Delete context menu.
   - Shareable direct post link clipboard copy helper.
4. Build the **Post Edit Modal** (`client/src/components/EditPostModal.jsx`) allowing real-time post modifications.
5. Provide bilingual (English & Kannada) translation across all feed controls, prompts, and modal dialogues.

---

## 🛠️ Technologies Used & Why

| Technology | What It Is | Why It Is Used in AgriChat |
| :--- | :--- | :--- |
| **React State & `useCallback`** | Component Hook Architecture | Memoizes API fetchers to avoid unnecessary re-renders when filtering by categories, districts, or query strings. |
| **Axios API Service Client** | HTTP Interceptor Client | Seamlessly communicates with backend CRUD endpoints (`/api/posts`), injecting JWT tokens on write operations. |
| **Optimistic / Local State Updates** | UI Responsiveness Pattern | Immediately reflects post creations, edits, and deletions in the React feed state without requiring a full page reload. |
| **Responsive Grid & Flex Layouts** | Vanilla CSS Grid & Flexbox | Delivers a clean desktop layout with sidebar widgets and a streamlined single-column feed on mobile devices. |
| **Clipboard API (`navigator.clipboard`)** | Web API | Enables one-click link sharing of community discussions to WhatsApp and local farmer groups. |

---

## 💡 Simple Explanations: Key Concepts

### 1. How Does the Feed Data Flow Work in React?
```
[ User selects Category / District / Searches ]
       │
       ▼
[ useEffect triggers fetchPosts() ] ---> GET /api/posts?category=Crops&district=Gadag
       │
       ▼
[ Server returns JSON array of populated posts ]
       │
       ▼
[ setPosts(res.data.posts) ] ---> React re-renders <PostCard /> list with badges & author info
```

### 2. How are Optimistic Updates Managed in State?
- **Create:** Newly created post returned from `POST /api/posts` is prepended to state: `setPosts(prev => [newPost, ...prev])`.
- **Edit:** Modified post returned from `PUT /api/posts/:id` replaces the existing record: `setPosts(prev => prev.map(p => p._id === id ? updated : p))`.
- **Delete:** Deleted post ID from `DELETE /api/posts/:id` is filtered out: `setPosts(prev => prev.filter(p => p._id !== id))`.

---

## 🔌 Day 5 Frontend Component Reference

| Component | File Path | Description |
| :--- | :--- | :--- |
| **Feed Page** | `client/src/pages/Feed.jsx` | Main community dashboard with category pills, search bar, sorting, widgets, and post list |
| **Create Post Modal** | `client/src/components/CreatePostModal.jsx` | Interactive composer with crop pills, category select, image previews, and announcement toggle |
| **Edit Post Modal** | `client/src/components/EditPostModal.jsx` | Pre-populated modal to modify post contents and categories |
| **Post Card** | `client/src/components/PostCard.jsx` | Feed card displaying author info, announcement ribbon, tags, image, and owner actions |

---

## 📂 Updated Repository Structure

```
AgriChat/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Updated with direct Feed navigation
│   │   │   ├── PostCard.jsx           # Individual post card with author & actions (Day 5)
│   │   │   ├── CreatePostModal.jsx    # Post creator with crop suggestions (Day 5)
│   │   │   └── EditPostModal.jsx      # Post editor modal (Day 5)
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Feed.jsx               # Community Feed dashboard (Day 5)
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx                    # Wired with default Feed view
│   │   └── index.css                  # Feed & Modal styling rules
│   └── package.json
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── seeder.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── .gitignore
├── PROJECT_JOURNEY.md                 # 10-Day Complete Journey
└── README.md
```

---

## 🎤 Day 5 Interview Questions & Answers

#### **Q1: Why is `useCallback` used for the `fetchPosts` function in the Feed component?**
> **Answer:** In React, functions defined inside components are recreated on every render. Passing an inline function or referencing it in a `useEffect` dependency array causes unnecessary API calls or infinite re-render loops. Wrapping `fetchPosts` with `useCallback` ensures that the function identity only changes when its actual dependencies (`selectedCategory`, `selectedDistrict`, `searchQuery`, `sortBy`) change.

#### **Q2: How do we conditionally render Edit & Delete options securely on the frontend?**
> **Answer:** In `PostCard.jsx`, we inspect the authenticated user: `const isOwner = user && (post.author?._id === user.id || user.role === 'admin')`. If `isOwner` is false, the action menu is not rendered in the DOM. Furthermore, the backend endpoint `PUT /api/posts/:id` independently validates the JWT to guarantee security even if API calls are forged.

#### **Q3: What is the advantage of using a dedicated modal over an inline form for post creation?**
> **Answer:** A modal isolates complex form state (photo selection, category dropdowns, tag tokens, announcement flags) from the main feed DOM, preventing the feed from lagging while typing and providing a focused, accessible writing experience on both mobile and desktop screens.

---

## 🏃 How to Run Frontend & Backend

### 1. Seed Demo Data:
```bash
cd server
npm run data:seed
```

### 2. Backend Server:
```bash
cd server
npm run dev
```
*(Runs on `http://localhost:5000`)*

### 3. Frontend React App:
```bash
cd client
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 🔮 Next Step (Day 6)
- **Social Interactions: Likes & Comments:**
  - Like/Unlike toggle API (`PUT /api/posts/:id/like`).
  - Comment CRUD APIs (`POST /api/posts/:id/comments`, `GET /api/posts/:id/comments`, `DELETE /api/comments/:id`).
  - Real-time comment drawer / accordion on post cards.
  - Interactive like animations and heart counters.



