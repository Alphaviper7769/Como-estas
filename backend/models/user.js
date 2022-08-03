const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    sex: { type: String, required: false },
    about: { type: String, required: false },
    post: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resume: { type: String, required: false }
});

module.exports = mongoose.model('User', userSchema);