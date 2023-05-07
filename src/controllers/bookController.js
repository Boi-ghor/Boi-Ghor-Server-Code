const bookModel = require("../models/Book/book");
const cloudinary = require("../helpers/imageUpload");
const slugify = require("slugify");
const mongoose=require('mongoose')
const publisherModel = require("../models/Publisher/publisher");
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
      const {photoId} = await bookModel.findOne(
        {_id:req.params.bookId}
      );

      if(!photoId) return res.json({error:"photo already deleted"})
        await cloudinary.uploader.destroy(photoId);
        await bookModel.findByIdAndDelete(req.params.bookId)
        return   res.status(200).json({ success: true, message: "deleted successfully"});

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
            res.json({message:"review added successfuly"})
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
          const { checked, radio,search } = req.body;
          console.log(search)

       const books=  await bookModel.aggregate([
              {
                  $match: {
                      $or: [
                          { category: { $in: checked } },
                          { price: { $gte: radio[0], $lte: radio[1] } },
                          {$or:[
                                  { bookName: { $regex: search, $options: "i" } },
                                  { description: { $regex: search, $options: "i" } },
                                  { slug: { $regex: search, $options: "i" } },
                                  { category: { $regex: search, $options: "i" } },
                                  { publisher: { $regex: search, $options: "i" } },
                                  { author: { $regex: search, $options: "i" } },

                              ]}
                      ]
                  }
              },
              {
                  $lookup: {
                      from: "categories",
                      localField: "category",
                      foreignField: "name",
                      as: "category"
                  }
              },
              {
                  $lookup: {
                      from: "authors",
                      localField: "author",
                      foreignField: "authorName",
                      as: "author"
                  }
              },
              {
                  $lookup: {
                      from: "publishers",
                      localField: "publisher",
                      foreignField: "publisherName",
                      as: "publisher"
                  }
              }
          ]);
       res.json(books)
      }
    catch
    (e)
    {
        console.log(e)
    }
}

exports.newBook=async (req,res)=>{
      try{
          const books=  await bookModel.aggregate([

              { $sort: { createAt: 1 } },

              {
                  $lookup: {
                      from: "categories",
                      localField: "category",
                      foreignField: "name",
                      as: "category"
                  }
              },
              {
                  $lookup: {
                      from: "authors",
                      localField: "author",
                      foreignField: "authorName",
                      as: "author"
                  }
              },
              {
                  $lookup: {
                      from: "publishers",
                      localField: "publisher",
                      foreignField: "publisherName",
                      as: "publisher"
                  }
              }
          ]);
          res.json(books)
      }
      catch (e) {

      }
}

exports.popularBooks= async (req,res)=>{
    try{
        const books=  await bookModel.aggregate([

            { $match: { isPopular: true } },

            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "name",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "author",
                    foreignField: "authorName",
                    as: "author"
                }
            },
            {
                $lookup: {
                    from: "publishers",
                    localField: "publisher",
                    foreignField: "publisherName",
                    as: "publisher"
                }
            }
        ]);
        res.json(books)
    }
    catch (e) {

    }
}