const mongoose = require('mongoose');

// Define the teamSchema
const teamSchema = new mongoose.Schema({
  team_id: { type: Number, required: true },
  team_name: { type: String, required: true },
  email_id: { type: String, required: true },
  team_owner_name: { type: String },
  team_logo: { type: String },
  no_of_players: { type: Number },
  phone_number: { type: String },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted_at: { type: Date },
});

// Create the Team model
const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
