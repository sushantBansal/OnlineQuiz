const express = require('express');
const {
  getSubjects,
  getSubject,
  getQuizes,
  searchSubject,
  createSubject,
  createSubjectCSV,
  updateSubject,
  deleteSubject,
  subjectUploadPhoto
} = require('../controllers/subject');

const Subject = require('../models/Subject');

// Include other resource routers
const quizRouter = require('./quizes');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const { fileUpload } = require('../middleware/aws-upload');

// Re-route into other resource routers
router.use('/:categoryId/quizes', quizRouter);

router
  .route('/photo')
  //.put(categoryUploadPhoto);
  .post(protect, authorize('publisher', 'admin'), subjectUploadPhoto);

router
  .route('/import')
  .post(protect, createSubjectCSV)

router
  .route('/')
  .get(advancedResults(Subject, 'parentCategory'), advancedResults(Subject, 'quizes'), getSubjects)
  //.post(createCategory);
  .post(protect, authorize('admin'), createSubject);

router
  .route('/:id')
  .get(getSubject)
  //.put(updateCategory)
  //.delete(deleteCategory);
  .put(protect, authorize('admin'), updateSubject)
  .delete(protect, authorize('admin'), deleteSubject);

router
  .route('/search/:term')
  .get(searchSubject);

module.exports = router;
