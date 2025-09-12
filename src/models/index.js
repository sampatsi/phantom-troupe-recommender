import mongoose from 'mongoose';
import User from './User.js';
import Internship from './Internship.js';

// Export models
export { User, Internship };

// Database connection function
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phantom-troupe-recommender';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Database disconnection function
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

// Database health check
export const checkDBHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return {
      status: states[state] || 'unknown',
      ready: state === 1
    };
  } catch (error) {
    return {
      status: 'error',
      ready: false,
      error: error.message
    };
  }
};
