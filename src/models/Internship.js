import mongoose from 'mongoose';

const educationRequiredSchema = new mongoose.Schema({
  degree: [{
    type: String,
    enum: ['B.Tech', 'B.Sc', 'B.E', 'M.Tech', 'M.Sc', 'M.E', 'MCA', 'BCA']
  }],
  branches: [{
    type: String,
    enum: ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'Aerospace', 'Biotech', 'Other']
  }],
  year_min: {
    type: Number,
    min: 1,
    max: 5
  }
});

const diversityEligibilitySchema = new mongoose.Schema({
  women_only: {
    type: Boolean,
    default: false
  },
  pwd_friendly: {
    type: Boolean,
    default: false
  },
  ews_priority: {
    type: Boolean,
    default: false
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

const internshipSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  org: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  org_type: {
    type: String,
    required: true,
    enum: ['Govt Dept', 'PSU', 'Private', 'NGO', 'Startup', 'Research Institute']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  skills_required: [{
    type: String,
    trim: true
  }],
  skills_nice_to_have: [{
    type: String,
    trim: true
  }],
  education_required: {
    type: educationRequiredSchema,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  is_remote: {
    type: Boolean,
    default: false
  },
  stipend: {
    type: Number,
    required: true,
    min: 0
  },
  duration_months: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  application_deadline: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  language_required: [{
    type: String,
    enum: ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'mr', 'kn', 'ml', 'or', 'pa', 'as']
  }],
  diversity_eligibility: {
    type: diversityEligibilitySchema,
    required: true
  },
  geo: {
    type: geoSchema,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  posted_at: {
    type: Date,
    default: Date.now
  },
  posted_by: {
    type: String,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  application_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  _id: false // We're using custom _id field
});

// Indexes for better query performance
internshipSchema.index({ title: 'text', description: 'text', org: 'text' }); // Text search
internshipSchema.index({ org_type: 1 });
internshipSchema.index({ location: 1 });
internshipSchema.index({ is_remote: 1 });
internshipSchema.index({ stipend: 1 });
internshipSchema.index({ application_deadline: 1 });
internshipSchema.index({ verified: 1, isActive: 1 });
internshipSchema.index({ 'education_required.degree': 1 });
internshipSchema.index({ 'education_required.branches': 1 });
internshipSchema.index({ 'education_required.year_min': 1 });
internshipSchema.index({ skills_required: 1 });
internshipSchema.index({ 'diversity_eligibility.women_only': 1 });
internshipSchema.index({ 'diversity_eligibility.pwd_friendly': 1 });
internshipSchema.index({ 'diversity_eligibility.ews_priority': 1 });
internshipSchema.index({ geo: '2dsphere' }); // For geospatial queries
internshipSchema.index({ posted_at: -1 }); // For sorting by newest first

// Compound indexes for common queries
internshipSchema.index({ 
  verified: 1, 
  isActive: 1, 
  application_deadline: 1 
});

internshipSchema.index({ 
  org_type: 1, 
  location: 1, 
  stipend: 1 
});

// Virtual for full location display
internshipSchema.virtual('fullLocation').get(function() {
  return this.is_remote ? `${this.location} / Remote` : this.location;
});

// Virtual for days until deadline
internshipSchema.virtual('daysUntilDeadline').get(function() {
  const now = new Date();
  const deadline = new Date(this.application_deadline);
  const diffTime = deadline - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to check if internship is still accepting applications
internshipSchema.methods.isAcceptingApplications = function() {
  return this.verified && 
         this.isActive && 
         new Date(this.application_deadline) > new Date();
};

// Method to check if user meets basic eligibility
internshipSchema.methods.isUserEligible = function(user) {
  const { education_required } = this;
  
  // Check degree requirement
  if (education_required.degree && education_required.degree.length > 0) {
    if (!education_required.degree.includes(user.education.degree)) {
      return false;
    }
  }
  
  // Check branch requirement
  if (education_required.branches && education_required.branches.length > 0) {
    if (!education_required.branches.includes(user.education.branch)) {
      return false;
    }
  }
  
  // Check year requirement
  if (education_required.year_min && user.education.year < education_required.year_min) {
    return false;
  }
  
  return true;
};

// Method to check diversity eligibility
internshipSchema.methods.checkDiversityEligibility = function(user) {
  const { diversity_eligibility } = this;
  const { constraints } = user;
  
  // Check women-only requirement
  if (diversity_eligibility.women_only && constraints.gender !== 'F') {
    return false;
  }
  
  // Check PwD friendly
  if (diversity_eligibility.pwd_friendly && constraints.disability) {
    return true; // PwD friendly means disabled candidates are welcome
  }
  
  return true;
};

// Static method to find internships by location proximity
internshipSchema.statics.findNearby = function(coordinates, maxDistance = 50000) {
  return this.find({
    geo: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Static method to find internships by skills match
internshipSchema.statics.findBySkills = function(skills) {
  return this.find({
    skills_required: { $in: skills }
  });
};

export default mongoose.model('Internship', internshipSchema);
