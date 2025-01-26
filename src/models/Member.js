const mongoose = require('mongoose');
 
// Member.js
const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalContributions: { type: Number, default: 0 },
  availableBalance: { type: Number, default: 0 },
  loanLimit: { type: Number, default: 0 },
  activeLoans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});
 
module.exports = mongoose.model('Member', memberSchema);