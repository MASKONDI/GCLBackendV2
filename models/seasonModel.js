const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
  season_id: { type: Number, required: true },
  season_name: { type: String, required: true },
  season_year: { type: Number, required: true },
  season_admin_email: { type: String },
  season_admin_contact_number: { type: String },
  season_start_date: { type: Date },
  season_end_date: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted_at: { type: Date },
  is_active: { type: Boolean, default: true },
  team_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  vendor_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
  sponsor_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor' }]
});

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;
