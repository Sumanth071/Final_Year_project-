#!/bin/bash

# AI-Powered Smart Restaurant Management System - Setup Script
# This script sets up and starts the entire application

echo "════════════════════════════════════════════════════════════════"
echo "  🍽️  AI-Powered Smart Restaurant Management System"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Navigate to project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "📁 Project Root: $PROJECT_ROOT"
echo ""

# Function to install dependencies
install_dependencies() {
    echo "════════════════════════════════════════════════════════════════"
    echo "📦 Installing Dependencies..."
    echo "════════════════════════════════════════════════════════════════"
    echo ""

    # Install server dependencies
    echo "📥 Installing server dependencies..."
    cd "$PROJECT_ROOT/server"
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install server dependencies"
        exit 1
    fi
    echo "✅ Server dependencies installed"
    echo ""

    # Install client dependencies
    echo "📥 Installing client dependencies..."
    cd "$PROJECT_ROOT/client"
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install client dependencies"
        exit 1
    fi
    echo "✅ Client dependencies installed"
    echo ""
}

# Function to check and setup environment variables
setup_env() {
    echo "════════════════════════════════════════════════════════════════"
    echo "⚙️  Checking Environment Variables..."
    echo "════════════════════════════════════════════════════════════════"
    echo ""

    SERVER_ENV="$PROJECT_ROOT/server/.env"
    SERVER_ENV_EXAMPLE="$PROJECT_ROOT/server/.env.example"

    if [ -f "$SERVER_ENV" ]; then
        echo "✅ Server .env exists"
        # Check if MongoDB URI is set
        if grep -q "mongodb+srv://ksumanthyadav120" "$SERVER_ENV"; then
            echo "✅ MongoDB Atlas URI is configured"
        else
            echo "⚠️  Warning: Check MONGO_URI in .env"
        fi
    else
        echo "⚠️  .env file not found in server directory"
        if [ -f "$SERVER_ENV_EXAMPLE" ]; then
            echo "📝 Copy from .env.example and update with your MongoDB URI"
        fi
    fi
    echo ""
}

# Function to start servers
start_servers() {
    echo "════════════════════════════════════════════════════════════════"
    echo "🚀 Starting Application..."
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    
    echo "ℹ️  This script requires two terminal windows to run both servers."
    echo ""
    echo "📋 Instructions:"
    echo "   1. First, this script will start the backend server."
    echo "   2. Open a new terminal and run: cd $PROJECT_ROOT/client && npm run dev"
    echo "   3. Frontend will be available at: http://localhost:5173"
    echo "   4. Backend API will be at: http://localhost:5000"
    echo ""
    echo "🔌 Key URLs:"
    echo "   - Frontend: http://localhost:5173"
    echo "   - Backend API: http://localhost:5000"
    echo "   - API Docs: Check controllers in server/src/routes/"
    echo ""
    
    read -p "Press Enter to start the backend server..."
    echo ""
    
    # Start backend
    echo "🔄 Starting Backend Server..."
    cd "$PROJECT_ROOT/server"
    npm run dev
}

# Function to display quick start guide
quick_start() {
    echo "════════════════════════════════════════════════════════════════"
    echo "⚡ QUICK START GUIDE"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "Option 1: Using Bash Script (Recommended)"
    echo "   $ bash setup.sh"
    echo ""
    echo "Option 2: Manual Setup"
    echo "   Terminal 1 (Backend):"
    echo "   $ cd server"
    echo "   $ npm install"
    echo "   $ npm run dev"
    echo ""
    echo "   Terminal 2 (Frontend):"
    echo "   $ cd client"
    echo "   $ npm install"
    echo "   $ npm run dev"
    echo ""
    echo "Option 3: Using Docker Compose"
    echo "   $ docker-compose up -d"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
}

# Main execution
case "${1:-start}" in
    install)
        install_dependencies
        ;;
    install-start)
        install_dependencies
        start_servers
        ;;
    start)
        start_servers
        ;;
    guide)
        quick_start
        ;;
    *)
        quick_start
        echo ""
        read -p "Run setup and start servers? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_dependencies
            setup_env
            start_servers
        fi
        ;;
esac
