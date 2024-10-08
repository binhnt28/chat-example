const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController')
const productController = require('../controller/productController')
const authController = require('../controller/authController')
const userController = require('../controller/userController')
const chatController = require('../controller/chatController')
const { verifyToken } = require('../middleware/authMiddleware')
router.get('/category', categoryController.getAllCategories);
router.post('/category', categoryController.createCategory);
router.get('/product', productController.getAllProduct);
router.post('/product', productController.createProduct);
router.post('/product/add-review', productController.addReview);
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/user/search', userController.searchUser);
router.get('/chat/list-message', verifyToken, chatController.listMessage);
router.post('/chat/create-message', verifyToken, chatController.sendMessage);
router.get('/chat/detail-message/:id', verifyToken, chatController.detailMessage);
module.exports = router;