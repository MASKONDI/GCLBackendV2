const mongoose = require('mongoose');

// Define the vendorSchema
const vendorSchema = new mongoose.Schema({
  vendor_id: { type: Number, required: true },
  vendor_name: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  email_id: { type: String },
  phone_number: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted_at: { type: Date },
});

// Create the Vendor model
const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
