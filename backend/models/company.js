const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    website: { type: String, required: false },
    posts: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Post', unique: true }],
    employees: [{
        empName: { type: String, required: false },
        position: { type: String, required: false },
        permissions: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Post', unique: true }]
    }]
});

module.exports = mongoose.model('Company', companySchema);