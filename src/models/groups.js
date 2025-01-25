// groups.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    groupname: {type: String, required: true, unique: true },
    groupemail: { type: String, required: true, unique: true },
    groupaccountnumber: { type: serializeInteger, required: true, unique: true }
});

groupSchema.pre('save', async function(next) {  
    next();
});

// group members.js
const groupSchema = new mongoose.schema({
    groupName: {type: mongoose.schema.Types.objextName, ref: 'Group' },
    totalMembers: { type: Number, default: 0 },
    totalContribution: { type: Number, default: 0 },  
})