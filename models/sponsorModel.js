const mongoose = require('mongoose');

// Define the sponsorSchema
const sponsorSchema = new mongoose.Schema({
  sponsor_id: { type: Number, required: true },
  sponsor_name: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  email_id: { type: String },
  phone_number: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted_at: { type: Date },
});

// Create the Sponsor model
const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;
