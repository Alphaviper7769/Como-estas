// Mongoose Schema for USERS/JOB SEEKERS

const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: false },
    sex: { type: String, required: false, default: '-' },
    phone: { type: String, required: false },
    about: { type: String, required: false, default: '' },
    post: { type: String, required: false, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resume: { type: String, required: false, default: '' },
    skills: [{ type: String, required: false, default: [] }],
    applications: [{ type: mongoose.Types.ObjectId, ref: 'Application', default: [] }]
});

userSchema.plugin(validator);

module.exports = mongoose.model('User', userSchema);