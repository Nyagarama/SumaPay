const schema = new mongoose.Schema({
    groupname: {type: String, required: true, unique: true },
    groupemail: { type: String, required: true, unique: true },
    groupaccountnumber: { type: Number, required: true, unique: true }
});
 
// group members.js
const groupSchema = new mongoose.Schema({
    groupName: {type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    totalMembers: { type: Number, default: 0 },
    totalContribution: { type: Number, default: 0 },  
})
 
groupSchema.pre('save', async function(next) {  
    next();
});