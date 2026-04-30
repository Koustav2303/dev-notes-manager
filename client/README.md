# 🚀 Dev Notes + Snippet Manager

A modern, developer-focused knowledge management platform designed to help store, organize, and retrieve code snippets and technical notes efficiently. Built with a focus on high-fidelity UI, smooth physics-based scrolling, and a robust full-stack architecture.

## ✨ Core Features
*   **Structured Storage:** Create, view, and organize developer notes.
*   **Markdown Support:** Built-in Markdown editor with real-time live preview.
*   **Smooth UX:** Integrated Lenis smooth scrolling and GSAP stagger animations for a premium feel.
*   **Secure API:** Express.js REST API with MongoDB Atlas cloud database integration.
*   **Responsive Design:** Fully responsive glassmorphic UI built with Tailwind CSS 3.

## 🛠️ Technology Stack
*   **Frontend:** React (Vite), Tailwind CSS, Zustand (State Management), GSAP, Lenis, React Router.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB Atlas with Mongoose.

## 📂 Project Structure
This repository uses a monorepo-style structure separating the client and server.

\`\`\`text
dev-notes-manager/
├── client/          # React frontend (Vite)
└── server/          # Node.js / Express backend
\`\`\`

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account set up.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Koustav2303/dev-notes-manager.git
cd dev-notes-manager
\`\`\`

### 2. Install Dependencies
You will need to install the dependencies for both the frontend and the backend.
\`\`\`bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
\`\`\`

### 3. Environment Variables
Create a `.env` file inside the `server/` directory and add your MongoDB connection string:

\`\`\`env
MONGO_URI=your_mongodb_atlas_connection_string_here
PORT=5001
JWT_SECRET=your_jwt_secret_key
\`\`\`
*(Note: Do not commit your actual `.env` file to version control.)*

### 4. Run the Application
Open two separate terminal windows to run both servers simultaneously.

**Terminal 1: Backend Server**
\`\`\`bash
cd server
node server.js
# Runs on http://localhost:5001
\`\`\`

**Terminal 2: Frontend Client**
\`\`\`bash
cd client
npm run dev
# Runs on http://localhost:5173
\`\`\`

## 🔗 API Endpoints
*   `GET /api/notes` - Fetch all saved snippets.
*   `POST /api/notes` - Create a new snippet to the database.
*   `POST /api/auth/register` - Register a new user.
*   `POST /api/auth/login` - Authenticate existing user.

---
*Architected and developed by Koustav.*