const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Test = require('../models/Test');
const { imageUpload } = require('../middleware/aws-upload');





// @desc      Get tests
// @route     GET /api/v1/users/:userId/tests
// @access    Private/user/guest/admin
exports.getTests = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const tests = await Test.find({ user: req.params.userId }).populate({
      path: 'user',
      select: 'userName'
    });

    return res.status(200).json({
      success: true,
      count: tests.length,
      data: tests
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single test
// @route     GET /api/v1/tests/:id
// @access    Private/User/Admin
exports.getTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: test
  });
});

// @desc      Get single test
// @route     GET /api/v1/tests/:id
// @access    Private/User/Admin
exports.getTestByUserIdAndQuizId = asyncHandler(async (req, res, next) => {

  const test = await Test.findOne({
    user: req.params.userId,
    quiz: req.params.quizId
  });

  res.status(200).json({
    success: true,
    data: test
  });
});

// @desc      Create Test
// @route     POST /api/v1/tests
// @access    Private/User/Admin
exports.createTest = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const user = await Test.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc      Update test
// @route     PUT /api/v1/tests/:id
// @access    Private/Admin/User/guest
exports.updatTest = asyncHandler(async (req, res, next) => {

  let test = await Test.findById(req.params.id);

  if (!test) {
    return next(
      new ErrorResponse(`Test not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is Site owner
  if (test.user.toString() !== req.user.id && req.user.role !== ('admin' || 'user' || 'guest')) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this category`,
        401
      )
    );
  }

  test = await Test.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: test });
});

// @desc      Delete test
// @route     DELETE /api/v1/tests/:id
// @access    Private/Admin/User
exports.deleteTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: test
  });
});
