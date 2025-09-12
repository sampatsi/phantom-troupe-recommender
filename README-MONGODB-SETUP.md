al# MongoDB Setup for Phantom Troupe Recommender

## Option 1: Local MongoDB Installation

### Install MongoDB Community Edition

**On macOS (using Homebrew):**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify installation
mongosh --version
```

**On Ubuntu/Debian:**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**On Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a Windows service

### Verify Local Installation
```bash
# Connect to MongoDB
mongosh

# In MongoDB shell, check databases
show dbs
```

## Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (choose the free tier)
4. Create a database user
5. Whitelist your IP address
6. Get your connection string

## Environment Configuration

Create a `.env` file in the project root:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/phantom-troupe-recommender
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/phantom-troupe-recommender

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=8080
NODE_ENV=development
```

## Installation and Setup Steps

1. **Install Dependencies:**
```bash
npm install
```

2. **Start MongoDB (if using local installation):**
```bash
# macOS
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod

# Windows - MongoDB should start automatically as a service
```

3. **Seed the Database:**
```bash
npm run seed
```

4. **Start the Application:**
```bash
npm run dev
```

## Database Seeding

The seed script will:
- Create a system administrator account
- Load all users from `data/users.json`
- Load all internships from `data/internships.json`
- Create additional test users

### Default Login Credentials:
- **Admin:** admin@phantom-troupe.com / admin123
- **Student:** student@test.com / password123
- **Org Admin:** orgadmin@test.com / password123
- **Original User:** asha@univ.edu / password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)
- `PUT /api/auth/change-password` - Change password (requires auth)
- `DELETE /api/auth/deactivate` - Deactivate account (requires auth)

### Public Endpoints
- `GET /health` - Health check with database status
- `GET /api/facets` - Get available locations and org types
- `GET /api/internships/:id` - Get specific internship details

### Protected Endpoints
- `GET /api/recommendations?limit=N` - Get personalized recommendations (requires auth)

## Testing the API

### 1. Register a new user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "education": {
      "degree": "B.Tech",
      "branch": "CSE",
      "year": 3,
      "cgpa": 8.5
    },
    "skills": ["Python", "JavaScript"],
    "preferences": {
      "roles": ["Software"],
      "locations": ["Bengaluru"],
      "stiped_min": 5000,
      "org_types": ["Private"]
    },
    "constraints": {
      "disability": false,
      "gender": "M",
      "income_band": "General"
    },
    "geo": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716]
    }
  }'
```

### 2. Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get recommendations (use token from login):
```bash
curl -X GET "http://localhost:8080/api/recommendations?limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `brew services list | grep mongodb` (macOS)
- Check connection string in `.env` file
- Verify network access if using MongoDB Atlas

### Database Seeding Issues
- Ensure MongoDB is running before seeding
- Check if database already has data (seed script will clear existing data)
- Verify JSON files in `data/` directory are valid

### Authentication Issues
- Ensure JWT_SECRET is set in `.env`
- Check token format: `Bearer <token>`
- Verify user exists and is active

## Production Considerations

1. **Change JWT_SECRET** to a strong, random string
2. **Use MongoDB Atlas** for production deployment
3. **Set up proper CORS** configuration
4. **Implement proper logging** and monitoring
5. **Use environment-specific configurations**
6. **Set up database backups**
