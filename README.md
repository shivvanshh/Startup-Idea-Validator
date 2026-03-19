# Startup Idea Validator Dashboard (IdeaVault)

IdeaVault is a comprehensive full-stack platform built for the Blind Date Round 1-3 Hackathon. It allows users to submit, manage, and explore startup ideas through a beautiful, modern, and animated user interface.

## Core Features Implemented

*   **Authentication**: Secure user registration and login with JSON Web Tokens (JWT).
*   **Idea Management**: Full CRUD capabilities allowing users to submit new ideas, modify existing ones, and manage visibility (Active/Hidden) directly from their "My Ideas" dashboard.
*   **Rich Idea Analytics**:
    *   Difficulty Score Rating (1-5) 
    *   Market Potential Rating (Low/Medium/High/Very High)
    *   Custom Expiration setting (Ideas auto-archive after X hours).
*   **Engagement Tracking**:
    *   Upvote system with immediate UI updates.
    *   View count tracking which increments on views.
*   **Sorting & Filtering**: Find ideas instantly using Keyword Search, Category filters, Difficulty filters, and Market settings. Trending ideas are sorted using the custom ranking logic: `(Market Potential × 2) + Difficulty Score + Upvotes`.
*   **Dashboard Analytics Panel**: Displays High-level statistics such as total ideas, most common categories, and average difficulty scores across the platform.
*   **Premium Interactive Design**: Sleek Dark/Light Mode toggle, responsive grid layouts via Tailwind CSS, and smooth interaction animations via Framer Motion.

---

## 🚀 Environment Setup & Local Running

### Prerequisites
1. **Node.js**: `v18.0.0` or higher
2. **MongoDB database** (Local instance or MongoDB Atlas)

### 1. Clone & Install Dependencies
First, open terminals for both the backend and frontend.

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
In the `backend` directory, ensure the `.env` file is set correctly:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/startup-idea-validator
JWT_SECRET=supersecretjwtkey_12345!
```

*Note: If testing against an empty local MongoDB instance, no further changes are needed here. If deploying, update `MONGO_URI` to an Atlas instance connection string.*

### 3. Run the Servers

**Terminal 1 (Backend):**
```bash
cd backend
node server.js
```
*Server will start on `http://localhost:5000`*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Vite will start the frontend on `http://localhost:5173`*

Open the frontend URL in your browser to start validating your ideas!

---

## 🌍 Production Deployment Guide (Round 3)

The application architecture is strictly designed to fulfill Round 3 objectives without using Vercel. 

**Recommended Providers:**
*   **Database**: MongoDB Atlas 
*   **Backend Server**: Render (Web Service) or Railway
*   **Frontend Client**: Render (Static Site) or Netlify 

### 1. Database (MongoDB Atlas)
1. Sign up/log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Free Tier is fine).
3. Whitelist IP addresses under "Network Access" (allow `0.0.0.0/0` for universal web hosting access).
4. Create a Database User and obtain the Connection String URI.

### 2. Backend Deployment (Render)
1. Create a `New Web Service` on Render.
2. Connect your Git repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**: Add your `MONGO_URI` from step 1, `PORT=5000`, and a secure `JWT_SECRET`.
5. Deploy and save the generated URL (e.g., `https://ideavault-api.onrender.com`).

### 3. Frontend Deployment (Render or Netlify)
1.  **Crucial Step**: Before deploying the UI, update the backend API URL. Open `frontend/src/api.js` and alter the `baseURL`:
    ```javascript
    const api = axios.create({
      baseURL: 'https://ideavault-api.onrender.com/api', // Replace with your backend URL
    });
    ```
2. Commit and push the changes for the frontend.
3. In Render, create a `New Static Site` (or use Netlify via GitHub linkage).
4. Configure settings:
    - **Root Directory**: `frontend`
    - **Build Command**: `npm run build`
    - **Publish Directory**: `dist`
5. Since we are using React Router, set up Redirect/Rewrite rules to redirect all 404 traffic to `index.html` to support Client Side Routing gracefully.

---
 
