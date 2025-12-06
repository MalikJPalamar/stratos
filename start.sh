#!/bin/bash

# StratOS Start Script
# Starts both backend and frontend servers

echo "🚀 Starting StratOS..."
echo ""

# Start Backend
echo "📡 Starting Backend (FastAPI)..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Start Frontend
echo "🎨 Starting Frontend (Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ StratOS is running!"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping StratOS...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
