const express = require('express');
const {
  getQuizes,
  getQuiz,
  addQuiz,
  createQuizCSV,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quiz');

const Quiz = require('../models/Quiz');
const questionRouter = require('./questions');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:quizId/questions', questionRouter);

router
  .route('/')
  .get(advancedResults(Quiz, 'category'), advancedResults(Quiz, 'questions'), getQuizes)
  //.post(addQuiz);
  .post(protect, authorize('publisher', 'admin'), addQuiz);

router
  .route('/import')
  .post(protect, createQuizCSV)

router
  .route('/:id')
  .get(getQuiz)
  //.put(updateQuiz)
  //.delete(deleteQuiz);
  .put(protect, authorize('publisher', 'admin'), updateQuiz)
  .delete(protect, authorize('publisher', 'admin'), deleteQuiz);

module.exports = router;
