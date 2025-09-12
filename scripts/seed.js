import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB, User, Internship } from '../src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load existing JSON data
const usersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8')
);
const internshipsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/internships.json'), 'utf-8')
);

// Default password for seeded users
const DEFAULT_PASSWORD = 'password123';

// Hash password function
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Transform user data for MongoDB
const transformUserData = async (userData) => {
  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
  
  return {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: 'student', // Default role for seeded users
    education: userData.education,
    skills: userData.skills || [],
    certifications: userData.certifications || [],
    preferences: userData.preferences,
    constraints: userData.constraints,
    language_pref: userData.language_pref || ['en'],
    geo: userData.geo,
    isActive: true,
    lastLogin: new Date()
  };
};

// Transform internship data for MongoDB
const transformInternshipData = (internshipData) => {
  return {
    title: internshipData.title,
    org: internshipData.org,
    org_type: internshipData.org_type,
    description: internshipData.description,
    skills_required: internshipData.skills_required || [],
    skills_nice_to_have: internshipData.skills_nice_to_have || [],
    education_required: internshipData.education_required,
    location: internshipData.location,
    is_remote: internshipData.is_remote || false,
    stipend: internshipData.stipend,
    duration_months: internshipData.duration_months,
    application_deadline: new Date(internshipData.application_deadline),
    language_required: internshipData.language_required || ['en'],
    diversity_eligibility: internshipData.diversity_eligibility,
    geo: internshipData.geo,
    verified: internshipData.verified !== false,
    posted_at: new Date(internshipData.posted_at),
    posted_by: 'system', // System user for seeded data
    isActive: true,
    application_count: 0
  };
};

// Create a system admin user
const createSystemAdmin = async () => {
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
    certifications: ['AWS Certified', 'Project Management'],
    preferences: {
      roles: ['Management'],
      locations: ['Remote'],
      stiped_min: 0,
      org_types: ['Private', 'PSU', 'Govt Dept']
    },
    constraints: {
      disability: false,
      gender: 'M',
      income_band: 'General'
    },
    language_pref: ['en'],
    geo: {
      type: 'Point',
      coordinates: [77.5946, 12.9716]
    },
    isActive: true,
    lastLogin: new Date()
  };

  return adminData;
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Internship.deleteMany({});
    
    // Create system admin
    console.log('👤 Creating system administrator...');
    const adminUser = await createSystemAdmin();
    const admin = new User(adminUser);
    await admin.save();
    console.log(`✅ Created admin user: ${adminUser.email}`);
    
    // Seed users
    console.log('👥 Seeding users...');
    const transformedUsers = await Promise.all(
      usersData.map(transformUserData)
    );
    
    const createdUsers = [];
    for (const userData of transformedUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Seed internships
    console.log('💼 Seeding internships...');
    const transformedInternships = internshipsData.map(transformInternshipData);
    
    const createdInternships = [];
    for (const internshipData of transformedInternships) {
      const internship = new Internship(internshipData);
      await internship.save();
      createdInternships.push(internship);
    }
    console.log(`✅ Created ${createdInternships.length} internships`);
    
    // Create some additional test users
    console.log('🧪 Creating additional test users...');
    const testUsers = [
      {
        name: 'Test Student',
        email: 'student@test.com',
        password: await hashPassword('password123'),
        role: 'student',
        education: {
          degree: 'B.Tech',
          branch: 'CSE',
          year: 3,
          cgpa: 8.5
        },
        skills: ['Python', 'JavaScript', 'React'],
        certifications: ['AWS Cloud Practitioner'],
        preferences: {
          roles: ['Software', 'Data'],
          locations: ['Bengaluru', 'Remote'],
          stiped_min: 5000,
          org_types: ['Private', 'Startup']
        },
        constraints: {
          disability: false,
          gender: 'M',
          income_band: 'General'
        },
        language_pref: ['en'],
        geo: {
          type: 'Point',
          coordinates: [77.5946, 12.9716]
        },
        isActive: true,
        lastLogin: new Date()
      },
      {
        name: 'Test Org Admin',
        email: 'orgadmin@test.com',
        password: await hashPassword('password123'),
        role: 'org_admin',
        education: {
          degree: 'M.Tech',
          branch: 'CSE',
          year: 5,
          cgpa: 9.0
        },
        skills: ['Management', 'Recruitment', 'HR'],
        certifications: ['HR Management'],
        preferences: {
          roles: ['Management'],
          locations: ['Bengaluru'],
          stiped_min: 0,
          org_types: ['Private']
        },
        constraints: {
          disability: false,
          gender: 'F',
          income_band: 'General'
        },
        language_pref: ['en'],
        geo: {
          type: 'Point',
          coordinates: [77.5946, 12.9716]
        },
        isActive: true,
        lastLogin: new Date()
      }
    ];
    
    const createdTestUsers = [];
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      createdTestUsers.push(user);
    }
    console.log(`✅ Created ${createdTestUsers.length} test users`);
    
    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`👥 Total Users: ${await User.countDocuments()}`);
    console.log(`💼 Total Internships: ${await Internship.countDocuments()}`);
    console.log(`👤 Students: ${await User.countDocuments({ role: 'student' })}`);
    console.log(`👔 Org Admins: ${await User.countDocuments({ role: 'org_admin' })}`);
    console.log(`✅ Verified Internships: ${await Internship.countDocuments({ verified: true })}`);
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('Admin: admin@phantom-troupe.com / admin123');
    console.log('Student: student@test.com / password123');
    console.log('Org Admin: orgadmin@test.com / password123');
    console.log('Original User: asha@univ.edu / password123');
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
};

// Run seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
