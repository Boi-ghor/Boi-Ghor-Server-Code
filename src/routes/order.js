const express = require("express");
const { CreateOrder, getMyOrder, getAllOrder, getOrderById, getOrderByPay, deleteOrder, changeOrderStatus } = require("../controllers/orderController");
const { registerSignIn, isAdmin} = require("../middleware/auth");
const {getPaymentToken, checkOut} = require("../controllers/paymentController");
const router = express.Router();

router.post("/createOrder",registerSignIn,CreateOrder);
router.get('/myOrders',registerSignIn,getMyOrder);
router.get('/allOrders',registerSignIn,isAdmin,getAllOrder);
router.get('/allOrders/:id',registerSignIn,getOrderById);
router.get('/order/:value',getOrderByPay);
router.delete('/order/:id',registerSignIn,deleteOrder);
router.put('/order/:id',registerSignIn,changeOrderStatus);

//payment

router.get('/client-token',registerSignIn,getPaymentToken)
router.post('/checkout/:id',registerSignIn,checkOut)

module.exports = router;