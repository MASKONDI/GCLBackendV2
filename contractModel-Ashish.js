const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  contract_id: { type: String , required: true },
  contract_token: { type: String },
  contract_type: { type: String },
  contract_file_hash: { type: String },
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  sponsor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor' },
  sponsor_name: { type: String },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendor_name: { type: String },
  action_by: { type: String },
  season_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  contract_start_date: { type: Date },
  contract_end_date: { type: Date },
  contract_with: { type: String },
  contract_with_emailId: { type: String },
  contract_with_contact_number: { type: Number },
  contract_from_emailId: { type: String },
  contract_from_contact_number: { type: Number },
  uploaded_by: { type: String },
  contract_status: { type: String },
  contract_comment: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted_at: { type: Date },
  recordDate: { type: Date },
  is_active: { type: Boolean, default: true },
  is_contract_fabricated: { type: Boolean, default: false },
  season_name: { type: String },
  season_year: { type: Number},
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
