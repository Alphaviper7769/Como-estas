// Mongoose Schema for Posts

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    name: { type: String, required: true },
    vacancy: { type: Number, required: false, default: 0 },
    applicantions: { type: mongoose.Types.ObjectId, ref: 'Application', unique: true },
    date: { type: Date, required: true },
    companyID: { type: mongoose.Types.ObjectId, ref: 'Company' },
    skills: [{ type: String, required: false }],
    eligibility: [{ type: String, required: false }],
    questions: [{ type: String, required: false }],
    dueDate: { type: Date, required: true },
    salary: { type: String, required: false, default: "---" },
    location: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);