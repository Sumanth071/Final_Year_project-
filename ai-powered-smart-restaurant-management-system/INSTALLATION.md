# 📦 Installation & Setup Guide

Complete step-by-step guide to get the AI-Powered Smart Restaurant Management System up and running.

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Git** (optional, for cloning)
   - Download: https://git-scm.com/

3. **MongoDB Atlas Account** (free tier available)
   - Sign up: https://www.mongodb.com/cloud/atlas
   - Already configured in `.env` file

4. **Code Editor** (Optional)
   - Visual Studio Code: https://code.visualstudio.com/
   - WebStorm, Sublime Text, or any editor

---

## 🚀 Installation Methods

### Method 1: Automated Setup (Windows Users)

**Step 1:** Navigate to the project directory
```bash
cd ai-powered-smart-restaurant-management-system
```

**Step 2:** Run the setup script
```bash
setup.bat
```

This will:
- ✅ Check Node.js installation
- ✅ Install all dependencies
- ✅ Verify environment configuration
- ✅ Display startup instructions

---

### Method 2: Automated Setup (Linux/Mac Users)

**Step 1:** Navigate to the project directory
```bash
cd ai-powered-smart-restaurant-management-system
```

**Step 2:** Make script executable and run
```bash
chmod +x setup.sh
./setup.sh
```

Or simply:
```bash
bash setup.sh
```

---

### Method 3: Manual Setup (All Platforms)

#### Step 1: Install Backend Dependencies

```bash
cd ai-powered-smart-restaurant-management-system
cd server
npm install
```

Expected output: ✅ All packages installed in `node_modules/`

#### Step 2: Install Frontend Dependencies

```bash
cd ../client
npm install
```

Expected output: ✅ All packages installed in `node_modules/`

#### Step 3: Verify Environment Configuration

Backend `.env` file is already configured:

```bash
cd ../server
cat .env
```

Expected output:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://ksumanthyadav120:Sumanth-db@suman.1lwpnwk.mongodb.net/
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=20d
```

✅ Everything is configured and ready!

---

## ▶️ Running the Application

### Option A: Two Terminal Windows (Easiest for Development)

**Terminal 1 - Start Backend:**
```bash
cd ai-powered-smart-restaurant-management-system/server
npm run dev
```

Expected output:
```
[nodemon] starting `node src/index.js`
Server running on port 5000
MongoDB Connected: ac-qvukvft-shard-00-00.1lwpnwk.mongodb.net
```

✅ Backend is ready!

**Terminal 2 - Start Frontend:**
```bash
cd ai-powered-smart-restaurant-management-system/client
npm run dev
```

Expected output:
```
VITE v4.5.14 ready in 3348 ms
➜  Local:   http://localhost:5173/
```

✅ Frontend is ready!

### Access the Application

1. Open browser and go to: **http://localhost:5173**
2. You should see the login page
3. Register a new account to get started

---

### Option B: Using Docker Compose

**Prerequisites:** Docker and Docker Compose installed

**Step 1:** Build and start containers
```bash
cd ai-powered-smart-restaurant-management-system
docker-compose up -d
```

**Step 2:** Wait for containers to be ready
```bash
docker-compose ps
```

Expected output:
```
NAME          STATUS
mongo         Up (healthy)
server        Up
client        Up
```

**Step 3:** Access application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

**Step 4:** Stop containers
```bash
docker-compose down
```

---

## 📋 Available Commands

### Backend Commands

```bash
cd server

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed

# Install dependencies
npm install
```

### Frontend Commands

```bash
cd client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

---

## 🔧 Configuration

### Backend Configuration (.env)

File location: `server/.env`

```env
# Server Settings
NODE_ENV=development              # development or production
PORT=5000                         # Server port (change if port in use)

# Database
MONGO_URI=mongodb+srv://...      # MongoDB Atlas connection string

# Authentication
JWT_SECRET=your_super_secret     # Change in production!
JWT_EXPIRE=20d                   # Token validity period
```

### Frontend Configuration (Optional)

File location: `client/.env.local` (create if needed)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Verification Checklist

After installation, verify everything is working:

### Backend Verification

```bash
# Check if backend is running
curl http://localhost:5000/api/auth/me

# Or use Postman to test endpoints
```

### Frontend Verification

1. Open http://localhost:5173 in browser
2. You should see a login/register page
3. Try to register a new account
4. Login and explore the dashboard

### Database Verification

```bash
# Check MongoDB connection in server logs
# You should see: "MongoDB Connected: cluster-name"
```

---

## 🐛 Troubleshooting

### ❌ "Node is not found"
**Solution:**
1. Install Node.js from https://nodejs.org/
2. Verify: `node --version`
3. Restart terminal/IDE

### ❌ "Port 5000 already in use"
**Solution (Linux/Mac):**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Solution (Windows):**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change port in `server/.env`: `PORT=5001`

### ❌ "MongoDB connection error"
**Solution:**
1. Check your internet connection
2. Ensure MongoDB Atlas credentials are correct in `.env`
3. Whitelist your IP in MongoDB Atlas:
   - Go to https://cloud.mongodb.com/
   - Network Access → Add Current IP Address

### ❌ "Module not found"
**Solution:**
```bash
# Clear and reinstall dependencies
rm -rf node_modules
npm install
```

### ❌ "All dependencies installed but still errors?"

Try these steps:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock files
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📱 First-Time Usage

### 1. Create Account
- Click "Register" on login page
- Fill in: Name, Email, Password, Role
- Click "Register"

### 2. Login
- Use the credentials you just created
- Choose your role:
  - **Guest**: Place orders and make bookings
  - **Staff**: Manage restaurant operations
  - **Restaurant Admin**: Manage entire restaurant
  - **Super Admin**: System administration

### 3. Explore Features
- **Dashboard**: View analytics and statistics
- **Restaurants**: Create/manage restaurants (admin only)
- **Menu**: Add menu items
- **Orders**: Process customer orders
- **Bookings**: Manage table reservations
- **Reports**: View business analytics
- **AI Insights**: Get AI-powered recommendations

---

## 🔄 Updating the Code

### Pull Latest Changes
```bash
git pull origin main
```

### Update Dependencies
```bash
cd server && npm update
cd ../client && npm update
```

### Rebuild and Restart
```bash
# Backend
cd server && npm run dev

# Frontend (in new terminal)
cd client && npm run dev
```

---

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [MongoDB Atlas Guide](https://docs.mongodb.com/manual/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## 🎯 Next Steps

1. ✅ Complete installation
2. ✅ Start both servers
3. ✅ Register and login
4. ✅ Explore all features
5. ✅ Read the main [README.md](README.md) for detailed documentation
6. ✅ Check API endpoints in server route files
7. ✅ Customize as needed for your use case

---

## 💬 Need Help?

If you encounter issues:

1. **Check this troubleshooting section** - Most common issues are covered
2. **Check server logs** - They usually indicate what's wrong
3. **Check MongoDB Atlas status** - Ensure cluster is running
4. **Review .env configuration** - Ensure all variables are set correctly

---

## ✨ Success!

Once you see both servers running without errors, you're ready to use the application!

🚀 **Happy coding!**
