const express = require('express');
const {
  getQuestions,
  getQuestion,
  createQuestionCSV,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/question');

const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// Include other resource routers
// const quizRouter = require('./quizes');
// router.use('/:categoryId/quizes', quizRouter);

router
  .route('/')
  .get(advancedResults(Question, 'quiz'), getQuestions)
  //.post(addQuestion);
  .post(protect, authorize('admin'), addQuestion);

router
  .route('/import')
  .post(protect, createQuestionCSV)

router
  .route('/:id')
  .get(getQuestion)
  //.put(updateQuiz)
  //.delete(deleteQuiz);
  .put(protect, authorize('admin'), updateQuestion)
  .delete(protect, authorize('admin'), deleteQuestion);

module.exports = router;
