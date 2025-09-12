import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    enum: ['B.Tech', 'B.Sc', 'B.E', 'M.Tech', 'M.Sc', 'M.E', 'MCA', 'BCA']
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'Aerospace', 'Biotech', 'Other']
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  }
});

const preferencesSchema = new mongoose.Schema({
  roles: [{
    type: String,
    enum: ['Software', 'Data', 'Design', 'Marketing', 'Finance', 'Operations', 'Research', 'Management']
  }],
  locations: [String],
  stiped_min: {
    type: Number,
    default: 0
  },
  org_types: [{
    type: String,
    enum: ['Govt Dept', 'PSU', 'Private', 'NGO', 'Startup', 'Research Institute']
  }]
});

const constraintsSchema = new mongoose.Schema({
  disability: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    enum: ['M', 'F', 'O'],
    required: true
  },
  income_band: {
    type: String,
    enum: ['EWS', 'General', 'OBC', 'SC', 'ST'],
    required: true
  }
});

const geoSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(coords) {
        return coords.length === 2 && 
               coords[0] >= -180 && coords[0] <= 180 && 
               coords[1] >= -90 && coords[1] <= 90;
      },
      message: 'Invalid coordinates'
    }
  }
});

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'org_admin'],
    default: 'student'
  },
  education: {
    type: educationSchema,
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  certifications: [{
    type: String,
    trim: true
  }],
  preferences: {
    type: preferencesSchema,
    required: true
  },
  constraints: {
    type: constraintsSchema,
    required: true
  },
  language_pref: [{
    type: String,
    enum: ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'mr', 'kn', 'ml', 'or', 'pa', 'as']
  }],
  geo: {
    type: geoSchema,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  _id: false // We're using custom _id field
});

// Indexes for better query performance
// Note: email index is automatically created by unique: true
userSchema.index({ role: 1 });
userSchema.index({ 'education.degree': 1, 'education.year': 1 });
userSchema.index({ 'education.branch': 1 });
userSchema.index({ skills: 1 });
userSchema.index({ 'preferences.locations': 1 });
userSchema.index({ 'preferences.org_types': 1 });
userSchema.index({ 'constraints.gender': 1, 'constraints.income_band': 1 });
userSchema.index({ geo: '2dsphere' }); // For geospatial queries

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to check if user is eligible for an internship
userSchema.methods.isEligibleForInternship = function(internship) {
  const { education_required } = internship;
  
  // Check degree requirement
  if (education_required.degree && !education_required.degree.includes(this.education.degree)) {
    return false;
  }
  
  // Check branch requirement
  if (education_required.branches && !education_required.branches.includes(this.education.branch)) {
    return false;
  }
  
  // Check year requirement
  if (education_required.year_min && this.education.year < education_required.year_min) {
    return false;
  }
  
  return true;
};

// Method to get user's location preferences
userSchema.methods.getLocationPreferences = function() {
  return this.preferences.locations || [];
};

// Method to get user's organization type preferences
userSchema.methods.getOrgTypePreferences = function() {
  return this.preferences.org_types || [];
};

export default mongoose.model('User', userSchema);
