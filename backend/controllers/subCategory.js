const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const SubCategory = require('../models/SubCategory');
const csv = require('csvtojson')
const fs = require('fs');
const { imageUpload } = require('../middleware/aws-upload')


// @desc      Get all subCategories
// @route     GET /api/v1/subCategories
// @access    Public
exports.getSubCategories = asyncHandler(async (req, res, next) => {
    if (req.params.subCategoryId) {
        const subCategories = await SubCategory.find({ subCategory: req.params.subCategoryId }).populate('category').populate('subjects');

        return res.status(200).json({
            success: true,
            count: subCategories.length,
            data: subCategories
        });
    }
    const subCategories = await SubCategory.find().populate('category').populate('subjects');

    return res.status(200).json({
        success: true,
        count: subCategories.length,
        data: subCategories
    });

});

// @desc      Get single subCategory
// @route     GET /api/v1/subCategories/:id
// @access    Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const subCategory = await SubCategory.findById(req.params.id).populate({
        path: 'subjects',
        populate: {
            path: 'quizes',
            populate: {
                path: 'questions'
            }
        }
    });

    if (!subCategory) {
        return next(
            new ErrorResponse(`SubCategory not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: subCategory });
});


// @desc      Get subjects
// @route     GET /api/v1/subjects
// @route     GET /api/v1/subjects/:subCategoryId/quizes
// @access    Public
exports.getSubjects = asyncHandler(async (req, res, next) => {
    if (req.params.subCategoryId) {
        const subjects = await Subject.find({ subCategory: req.params.subCategoryId }).populate('quizes');

        return res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc      Create new subCategory
// @route     POST /api/v1/subCategories
// @access    Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
    // Add user to req,body
    req.body.user = req.user.id;

    const subCategory = await SubCategory.create(req.body);

    res.status(201).json({
        success: true,
        data: subCategory
    });
});



// @desc      Update subCategory
// @route     PUT /api/v1/subCategories/:id
// @access    Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    let subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
        return next(
            new ErrorResponse(`SubCategory not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is Site owner
    if (subCategory.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this subCategory`,
                401
            )
        );
    }

    subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: subCategory });
});

// @desc      Delete subCategory
// @route     DELETE /api/v1/subCategory/:id
// @access    Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
        return next(
            new ErrorResponse(`SubCategory not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is site owner
    if (subCategory.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this subCategory`,
                401
            )
        );
    }

    await subCategory.remove();

    res.status(200).json({ success: true, data: {} });
});


// @desc      Create new subCategory using csv
// @route     POST /api/v1/subCategories
// @access    Private
exports.createSubCategoryCSV = asyncHandler(async (req, res, next) => {
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
                const cat = await SubCategory.create({
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

exports.searchSubCategory = asyncHandler(async (req, res, next) => {

    const subCategories = await SubCategory.find({ $text: { $search: req.params.term, $caseSensitive: false }, display: true });
    return res.status(200).json({
        success: true,
        count: subCategories.length,
        data: subCategories
    });

})

// @desc      Upload photo for subCategory
// @route     PUT /api/v1/subCategories/photo
// @access    Private
exports.subCategoryUploadPhoto = asyncHandler(async (req, res, next) => {

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
