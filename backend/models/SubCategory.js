const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a category title']
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
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

SubCategorySchema.index({
    title: 'text',
    description: 'text',
}, {
    weights: {
        title: 1,
        description: 1,
    },
});

SubCategorySchema.virtual('subjects', {
    ref: 'Subject',
    localField: '_id',
    foreignField: 'subCategory',
    justOne: false
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);
