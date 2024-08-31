const express = require("express");
const router = express.Router();

const authController = require("../contollers/auth.controller");
const userController = require("../contollers/user.controller");
const productController = require("../contollers/product.controller");
const orderController = require('../contollers/order.controller')

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
router.post('/order/createOrder', orderController.createOrder);
router.get('/orders/getAllOrders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);

module.exports = router;
