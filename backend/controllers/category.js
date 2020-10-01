const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');
const Quiz = require('../models/Quiz');
const csv = require('csvtojson')
const fs = require('fs');
const { imageUpload } = require('../middleware/aws-upload')
const db = require('mongoose');

// @desc      Get all categories
// @route     GET /api/v1/categories
// @access    Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    if (req.params.categoryId) {
        const categories = await Category.find({ category: req.params.categoryId }).populate('parentCategory').populate('subCategories');

        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    }

    const categories = await Category.find().populate('parentCategory').populate({
        path: 'subCategories',
        populate: {
            path: 'subjects',
            populate: {
                path: 'quizes'
            }
        }
    });

    return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    });
});

// @desc      Get single category
// @route     GET /api/v1/categories/:id
// @access    Public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).populate({
        path: 'subCategories',
        populate: {
            path: 'subjects',
            populate: {
                path: 'quizes',
                populate: {
                    path: 'questions'
                }
            }
        }
    });

    if (!category) {
        return next(
            new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: category });
});


// @desc      Get subCategories
// @route     GET /api/v1/subCategories
// @route     GET /api/v1/subCategories/:categoryId/subCategories
// @access    Public
exports.getSubcategories = asyncHandler(async (req, res, next) => {
    if (req.params.categoryId) {
        const subCategories = await SubCategory.find({ category: req.params.categoryId });

        return res.status(200).json({
            success: true,
            count: subCategories.length,
            data: subCategories
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc      Create new category
// @route     POST /api/v1/categories
// @access    Private
exports.createCategory = asyncHandler(async (req, res, next) => {
    // Add user to req,body
    req.body.user = req.user.id;

    const category = await Category.create(req.body);

    res.status(201).json({
        success: true,
        data: category
    });
});



// @desc      Update category
// @route     PUT /api/v1/categories/:id
// @access    Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return next(
            new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is Site owner
    if (category.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this category`,
                401
            )
        );
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: category });
});

// @desc      Delete category
// @route     DELETE /api/v1/category/:id
// @access    Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(
            new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is site owner
    if (category.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this category`,
                401
            )
        );
    }

    await category.remove();

    res.status(200).json({ success: true, data: {} });
});


// @desc      Create new category using csv
// @route     POST /api/v1/categories
// @access    Private
exports.createCategoryCSV = asyncHandler(async (req, res, next) => {
    // Add user to req,body
    req.body.user = req.user.id;

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a csv file`, 400));
    }
    const file = req.files.file;

    let tempPath = `${process.env.FILE_UPLOAD_PATH}/${file.name}`;

    file.mv(tempPath, async err => {
        if (err) {
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        const jsonObj = await csv()
            .fromFile(tempPath)

        fs.unlinkSync(tempPath)

        let dataMap = {
            FALSE: false,
            TRUE: true
        }


        const responses = await Promise.all(jsonObj.map(async (obj) => {
            const map = Object.keys(obj).reduce((t, b) => {
                if (obj[b]) {
                    return { ...t, [b]: obj[b] }
                }
                return t;
            }, {})
            try {
                const cat = await Category.create({
                    ...map,
                    display: dataMap[obj.display],
                    user: req.body.user
                })
                return cat
            } catch (error) {
                return next(new ErrorResponse(error, 400));
            }

        }))


        return res.status(201).json({
            success: true,
            dataImported: responses
        });

    });

});

exports.searchCategory = asyncHandler(async (req, res, next) => {


    const categories = await Category.find({ $text: { $search: req.params.term, $caseSensitive: false }, display: true });
    const quizes = await Quiz.find({ $text: { $search: req.params.term, $caseSensitive: false }, displayOnLeaderboard: true });
    return res.status(200).json({
        success: true,
        count: categories.length + quizes.length,
        data: {
            categories, quizes
        }
    });

})

// @desc      Upload photo for category
// @route     PUT /api/v1/categories/photo
// @access    Private
exports.categoryUploadPhoto = asyncHandler(async (req, res, next) => {

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // Uplaod image to s3 bucket
    try {
        const url = await imageUpload(file)

        return res.status(200).json({
            success: true,
            data: file.name,
            url: url
        });
    } catch (error) {
        console.log({ error })
        return next(new ErrorResponse(`Problem with file upload`, 500));
    }

});
