# StratOS - Strategic Foresight Learning Platform

**"Brilliant for Strategic Foresight"**

StratOS is an interactive B2C learning platform that transforms abstract Strategic Foresight concepts (FTI Method) into engaging, playable simulations.

## Overview

StratOS teaches users to master strategic foresight through four progressive levels:
- **Level 1: The Observer** - Signal Hunter (Tinder-like signal detection)
- **Level 2: The Analyst** - Pattern Matcher (CIPHER framework)
- **Level 3: The Futurist** - World Builder (Scenario planning)
- **Level 4: The Strategist** - Timeline Constructor (Backcasting)

## Project Structure

```
stratos/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Level pages and home
│   │   ├── store/         # Zustand state management
│   │   └── utils/         # Helper functions
│   ├── package.json
│   └── tailwind.config.js
├── backend/           # FastAPI Python backend
│   ├── main.py            # API routes and signals database
│   ├── requirements.txt   # Python dependencies
│   └── venv/             # Virtual environment
└── README.md
```

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Physics-based animations
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Features

### Level 1: Signal Hunter (Currently Implemented)
- Tinder-like swipe interface for signal detection
- 12 curated signals covering the CIPHER framework
- Real-time accuracy tracking
- XP and progression system
- Smooth physics-based animations
- Immediate feedback on choices

### CIPHER Framework Coverage
The signals dataset includes examples of:
- **C**ontradiction - Opposing trends
- **I**nflection - Breakthrough moments
- **P**ractice - Emerging behaviors
- **H**ack - Workarounds and innovations
- **E**xtreme - Outlier events
- **R**arity - First-time occurrences

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- Python 3.12
- npm

### Installation

1. **Clone or navigate to the project:**
```bash
cd /root/stratos
```

2. **Backend Setup:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Frontend Setup:**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the Backend (Terminal 1):**
```bash
cd backend
source venv/bin/activate
python main.py
```
Backend runs on: http://localhost:8000

2. **Start the Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

3. **Access the Application:**
Open your browser to http://localhost:5173

## API Endpoints

### `GET /`
Health check endpoint

### `GET /api/signals`
Returns all signals for Level 1, optionally shuffled

### `POST /api/score`
Scores a user's signal classification
```json
{
  "signalId": 1,
  "userChoice": true
}
```

### `GET /api/cipher-categories`
Returns all CIPHER categories with descriptions

## Current Status

### ✅ Implemented
- Full project structure
- React frontend with Tailwind CSS and Framer Motion
- Zustand state management
- 4-level navigation system
- Level 1: Signal Hunter (fully functional)
- FastAPI backend with CORS
- 12 curated signals with CIPHER categorization
- Scoring algorithm
- XP and accuracy tracking
- Progress visualization

### 🚧 In Development (Placeholder)
- Level 2: Pattern Matcher (CIPHER drag-and-drop)
- Level 3: World Builder (Scenario planning)
- Level 4: Timeline Constructor (Backcasting)

## Development Notes

### State Management
User progress, XP, accuracy, and game state are managed through Zustand in `/frontend/src/store/useGameStore.js`

### Styling
Custom color palette defined in `tailwind.config.js`:
- `brilliant-blue`: #0066FF
- `brilliant-dark`: #0A0E27

### Animation
Framer Motion powers:
- Card swipe mechanics
- Smooth transitions
- Physics-based interactions

## Future Enhancements

1. **Level 2: Pattern Matcher**
   - Drag-and-drop CIPHER classification
   - Pattern constellation building
   - Trend identification

2. **Level 3: World Builder**
   - Interactive 2D scenario space
   - Real-time narrative generation
   - Visual world transformations

3. **Level 4: Timeline Constructor**
   - Reverse tower defense mechanics
   - Dependency graph logic
   - Strategic planning validation

4. **Backend Enhancements**
   - User authentication
   - Firestore integration
   - Progress persistence
   - Leaderboards

5. **Monetization**
   - Freemium model (Level 1 free)
   - Subscription for advanced levels
   - Sandbox mode unlocks

## Contributing

This is a prototype build. Future contributions should follow:
- React best practices
- Component-driven development
- Responsive design principles
- Accessibility standards

## License

Proprietary - All rights reserved

## Acknowledgments

- Inspired by Brilliant.org's interactive learning model
- FTI Method by Future Today Institute
- CIPHER Framework for strategic foresight
