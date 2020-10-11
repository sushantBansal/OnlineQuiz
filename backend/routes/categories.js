const express = require('express');
const {
  getCategories,
  getCategory,
  getQuizes,
  searchCategory,
  createCategory,
  createCategoryCSV,
  updateCategory,
  deleteCategory,
  categoryUploadPhoto
} = require('../controllers/category');

const Category = require('../models/Category');

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
  .post(protect, authorize('publisher', 'admin'), categoryUploadPhoto);

router
  .route('/import')
  .post(protect, createCategoryCSV)

router
  .route('/')
  .get(advancedResults(Category, 'parentCategory'), advancedResults(Category, 'subCategories'), getCategories)
  //.post(createCategory);
  .post(protect, authorize('admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  //.put(updateCategory)
  //.delete(deleteCategory);
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

router
  .route('/search/:term')
  .get(searchCategory);

module.exports = router;
