const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  // Product Request Fields
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  desiredShape: { type: String },
  desiredColor: { type: String },
  desiredSize: { type: String },
  quantity: { type: Number, default: 1 },
  intensity: { type: String },
  
  // Consultation Request Fields
  requestType: { 
    type: String, 
    enum: ["product", "consultation"], 
    required: true,
    default: "product"
  },
  consultationType: {
    type: String,
    enum: ['investment', 'collection', 'certification', 'custom', 'education', 'appraisal']
  },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  timezone: { type: String, default: 'UTC' },
  gemTypes: [{
    type: String,
    enum: [
      'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Citrine',
      'Topaz', 'Garnet', 'Peridot', 'Aquamarine', 'Opal', 'Pearl',
      'Tanzanite', 'Alexandrite', 'Tourmaline', 'Spinel', 'Other'
    ]
  }],
  budget: {
    type: String,
    enum: ['under-1000', '1000-5000', '5000-10000', '10000-25000', '25000-50000', 'over-50000']
  },
  purpose: {
    type: String,
    enum: ['Investment', 'Personal Collection', 'Jewelry Design', 'Gift', 'Heirloom', 'Learning', 'Certification', 'Appraisal']
  },
  experience: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Collector', 'Professional']
  },
  specificQuestions: { type: String },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'asap'],
    default: 'normal'
  },
  communicationPreference: {
    type: String,
    enum: ['email', 'phone', 'video'],
    default: 'email'
  },
  location: { type: String },
  virtualPreference: { type: Boolean, default: true },
  
  // Common Fields
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    match: [/^\S+@\S+\.\S+$/, "Invalid email"] 
  },
  phone: { 
    type: String, 
    required: true, 
    match: [/^[0-9]{10,15}$/, "Phone must be 10–15 digits"] 
  },
  contactMethod: { 
    type: String, 
    enum: ["call","email","online meeting","appointment"], 
    required: true 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending","confirmed","rejected", "cancelled", "completed"], default: "pending" },
  rejectionReason: { type: String, default: "" },
  appointment: { type: Date },
  totalPrice: { type: Number },
  consultationFee: { type: Number },
  
  // Additional consultation fields
  assignedGemologist: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  confirmedDate: { type: Date },
  confirmedTime: { type: String },
  meetingLink: { type: String },
  notes: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: { type: String },
  paymentDate: { type: Date },
  lastContacted: { type: Date },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
RequestSchema.index({ email: 1 });
RequestSchema.index({ requestType: 1 });
RequestSchema.index({ consultationType: 1 });
RequestSchema.index({ status: 1 });
RequestSchema.index({ preferredDate: 1 });
RequestSchema.index({ createdAt: -1 });

// Virtual for full name
RequestSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for consultation type details
RequestSchema.virtual('consultationDetails').get(function() {
  if (this.requestType !== 'consultation') return null;
  
  const types = {
    investment: { title: 'Investment Consultation', duration: '60 minutes', price: 150 },
    collection: { title: 'Collection Building', duration: '45 minutes', price: 100 },
    certification: { title: 'Certification & Authentication', duration: '30 minutes', price: 75 },
    custom: { title: 'Custom Design Consultation', duration: '90 minutes', price: 200 },
    education: { title: 'Educational Session', duration: '45 minutes', price: 80 },
    appraisal: { title: 'Gemstone Appraisal', duration: '60 minutes', price: 120 }
  };
  return types[this.consultationType] || null;
});

// Method to get request summary
RequestSchema.methods.getSummary = function() {
  return {
    id: this._id,
    requestType: this.requestType,
    fullName: this.fullName,
    email: this.email,
    phone: this.phone,
    status: this.status,
    createdAt: this.createdAt,
    ...(this.requestType === 'consultation' ? {
      consultationType: this.consultationDetails?.title || this.consultationType,
      preferredDate: this.preferredDate,
      preferredTime: this.preferredTime,
      consultationFee: this.consultationFee
    } : {
      product: this.product,
      totalPrice: this.totalPrice
    })
  };
};

// Method to update status
RequestSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  this.notes = notes;
  this.updatedAt = new Date();
  return this.save();
};

// Pre-save middleware to set consultation fee based on type
RequestSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('consultationType')) {
    if (this.requestType === 'consultation' && this.consultationType) {
      const fees = {
        investment: 150,
        collection: 100,
        certification: 75,
        custom: 200,
        education: 80,
        appraisal: 120
      };
      this.consultationFee = fees[this.consultationType] || 100;
    }
  }
  next();
});

module.exports = mongoose.model("UserRequests", RequestSchema);
