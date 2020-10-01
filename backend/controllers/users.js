const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const { imageUpload } = require('../middleware/aws-upload');

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update password
// @route     DELETE /api/v1/users/:id/updatepassword
// @access    Private/Admin
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const password = req.body.password;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
  }
  next();
})


// @desc      Upload photo for User
// @route     PUT /api/v1/users/photo
// @access    Private
exports.userUploadPhoto = asyncHandler(async (req, res, next) => {

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