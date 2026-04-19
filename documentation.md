# Spitians (SPITConnect) Project Documentation

## 1. Project Overview
**Spitians** (also known as **SPITConnect**) is a comprehensive student networking and campus ecosystem platform designed specifically for students at S.P.I.T. (Sardar Patel Institute of Technology). The platform serves as a centralized hub for networking, academic assistance, event management, project collaboration, and career opportunities.

### Mission
To bridge the gap between students across different departments, foster collaboration, and provide a unified digital space for the campus community to thrive.

---

## 2. Technical Stack

### Frontend
- **Framework**: [React](https://react.dev/) (v18.3)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4), [Framer Motion](https://www.framer.com/motion/) (for animations)
- **State Management**: React Context API
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Communication**: Axios (REST), Socket.io-client (Real-time)
- **Deployment**: Vercel

### Backend
- **Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/) (v5)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens), Bcrypt.js
- **File Storage**: [Cloudinary](https://cloudinary.com/) (via Multer)
- **Real-time**: [Socket.io](https://socket.io/)
- **Scheduled Tasks**: Node-cron (for scraping)

---

## 3. Project Architecture

The project follows a decoupled client-server architecture.

### Root Directory
- `/frontend`: React application source code.
- `/backend`: Express.js server source code.

### Frontend Structure (`/frontend/src`)
- `components/`: Reusable UI components (layout, feature-specific modules).
- `pages/`: Individual page views (Home, Profile, Communities, etc.).
- `context/`: Global state management (Auth, Theme, etc.).
- `api/`: Centralized API call configurations.
- `routes/`: Routing logic and protected route wrappers.
- `lib/`: Utility libraries and configurations (e.g., Lucide, Framer Motion defaults).
- `assets/`: Static assets like images and global styles.

### Backend Structure (`/backend`)
- `config/`: Database connection and environment configurations.
- `controllers/`: Business logic for handling API requests.
- `models/`: Mongoose schemas for MongoDB collections.
- `routes/`: API endpoint definitions mapped to controllers.
- `middleware/`: Custom middleware (Auth, Error handling, Rate limiting).
- `services/`: Specialized logic (e.g., Notification service).
- `utils/`: Helper functions.
- `socket.js`: Real-time communication setup.

---

## 4. Key Features

### 🔐 Authentication & User Profiles
- Secure Login/Register with JWT.
- Detailed User Profiles showing academic info, skills, and activity.
- User search and follow/unfollow system.

### 🏠 Social Engine (Campus Pulse)
- Create, Like, and Comment on posts.
- **Pulse**: A specialized social feed for campus-wide updates.
- Multimedia support (Image uploads via Cloudinary).

### 👥 Communities & Messaging
- Creation and management of community groups.
- Real-time chat functionality powered by Socket.io.
- Group-based permissions and roles.

### 📚 Academic Help
- Dedicated section for sharing resources and asking academic questions.
- Thread-based discussions.

### 💼 Opportunities & Scraper
- Automated scraping of internship listings from sites like **Internshala** (using Cheerio and Node-cron).
- Job/Internship board with detailed descriptions and application links.

### 🚀 Projects & Events
- Showcasing student projects with links and contributors.
- Event management system with registration and details.

### 🏆 Gamification
- Daily Challenges and Streaks to encourage platform engagement.
- Leaderboards based on student participation.

### 🛡️ Admin & Moderation
- Dashboard for managing reports and system health.
- Rate limiting and security hardening (Helmet, Morgan).

---

## 5. Database Schema (Models)

| Model | Description |
| :--- | :--- |
| **User** | Stores user credentials, profile info, streaks, and followers. |
| **Post** | Standard social posts with image and metadata. |
| **Pulse** | Specialized campus-wide social updates. |
| **Comment** | Threaded responses to posts. |
| **Community** | Groups with members, descriptions, and privacy settings. |
| **Message** | Real-time chat messages within communities. |
| **Opportunity** | Scraped and manual job/internship listings. |
| **Project** | Student project details, tech stack, and members. |
| **Event** | Campus events with dates and registration info. |
| **Notification**| User alerts for likes, follows, and messages. |
| **DailyChallenge**| Repository of challenges for the streak system. |

---

## 6. API Endpoints (Summary)

All endpoints are prefixed with `/api`.

- `/auth`: Login, Register, Logout.
- `/users`: Profile management, followers.
- `/posts`: CRUD for social feed.
- `/communities`: Groups, memberships, and messaging.
- `/opportunities`: Job/Internship listings.
- `/projects`: Project showcase management.
- `/events`: Campus event management.
- `/academic`: Academic help threads.
- `/search`: Multi-modal search across users, posts, and groups.

---

## 7. Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd spitians
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # MONGO_URI, JWT_SECRET, CLOUDINARY_URL, PORT
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with:
   # VITE_API_URL
   npm run dev
   ```

---
*Documentation generated on 2026-04-19.*
