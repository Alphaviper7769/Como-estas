// Mongoose Schema for INBOX

const mongoose = require('mongoose');

const inboxSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    inbox: [{
        sender: { type: String, required: true },
        senderID: { type: String, required: true },
        message: { type: String }
    }]
});

module.exports = mongoose.model('Inbox', inboxSchema);