const bookModel = require("../models/Book/book");
const orderModel = require("../models/Order/OrderModel")
const cloudinary = require("../helpers/imageUpload");
const slugify = require("slugify");
const braintree = require("braintree");
const mongoose=require('mongoose')

// Payment GateWay
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
  

exports.createBook = async (req,res) => {
    console.log("aschi")
    try {
        const {bookName,description,price,quantity,sellCount,category,author,publisher} = req.body;
        console.log("acchi")
        const {photo} = req.files;
        switch (true) {
            case !bookName?.trim():
                return res.json({error: "Book name is required"});
            case !description?.trim():
                return res.json({error: "Book description is required"});
            case !price?.trim():
                return res.json({error: "Price required"});
            case !quantity?.trim():
                return res.json({error: "Quantity required"});
            case photo && photo.size > 1000000:
                return res.json({error: "Image required and it should be less then 1 MB"});
        }
        const {url, public_id} = await cloudinary.uploader.upload(photo.tempFilePath, {folder: 'Book'});
        const book = new bookModel ({...req.body, slug:slugify(bookName), photoURL: url, photoId: public_id});
        await book.save();
        res.json(book)
    } catch (err) {
        console.log(err)
    }
}

exports.list = async (req, res) => {
    try {
      const books = await bookModel.aggregate([
        {
            $lookup: {from:"categories", localField:"category", foreignField:"name", as: "category"}
        },
        {
            $lookup: {from:"authors", localField:"author", foreignField:"authorName", as: "author"}
        },
        {
            $lookup: {from:"publishers", localField:"publisher", foreignField:"publisherName", as: "publisher"}
        }
      ])
      res.json(books);
    } catch (err) {
      console.log(err);
    }
  };

  exports.read = async (req, res) => {
    try {
        const book = await bookModel.aggregate([
            {
                $match: {slug: req.params.slug}
            },
            {
                $lookup: {from:"categories", localField:"category", foreignField:"name", as: "category"}
            },
            {
                $lookup: {from:"authors", localField:"author", foreignField:"authorName", as: "author"}
            },
            {
                $lookup: {from:"publishers", localField:"publisher", foreignField:"publisherName", as: "publisher"}
            }
          ])
  
      res.json(book);
    } catch (err) {
      console.log(err);
    }
  };

  exports.remove = async (req, res) => {
    try {
      const book = await bookModel.deleteOne(
        {_id:req.params.bookId}
      );
      res.json(book);
    } catch (err) {
      console.log(err);
    }
  };


  exports.updateBook = async (req,res) => {
    try {
        const {bookName,description,price,quantity,sellCount,category,author,publisher} = req.body;
        const {photo} = req.files;
        switch (true) {
            case !bookName?.trim():
                return res.json({error: "Book name is required"});
            case !description?.trim():
                return res.json({error: "Book description is required"});
            case !price?.trim():
                return res.json({error: "Price required"});
            case !quantity?.trim():
                return res.json({error: "Quantity required"});
            case !category?.trim():
                return res.json({error: "Quantity required"});
            case !author?.trim():
                return res.json({error: "Quantity required"});
            case !publisher?.trim():
                return res.json({error: "Quantity required"});
            case photo && photo.size > 1000000:
                return res.json({error: "Image required and it should be less then 1 MB"});
        }
        const bookDetail = await bookModel.find({_id:req.params.bookId});
        console.log(bookDetail)
        const {result} = await cloudinary.uploader.destroy(bookDetail.photoId);
        const {url, public_id} = await cloudinary.uploader.upload(photo.tempFilePath, {folder: 'Book'});
        const book = new bookModel ({...req.body, slug:slugify(bookName), photoURL: url, photoId: public_id});
        await book.update();
        res.json(book)
    } catch (err) {
        console.log({console: err})
    }
}

  

exports.addReview=async (req,res)=>{

      try{
          console.log("aschi")
          const {bookId,userId,name,review}=req.body;
          const payload={
              userId,
              name,
              review
          }
        const newReview= await  bookModel.findOneAndUpdate(
              { _id: bookId },
              { $push: { review: payload } },
              { new: true },)
        if(newReview){
            res.json({message:"review added successfully"})
        }else{
            res.json({error:"review cannot added"})
        }
      }
      catch (e) {
          res.json({error:e})
      }

}

exports.filterBook=async (req,res)=>{
      try{

      }
    catch
    (e)
    {

    }
}

//========== Payment Gateway ==============//
//token
exports.braintreeToken = async (req, res)=>{
    try{
        gateway.clientToken.generate({}, function(err, response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
        })
    }catch(err){
        console.log(err)
    }
}

//payment
exports.braintreePayment = async (req, res)=>{
    try{
        const {cart, nonce} = req.body;
    let total = 0
    cart.map( (i) => {
      total += i.price
    });

    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    }, function(err, result){
      if(result){
        const order = new orderModel({
          books: cart,
          payment: result,
          buyer: req.user._id
        }).save()
        res.json(({ok: true}))
      }else{
        res.status(500).send(err)
      }
    })
    }catch(err){
        console.log(err)
    }
}