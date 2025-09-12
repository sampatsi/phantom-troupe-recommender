import { connectDB, User, Internship } from './src/models/index.js';
import { loadRules } from './src/rules/loader.js';
import { recommend } from './src/routes/recommendations.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const debugRecommendations = async () => {
  try {
    console.log('🔍 Starting recommendation debug...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Load rules
    const rules = loadRules(path.join(__dirname, './src/rules/config.yaml'));
    console.log('✅ Rules loaded:', Object.keys(rules));
    
    // Get user
    const user = await User.findById('u_asha');
    console.log('👤 User found:', user ? user.name : 'NOT FOUND');
    if (user) {
      console.log('   Education:', user.education);
      console.log('   Skills:', user.skills);
      console.log('   Preferences:', user.preferences);
    }
    
    // Get internships
    const internships = await Internship.find({
      verified: true,
      isActive: true,
      application_deadline: { $gte: new Date() }
    }).limit(10);
    
    console.log('💼 Internships found:', internships.length);
    internships.forEach((internship, index) => {
      console.log(`   ${index + 1}. ${internship.title} (${internship.org})`);
      console.log(`      Skills required: ${internship.skills_required.join(', ')}`);
      console.log(`      Education: ${internship.education_required.degree.join(', ')} (year >= ${internship.education_required.year_min})`);
      console.log(`      Deadline: ${internship.application_deadline}`);
    });
    
    // Test recommendation
    console.log('\n🎯 Testing recommendation...');
    const result = recommend({ user, internships, rules, limit: 5 });
    console.log('📊 Recommendation result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    process.exit(0);
  }
};

debugRecommendations();
