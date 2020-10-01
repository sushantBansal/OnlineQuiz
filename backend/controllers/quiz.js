const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Quiz = require('../models/Quiz');
const Category = require('../models/Category');
const csv = require('csvtojson')
const fs = require('fs');

// @desc      Get quizes
// @route     GET /api/v1/quizes
// @route     GET /api/v1/categories/:categoryId/quizes
// @access    Public
exports.getQuizes = asyncHandler(async (req, res, next) => {

    console.log("Calling getQuizes in Quiz Controller")
    if (req.params.categoryId) {
        const quizes = await Quiz.find({ category: req.params.categoryId }).populate({
            path: 'category',
            select: 'title'
        }).populate('questions');

        return res.status(200).json({
            success: true,
            count: quizes.length,
            data: quizes
        });
    }
    // if (req.params.categoryId) {
    const quizes = await Quiz.find().populate({
        path: 'subject',
        select: 'title'
    }).populate('questions');

    return res.status(200).json({
        success: true,
        count: quizes.length,
        data: quizes
    });
    // } else {
    //     res.status(200).json(res.advancedResults);
    // }
});

// @desc      Get single quiz
// @route     GET /api/v1/quizes/:id
// @access    Public
exports.getQuiz = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id).populate({
        path: 'questions'
    }).populate('category');

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz with the id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: quiz
    });
});

// @desc      Add quiz
// @route     POST /api/v1/categories/:categoryId/quizes
// @access    Private
exports.addQuiz = asyncHandler(async (req, res, next) => {
    console.log(req.params)
    req.body.category = req.params.categoryId;
    // Commented out user
    req.body.user = req.user.id;

    const category = await Category.findById(req.body.category);

    if (!category) {
        return next(
            new ErrorResponse(
                `No category with the id of ${req.body.category}`,
                404
            )
        );
    }

    // Make sure user is site owner
    if (category.user && category.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to add a quiz to category ${category._id}`,
                401
            )
        );
    }

    const quiz = await Quiz.create(req.body);

    res.status(200).json({
        success: true,
        data: quiz
    });
});


// @desc      Create new Quiz using csv
// @route     POST /api/v1/quizes
// @access    Private
exports.createQuizCSV = asyncHandler(async (req, res, next) => {
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

        const jsonObj = await csv({ delimiter: ',' })
            .fromFile(tempPath)

        let dataMap = {
            FALSE: false,
            TRUE: true
        }

        const responses = await Promise.all(jsonObj.map(async (obj) => {

            try {
                const quiz = await Quiz.create({
                    ...obj,
                    display: dataMap[obj.display],
                    user: req.body.user
                })
                return quiz
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

// @desc      Update quiz
// @route     PUT /api/v1/quizes/:id
// @access    Private
exports.updateQuiz = asyncHandler(async (req, res, next) => {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return next(
            new ErrorResponse(`No Quiz with the id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is quiz owner
    if (quiz.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update quiz ${quiz._id}`,
                401
            )
        );
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    quiz.save();

    res.status(200).json({
        success: true,
        data: quiz
    });
});

// @desc      Delete quiz
// @route     DELETE /api/v1/quizes/:id
// @access    Private
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz with the id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is course owner
    if (quiz.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete quiz ${course._id}`,
                401
            )
        );
    }

    await quiz.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
