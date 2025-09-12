# 📚 Phantom Troupe Recommender - API Documentation

## 🌐 Base URL
```
Development: http://localhost:8080
Production: https://your-domain.com
```

## 🔐 Authentication
All protected endpoints require a JWT token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

---

## 📋 API Endpoints

### 🏥 Health Check
```http
GET /health
```
**Description**: Check if the API is running and database is connected.

**Response**:
```json
{
  "ok": true,
  "now": "2025-09-12T21:12:48.259Z",
  "database": {
    "status": "connected",
    "ready": true
  }
}
```

---

### 👤 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body**:
```json
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
  "certifications": ["AWS Cloud Practitioner"],
  "preferences": {
    "roles": ["Software", "Data"],
    "locations": ["Bengaluru", "Remote"],
    "stiped_min": 10000,
    "org_types": ["Private", "Startup"]
  },
  "constraints": {
    "disability": false,
    "gender": "M",
    "income_band": "General"
  },
  "language_pref": ["en"],
  "geo": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  }
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "68c48b48f952744af547cbd6",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "education": { /* ... */ },
    "skills": ["Java", "Python", "React"],
    "preferences": { /* ... */ },
    "constraints": { /* ... */ },
    "isActive": true,
    "createdAt": "2025-09-12T21:12:48.259Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "message": "Login successful",
  "user": {
    "_id": "68c48b48f952744af547cbd6",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "education": { /* ... */ },
    "skills": ["Java", "Python", "React"],
    "preferences": { /* ... */ },
    "constraints": { /* ... */ },
    "isActive": true,
    "lastLogin": "2025-09-12T21:12:48.259Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response**:
```json
{
  "user": {
    "_id": "68c48b48f952744af547cbd6",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "education": { /* ... */ },
    "skills": ["Java", "Python", "React"],
    "preferences": { /* ... */ },
    "constraints": { /* ... */ },
    "isActive": true,
    "createdAt": "2025-09-12T21:12:48.259Z",
    "updatedAt": "2025-09-12T21:12:48.259Z"
  }
}
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Smith",
  "skills": ["Java", "Python", "React", "Node.js"],
  "preferences": {
    "roles": ["Software", "Data", "DevOps"],
    "locations": ["Bengaluru", "Mumbai", "Remote"],
    "stiped_min": 15000,
    "org_types": ["Private", "Startup", "MNC"]
  }
}
```

**Response**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "68c48b48f952744af547cbd6",
    "name": "John Smith",
    "email": "john@example.com",
    "role": "student",
    "education": { /* ... */ },
    "skills": ["Java", "Python", "React", "Node.js"],
    "preferences": { /* ... */ },
    "constraints": { /* ... */ },
    "isActive": true,
    "updatedAt": "2025-09-12T21:15:30.123Z"
  }
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword"
}
```

**Response**:
```json
{
  "message": "Password changed successfully"
}
```

#### Deactivate Account
```http
DELETE /api/auth/deactivate
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "password": "currentpassword"
}
```

**Response**:
```json
{
  "message": "Account deactivated successfully"
}
```

---

### 💼 Internship Endpoints

#### List All Internships
```http
GET /api/internships?limit=50&skip=0
```

**Query Parameters**:
- `limit` (optional): Number of internships to return (default: 50)
- `skip` (optional): Number of internships to skip (default: 0)

**Response**:
```json
{
  "count": 4,
  "items": [
    {
      "_id": "68c48b48f952744af547cbdc",
      "title": "Software Intern - eGov",
      "org": "Dept. of IT",
      "org_type": "Govt Dept",
      "description": "Work on government digital initiatives...",
      "skills_required": ["Java", "SQL", "Excel"],
      "skills_nice_to_have": ["Spring Boot", "React"],
      "education_required": {
        "degree": ["B.Tech", "B.Sc"],
        "branches": ["CSE", "IT"],
        "year_min": 2
      },
      "location": "Bengaluru",
      "is_remote": false,
      "stipend": 12000,
      "duration_months": 6,
      "application_deadline": "2025-11-30T00:00:00.000Z",
      "language_required": ["en"],
      "diversity_eligibility": {
        "women_only": false,
        "pwd_friendly": true,
        "ews_priority": true
      },
      "geo": {
        "type": "Point",
        "coordinates": [77.5946, 12.9716]
      },
      "verified": true,
      "posted_at": "2025-09-01T00:00:00.000Z",
      "posted_by": "system",
      "isActive": true,
      "application_count": 0
    }
  ]
}
```

