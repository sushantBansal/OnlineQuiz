const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Subject = require('../models/Subject');
const csv = require('csvtojson')
const fs = require('fs');
const { imageUpload } = require('../middleware/aws-upload')


// @desc      Get all subjects
// @route     GET /api/v1/subjects
// @access    Public
exports.getSubjects = asyncHandler(async (req, res, next) => {
    if (req.params.quizId) {
        const subjects = await Subject.find({ subject: req.params.subjectId }).populate('subCategory').populate('quizes');

        return res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    }

    const subjects = await Subject.find().populate('subCategory').populate({
        path: 'quizes',
        populate: {
            path: 'questions'
        }
    });

    return res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects
    });
});

// @desc      Get single subject
// @route     GET /api/v1/subjects/:id
// @access    Public
exports.getSubject = asyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.params.id).populate({
        path: 'quizes',
        populate: {
            path: 'questions'
        }
    });

    if (!subject) {
        return next(
            new ErrorResponse(`Subject not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: subject });
});


// @desc      Get quizes
// @route     GET /api/v1/quizes
// @route     GET /api/v1/quizes/:subjectId/quizes
// @access    Public
exports.getQuizes = asyncHandler(async (req, res, next) => {
    if (req.params.subjectId) {
        const quizes = await Quiz.find({ subject: req.params.subjectId });

        return res.status(200).json({
            success: true,
            count: quizes.length,
            data: quizes
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc      Create new subject
// @route     POST /api/v1/subjects
// @access    Private
exports.createSubject = asyncHandler(async (req, res, next) => {
    // Add user to req,body
    req.body.user = req.user.id;

    const subject = await Subject.create(req.body);

    res.status(201).json({
        success: true,
        data: subject
    });
});



// @desc      Update subject
// @route     PUT /api/v1/subjects/:id
// @access    Private
exports.updateSubject = asyncHandler(async (req, res, next) => {
    let subject = await Subject.findById(req.params.id);

    if (!subject) {
        return next(
            new ErrorResponse(`Subject not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is Site owner
    if (subject.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this subject`,
                401
            )
        );
    }

    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: subject });
});

// @desc      Delete subject
// @route     DELETE /api/v1/subject/:id
// @access    Private
exports.deleteSubject = asyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
        return next(
            new ErrorResponse(`Subject not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is site owner
    if (subject.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this subject`,
                401
            )
        );
    }

    await subject.remove();

    res.status(200).json({ success: true, data: {} });
});


// @desc      Create new subject using csv
// @route     POST /api/v1/subjects
// @access    Private
exports.createSubjectCSV = asyncHandler(async (req, res, next) => {
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
                const cat = await Subject.create({
                    ...map,
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

exports.searchSubject = asyncHandler(async (req, res, next) => {

    const subjects = await Subject.find({ $text: { $search: req.params.term, $caseSensitive: false }, display: true });
    return res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects
    });

})

// @desc      Upload photo for subject
// @route     PUT /api/v1/subjects/photo
// @access    Private
exports.subjectUploadPhoto = asyncHandler(async (req, res, next) => {

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
