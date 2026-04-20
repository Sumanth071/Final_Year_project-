# QUICK START GUIDE

## 🚀 Start the Application in 3 Steps

### Step 1: Install Dependencies
```bash
cd ai-powered-smart-restaurant-management-system

# Install backend
cd server
npm install

# Install frontend
cd ../client
npm install
```

### Step 2: Setup Environment Variables (.env)
The `.env` file is already configured with MongoDB Atlas. No changes needed!

Backend is configured with:
- **MongoDB**: mongodb+srv://ksumanthyadav120:Sumanth-db@suman.1lwpnwk.mongodb.net/
- **JWT Validity**: 20 days
- **Server Port**: 5000

### Step 3: Start Both Servers

**Terminal 1 - Backend Server:**
```bash
cd ai-powered-smart-restaurant-management-system/server
npm run dev
```
✅ Backend running at: **http://localhost:5000**

**Terminal 2 - Frontend Server:**
```bash
cd ai-powered-smart-restaurant-management-system/client
npm run dev
```
✅ Frontend running at: **http://localhost:5173**

---

## 📂 Default Credentials

Use these to login and test:
- Email: Any email you register with
- Password: Any password (minimum 6 characters)

---

## 🎯 Next Steps

1. **Open Browser**: http://localhost:5173
2. **Register**: Create a new account
3. **Explore**: Try all features (restaurants, orders, bookings, reports, AI insights)
4. **View Analytics**: Check the dashboard for real-time data

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error?
✅ Already configured with MongoDB Atlas!
Just make sure you have internet connection.

### Dependencies Issue?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Full Documentation

See **README.md** in the root directory for complete documentation.

---

**Happy Coding! 🚀**
