# 🚀 Phantom Troupe Recommender - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Project Installation](#project-installation)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup & Seeding](#database-setup--seeding)
6. [Starting the Application](#starting-the-application)
7. [Testing & Demo](#testing--demo)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git** (for cloning the repository)
- **MongoDB Atlas Account** (free tier available)

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

### Check Prerequisites
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

---

## 🗄️ MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Verify your email address

### Step 2: Create a New Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to your location
5. Click "Create Cluster"

### Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `phantom-troupe-recommender`

**Example Connection String:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/phantom-troupe-recommender?retryWrites=true&w=majority&appName=Cluster0
```

---

## 📥 Project Installation

### Step 1: Clone the Repository
```bash
# Clone the repository
git clone https://github.com/sampatsi/phantom-troupe-recommender.git

# Navigate to project directory
cd phantom-troupe-recommender
```

### Step 2: Install Backend Dependencies
```bash
# Install backend dependencies
npm install
```

### Step 3: Install Frontend Dependencies
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Go back to root directory
cd ..
```

---

## ⚙️ Environment Configuration

### Step 1: Create Backend Environment File
Create `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add the following content to `.env`:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/phantom-troupe-recommender?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=8080
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Step 2: Create Frontend Environment File
Create `.env` file in the frontend directory:

```bash
# Create frontend .env file
touch frontend/.env
```

Add the following content to `frontend/.env`:
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080
```

### Step 3: Update MongoDB Connection String
Replace the MongoDB URI in `.env` with your actual connection string from Atlas:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/phantom-troupe-recommender?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🗃️ Database Setup & Seeding

### Step 1: Seed the Database
```bash
# Seed the database with sample data
MONGODB_URI="your-connection-string" npm run seed
```

### Step 2: Verify Database Seeding
```bash
# Check if seeding was successful
MONGODB_URI="your-connection-string" npm run seed:reset
```

### Step 3: View Database in MongoDB Atlas
1. Go to your MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Select your database: `phantom-troupe-recommender`
4. View collections:
   - `users` - User profiles and authentication data
   - `internships` - Internship listings and requirements

---

## 🚀 Starting the Application

### Step 1: Start Backend Server
```bash
# Start the backend server
npm run dev
```

The backend will start on `http://localhost:8080`

### Step 2: Start Frontend Server
Open a new terminal and run:
```bash
# Navigate to frontend directory
cd frontend

# Start the frontend server
npm start
```

The frontend will start on `http://localhost:3000`

### Step 3: Verify Both Servers
- Backend: http://localhost:8080/health
- Frontend: http://localhost:3000

---

## 🧪 Testing & Demo

### Step 1: Access the Application
1. Open your browser
2. Go to `http://localhost:3000`
3. You should see the Phantom Troupe Recommender homepage

### Step 2: Test User Authentication
**Default Login Credentials:**
- **Admin**: `admin@phantom-troupe.com` / `admin123`
- **Student**: `asha@univ.edu` / `password123`
- **Test Student**: `student@test.com` / `password123`
- **Org Admin**: `orgadmin@test.com` / `password123`

### Step 3: Test Recommendations
1. Login with any student account
2. Go to Dashboard
3. View personalized internship recommendations
4. Check the rule-based filtering system

### Step 4: Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:8080/health

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "asha@univ.edu", "password": "password123"}'

# Test recommendations (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/recommendations?limit=5
```

---

## 🔍 Viewing Database in MongoDB

### Method 1: MongoDB Atlas Web Interface
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Browse Collections"
3. Select your database
4. View and edit documents

### Method 2: MongoDB Compass (Desktop App)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your Atlas connection string
3. Browse collections and documents

### Method 3: Command Line (MongoDB Shell)
```bash
# Install MongoDB Shell
npm install -g mongosh

# Connect to Atlas
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/phantom-troupe-recommender"

# View collections
show collections

# View users
db.users.find().pretty()

# View internships
db.internships.find().pretty()
```

---

## 🔄 Updating Database Connection

### Step 1: Update .env File
```bash
# Edit the .env file
nano .env
```

Update the `MONGODB_URI` with your new connection string:
```env
MONGODB_URI=mongodb+srv://new-username:new-password@new-cluster.xxxxx.mongodb.net/phantom-troupe-recommender?retryWrites=true&w=majority&appName=NewCluster
```

### Step 2: Restart the Application
```bash
# Stop the current server (Ctrl+C)
# Restart the backend
npm run dev

# Restart the frontend
cd frontend && npm start
```

### Step 3: Reseed the Database
```bash
# Reseed with new database
MONGODB_URI="new-connection-string" npm run seed
```

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
**Error**: `MongoServerError: Authentication failed`
**Solution**: 
- Check username and password in connection string
- Ensure user has proper permissions
- Verify network access settings

#### 2. Port Already in Use
**Error**: `EADDRINUSE: address already in use :::8080`
**Solution**:
```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9

# Or use a different port
PORT=8081 npm run dev
```

#### 3. Frontend Build Errors
**Error**: `Module not found` or compilation errors
**Solution**:
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 4. Database Seeding Failed
**Error**: `User validation failed`
**Solution**:
```bash
# Clear database and reseed
MONGODB_URI="your-connection-string" npm run seed:reset
```

### Getting Help
- Check the [Component Guide](./COMPONENT-GUIDE.md) for detailed explanations
- Review the [API Documentation](./API-DOCUMENTATION.md)
- Check server logs for detailed error messages

---

## 📚 Next Steps

1. **Read the Component Guide**: Understand how each part works
2. **Explore the API**: Test different endpoints
3. **Customize Rules**: Modify the recommendation engine
4. **Add Features**: Extend the application functionality
5. **Deploy**: Deploy to production when ready

---

## 🎯 Quick Start Commands

```bash
# Complete setup in one go
git clone https://github.com/sampatsi/phantom-troupe-recommender.git
cd phantom-troupe-recommender
npm install
cd frontend && npm install && cd ..
cp .env.example .env
# Edit .env with your MongoDB URI
MONGODB_URI="your-connection-string" npm run seed
npm run dev
# In another terminal:
cd frontend && npm start
```

**🎉 You're all set! Visit http://localhost:3000 to start using the application.**
