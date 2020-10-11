const express = require('express');
const {
  getUsers,
  getUser,
  userUploadPhoto,
  createUser,
  updatePassword,
  updateUser,
  deleteUser
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });
// Include other resource routers
const testRouter = require('./tests');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Re-route into other resource routers
router.use('/:userId/tests', authorize('guest', 'user', 'admin'), testRouter);

router.use(authorize('admin'));

router
  .route('/photo')
  .post(protect, authorize('publisher', 'admin'), userUploadPhoto);

router
  .route('/')
  .get(protect, authorize('admin'), advancedResults(User), getUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updatePassword, updateUser)
  .delete(protect, authorize('admin'), deleteUser)


module.exports = router;
