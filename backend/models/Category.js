const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a category title']
    },
    icon: {
        type: String,
        required: [false, 'Please choose one icon']
    },
    parentCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
    display: {
        type: Boolean,
        default: false
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

CategorySchema.index({
    title: 'text',
    description: 'text',
}, {
    weights: {
        title: 1,
        description: 1,
    },
});

CategorySchema.virtual('subCategories', {
    ref: 'SubCategory',
    localField: '_id',
    foreignField: 'category',
    justOne: false
});

module.exports = mongoose.model('Category', CategorySchema);
