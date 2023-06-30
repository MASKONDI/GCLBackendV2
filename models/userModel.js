const mongoose = require('mongoose');

// Define the userSchema
const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  user_name: { type: String, required: true },
  email_id: { type: String, required: true },
  password: { type: String, required: true },
  full_name: { type: String },
  contact_number: {type: Number},
  role: { type: String },
  access: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted_at: { type: Date },
  is_user_active: { type: Boolean, default: true },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
