const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController')
const productController = require('../controller/productController')

router.get('/category', categoryController.getAllCategories);
router.post('/category', categoryController.createCategory);
router.get('/product', productController.getAllProduct);
router.post('/product', productController.createProduct);
router.post('/product/add-review', productController.addReview);
module.exports = router;