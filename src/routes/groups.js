// group information
const express = require('express');
const router = express.Router();
const group = require('../models/Groups');
// const groupservice = require('../groupservice')
 
// search whether a group exist
// group routes
router.get('/', (req, res) => {
    try {
        const groups = GroupService.getAllGroups();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
router.get('/:groupName', (req, res) => {
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
 
// module.exports = { groupRouter, memberRouter };
module.exports = { router };