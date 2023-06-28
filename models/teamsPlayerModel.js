const mongoose = require('mongoose');

const teamPlayerSchema = new mongoose.Schema({
  teams_player_id: {
    type: String, required: true,
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,ref: 'Team'
  },
  player_id: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Player'
  }],
  season_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Season'

  },
  created_at: { type: Date, default: Date.now },
  updated_at: {
    type: Date,
  },
  deleted_at: {
    type: Date,
   
  },
  is_active: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('TeamPlayer', teamPlayerSchema);
