const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a question title']
    },
    isMultipleChoice: {
        type: Boolean,
        default: false
    },
    questionChoices: {
        type: [{
            text: String,
            isCorrect: Boolean
        }],
        validate: {
            validator: v => Array.isArray(v) && v.length > 0,
            message: 'QuestionChoices cannot be empty'
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
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
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
