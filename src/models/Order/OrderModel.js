const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    books: [{
        type: mongoose.ObjectId,
        ref: "books"
    }],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "delivered", "cancel"],
    }
},{
    timestamps: true,
    versionKey: false
})

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;