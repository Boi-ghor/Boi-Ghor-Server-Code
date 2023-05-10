const express = require("express");
const { CreateOrder, getMyOrder, getAllOrder, getOrderById, getOrderByPay, deleteOrder, changeOrderStatus } = require("../controllers/orderController");
const { registerSignIn, isAdmin} = require("../middleware/auth");
const router = express.Router();

router.post("/createOrder",registerSignIn,CreateOrder);
router.get('/myOrders',registerSignIn,getMyOrder);
router.get('/allOrders',registerSignIn,isAdmin,getAllOrder);
router.get('/allOrders/:id',registerSignIn,getOrderById);
router.get('/order/:value',getOrderByPay);
router.delete('/order/:id',registerSignIn,deleteOrder);
router.put('/order/:id',registerSignIn,changeOrderStatus);

module.exports = router;