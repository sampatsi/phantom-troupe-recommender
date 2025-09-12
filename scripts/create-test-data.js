#!/usr/bin/env node

/**
 * Create Test Data Script
 * 
 * This script creates comprehensive test data for the Phantom Troupe Recommender
 * including various user profiles and internship opportunities to demonstrate
 * the rule-based filtering system effectively.
 * 
 * Usage:
 *   node scripts/create-test-data.js
 *   MONGODB_URI="your-connection-string" node scripts/create-test-data.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const createTestUsers = async () => {
  const { User } = await import('../src/models/User.js');
  
  console.log('👥 Creating comprehensive test users...');
  
  const testUsers = [
    // Computer Science Students
    {
      name: 'Asha Patel',
      email: 'asha@univ.edu',
      password: await hashPassword('password123'),
      role: 'student',
      education: {
        degree: 'B.Tech',
        branch: 'CSE',
        year: 3,
        cgpa: 8.1
      },
      skills: ['Java', 'SQL', 'Excel', 'Hindi'],
      certifications: ['NPTEL-ML'],
      preferences: {
        roles: ['Software', 'Data'],
        locations: ['Bengaluru', 'Remote'],
        stiped_min: 8000,
        org_types: ['Govt Dept', 'PSU', 'Private']
      },
      constraints: {
        disability: false,
        gender: 'F',
        income_band: 'EWS'
      },
      language_pref: ['hi', 'en'],
      geo: {
        type: 'Point',
        coordinates: [77.5946, 12.9716] // Bengaluru
      },
      isActive: true,
      lastLogin: new Date()
    },
    {
      name: 'Rajesh Kumar',
      email: 'rajesh@tech.edu',
      password: await hashPassword('password123'),
      role: 'student',
      education: {
        degree: 'B.Tech',
        branch: 'CSE',
        year: 4,
        cgpa: 9.2
      },
      skills: ['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
      certifications: ['AWS Cloud Practitioner', 'Google Cloud'],
      preferences: {
        roles: ['Software', 'DevOps'],
        locations: ['Mumbai', 'Pune', 'Remote'],
        stiped_min: 15000,
        org_types: ['Private', 'Startup', 'MNC']
      },
      constraints: {
        disability: false,
        gender: 'M',
        income_band: 'General'
      },
      language_pref: ['en'],
      geo: {
        type: 'Point',
        coordinates: [72.8777, 19.0760] // Mumbai
      },
      isActive: true,
      lastLogin: new Date()
    },
    {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: await hashPassword('password123'),
      role: 'student',
      education: {
        degree: 'M.Tech',
        branch: 'CSE',
        year: 2,
        cgpa: 8.8
      },
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'R', 'Statistics'],
      certifications: ['Coursera ML', 'Deep Learning Specialization'],
      preferences: {
        roles: ['Data', 'Research'],
        locations: ['Bengaluru', 'Hyderabad', 'Remote'],
        stiped_min: 20000,
        org_types: ['Private', 'Research Institute']
      },
      constraints: {
        disability: false,
        gender: 'F',
        income_band: 'General'
      },
      language_pref: ['en', 'hi'],
      geo: {
        type: 'Point',
        coordinates: [77.5946, 12.9716] // Bengaluru
      },
      isActive: true,
      lastLogin: new Date()
    },
    {
      name: 'Amit Singh',
      email: 'amit@college.edu',
      password: await hashPassword('password123'),
      role: 'student',
      education: {
        degree: 'B.Tech',
        branch: 'ECE',
        year: 3,
        cgpa: 7.5
      },
      skills: ['C++', 'Embedded Systems', 'Arduino', 'Python'],
      certifications: ['IoT Fundamentals'],
      preferences: {
        roles: ['Hardware', 'Software'],
        locations: ['Delhi', 'Noida', 'Gurgaon'],
        stiped_min: 10000,
        org_types: ['Private', 'PSU']
      },
      constraints: {
        disability: true,
        gender: 'M',
        income_band: 'EWS'
      },
      language_pref: ['en', 'hi'],
      geo: {
        type: 'Point',
        coordinates: [77.1025, 28.7041] // Delhi
      },
      isActive: true,
      lastLogin: new Date()
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha@university.edu',
      password: await hashPassword('password123'),
      role: 'student',
      education: {
        degree: 'B.Sc',
        branch: 'CSE',
        year: 3,
        cgpa: 8.5
      },
      skills: ['Web Development', 'HTML', 'CSS', 'JavaScript', 'PHP'],
      certifications: ['Web Development Bootcamp'],
      preferences: {
        roles: ['Design', 'Software'],
        locations: ['Hyderabad', 'Bengaluru', 'Remote'],
        stiped_min: 12000,
        org_types: ['Startup', 'Private']
      },
      constraints: {
        disability: false,
        gender: 'F',
        income_band: 'General'
      },
      language_pref: ['en', 'te'],
      geo: {
        type: 'Point',
        coordinates: [78.4744, 17.3850] // Hyderabad
      },
      isActive: true,
      lastLogin: new Date()
    },
    // Organization Admins
    {
      name: 'Dr. Ravi Verma',
      email: 'ravi@techcorp.com',
      password: await hashPassword('password123'),
      role: 'org_admin',
      education: {
        degree: 'M.Tech',
        branch: 'CSE',
        year: 5,
        cgpa: 9.0
      },
      skills: ['Management', 'Recruitment', 'HR', 'Leadership'],
      certifications: ['PMP', 'HR Management'],
      preferences: {
        roles: ['Management'],
        locations: ['Bengaluru'],
        stiped_min: 0,
        org_types: ['Private']
      },
      constraints: {
        disability: false,
        gender: 'M',
        income_band: 'General'
      },
      language_pref: ['en', 'hi'],
      geo: {
        type: 'Point',
        coordinates: [77.5946, 12.9716] // Bengaluru
      },
      isActive: true,
      lastLogin: new Date()
    },
    {
      name: 'Ms. Sunita Iyer',
      email: 'sunita@govt.org',
      password: await hashPassword('password123'),
      role: 'org_admin',
      education: {
        degree: 'M.Tech',
        branch: 'IT',
        year: 5,
        cgpa: 8.8
      },
      skills: ['Public Policy', 'Digital Governance', 'Management'],
      certifications: ['Public Administration', 'Digital India'],
      preferences: {
        roles: ['Management'],
        locations: ['Delhi'],
        stiped_min: 0,
        org_types: ['Govt Dept']
      },
      constraints: {
        disability: false,
        gender: 'F',
        income_band: 'General'
      },
      language_pref: ['en', 'hi'],
      geo: {
        type: 'Point',
        coordinates: [77.1025, 28.7041] // Delhi
      },
      isActive: true,
      lastLogin: new Date()
    }
  ];

  const createdUsers = [];
  for (const userData of testUsers) {
    const user = new User(userData);
    await user.save();
    createdUsers.push(user);
  }
  
  console.log(`✅ Created ${createdUsers.length} test users`);
  return createdUsers;
};

const createTestInternships = async () => {
  const { Internship } = await import('../src/models/Internship.js');
  
  console.log('💼 Creating comprehensive test internships...');
  
  const testInternships = [
    // Software Development Internships
    {
      title: 'Software Intern - eGov',
      org: 'Dept. of IT',
      org_type: 'Govt Dept',
      description: 'Work on government digital initiatives and e-governance projects. Develop web applications using Java and SQL for citizen services.',
      skills_required: ['Java', 'SQL', 'Excel'],
      skills_nice_to_have: ['Spring Boot', 'React', 'Angular'],
      education_required: {
        degree: ['B.Tech', 'B.Sc'],
        branches: ['CSE', 'IT'],
        year_min: 2
      },
      location: 'Bengaluru',
      is_remote: false,
      stipend: 12000,
      duration_months: 6,
      application_deadline: new Date('2025-11-30'),
      language_required: ['en'],
      diversity_eligibility: {
        women_only: false,
        pwd_friendly: true,
        ews_priority: true
      },
      geo: {
        type: 'Point',
        coordinates: [77.5946, 12.9716] // Bengaluru
      },
      verified: true,
      posted_at: new Date('2025-09-01'),
      posted_by: 'system',
      isActive: true,
      application_count: 0
    },
    {
      title: 'Women in Tech – Web Intern',
      org: 'Startup Hub',
      org_type: 'Startup',
      description: 'Build modern web applications using JavaScript and React. Work on frontend development and user experience design.',
      skills_required: ['JavaScript'],
      skills_nice_to_have: ['React', 'Node.js', 'CSS', 'HTML'],
      education_required: {
        degree: ['B.Tech', 'B.Sc'],
        branches: ['CSE', 'IT'],
        year_min: 2
      },
      location: 'Mumbai',
      is_remote: true,
      stipend: 15000,
      duration_months: 4,
      application_deadline: new Date('2025-10-10'),
      language_required: ['en'],
      diversity_eligibility: {
        women_only: true,
        pwd_friendly: true,
        ews_priority: true
      },
      geo: {
        type: 'Point',
        coordinates: [72.8777, 19.0760] // Mumbai
      },
      verified: true,
      posted_at: new Date('2025-09-05'),
      posted_by: 'system',
      isActive: true,
      application_count: 0
    },
    {
      title: 'Data Intern - City Analytics',
      org: 'Smart City Lab',
      org_type: 'Research Institute',
      description: 'Analyze urban data using Python and Excel. Work on smart city initiatives and data visualization projects.',
      skills_required: ['Python', 'Excel'],
      skills_nice_to_have: ['Pandas', 'NumPy', 'Matplotlib', 'SQL'],
      education_required: {
        degree: ['B.Tech', 'B.Sc'],
        branches: ['CSE', 'IT', 'ECE'],
        year_min: 2
      },
      location: 'Hyderabad',
      is_remote: false,
      stipend: 18000,
      duration_months: 5,
      application_deadline: new Date('2025-10-15'),
      language_required: ['en'],
      diversity_eligibility: {
        women_only: false,
        pwd_friendly: true,
        ews_priority: false
      },
      geo: {
        type: 'Point',
        coordinates: [78.4744, 17.3850] // Hyderabad
      },
      verified: true,
      posted_at: new Date('2025-09-08'),
      posted_by: 'system',
      isActive: true,
      application_count: 0
    },
    {
      title: 'Software Intern - Telecom',
      org: 'Telecom PSU',
      org_type: 'PSU',
      description: 'Develop telecom applications using C++ and Java. Work on network management and communication systems.',
      skills_required: ['C++', 'Java'],
      skills_nice_to_have: ['Linux', 'Networking', 'Database'],
      education_required: {
        degree: ['B.Tech'],
        branches: ['CSE', 'IT', 'ECE'],
        year_min: 3
      },
      location: 'Delhi',
      is_remote: false,
      stipend: 14000,
      duration_months: 6,
      application_deadline: new Date('2025-09-25'),
      language_required: ['en', 'hi'],
      diversity_eligibility: {
        women_only: false,
        pwd_friendly: false,
        ews_priority: false
      },
      geo: {
        type: 'Point',
        coordinates: [77.1025, 28.7041] // Delhi
      },
      verified: true,
      posted_at: new Date('2025-08-20'),
      posted_by: 'system',
      isActive: true,
      application_count: 0
    },
    {
      title: 'Machine Learning Intern',
      org: 'AI Research Lab',
      org_type: 'Private',
      description: 'Work on machine learning projects using Python and TensorFlow. Develop AI models for various applications.',
      skills_required: ['Python', 'Machine Learning'],
      skills_nice_to_have: ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy'],
      education_required: {
        degree: ['M.Tech', 'B.Tech'],
        branches: ['CSE', 'IT'],
        year_min: 2
      },
      location: 'Bengaluru',
      is_remote: true,
      stipend: 25000,
      duration_months: 8,
      application_deadline: new Date('2025-12-15'),
      language_required: ['en'],
      diversity_eligibility: {
        women_only: false,
        pwd_friendly: true,
        ews_priority: true
      },
      geo: {
        type: 'Point',
        coordinates: [77.5946, 12.9716] // Bengaluru
      },
      verified: true,
      posted_at: new Date('2025-09-10'),
      posted_by: 'system',
      isActive: true,
      application_count: 0
    },
    {
      title: 'Web Development Intern',
      org: 'Digital Agency',
      org_type: 'Startup',
      description: 'Build responsive websites using HTML, CSS, and JavaScript. Work on client projects and learn modern web technologies.',
      skills_required: ['HTML', 'CSS', 'JavaScript'],
      skills_nice_to_have: ['React', 'Vue.js', 'PHP', 'WordPress'],
      education_required: {
        degree: ['B.Tech', 'B.Sc', 'BCA'],
        branches: ['CSE', 'IT'],
        year_min: 2
      },
      location: 'Pune',
      is_remote: true,
      stipend: 10000,
      duration_months: 3,
      application_deadline: new Date('2025-10-30'),
      language_required: ['en'],
      diversity_eligibility: {
        women_only: false,
        pwd_friendly: true,
        ews_priority: false
      },
      geo: {
        type: 'Point',
        coordinates: [73.8567, 18.5204] // Pune
      },
      verified: true,
      posted_at: new Date('2025-09-12'),
      posted_by: 'system',
      isActive: true,
      application_count: 0
    },
    {
      title: 'Embedded Systems Intern',
      org: 'Electronics Corp',
      org_type: 'Private',
      description: 'Work on embedded systems development using C++ and Arduino. Develop IoT solutions and hardware prototypes.',
      skills_required: ['C++', 'Embedded Systems'],
      skills_nice_to_have: ['Arduino', 'Raspberry Pi', 'Python', 'Linux'],
      education_required: {
        degree: ['B.Tech'],
        branches: ['ECE', 'CSE'],
        year_min: 3
      },
      location: 'Noida',
      is_remote: false,
      stipend: 16000,
      duration_months: 6,
      application_deadline: new Date('2025-11-20'),
      language_required: ['en', 'hi'],
      diversity_eligibility: {
        women_only: false,
        pwd_friendly: true,
        ews_priority: true
      },
      geo: {
        type: 'Point',
        coordinates: [77.3910, 28.5355] // Noida
      },
      verified: true,
      posted_at: new Date('2025-09-15'),
      posted_by: 'system',
      isActive: true,
      application_count: 0
    },
    {
      title: 'DevOps Intern',
      org: 'Cloud Solutions Inc',
      org_type: 'MNC',
      description: 'Learn cloud technologies and DevOps practices. Work on AWS, Docker, and CI/CD pipelines.',
      skills_required: ['Linux', 'Python'],
      skills_nice_to_have: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
      education_required: {
        degree: ['B.Tech', 'M.Tech'],
        branches: ['CSE', 'IT'],
        year_min: 2
      },
      location: 'Gurgaon',
      is_remote: true,
      stipend: 20000,
      duration_months: 6,
      application_deadline: new Date('2025-12-01'),
      language_required: ['en'],
      diversity_eligibility: {
        women_only: false,
        pwd_friendly: true,
        ews_priority: false
      },
      geo: {
        type: 'Point',
        coordinates: [77.0266, 28.4595] // Gurgaon
      },
      verified: true,
      posted_at: new Date('2025-09-18'),
      posted_by: 'system',
      isActive: true,
      application_count: 0
    }
  ];

  const createdInternships = [];
  for (const internshipData of testInternships) {
    const internship = new Internship(internshipData);
    await internship.save();
    createdInternships.push(internship);
  }
  
  console.log(`✅ Created ${createdInternships.length} test internships`);
  return createdInternships;
};

const createSystemAdmin = async () => {
  const { User } = await import('../src/models/User.js');
  
  console.log('👤 Creating system administrator...');
  
  const adminData = {
    name: 'System Administrator',
    email: 'admin@phantom-troupe.com',
    password: await hashPassword('admin123'),
    role: 'org_admin',
    education: {
      degree: 'M.Tech',
      branch: 'CSE',
      year: 5,
      cgpa: 9.5
    },
    skills: ['Management', 'Leadership', 'System Administration'],
    certifications: ['PMP', 'ITIL'],
    preferences: {
      roles: ['Management'],
      locations: ['Bengaluru'],
      stiped_min: 0,
      org_types: ['Private']
    },
    constraints: {
      disability: false,
      gender: 'M',
      income_band: 'General'
    },
    language_pref: ['en'],
    geo: {
      type: 'Point',
      coordinates: [77.5946, 12.9716] // Bengaluru
    },
    isActive: true,
    lastLogin: new Date()
  };

  const admin = new User(adminData);
  await admin.save();
  console.log(`✅ Created admin user: ${adminData.email}`);
  return admin;
};

const main = async () => {
  try {
    console.log('🌱 Starting comprehensive test data creation...');
    
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    const { User, Internship } = await import('../src/models/index.js');
    await User.deleteMany({});
    await Internship.deleteMany({});
    
    // Create system admin
    await createSystemAdmin();
    
    // Create test users
    const users = await createTestUsers();
    
    // Create test internships
    const internships = await createTestInternships();
    
    // Summary
    console.log('\n📊 Test Data Creation Summary:');
    console.log(`👥 Total Users: ${await User.countDocuments()}`);
    console.log(`💼 Total Internships: ${await Internship.countDocuments()}`);
    console.log(`👤 Students: ${await User.countDocuments({ role: 'student' })}`);
    console.log(`👔 Org Admins: ${await User.countDocuments({ role: 'org_admin' })}`);
    console.log(`✅ Verified Internships: ${await Internship.countDocuments({ verified: true })}`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('Admin: admin@phantom-troupe.com / admin123');
    console.log('Student (Asha): asha@univ.edu / password123');
    console.log('Student (Rajesh): rajesh@tech.edu / password123');
    console.log('Student (Priya): priya@example.com / password123');
    console.log('Student (Amit): amit@college.edu / password123');
    console.log('Student (Sneha): sneha@university.edu / password123');
    console.log('Org Admin (Ravi): ravi@techcorp.com / password123');
    console.log('Org Admin (Sunita): sunita@govt.org / password123');
    
    console.log('\n🎯 Test Scenarios:');
    console.log('1. Asha (B.Tech CSE, Java/SQL) → Should match eGov internship');
    console.log('2. Rajesh (B.Tech CSE, Python/React) → Should match Web/Data internships');
    console.log('3. Priya (M.Tech CSE, ML/Python) → Should match ML internship');
    console.log('4. Amit (B.Tech ECE, C++/Embedded) → Should match Telecom/Embedded internships');
    console.log('5. Sneha (B.Sc CSE, Web Dev) → Should match Web Development internship');
    
    console.log('\n🎉 Test data creation completed successfully!');
    console.log('🚀 You can now start the application and test the recommendation system.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    process.exit(1);
  }
};

main();
