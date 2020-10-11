const express = require('express');
const {
  getTest,
  createTest,
  deleteTest,
  getTests,
  updatTest,
  getTestByUserIdAndQuizId
} = require('../controllers/test');



const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'user', 'guest'));


router
  .route('/')
  .get(protect, authorize('admin', 'user', 'guest'), getTests)
  .post(protect, authorize('admin', 'user', 'guest'), createTest);

router
  .route('/:id')
  .get(protect, authorize('admin', 'user', 'guest'), getTest)
  .put(protect, authorize('admin', 'user', 'guest'), updatTest)
  .delete(protect, authorize('admin', 'user', 'guest'), deleteTest)

router
  .route('/:userId/:quizId')
  .get(protect, getTestByUserIdAndQuizId)

module.exports = router;
