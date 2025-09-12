import express from 'express';
import dayjs from 'dayjs';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { loadRules } from './rules/loader.js';
import { recommend } from './routes/recommendations.js';
import { connectDB, checkDBHealth } from './models/index.js';
import { authenticate, optionalAuth, rateLimit } from './middleware/auth.js';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword, 
  deactivateAccount 
} from './controllers/authController.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Load rules config
const rules = loadRules(path.join(__dirname, './rules/config.yaml'));

// Health check with database status
app.get('/health', async (req, res) => {
  const dbHealth = await checkDBHealth();
  res.json({ 
    ok: true, 
    now: dayjs().toISOString(),
    database: dbHealth
  });
});

// Authentication routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/profile', authenticate, getProfile);
app.put('/api/auth/profile', authenticate, updateProfile);
app.put('/api/auth/change-password', authenticate, changePassword);
app.delete('/api/auth/deactivate', authenticate, deactivateAccount);

// Facets (derived from MongoDB data)
app.get('/api/facets', async (req, res) => {
  try {
    const { Internship } = await import('./models/index.js');
    
    const locations = await Internship.distinct('location', { 
      verified: true, 
      isActive: true 
    });
    const orgTypes = await Internship.distinct('org_type', { 
      verified: true, 
      isActive: true 
    });
    
    res.json({ 
      locations: locations.filter(Boolean).sort(), 
      org_types: orgTypes.filter(Boolean).sort() 
    });
  } catch (error) {
    console.error('Error fetching facets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List all internships (public access)
app.get('/api/internships', async (req, res) => {
  try {
    const { Internship } = await import('./models/index.js');
    const limit = parseInt(req.query.limit || '50', 10);
    const skip = parseInt(req.query.skip || '0', 10);
    
    const internships = await Internship.find({ 
      verified: true, 
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    res.json({
      count: internships.length,
      items: internships
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Single internship (public access)
app.get('/api/internships/:id', async (req, res) => {
  try {
    const { Internship } = await import('./models/index.js');
    
    const job = await Internship.findOne({ 
      _id: req.params.id, 
      verified: true, 
      isActive: true 
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Recommendations (requires authentication)
app.get('/api/recommendations', authenticate, async (req, res) => {
  try {
    const { User, Internship } = await import('./models/index.js');
    const limit = parseInt(req.query.limit || '10', 10);
    
    // Get user from database
    console.log('Looking for user with ID:', req.user.userId);
    const user = await User.findById(req.user.userId);
    console.log('Found user:', user ? user.name : 'null');
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    // Get internships from database
    const internships = await Internship.find({
      verified: true,
      isActive: true,
      application_deadline: { $gte: new Date() }
    }).limit(1000); // Limit for performance
    
    const result = recommend({ user, internships, rules, limit });
    res.json(result);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const port = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(port, () => {
      console.log(`🚀 Phantom Troupe Recommender listening on http://localhost:${port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
