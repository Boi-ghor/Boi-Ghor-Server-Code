const mongoose=require('mongoose');

const orderSchema= mongoose.Schema({
    customerName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    bookList:[{
        type:Object,
        required:true
    }],
    totalPrice:{
        type:Number
    },
    isPay:{
        type:String,
        enum:["paid","unpaid"],
        default:"unpaid"

    },
    show:{
        type:String,
        enum:[true,false],
        default: true
    },
    orderStatus:
        {
            type:String,
            enum:['accepted','processing' ,'shipped','delivered'],
            default:'accepted',
        }

},{timestamps:true,versionKey:false});

const orderModel=mongoose.model("orders",orderSchema);

module.exports=orderModel;