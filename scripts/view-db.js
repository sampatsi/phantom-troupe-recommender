#!/usr/bin/env node

/**
 * View Database Script
 * 
 * This script allows you to view and explore the MongoDB database
 * collections and documents for the Phantom Troupe Recommender.
 * 
 * Usage:
 *   node scripts/view-db.js
 *   MONGODB_URI="your-connection-string" node scripts/view-db.js
 *   node scripts/view-db.js --collection users
 *   node scripts/view-db.js --collection internships --limit 5
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
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

const viewUsers = async (limit = 10) => {
  const { User } = await import('../src/models/User.js');
  
  console.log('\n👥 USERS COLLECTION');
  console.log('='.repeat(50));
  
  const totalUsers = await User.countDocuments();
  console.log(`Total Users: ${totalUsers}`);
  
  const users = await User.find({})
    .select('-password') // Exclude password field
    .limit(limit)
    .sort({ createdAt: -1 });
  
  console.log(`\nShowing ${users.length} users (most recent first):`);
  
  users.forEach((user, index) => {
    console.log(`\n--- User ${index + 1} ---`);
    console.log(`ID: ${user._id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Education: ${user.education?.degree} ${user.education?.branch}, Year ${user.education?.year}`);
    console.log(`Skills: ${user.skills?.join(', ') || 'None'}`);
    console.log(`Location: ${user.geo?.coordinates ? `[${user.geo.coordinates[1]}, ${user.geo.coordinates[0]}]` : 'Not set'}`);
    console.log(`Active: ${user.isActive ? 'Yes' : 'No'}`);
    console.log(`Created: ${user.createdAt}`);
  });
  
  // Statistics
  const students = await User.countDocuments({ role: 'student' });
  const orgAdmins = await User.countDocuments({ role: 'org_admin' });
  const activeUsers = await User.countDocuments({ isActive: true });
  
  console.log('\n📊 User Statistics:');
  console.log(`Students: ${students}`);
  console.log(`Org Admins: ${orgAdmins}`);
  console.log(`Active Users: ${activeUsers}`);
  console.log(`Inactive Users: ${totalUsers - activeUsers}`);
};

const viewInternships = async (limit = 10) => {
  const { Internship } = await import('../src/models/Internship.js');
  
  console.log('\n💼 INTERNSHIPS COLLECTION');
  console.log('='.repeat(50));
  
  const totalInternships = await Internship.countDocuments();
  console.log(`Total Internships: ${totalInternships}`);
  
  const internships = await Internship.find({})
    .limit(limit)
    .sort({ posted_at: -1 });
  
  console.log(`\nShowing ${internships.length} internships (most recent first):`);
  
  internships.forEach((internship, index) => {
    console.log(`\n--- Internship ${index + 1} ---`);
    console.log(`ID: ${internship._id}`);
    console.log(`Title: ${internship.title}`);
    console.log(`Organization: ${internship.org} (${internship.org_type})`);
    console.log(`Location: ${internship.location} ${internship.is_remote ? '(Remote)' : ''}`);
    console.log(`Stipend: ₹${internship.stipend?.toLocaleString() || 'Not specified'}`);
    console.log(`Duration: ${internship.duration_months} months`);
    console.log(`Deadline: ${internship.application_deadline?.toLocaleDateString() || 'Not set'}`);
    console.log(`Skills Required: ${internship.skills_required?.join(', ') || 'None'}`);
    console.log(`Education: ${internship.education_required?.degree?.join('/') || 'Any'} ${internship.education_required?.branches?.join('/') || ''}, Year ${internship.education_required?.year_min || 'Any'}+`);
    console.log(`Diversity: Women-only: ${internship.diversity_eligibility?.women_only ? 'Yes' : 'No'}, PwD-friendly: ${internship.diversity_eligibility?.pwd_friendly ? 'Yes' : 'No'}, EWS Priority: ${internship.diversity_eligibility?.ews_priority ? 'Yes' : 'No'}`);
    console.log(`Verified: ${internship.verified ? 'Yes' : 'No'}`);
    console.log(`Active: ${internship.isActive ? 'Yes' : 'No'}`);
    console.log(`Applications: ${internship.application_count || 0}`);
    console.log(`Posted: ${internship.posted_at?.toLocaleDateString() || 'Not set'}`);
  });
  
  // Statistics
  const verifiedInternships = await Internship.countDocuments({ verified: true });
  const activeInternships = await Internship.countDocuments({ isActive: true });
  const remoteInternships = await Internship.countDocuments({ is_remote: true });
  const womenOnlyInternships = await Internship.countDocuments({ 'diversity_eligibility.women_only': true });
  const ewsPriorityInternships = await Internship.countDocuments({ 'diversity_eligibility.ews_priority': true });
  
  console.log('\n📊 Internship Statistics:');
  console.log(`Verified: ${verifiedInternships}`);
  console.log(`Active: ${activeInternships}`);
  console.log(`Remote: ${remoteInternships}`);
  console.log(`Women-only: ${womenOnlyInternships}`);
  console.log(`EWS Priority: ${ewsPriorityInternships}`);
};

const viewDatabaseStats = async () => {
  const { User, Internship } = await import('../src/models/index.js');
  
  console.log('\n📊 DATABASE STATISTICS');
  console.log('='.repeat(50));
  
  const userCount = await User.countDocuments();
  const internshipCount = await Internship.countDocuments();
  
  console.log(`Total Collections: 2`);
  console.log(`Users: ${userCount}`);
  console.log(`Internships: ${internshipCount}`);
  
  // Database size estimation
  const userSize = await User.estimatedDocumentCount();
  const internshipSize = await Internship.estimatedDocumentCount();
  
  console.log(`\nEstimated Document Count:`);
  console.log(`Users: ${userSize}`);
  console.log(`Internships: ${internshipSize}`);
  
  // Recent activity
  const recentUsers = await User.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });
  
  const recentInternships = await Internship.countDocuments({
    posted_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });
  
  console.log(`\nRecent Activity (Last 24 hours):`);
  console.log(`New Users: ${recentUsers}`);
  console.log(`New Internships: ${recentInternships}`);
};

const searchUsers = async (query) => {
  const { User } = await import('../src/models/User.js');
  
  console.log(`\n🔍 SEARCHING USERS: "${query}"`);
  console.log('='.repeat(50));
  
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { skills: { $in: [new RegExp(query, 'i')] } }
    ]
  }).select('-password').limit(10);
  
  if (users.length === 0) {
    console.log('No users found matching the query.');
    return;
  }
  
  console.log(`Found ${users.length} users:`);
  
  users.forEach((user, index) => {
    console.log(`\n--- User ${index + 1} ---`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Skills: ${user.skills?.join(', ') || 'None'}`);
  });
};

const searchInternships = async (query) => {
  const { Internship } = await import('../src/models/Internship.js');
  
  console.log(`\n🔍 SEARCHING INTERNSHIPS: "${query}"`);
  console.log('='.repeat(50));
  
  const internships = await Internship.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { org: { $regex: query, $options: 'i' } },
      { skills_required: { $in: [new RegExp(query, 'i')] } },
      { location: { $regex: query, $options: 'i' } }
    ]
  }).limit(10);
  
  if (internships.length === 0) {
    console.log('No internships found matching the query.');
    return;
  }
  
  console.log(`Found ${internships.length} internships:`);
  
  internships.forEach((internship, index) => {
    console.log(`\n--- Internship ${index + 1} ---`);
    console.log(`Title: ${internship.title}`);
    console.log(`Organization: ${internship.org}`);
    console.log(`Location: ${internship.location}`);
    console.log(`Skills: ${internship.skills_required?.join(', ') || 'None'}`);
    console.log(`Stipend: ₹${internship.stipend?.toLocaleString() || 'Not specified'}`);
  });
};

const main = async () => {
  try {
    await connectDB();
    
    const args = process.argv.slice(2);
    const collection = args.find(arg => arg.startsWith('--collection'))?.split('=')[1];
    const limit = parseInt(args.find(arg => arg.startsWith('--limit'))?.split('=')[1] || '10');
    const search = args.find(arg => arg.startsWith('--search'))?.split('=')[1];
    
    if (search) {
      await searchUsers(search);
      await searchInternships(search);
    } else if (collection === 'users') {
      await viewUsers(limit);
    } else if (collection === 'internships') {
      await viewInternships(limit);
    } else {
      await viewDatabaseStats();
      await viewUsers(5);
      await viewInternships(5);
    }
    
    console.log('\n✅ Database view completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error viewing database:', error);
    process.exit(1);
  }
};

main();
