const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a quiz title']
    },
    noOfQuestion: {
        type: Number,
        default: 0,
        required: [true, 'Please add question numbers']
    },
    duration: {
        type: Number,
        default: 0,
        required: [true, 'Please specify the duration']
    },
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: [false, 'Please add a category']
    },
    displayOnLeaderboard: {
        type: Boolean,
        default: false
    },
    isRandom: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: [true, 'Please enter a description']
    },
    instruction: {
        type: String,
        required: [true, 'Please specify a instruction']
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

QuizSchema.index({
    title: 'text',
    description: 'text',
}, {
    weights: {
        title: 1,
        description: 1,
    },
});


QuizSchema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'quiz',
    justOne: false
});

module.exports = mongoose.model('Quiz', QuizSchema);
