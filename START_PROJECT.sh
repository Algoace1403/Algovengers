#!/bin/bash

echo "🚀 Starting Algovengers Project..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Check and kill existing processes
echo -e "${YELLOW}Checking for existing servers...${NC}"
if check_port 5001; then
    echo "Killing existing backend server on port 5001..."
    lsof -ti:5001 | xargs kill -9
fi

if check_port 3000; then
    echo "Killing existing frontend server on port 3000..."
    lsof -ti:3000 | xargs kill -9
fi

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Starting Backend Server (Port 5001)${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Start backend in background
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Starting Frontend Server (Port 3000)${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Start frontend
cd ../frontend
npm run dev

# This will keep running until you press Ctrl+C
# When you stop it, it will also stop the backend
trap "kill $BACKEND_PID" EXIT