#### Get Specific Internship
```http
GET /api/internships/:id
```

**Response**:
```json
{
  "_id": "68c48b48f952744af547cbdc",
  "title": "Software Intern - eGov",
  "org": "Dept. of IT",
  "org_type": "Govt Dept",
  "description": "Work on government digital initiatives...",
  "skills_required": ["Java", "SQL", "Excel"],
  "skills_nice_to_have": ["Spring Boot", "React"],
  "education_required": {
    "degree": ["B.Tech", "B.Sc"],
    "branches": ["CSE", "IT"],
    "year_min": 2
  },
  "location": "Bengaluru",
  "is_remote": false,
  "stipend": 12000,
  "duration_months": 6,
  "application_deadline": "2025-11-30T00:00:00.000Z",
  "language_required": ["en"],
  "diversity_eligibility": {
    "women_only": false,
    "pwd_friendly": true,
    "ews_priority": true
  },
  "geo": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  },
  "verified": true,
  "posted_at": "2025-09-01T00:00:00.000Z",
  "posted_by": "system",
  "isActive": true,
  "application_count": 0
}
```

---

### 🎯 Recommendation Endpoints

#### Get Personalized Recommendations
```http
GET /api/recommendations?limit=10
Authorization: Bearer <token>
```

**Query Parameters**:
- `limit` (optional): Number of recommendations to return (default: 10)

**Response**:
```json
{
  "count": 1,
  "items": [
    {
      "id": "68c48b48f952744af547cbdc",
      "title": "Software Intern - eGov",
      "org": "Dept. of IT",
      "score": 16.002,
      "explain": {
        "passed_rules": [
          "edu_degree",
          "edu_year",
          "skills_required",
          "deadline",
          "language_required",
          "women_only"
        ],
        "soft_scores": {
          "stipend_pref": 1,
          "location_proximity": 1,
          "org_type_affinity": 1,
          "skills_nice_to_have": 0,
          "role_keyword": 1
        },
        "fairness": 0.2,
        "tie_breaker": 10002
      }
    }
  ]
}
```

**Score Explanation**:
- `passed_rules`: Hard eligibility rules that passed
- `soft_scores`: Individual soft scoring components
- `fairness`: Fairness boost (EWS, women, PwD)
- `tie_breaker`: Application count for final ranking

---

### 🔍 Filter Endpoints

#### Get Filter Facets
```http
GET /api/facets
```

**Response**:
```json
{
  "skills": ["Java", "Python", "React", "SQL", "Excel", "C++", "JavaScript"],
  "degrees": ["B.Tech", "B.Sc", "M.Tech", "M.Sc"],
  "branches": ["CSE", "IT", "ECE", "EEE", "ME", "CE"],
  "org_types": ["Private", "Startup", "Govt Dept", "PSU", "MNC"],
  "locations": ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Remote"],
  "stipend_ranges": [
    {"min": 0, "max": 5000, "label": "0-5k"},
    {"min": 5000, "max": 10000, "label": "5-10k"},
    {"min": 10000, "max": 15000, "label": "10-15k"},
    {"min": 15000, "max": 20000, "label": "15-20k"},
    {"min": 20000, "max": 999999, "label": "20k+"}
  ]
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📊 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## 🔧 Testing the API

### Using cURL
```bash
# Health check
curl http://localhost:8080/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "asha@univ.edu", "password": "password123"}'

# Get recommendations (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/recommendations?limit=5
```

### Using Postman
1. Import the collection
2. Set base URL to `http://localhost:8080`
3. Use the login endpoint to get a token
4. Set the token in Authorization header
5. Test other endpoints

### Using JavaScript
```javascript
// Login and get token
const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'asha@univ.edu',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// Get recommendations
const recommendationsResponse = await fetch('http://localhost:8080/api/recommendations?limit=5', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const recommendations = await recommendationsResponse.json();
console.log(recommendations);
```

---

## 🚀 Production Considerations

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secure-secret
CORS_ORIGIN=https://your-domain.com
```

### Security Headers
- HTTPS required
- CORS properly configured
- Rate limiting enabled
- Input validation on all endpoints

### Monitoring
- Health check endpoint for monitoring
- Error logging and tracking
- Performance metrics
- Database connection monitoring

---

This API documentation provides comprehensive information about all available endpoints, request/response formats, and usage examples for the Phantom Troupe Recommender system.
