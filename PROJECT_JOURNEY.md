# 🌾 AgriChat: 10-Day MERN Stack Project Journey & Guide

> **Project Type:** Full-Stack Web Application (Community Platform for Farmers)  
> **Tech Stack:** MongoDB, Express.js, React.js, Node.js (MERN)  
> **Repository:** [AgriChat](https://github.com/ajitrloni27/AgriChat)

---

## 🗺️ 10-Day Progress Tracker

- [x] **Day 1: Project Setup & Database Design** *(Completed)*
- [ ] **Day 2: User Authentication (Backend & Frontend)**
- [ ] **Day 3: Profile Management & Forgot Password**
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

---

## 🛠️ Technologies Used & Why

| Technology | What It Is | Why It Is Used in AgriChat |
| :--- | :--- | :--- |
| **Node.js** | JavaScript Runtime Environment | Allows executing JavaScript on the backend server. It uses an event-driven, non-blocking I/O model which makes it fast and scalable for handling numerous concurrent farmer queries. |
| **Express.js** | Minimalist Web Framework for Node.js | Simplifies creating RESTful API endpoints, routing, error handling, and middleware integration without boilerplate HTTP code. |
| **MongoDB** | NoSQL Document Database | Stores data in flexible, JSON-like BSON documents. Ideal for rapid iteration, nested data (like like arrays, comment references), and scales horizontally. |
| **Mongoose** | Object Data Modeling (ODM) Library | Enforces strict schema validations, type casting, indexes, pre/post middleware hooks, and model-level relationships over MongoDB collections. |
| **dotenv** | Environment Configuration Loader | Keeps sensitive keys (database connection strings, JWT secret keys, API ports) safe in `.env` files outside version control. |
| **cors** | Cross-Origin Resource Sharing Middleware | Enables the React frontend (running on a different port like `http://localhost:5173`) to safely communicate with the backend server (`http://localhost:5000`). |
| **nodemon** | Development Utility | Automatically restarts the Node server whenever file changes are detected during local development. |

---

## 💡 Simple Explanations: Key Concepts

### 1. What is an ODM (Object Data Modeling) library?
In raw MongoDB, you can insert any unstructured JSON document. **Mongoose** sits between your Node.js app and MongoDB like a blueprint manager. It makes sure every user has an email, every post has an author, and fields follow defined data types (String, Boolean, Date, ObjectId).

### 2. Why MongoDB instead of SQL (MySQL / PostgreSQL)?
- **JSON-Native:** Data is transferred as JSON in JavaScript and stored natively as BSON in MongoDB—zero translation layer needed.
- **Flexible Schema:** Farming data can evolve (e.g. adding crop tags, weather alerts, audio attachments later) without complex database migration scripts.
- **Speed & Scale:** Ideal for community feed posts and social interaction streams.

### 3. How do Relationships work in Mongoose?
We use `mongoose.Schema.Types.ObjectId` with the `ref` property:
```javascript
author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
```
This stores the unique ID of the `User` document inside the `Post` document. Mongoose's `.populate('author')` feature allows fetching author details automatically when querying posts.

---

## 📂 Day 1 Folder Structure

```
AgriChat/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection logic using Mongoose
│   ├── models/
│   │   ├── User.js            # User schema (farmer/expert/admin accounts)
│   │   ├── Post.js            # Post schema (feed posts, announcements, likes)
│   │   └── Comment.js         # Comment schema (post discussions)
│   ├── .env                   # Local environment variables
│   ├── .env.example           # Example environment template for team/deployment
│   ├── package.json           # Backend dependencies and scripts
│   └── server.js              # Express app setup and entry point
├── .gitignore                 # Excludes node_modules and .env from Git
└── PROJECT_JOURNEY.md         # Daily roadmap & comprehensive learning guide
```

---

## 🗄️ Database Schemas Detail

### 1. `User` Model (`server/models/User.js`)
* **`name`**: String, required, trimmed.
* **`email`**: String, required, unique, validated with regex.
* **`password`**: String, required (hidden from queries by default with `select: false`).
* **`role`**: Enum (`'farmer'`, `'expert'`, `'admin'`), defaults to `'farmer'`.
* **`village`**, **`district`**, **`state`**: Location information for localized agricultural context.
* **`profilePic`**: Image URL for user avatar.
* **`preferredLanguage`**: Enum (`'en'`, `'kn'`) for English / Kannada interface.
* **`isBlocked`**: Boolean flag for admin user moderation.
* **`timestamps`**: Automatically tracks `createdAt` and `updatedAt`.

### 2. `Post` Model (`server/models/Post.js`)
* **`content`**: String, required (up to 2000 characters).
* **`image`**: Cloudinary / uploaded image URL.
* **`author`**: Reference to `User` ObjectId.
* **`isAnnouncement`**: Boolean flag (admin announcements pinned to the top).
* **`category`**: Farming categories (*Crops, Pest Control, Weather, Market Prices, Govt Schemes, Machinery, General*).
* **`likes`**: Array of `User` ObjectIds (prevents duplicate likes).
* **Index**: `{ isAnnouncement: -1, createdAt: -1 }` for high-speed feed sorting.

### 3. `Comment` Model (`server/models/Comment.js`)
* **`text`**: String, required (up to 1000 characters).
* **`author`**: Reference to `User` ObjectId.
* **`postId`**: Reference to the parent `Post` ObjectId.
* **Index**: `{ postId: 1, createdAt: 1 }` for fast retrieval of comments per post.

---

## 🎤 Day 1 Interview Questions & Answers

#### **Q1: Why choose MongoDB over a relational database like MySQL for AgriChat?**
> **Answer:** MongoDB is a document-oriented NoSQL database that stores data in JSON/BSON format. For a community platform like AgriChat, posts, nested likes arrays, user preferences, and media metadata can evolve quickly. MongoDB handles polymorphic structures gracefully and pairs natively with JavaScript in the MERN stack.

#### **Q2: What is Mongoose and why do we use it with Node.js?**
> **Answer:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. While MongoDB is schema-less by nature, Mongoose provides application-level schema enforcement, data validation, type casting, default values, pre/post middleware hooks, and query helpers (e.g. `.populate()`).

#### **Q3: Why did we put `select: false` on the User's password field?**
> **Answer:** Security best practice. By default, querying user profiles (like displaying author names on posts) will automatically exclude the hashed password from the response payload, reducing the risk of accidental credential leakage.

#### **Q4: Why are database indexes added on `Post` and `Comment` models?**
> **Answer:** Indexes create efficient lookup structures in MongoDB. For example, indexing `{ isAnnouncement: -1, createdAt: -1 }` on Posts allows MongoDB to return pinned announcements and newest posts instantly without scanning every document in the collection (avoiding full collection scans).

---

## 🏃 How to Run Day 1 Backend

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the development server with live reload:
   ```bash
   npm run dev
   ```
4. Test the health endpoint:
   Open browser or Postman at: `http://localhost:5000/api/health`

---

## 🔮 Next Step (Day 2)
- **User Authentication (Backend & Frontend):**
  - Implement bcrypt password hashing.
  - Generate and verify JSON Web Tokens (JWT).
  - Create `/api/auth/register`, `/api/auth/login`, and `/api/auth/me` endpoints.
  - Setup React frontend authentication state & forms.
