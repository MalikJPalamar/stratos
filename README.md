# StratOS - Strategic Foresight Learning Platform

**"Brilliant for Strategic Foresight"**

StratOS is an interactive B2C learning platform that transforms abstract Strategic Foresight concepts (FTI Method) into engaging, playable simulations. Master the art of futures thinking through 4 progressive levels with gamified mechanics, real-time feedback, and beautiful animations.

## 🎮 Play Now

**Live Demo:** *Coming Soon*

## 📚 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How to Play](#how-to-play)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)

## 🌟 Overview

StratOS teaches strategic foresight through four progressive levels:

### **Level 1: Signal Hunter** 🔍
*Tinder-style signal detection*
- Swipe right for signals, left for noise
- Learn to identify weak signals vs. random events
- Track accuracy and build streaks
- Master signal detection fundamentals

### **Level 2: Pattern Matcher** 🧩
*CIPHER framework classification*
- Classify 15 signals into 6 CIPHER categories
- Learn pattern recognition across:
  - **C**ontradiction - Opposing trends
  - **I**nflection - Breakthrough moments
  - **P**ractice - Emerging behaviors
  - **H**ack - Workarounds & innovations
  - **E**xtreme - Outlier events
  - **R**arity - First-time occurrences
- 60% accuracy required to unlock Level 3

### **Level 3: World Builder** 🌍
*Interactive scenario planning*
- Click on a 2D axis to explore future scenarios
- Economic Growth × Tech Advancement dimensions
- 4 distinct future worlds:
  - Abundant Future (high/high)
  - Tech Divide (low/high)
  - Slow Decline (low/low)
  - Material World (high/low)
- 100 XP for exploring all quadrants

### **Level 4: Timeline Constructor** 📅
*Backcasting mastery*
- Drag-and-drop timeline building
- Arrange 5 milestones chronologically
- 4 future scenarios to master:
  - AI Healthcare Revolution
  - Climate Tech Breakthrough
  - Decentralized Finance Dominance
  - Space Economy Expansion
- 150 XP for perfect timeline ordering

## ✨ Features

### 🎯 Gamification
- **XP System** - Earn points for correct answers
- **Streak Tracking** - Build combos for bonus XP
- **Accuracy Metrics** - Track your performance
- **Progressive Unlocking** - Master each level to advance
- **Confetti Celebrations** - Visual rewards for success

### 🎨 Visual Polish
- **Smooth Animations** - Framer Motion physics
- **Responsive Design** - Works on all devices
- **Dark Theme** - Beautiful, distraction-free UI
- **Interactive Tutorials** - Modal instructions for each level
- **Loading States** - Polished UX throughout

### 🔐 Authentication
- **Email/Password** - Traditional signup with bcrypt
- **Google OAuth** - Sign in with Google
- **GitHub OAuth** - Sign in with GitHub
- **JWT Tokens** - 30-day session persistence
- **Progress Sync** - Game state saved to database

### 📊 Progress Tracking
- Level completion status
- Total XP earned
- Best streak achieved
- Overall accuracy percentage
- Real-time stats in header

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Physics-based animations
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **canvas-confetti** - Celebration effects

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL ORM
- **SQLite** - Development database
- **Pydantic** - Data validation
- **JWT** - Token authentication
- **Passlib + Bcrypt** - Password hashing
- **Google Auth** - OAuth 2.0 integration
- **GitHub OAuth** - OAuth integration
- **Uvicorn** - ASGI server

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.x or higher
- **Python** 3.12
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/MalikJPalamar/stratos.git
cd stratos
```

2. **Backend Setup:**
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

3. **Frontend Setup:**
```bash
cd ../frontend

# Install dependencies
npm install
```

### Running the Application

#### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```
✅ Backend running on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on: http://localhost:5173

#### Option 2: Production Build
```bash
cd frontend
npm run build
# Serve the dist/ folder with your preferred static server
```

### Access the Application
Open your browser to: **http://localhost:5173**

## 🎮 How to Play

### 1. Start at Home
- View all 4 levels
- Check your current progress
- Each level shows unlock status

### 2. Level 1: Signal Hunter
- Read the signal card carefully
- Swipe **right** (✓) if it's a **signal**
- Swipe **left** (✗) if it's **noise**
- Build streaks for bonus XP
- Track your accuracy

### 3. Level 2: Pattern Matcher
- Read each signal
- Click the correct CIPHER category
- Match at least 60% to unlock Level 3
- Learn pattern recognition

### 4. Level 3: World Builder
- Click anywhere on the canvas
- Explore different future scenarios
- Visit all 4 quadrants to complete
- Earn 100 XP

### 5. Level 4: Timeline Constructor
- Choose a future scenario
- Drag milestones to reorder them
- Arrange from present → future
- Complete all 4 scenarios to master StratOS

### Tips for Success
- **Read carefully** - Details matter
- **Think about causality** - What enables what?
- **Build streaks** - Consecutive correct answers = bonus XP
- **Explore thoroughly** - Each level rewards exploration
- **Learn from feedback** - Read explanations for wrong answers

## 🔐 Authentication

### Signup Options
1. **Email/Password**
   - Secure bcrypt hashing
   - Email validation
   - Instant account creation

