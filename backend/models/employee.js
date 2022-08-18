const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    post: { type: String, required: false },
    permissions: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
    companyID: { type: mongoose.Types.ObjectId, ref: 'Company' }
});

module.exports = mongoose.model('Employee', employeeSchema);