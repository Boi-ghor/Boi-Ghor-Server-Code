const orderModel = require("../models/Order/Order");
const UserModel = require("../models/User/User");



exports.CreateOrder = async (req,res) => {
    try {
        // console.log("req",req.user['_id'])
        let postBody = req.body;
        let userDetails = await UserModel.find({_id: req.user["_id"]})
        // console.log("createOrder",userDetails[0]['email'])
        postBody.userEmail = userDetails[0]['email']
        const orderConfirm = await orderModel.create(postBody);
        return res.status(200).json({success:true, data: orderConfirm, message: "order successful"})
    } catch (err) {
        return res.status(500).json({success:false, data: err.toString(), message: "error in order"})
    }
}

exports.getMyOrder= async (req,res) => {
    try{
        let userDetails = await UserModel.find({_id: req.user["_id"]})
        const payload={
            userEmail: userDetails[0]['email']
        }
        let data =await orderModel.aggregate([{$match:payload}])
        return res.status(200).json({success:true, data: data})
    }
    catch (err) {
        return res.status(500).json({success:false, data: err.toString()})
    }
}

exports.getAllOrder = async (req,res) => {
    try{
        let data =await orderModel.aggregate([{$match:{}}])
        return res.status(200).json({success:true, data: data})
    }
    catch (err) {
        return res.status(500).json({success:false, data: err.toString()})
    }
}

exports.getOrderById = async (req,res) => {
    try{
        const {id}=req.params;
        let data =await orderModel.findById(id)
        return res.status(200).json({success:true, data: data})
    }
    catch (err) {
        return res.status(500).json({success:false, data: err.toString()})
    }
}

exports.getOrderByPay = async (req,res) => {

    try{
        const {value}=req.params;
        const payload={
            isPay:value
        }
        console.log(payload)
        let data =await orderModel.aggregate([{$match:payload}])
        return res.status(200).json({success:true, data: data})
    }
    catch (err) {
        return res.status(500).json({success:false, data: err.toString()})
    }
}

exports.deleteOrder= async (req,res) => {
    try{
        let DeleteID=req.params.id;
        let QueryObject={};
        QueryObject['_id']=DeleteID;
        let data =  await orderModel.deleteMany(QueryObject)
        return res.status(200).json({success:true, data: data})
    }
    catch (err) {
        return res.status(500).json({success:false, data: err.toString()})
    }
}

exports.changeOrderStatus = async (req,res) => {
    try{
        const {id}= req.params;
        let PostBody=req.body;
        let data = await orderModel.findByIdAndUpdate(id,PostBody,{new:true})
        return res.status(200).json({success:true, data: data})
    }
    catch (err) {
        return res.status(500).json({success:false, data: err.toString()})
    }
}

