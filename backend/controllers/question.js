const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Category = require('../models/Category');
const csv = require('csvtojson');
const fs = require('fs');

// @desc      Get questions
// @route     GET /api/v1/questions
// @route     GET /api/v1/quizes/:quizId/questions
// @access    Public
exports.getQuestions = asyncHandler(async (req, res, next) => {
    if (req.params.quizId) {
        const questions = await Question.find({ quiz: req.params.quizId }).populate({
            path: 'quiz',
            select: 'title'
        });

        return res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc      Get single question
// @route     GET /api/v1/questions/:id
// @access    Public
exports.getQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id).populate({
        path: 'quiz',
        select: 'title'
    });

    if (!question) {
        return next(
            new ErrorResponse(`No question with the id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: question
    });
});

// @desc      Add question
// @route     POST /api/v1/quizes/:quizId/questions
// @access    Private
exports.addQuestion = asyncHandler(async (req, res, next) => {
    console.log(req.params)
    req.body.quiz = req.params.quizId;
    // Commented out user
    req.body.user = req.user.id;

    const quiz = await Quiz.findById(req.body.quiz);

    if (!quiz) {
        return next(
            new ErrorResponse(
                `No quiz with the id of ${req.body.quiz}`,
                404
            )
        );
    }

    // Make sure user is site owner
    if (quiz.user && quiz.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to add a question to quiz ${category._id}`,
                401
            )
        );
    }

    const question = await Question.create(req.body);

    res.status(200).json({
        success: true,
        data: question
    });
});


// @desc      Create new Quiz using csv
// @route     POST /api/v1/quizes
// @access    Private
exports.createQuestionCSV = asyncHandler(async (req, res, next) => {
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

        //fs.unlinkSync(tempPath)

        let isMultiple = {
            FALSE: false,
            TRUE: true
        }

        jsonObj.map(async (obj) => {
            await Question.create({
                ...obj,
                isMultiple: dataMap[obj.isMultiple],
                user: req.body.user
            })
        })

        console.log(jsonObj.map(obj => (obj)))
        return res.status(201).json({
            success: true,
            dataImported: jsonObj
        });
    });

});

// @desc      Update question
// @route     PUT /api/v1/questions/:id
// @access    Private
exports.updateQuestion = asyncHandler(async (req, res, next) => {
    let question = await Question.findById(req.params.id);

    if (!question) {
        return next(
            new ErrorResponse(`No Question with the id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is quiz owner
    if (question.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update question ${quiz._id}`,
                401
            )
        );
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    question.save();

    res.status(200).json({
        success: true,
        data: question
    });
});

// @desc      Delete question
// @route     DELETE /api/v1/questions/:id
// @access    Private
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        return next(
            new ErrorResponse(`No question with the id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is question owner
    if (question.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete question ${course._id}`,
                401
            )
        );
    }

    await question.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