2. **Google OAuth**
   - One-click signup
   - Profile picture imported
   - Automatic account linking

3. **GitHub OAuth**
   - Developer-friendly
   - Uses primary email
   - Avatar imported

### How Authentication Works
1. User signs up/logs in
2. Backend generates JWT token (30-day expiration)
3. Frontend stores token in localStorage
4. Token sent with API requests via Authorization header
5. Game progress synced to user's account

### Protected Features
- Game progress persistence
- XP and streak tracking
- Profile management
- Leaderboards (coming soon)

## 📡 API Documentation

### Authentication Endpoints

#### `POST /auth/signup`
Register with email/password
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "full_name": "John Doe"
}
```

#### `POST /auth/login`
Login with email/password (OAuth2 compatible)
```
Form data:
username=user@example.com
password=secure_password
```

#### `POST /auth/google`
Authenticate with Google ID token
```json
{
  "token": "google_id_token_here"
}
```

#### `POST /auth/github`
Authenticate with GitHub OAuth code
```json
{
  "code": "github_oauth_code_here"
}
```

#### `GET /auth/me`
Get current user info (requires auth)

#### `PUT /auth/profile`
Update user profile (requires auth)

### Game Progress Endpoints

#### `POST /api/progress/save`
Save game progress (requires auth)
```json
{
  "current_level": 2,
  "xp": 150,
  "accuracy": 85.5,
  "current_streak": 5,
  "best_streak": 10
}
```

#### `GET /api/progress`
Load user's game progress (requires auth)

### Level 1 Endpoints

#### `GET /api/signals`
Get all signals for Level 1
- Query param: `shuffle=true` (default)
- Returns 35 signals

### Level 2 Endpoints

#### `GET /api/level2/signals?limit=15`
Get signals for Pattern Matcher

#### `POST /api/level2/classify`
Classify a signal into CIPHER category
```json
{
  "signalId": 1,
  "userCategory": "Inflection"
}
```

#### `GET /api/cipher-categories`
Get all 6 CIPHER categories with descriptions

### Level 3 Endpoints

#### `GET /api/level3/scenario?x=0.5&y=0.5`
Get scenario for coordinates (-1 to 1 range)

### Level 4 Endpoints

#### `GET /api/level4/scenarios`
Get all 4 timeline scenarios

#### `GET /api/level4/scenario/{name}`
Get shuffled milestones for a scenario

#### `POST /api/level4/validate`
Validate timeline order
```json
{
  "scenarioName": "AI Healthcare Revolution",
  "userOrder": [1, 2, 3, 4, 5]
}
```

## 📁 Project Structure

```
stratos/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── Layout.jsx    # Header with stats
│   │   ├── pages/            # Level components
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Level1SignalHunter.jsx
│   │   │   ├── Level2PatternMatcher.jsx
│   │   │   ├── Level3WorldBuilder.jsx
│   │   │   └── Level4TimelineConstructor.jsx
│   │   ├── store/
│   │   │   └── useGameStore.js   # Zustand state
│   │   ├── App.jsx           # Router setup
│   │   └── main.jsx          # React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                  # FastAPI application
│   ├── main.py               # API routes & game logic
│   ├── database.py           # SQLAlchemy models
│   ├── auth.py               # JWT & authentication
│   ├── requirements.txt      # Python dependencies
│   ├── stratos.db            # SQLite database
│   └── venv/                 # Virtual environment
│
└── README.md                 # This file
```

## 🔧 Development

### Environment Variables (Optional)
Create `.env` files for production:

**Backend (.env):**
```env
SECRET_KEY=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
DATABASE_URL=sqlite:///./stratos.db
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GITHUB_CLIENT_ID=your-github-client-id
```

### Development Commands

**Frontend:**
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

**Backend:**
```bash
python main.py   # Start server
```

### Code Style
- **Frontend**: Prettier + ESLint
- **Backend**: Black + isort
- **Components**: Functional React with hooks
- **State**: Zustand for global, useState for local
- **Styling**: Tailwind utility classes

## 📊 Current Status

### ✅ Fully Implemented
- Complete 4-level game system
- All levels playable with polish
- Comprehensive authentication (Email, Google, GitHub)
- Game progress persistence
- XP, accuracy, and streak tracking
- Smooth animations throughout
- Instructions modals
- Loading states & error handling
- Confetti celebrations
- 35+ curated signals

### 🚧 Coming Soon
- Leaderboards
- Achievement system
- Social sharing
- Advanced analytics dashboard
- Mobile apps (iOS/Android)

## 🤝 Contributing

This is currently a prototype. Future contributions welcome for:
- Additional signals and scenarios
- New level mechanics
- UI/UX improvements
- Performance optimizations
- Accessibility enhancements

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Inspired by **Brilliant.org**'s interactive learning model
- **FTI Method** by Future Today Institute
- **CIPHER Framework** for strategic foresight
- Built with ❤️ by the StratOS team

## 📞 Support

For issues and feature requests:
- GitHub Issues: https://github.com/MalikJPalamar/stratos/issues
- Email: support@stratos.app (coming soon)

---

**Ready to master strategic foresight? Start playing StratOS today!** 🚀
