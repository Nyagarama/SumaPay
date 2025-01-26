// User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 
const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  createdAt: { type: Date, default: Date.now }
});
 
 
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
 
// Member.js
const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalContributions: { type: Number, default: 0 },
  availableBalance: { type: Number, default: 0 },
  loanLimit: { type: Number, default: 0 },
  activeLoans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});
 
// Contribution.js
const contributionSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['contribution', 'loan-payment'], required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' }
});
 
// Loan.js
const loanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  term: { type: Number, required: true }, // in months
  totalAmount: { type: Number, required: true }, // amount + interest
  remainingAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'active', 'completed', 'defaulted'], 
    default: 'pending' 
  },
  paymentSchedule: [{
    dueDate: Date,
    amount: Number,
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' }
  }],
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  createdAt: { type: Date, default: Date.now }
});
 
// payment.js
const paymentSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  type: {
    type: String,
    enum: ['loan', 'contribution','fee'], // fee for delayed loan payment
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ['credit card', 'paypal', 'm-pesa'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'Completed', 'failed'],
    default: 'pending'
  },
});
module.exports = mongoose.model('Payment', paymentSchema);