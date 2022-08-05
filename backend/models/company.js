// Mongoose Schema for Companies

const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    website: { type: String, required: false },
    posts: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Post', unique: true }],
    employees: [{ type: mongoose.Types.ObjectId, ref: 'Employee' }]
});

// every entry must be unique. 
companySchema.plugin(validator);

module.exports = mongoose.model('Company', companySchema);