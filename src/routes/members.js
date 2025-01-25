// members.js
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Contribution = require('../models/Contribution');
const Loan = require('../models/Loan');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all members (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const members = await Member.find()
            .populate('userId', 'username email')
            .select('-__v');
        
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get member details
router.get('/:memberId', verifyToken, async (req, res) => {
    try {
        const member = await Member.findById(req.params.memberId)
            .populate('userId', 'username email')
            .select('-__v');

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Check if user is admin or the member themselves
        if (req.user.role !== 'admin' && member.userId._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        // Get member's contributions
        const contributions = await Contribution.find({ memberId: member._id })
            .sort({ date: -1 });

        // Get member's loans
        const loans = await Loan.find({ memberId: member._id })
            .sort({ createdAt: -1 });

        res.json({
            member,
            contributions,
            loans
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update member status (Admin only)
router.patch('/:memberId/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['active', 'inactive', 'suspended'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const member = await Member.findByIdAndUpdate(
            req.params.memberId,
            { status },
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Record member contribution
router.post('/:memberId/contributions', verifyToken, async (req, res) => {
    try {
        const { amount, type = 'savings, contribution',  } = req.body;
        const memberId = req.params.memberId;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }

        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Create contribution record
        const contribution = new Contribution({
            memberId,
            amount,
            type,
            status: 'confirmed'
        });

        await contribution.save();

        // Update member's total contributions and available balance
        member.totalContributions += amount;
        member.availableBalance += amount;
        
        // Update loan limit (e.g., 3x of total contributions)
        // adjustable
        member.loanLimit = member.totalContributions * 3;
        
        await member.save();

        res.status(201).json({
            message: 'Contribution recorded successfully',
            contribution,
            updatedMember: member
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get member's contribution history
router.get('/:memberId/contributions', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;
        const query = { memberId: req.params.memberId };

        // Add date range filter if provided
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Add type filter if provided
        if (type) {
            query.type = type;
        }

        const contributions = await Contribution.find(query)
            .sort({ date: -1 });

        // Calculate summary
        const summary = {
            totalContributions: contributions.reduce((sum, c) => sum + c.amount, 0),
            totalCount: contributions.length
        };

        res.json({
            contributions,
            summary
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get member's loan history
router.get('/:memberId/loans', verifyToken, async (req, res) => {
    try {
        const { status } = req.query;
        const query = { memberId: req.params.memberId };

        if (status) {
            query.status = status;
        }

        const loans = await Loan.find(query)
            .sort({ createdAt: -1 });

        // Calculate summary
        const summary = {
            totalLoans: loans.length,
            activeLoans: loans.filter(l => l.status === 'active').length,
            totalAmount: loans.reduce((sum, l) => sum + l.amount, 0),
            remainingAmount: loans.reduce((sum, l) => sum + l.remainingAmount, 0)
        };

        res.json({
            loans,
            summary
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get member statistics
router.get('/:memberId/statistics', verifyToken, async (req, res) => {
    try {
        const memberId = req.params.memberId;
        
        // Get member details
        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Get all contributions
        const contributions = await Contribution.find({ memberId });
        
        // Get all loans
        const loans = await Loan.find({ memberId });

        const statistics = {
            totalContributions: member.totalContributions,
            availableBalance: member.availableBalance,
            loanLimit: member.loanLimit,
            contributionStats: {
                totalCount: contributions.length,
                lastContribution: contributions[0]?.date
            },
            loanStats: {
                totalLoans: loans.length,
                activeLoans: loans.filter(l => l.status === 'active').length,
                completedLoans: loans.filter(l => l.status === 'completed').length,
                totalLoanAmount: loans.reduce((sum, l) => sum + l.amount, 0)
            }
        };

        res.json(statistics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;