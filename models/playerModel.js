const mongoose = require('mongoose');

// Define the playerSchema
const playerSchema = new mongoose.Schema({
  player_id: { type: Number, required: true },
  player_name: { type: String, required: true },
  player_image: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted_at: { type: Date },
  is_active: { type: Boolean, default: true },
  email_id: { type: String },
  phone_number: { type: String },
});

// Create the Player model
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
