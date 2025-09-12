# Phantom Troupe - Rule-Based Internship Recommender

A comprehensive internship recommendation system built for the Smart India Hackathon 2024. This system combines rule-based filtering with machine learning to provide personalized internship recommendations to students.

## 📚 Documentation

- **[Complete Setup Guide](./SETUP-GUIDE.md)** - Step-by-step installation and configuration
- **[Component Guide](./COMPONENT-GUIDE.md)** - Detailed explanation of system architecture
- **[API Documentation](./API-DOCUMENTATION.md)** - Complete API reference and examples
- **[Demo Script](./DEMO-SCRIPT.md)** - Comprehensive demonstration guide

## 🚀 Features

### Core Functionality
- **AI-Powered Matching**: Advanced algorithms analyze user profiles to match with relevant internships
- **Rule-Based Filtering**: Hard eligibility filters (degree, year, skills, deadline) and soft ranking rules
- **JWT Authentication**: Secure role-based access (students vs organization admins)
- **MongoDB Integration**: Scalable database with proper indexing for performance
- **Real-time Recommendations**: Dynamic updates based on user preferences

### User Experience
- **Mobile-Friendly UI**: Responsive design built with React and Tailwind CSS
- **Multi-language Support**: Ready for regional language integration
- **Accessibility**: Inclusive design for all users
- **Intuitive Interface**: Clean, modern UI with easy navigation

### Technical Features
- **RESTful API**: Well-documented endpoints with proper error handling
- **Rate Limiting**: Protection against abuse
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Graceful error management throughout the application

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **js-yaml** - Configuration management

### Frontend
- **React 18** with **TypeScript** - UI framework
- **Tailwind CSS** - Styling and responsive design
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Headless UI** - Accessible UI components

### Recommendation Engine
- **Rule-based System** - YAML-driven configuration
- **Machine Learning Ready** - Extensible architecture for ML integration
- **Scoring Algorithm** - Multi-factor scoring system
- **Fairness Boost** - Diversity and inclusion considerations

## 📁 Project Structure

```
phantom-troupe-recommender/
├── src/
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Internship.js
│   │   └── index.js
│   ├── routes/                 # API routes
│   │   └── recommendations.js
│   ├── rules/                  # Rule engine
│   │   ├── config.yaml
│   │   ├── engine.js
│   │   └── loader.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js
│   ├── controllers/            # Business logic
│   │   └── authController.js
│   └── server.js              # Main server file
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   └── App.tsx
│   └── package.json
├── data/                      # Sample data
│   ├── users.json
│   └── internships.json
├── scripts/                   # Utility scripts
│   └── seed.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd phantom-troupe-recommender
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phantom-troupe-recommender
   JWT_SECRET=your-super-secret-jwt-key
   PORT=8080
   NODE_ENV=development
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```

7. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Health Check: http://localhost:8080/health

## 🔑 Default Login Credentials

- **Admin**: admin@phantom-troupe.com / admin123
- **Student**: asha@univ.edu / password123
- **Test Student**: student@test.com / password123
- **Test Admin**: orgadmin@test.com / password123

## 📚 API Documentation

### Authentication Endpoints
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

## 🎯 Recommendation Algorithm

### Hard Rules (Eligibility Filters)
1. **Education Match**: Degree and branch requirements
2. **Year Requirement**: Minimum academic year
3. **Skills Match**: Required skills must be present
4. **Deadline Check**: Application deadline not passed
5. **Language Support**: Language preferences match
6. **Diversity Eligibility**: Gender and special considerations

### Soft Rules (Scoring)
1. **Stipend Preference**: Higher score for preferred stipend range
2. **Location Proximity**: Geographic distance consideration
3. **Organization Type**: Preference matching
4. **Nice-to-Have Skills**: Bonus points for additional skills
5. **Role Keywords**: Title and description keyword matching

### Fairness Boost
- **Women**: 10% boost for women candidates
- **PwD**: 15% boost for persons with disabilities
- **EWS**: 10% boost for economically weaker sections

## 🔧 Configuration

### Rule Engine Configuration
The recommendation rules are defined in `src/rules/config.yaml`. You can modify:
- Hard eligibility rules
- Soft scoring weights
- Fairness boost percentages
- Tie-breaker criteria

### Database Indexes
Optimized indexes are created for:
- User email and role
- Education fields
- Skills and preferences
- Internship metadata
- Geospatial queries

## 🧪 Testing

### Backend Testing
```bash
# Test API endpoints
curl -X GET http://localhost:8080/health
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "asha@univ.edu", "password": "password123"}'
```

### Frontend Testing
- Navigate to http://localhost:3000
- Test user registration and login
- Verify recommendation display
- Test responsive design on different screen sizes

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to cloud platform (Heroku, AWS, etc.)
4. Run database migration: `npm run seed`

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API URL in environment variables

## 🔮 Future Enhancements

### Machine Learning Integration
- **Collaborative Filtering**: User behavior analysis
- **Content-Based Filtering**: Enhanced skill matching
- **Hybrid Approach**: Combining multiple ML models

### Advanced Features
- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: User engagement metrics
- **Multi-language Support**: i18n implementation
- **Mobile App**: React Native version

### Integration Capabilities
- **PM Internship Portal**: Direct integration
- **Third-party APIs**: Job board integration
- **Analytics**: Google Analytics integration
- **Monitoring**: Application performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is developed for the Smart India Hackathon 2024.

## 👥 Team

- **Backend Development**: Node.js, Express, MongoDB
- **Frontend Development**: React, TypeScript, Tailwind CSS
- **Recommendation Engine**: Rule-based system with ML readiness
- **UI/UX Design**: Mobile-first, accessible design

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Smart India Hackathon 2024**