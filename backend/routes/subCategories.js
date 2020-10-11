const express = require('express');
const {
  getSubCategories,
  getSubCategory,
  getSubjects,
  searchSubCategory,
  createSubCategory,
  createSubCategoryCSV,
  updateSubCategory,
  deleteSubCategory,
  subCategoryUploadPhoto
} = require('../controllers/subCategory');

const SubCategory = require('../models/SubCategory');

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
  //.put(subCategoryUploadPhoto);
  .post(protect, authorize('publisher', 'admin'), subCategoryUploadPhoto);

router
  .route('/import')
  .post(protect, createSubCategoryCSV)

router
  .route('/')
  .get(advancedResults(SubCategory, 'parentCategory'), advancedResults(SubCategory, 'quizes'), getSubCategories)
  //.post(createSubCategory);
  .post(protect, authorize('admin'), createSubCategory);

router
  .route('/:id')
  .get(getSubCategory)
  //.put(updateSubCategory)
  //.delete(deleteSubCategory);
  .put(protect, authorize('admin'), updateSubCategory)
  .delete(protect, authorize('admin'), deleteSubCategory);

router
  .route('/search/:term')
  .get(searchSubCategory);

module.exports = router;
