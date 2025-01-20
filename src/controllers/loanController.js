// loanController.js
const Loan = require('../models/Loan');
const Member = require('../models/Member');

const loanController = {
  async requestLoan(req, res) {
    try {
      const { memberId, amount, term } = req.body;
      
      // Get member details
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      
      // Check loan eligibility
      if (amount > member.loanLimit) {
        return res.status(400).json({ message: 'Loan amount exceeds limit' });
      }
      
      // Calculate interest and total amount
      const interestRate = 12; // 12% annual interest
      const totalInterest = (amount * interestRate * term) / (12 * 100);
      const totalAmount = amount + totalInterest;
      
      // Create loan schedule
      const monthlyPayment = totalAmount / term;
      const paymentSchedule = [];
      let dueDate = new Date();
      
      for (let i = 0; i < term; i++) {
        dueDate = new Date(dueDate.setMonth(dueDate.getMonth() + 1));
        paymentSchedule.push({
          dueDate: new Date(dueDate),
          amount: monthlyPayment,
          status: 'pending'
        });
      }
      
      // Create new loan
      const loan = new Loan({
        memberId,
        amount,
        interestRate,
        term,
        totalAmount,
        remainingAmount: totalAmount,
        paymentSchedule
      });
      
      await loan.save();
      
      // Update member's active loans
      member.activeLoans.push(loan._id);
      await member.save();
      
      res.status(201).json(loan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  async approveLoan(req, res) {
    try {
      const { loanId } = req.params;
      const { approvedBy } = req.body;
      
      const loan = await Loan.findById(loanId);
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
      
      loan.status = 'approved';
      loan.approvedBy = approvedBy;
      loan.approvedAt = new Date();
      
      await loan.save();
      
      res.json(loan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  async makeLoanPayment(req, res) {
    try {
      const { loanId } = req.params;
      const { amount } = req.body;
      
      const loan = await Loan.findById(loanId);
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
      
      // Update remaining amount
      loan.remainingAmount -= amount;
      
      // Update payment schedule
      for (let payment of loan.paymentSchedule) {
        if (payment.status === 'pending') {
          payment.status = 'paid';
          break;
        }
      }
      
      // Check if loan is completed
      if (loan.remainingAmount <= 0) {
        loan.status = 'completed';
      }
      
      await loan.save();
      
      res.json(loan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = loanController;