# 🧩 Phantom Troupe Recommender - Component Guide

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Components](#backend-components)
3. [Frontend Components](#frontend-components)
4. [Database Schema](#database-schema)
5. [Rule Engine](#rule-engine)
6. [Authentication System](#authentication-system)
7. [API Endpoints](#api-endpoints)
8. [Recommendation Algorithm](#recommendation-algorithm)

---

## 🏗️ Architecture Overview

The Phantom Troupe Recommender follows a **3-tier architecture**:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 8080    │    │   (Atlas)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Features
- **Rule-Based Filtering**: YAML-driven recommendation engine
- **JWT Authentication**: Secure user authentication
- **MongoDB Integration**: Scalable data storage
- **Responsive UI**: Mobile-friendly interface
- **Fairness & Inclusion**: EWS, women, PwD considerations

---

## 🔧 Backend Components

### 1. Server (`src/server.js`)
**Purpose**: Main Express.js server and API routing

**Key Features**:
- Express.js application setup
- Middleware configuration (CORS, rate limiting, authentication)
- API route definitions
- Error handling
- Health check endpoint

**Key Routes**:
```javascript
// Public routes
GET  /health                    // Health check
GET  /api/internships          // List internships
GET  /api/internships/:id      // Get specific internship
GET  /api/facets               // Get filter facets

// Authentication routes
POST /api/auth/register        // User registration
POST /api/auth/login           // User login
GET  /api/auth/profile         // Get user profile
PUT  /api/auth/profile         // Update user profile
POST /api/auth/change-password // Change password
DELETE /api/auth/deactivate    // Deactivate account

// Protected routes
GET  /api/recommendations      // Get personalized recommendations
```

### 2. Models (`src/models/`)

#### User Model (`src/models/User.js`)
**Purpose**: Defines user schema and validation

**Schema Structure**:
```javascript
{
  _id: ObjectId,                    // Auto-generated ID
  name: String,                     // User's full name
  email: String,                    // Unique email address
  password: String,                 // Hashed password
  role: String,                     // 'student' or 'org_admin'
  education: {                      // Educational background
    degree: String,                 // B.Tech, M.Tech, etc.
    branch: String,                 // CSE, IT, ECE, etc.
    year: Number,                   // Current year (1-5)
    cgpa: Number                    // CGPA score
  },
  skills: [String],                 // Technical skills
  preferences: {                    // User preferences
    roles: [String],                // Preferred roles
    locations: [String],            // Preferred locations
    stiped_min: Number,             // Minimum stipend
    org_types: [String]             // Preferred org types
  },
  constraints: {                    // User constraints
    disability: Boolean,            // Disability status
    gender: String,                 // Gender (M/F)
    income_band: String             // Income category
  },
  geo: {                           // Geographic location
    type: "Point",
    coordinates: [Number, Number]   // [longitude, latitude]
  },
  isActive: Boolean,               // Account status
  lastLogin: Date,                 // Last login timestamp
  createdAt: Date,                 // Account creation date
  updatedAt: Date                  // Last update date
}
```

#### Internship Model (`src/models/Internship.js`)
**Purpose**: Defines internship schema and validation

**Schema Structure**:
```javascript
{
  _id: ObjectId,                    // Auto-generated ID
  title: String,                    // Internship title
  org: String,                      // Organization name
  org_type: String,                 // Organization type
  description: String,              // Job description
  skills_required: [String],        // Required skills
  skills_nice_to_have: [String],    // Nice-to-have skills
  education_required: {             // Education requirements
    degree: [String],               // Required degrees
    branches: [String],             // Required branches
    year_min: Number                // Minimum year
  },
  location: String,                 // Job location
  is_remote: Boolean,               // Remote work option
  stipend: Number,                  // Stipend amount
  duration_months: Number,          // Duration in months
  application_deadline: Date,       // Application deadline
  language_required: [String],      // Required languages
  diversity_eligibility: {          // Diversity criteria
    women_only: Boolean,            // Women-only position
    pwd_friendly: Boolean,          // PwD-friendly
    ews_priority: Boolean           // EWS priority
  },
  geo: {                           // Geographic location
    type: "Point",
    coordinates: [Number, Number]   // [longitude, latitude]
  },
  verified: Boolean,                // Verification status
  posted_at: Date,                  // Posted date
  posted_by: String,                // Posted by user
  isActive: Boolean,                // Active status
  application_count: Number         // Number of applications
}
```

### 3. Controllers (`src/controllers/`)

#### Auth Controller (`src/controllers/authController.js`)
**Purpose**: Handles user authentication and profile management

**Key Functions**:
- `register()`: User registration with validation
- `login()`: User authentication and JWT generation
- `getProfile()`: Retrieve user profile
- `updateProfile()`: Update user information
- `changePassword()`: Change user password
- `deactivateAccount()`: Deactivate user account

**Authentication Flow**:
1. User submits credentials
2. Validate email and password
3. Generate JWT token
4. Return user data and token
5. Client stores token for future requests

### 4. Middleware (`src/middleware/`)

#### Auth Middleware (`src/middleware/auth.js`)
**Purpose**: JWT token validation and user authentication

**Key Functions**:
- `generateToken()`: Create JWT token
- `verifyToken()`: Validate JWT token
- `authenticate()`: Middleware for protected routes
- `authorize()`: Role-based access control
- `optionalAuth()`: Optional authentication
- `rateLimit()`: Rate limiting middleware

**Security Features**:
- JWT token expiration (7 days default)
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS protection

### 5. Rule Engine (`src/rules/`)

#### Rule Configuration (`src/rules/config.yaml`)
**Purpose**: Defines recommendation rules and scoring

**Hard Rules** (Eligibility Filters):
```yaml
hard_rules:
  - id: edu_degree
    when: "internship.education_required && internship.education_required.degree"
    check: "includes(internship.education_required.degree, user.education.degree)"
    fail_reason: "Degree requirement not met"

  - id: edu_year
    when: "internship.education_required && internship.education_required.year_min"
    check: "user.education.year >= internship.education_required.year_min"
    fail_reason: "Minimum year not met"

  - id: skills_required
    check: "subset(internship.skills_required, normSkills(user.skills))"
    fail_reason: "Required skills missing"

  - id: deadline
    check: "now() <= internship.application_deadline"
    fail_reason: "Application deadline passed"

  - id: language_required
    when: "internship.language_required && internship.language_required.length"
    check: "overlap(internship.language_required, user.language_pref)"
    fail_reason: "Language requirement not met"

  - id: women_only
    when: "internship.diversity_eligibility && internship.diversity_eligibility.women_only === true"
    check: "user.constraints && user.constraints.gender === 'F'"
    fail_reason: "Women-only internship"
```

**Soft Rules** (Scoring):
```yaml
soft_rules:
  - id: stipend_pref
    score: "internship.stipend >= user.preferences.stiped_min ? 1 : 0"
    weight: 1

  - id: location_proximity
    score: "internship.is_remote ? 1 : (1 - distance(user.geo, internship.geo) / 1000)"
    weight: 1

  - id: org_type_affinity
    score: "includes(user.preferences.org_types, internship.org_type) ? 1 : 0"
    weight: 1

  - id: skills_nice_to_have
    score: "jaccard(normSkills(user.skills), new Set(internship.skills_nice_to_have))"
    weight: 0.5

  - id: role_keyword
    score: "keyword(user.preferences.roles, internship.title, internship.description)"
    weight: 1
```

#### Rule Engine (`src/rules/engine.js`)
**Purpose**: Executes recommendation rules and scoring

**Key Functions**:
- `evaluateOne()`: Evaluate single internship against user
- `rank()`: Rank all internships for a user
- `runHardRules()`: Apply eligibility filters
- `runSoftRules()`: Calculate soft scores
- `fairnessBoost()`: Apply fairness adjustments

**Scoring Algorithm**:
1. **Hard Rules**: Filter out ineligible internships
2. **Soft Rules**: Calculate preference scores
3. **Fairness Boost**: Apply inclusion bonuses
4. **Tie Breaker**: Use application count for final ranking

---

## 🎨 Frontend Components

### 1. App Structure (`src/App.tsx`)
**Purpose**: Main application component with routing

**Features**:
- React Router setup
- Authentication context
- Route protection
- Global error handling

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)
**Purpose**: Global authentication state management

**State**:
- `user`: Current user data
- `token`: JWT authentication token
- `loading`: Loading state
- `error`: Error messages

**Functions**:
- `login()`: User login
- `register()`: User registration
- `logout()`: User logout
- `checkAuth()`: Validate existing token

### 3. Components

#### Login Component (`src/components/Login.tsx`)
**Purpose**: User login interface

**Features**:
- Email/password form
- Form validation
- Error handling
- Redirect to dashboard

#### Register Component (`src/components/Register.tsx`)
**Purpose**: User registration interface

**Features**:
- Comprehensive registration form
- Education details
- Skills selection
- Preferences configuration
- Constraints and diversity options

#### Dashboard Component (`src/components/Dashboard.tsx`)
**Purpose**: Main user dashboard

**Features**:
- User profile display
- Personalized recommendations
- Recommendation filtering
- Application management

#### Recommendation Card (`src/components/RecommendationCard.tsx`)
**Purpose**: Individual recommendation display

**Features**:
- Internship details
- Score explanation
- Application button
- Skills matching display

### 4. Services

#### API Service (`src/services/api.ts`)
**Purpose**: Centralized API communication

**Features**:
- Axios configuration
- JWT token attachment
- Error handling
- Request/response interceptors

---

## 🗄️ Database Schema

### Collections

#### Users Collection
```javascript
// Indexes for performance
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "education.degree": 1, "education.year": 1 })
db.users.createIndex({ "skills": 1 })
db.users.createIndex({ "geo": "2dsphere" })
db.users.createIndex({ "isActive": 1 })
```

#### Internships Collection
```javascript
// Indexes for performance
db.internships.createIndex({ "verified": 1, "isActive": 1 })
db.internships.createIndex({ "application_deadline": 1 })
db.internships.createIndex({ "skills_required": 1 })
db.internships.createIndex({ "education_required.degree": 1 })
db.internships.createIndex({ "geo": "2dsphere" })
db.internships.createIndex({ "org_type": 1 })
```

### Data Relationships
- **One-to-Many**: User → Applications (future feature)
- **Many-to-Many**: Users ↔ Internships (through recommendations)
- **Geospatial**: Location-based matching using 2dsphere indexes

---

## 🔐 Authentication System

### JWT Token Structure
```javascript
{
  "userId": "68c48b48f952744af547cbd6",
  "email": "asha@univ.edu",
  "role": "student",
  "iat": 1757711239,
  "exp": 1758316039
}
```

### Authentication Flow
1. **Registration**: User creates account → Password hashed → User stored in DB
2. **Login**: Credentials validated → JWT generated → Token returned
3. **Protected Routes**: Token validated → User data attached to request
4. **Token Refresh**: New token generated on each login

### Security Measures
- **Password Hashing**: bcrypt with salt rounds
- **JWT Expiration**: 7-day token lifetime
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Mongoose schema validation

---

## 🌐 API Endpoints

### Authentication Endpoints
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "education": {
    "degree": "B.Tech",
    "branch": "CSE",
    "year": 3,
    "cgpa": 8.5
  },
  "skills": ["Java", "Python", "React"],
  "preferences": {
    "roles": ["Software", "Data"],
    "locations": ["Bengaluru", "Remote"],
    "stiped_min": 10000,
    "org_types": ["Private", "Startup"]
  }
}
```

### Recommendation Endpoints
```http
GET /api/recommendations?limit=10
Authorization: Bearer <jwt-token>

Response:
{
  "count": 3,
  "items": [
    {
      "id": "68c48b48f952744af547cbdc",
      "title": "Software Intern - eGov",
      "org": "Dept. of IT",
      "score": 16.002,
      "explain": {
        "passed_rules": ["edu_degree", "edu_year", "skills_required"],
        "soft_scores": {
          "stipend_pref": 1,
          "location_proximity": 1,
          "org_type_affinity": 1
        },
        "fairness": 0.2,
        "tie_breaker": 10002
      }
    }
  ]
}
```

---

## 🎯 Recommendation Algorithm

### Step 1: Hard Filtering
1. **Education Check**: Verify degree and year requirements
2. **Skills Check**: Ensure all required skills are present
3. **Deadline Check**: Verify application deadline hasn't passed
4. **Language Check**: Match language requirements
5. **Diversity Check**: Apply women-only, PwD, EWS filters

### Step 2: Soft Scoring
1. **Stipend Preference**: Higher stipend = higher score
2. **Location Proximity**: Closer locations preferred
3. **Organization Type**: Match user preferences
4. **Nice-to-have Skills**: Bonus for additional skills
5. **Role Keywords**: Match preferred roles

### Step 3: Fairness Boost
1. **EWS Priority**: 0.2 bonus for EWS category
2. **Women Priority**: Additional boost for women
3. **PwD Friendly**: Accessibility considerations

### Step 4: Final Ranking
1. **Total Score**: Soft scores + fairness boost
2. **Tie Breaker**: Application count (lower is better)
3. **Sort**: Descending by total score

### Example Scoring
```javascript
// User: Asha (B.Tech CSE, Year 3, Skills: Java, SQL, Excel)
// Internship: Software Intern - eGov

Hard Rules: ✅ All passed
Soft Scores:
  - stipend_pref: 1.0 (meets minimum stipend)
  - location_proximity: 1.0 (Bengaluru match)
  - org_type_affinity: 1.0 (Government preference)
  - skills_nice_to_have: 0.0 (no additional skills)
  - role_keyword: 1.0 (Software role match)

Fairness: 0.2 (EWS + Women priority)
Tie Breaker: 10002 (application count)

Total Score: 4.0 + 0.2 + 0.010002 = 4.210002
```

---

## 🚀 Deployment Considerations

### Environment Variables
- **Production**: Use strong JWT secrets
- **Database**: Use production MongoDB cluster
- **CORS**: Configure for production domain
- **Rate Limiting**: Adjust for production load

### Performance Optimization
- **Database Indexes**: Optimize query performance
- **Caching**: Implement Redis for frequent queries
- **CDN**: Use CDN for static assets
- **Monitoring**: Implement logging and monitoring

### Security Best Practices
- **HTTPS**: Always use HTTPS in production
- **Secrets**: Store secrets in environment variables
- **Validation**: Validate all inputs
- **Rate Limiting**: Implement proper rate limiting
- **CORS**: Configure CORS properly

---

## 📊 Monitoring and Analytics

### Key Metrics
- **User Engagement**: Login frequency, session duration
- **Recommendation Quality**: Click-through rates, applications
- **System Performance**: Response times, error rates
- **Database Performance**: Query times, connection usage

### Logging
- **Authentication**: Login attempts, failures
- **Recommendations**: Generation time, user interactions
- **Errors**: Detailed error logging with stack traces
- **Performance**: API response times, database queries

---

This component guide provides a comprehensive understanding of how each part of the Phantom Troupe Recommender works together to create a powerful, fair, and scalable internship recommendation system.
