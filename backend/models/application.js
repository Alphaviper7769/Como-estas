// Mongoose Schema for Applications for every post

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    userID: { type: mongoose.Types.ObjectId, ref: 'User' },
    postID: { type: mongoose.Types.ObjectId, ref: 'Post' },
    answers: [{ type: String, required: false, unique: false }],
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Application', applicationSchema);