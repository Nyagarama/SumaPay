// group information
const express = require('express');
const router = express.Router();
const group = require('../models/Groups');
const groupservice = require('../groupservice.js')

// search whether a group exist
// group routes
groupRouter.get('/', (req, res) => {
    try {
        const groups = GroupSerivice.getAllGroups();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

memberRouter.get('/:groupName', (req, res) => {
    try {
        const { groupName } = req.params;
        const { search } = req.query;

        const members = getGroupMembers(groupName, search);
        const totalContribution = GroupSerivice.getTotalContribution(groupName);

        res.json({
            members,
            totalContribution
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export { groupRouter, memberRouter };