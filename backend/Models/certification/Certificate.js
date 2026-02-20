const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  certificate_type: { 
    type: String, 
    required: true,
    enum: ["Identification", "Test & Result"]
  },
  certificate_number: { 
    type: String, 
    required: true,
    trim: true
    // Remove unique: true if it exists - we'll handle uniqueness in routes
  },
  lab_name: { 
    type: String, 
    required: true,
    trim: true
  },
  issue_date: { 
    type: Date, 
    required: true 
  },
  origin: { 
    type: String,
    trim: true
  },
  variety: { 
    type: String,
    trim: true
  },
  file: { 
    type: String // uploaded file name
  },
  qr_code: {
    type: String, // QR code data URL
    default: null
  },
  verification_url: {
    type: String, // Unique verification URL
    default: null
  }
}, { 
  timestamps: true 
});

// Remove unique constraint to allow same lab name multiple times
// CertificateSchema.index({ certificate_number: 1, lab_name: 1 }, { unique: true });

module.exports = mongoose.model("Certificates", CertificateSchema);