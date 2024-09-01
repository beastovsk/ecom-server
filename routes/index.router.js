const express = require("express");
const router = express.Router();

const authController = require("../contollers/auth.controller");
const userController = require("../contollers/user.controller");
const productController = require("../contollers/product.controller");
const orderController = require('../contollers/order.controller')
const blogController = require('../contollers/blog.controller')
const feedbackController = require('../contollers/feedback.controller')

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/confirmEmail", authController.confirmEmail);
router.post("/auth/sendResetCode", authController.sendResetCode);
router.post("/auth/resetPassword", authController.resetPassword);
router.post("/auth/supportRequest", authController.supportRequest);
router.post("/user/changeEmail", userController.changeEmail);
router.get("/user/getUser", userController.getUser);
router.post("/user/changePassword", userController.changePassword);
router.get('/product/getProductById/:id', productController.getProductById);  
router.get('/product/getAllProducts', productController.getAllProducts);     
router.post('/product/createProduct', productController.createProduct);      
router.put('/product/updateProduct/:id', productController.updateProduct);   
router.delete('/product/deleteProduct/:id', productController.deleteProduct);
router.post('/orders/createOrder', orderController.createOrder);
router.get('/orders/getAllOrders', orderController.getAllOrders);
router.get('/orders/getUserOrders', orderController.getUserOrders);
router.get('/orders/:id', orderController.getOrderById);
router.get('/blog/getAllBlogs', blogController.getAllBlogs);     
router.post('/blog/createBlog', blogController.createBlog);      
router.put('/blog/updateBlog/:id', blogController.updateBlog);   
router.delete('/blog/deleteBlog/:id', blogController.deleteBlog);
router.get('/feedback/getAllFeedbacks', feedbackController.getAllFeedbacks);     
router.post('/feedback/createFeedback', feedbackController.createFeedback);

module.exports = router;
