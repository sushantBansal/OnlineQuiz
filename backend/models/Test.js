const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [false]
    },
    remainingDuration: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
    },
    response: {
        type: [Object]
    },
    result: {
        type: Object
    },
    quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('Test', TestSchema);
