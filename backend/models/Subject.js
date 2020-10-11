const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a category title']
    },
    subCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: null
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

SubjectSchema.index({
    title: 'text',
    description: 'text',
}, {
    weights: {
        title: 1,
        description: 1,
    },
});

SubjectSchema.virtual('quizes', {
    ref: 'Quiz',
    localField: '_id',
    foreignField: 'subject',
    justOne: false
});

module.exports = mongoose.model('Subject', SubjectSchema);
