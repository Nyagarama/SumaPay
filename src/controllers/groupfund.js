import { Router } from 'express';
import GroupFund, { find, findById } from '../models/groupfund';

const router = Router();

// Get all group funds
router.get('/', async (req, res) => {
    try {
        const groupFunds = await find();
        res.json(groupFunds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one group fund
router.get('/:id', getGroupFund, (req, res) => {
    res.json(res.groupFund);
});

// Create a group fund
router.post('/', async (req, res) => {
    const { name, amount, members } = req.body;
    const groupFund = new GroupFund({ name, amount, members });

    try {
        const newGroupFund = await groupFund.save();
        res.status(201).json(newGroupFund);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a group fund
router.patch('/:id', getGroupFund, async (req, res) => {
    const { name, amount, members } = req.body;

    if (name != null) res.groupFund.name = name;
    if (amount != null) res.groupFund.amount = amount;
    if (members != null) res.groupFund.members = members;

    try {
        const updatedGroupFund = await res.groupFund.save();
        res.json(updatedGroupFund);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a group fund
router.delete('/:id', getGroupFund, async (req, res) => {
    try {
        await res.groupFund.remove();
        res.json({ message: 'Deleted Group Fund' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getGroupFund(req, res, next) {
    try {
        const groupFund = await findById(req.params.id);
        if (!groupFund) {
            return res.status(404).json({ message: 'Cannot find group fund' });
        }
        res.groupFund = groupFund;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export default router;
