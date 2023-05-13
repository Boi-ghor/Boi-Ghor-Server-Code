const categoryModel = require("../models/CategoryModel")
const slugify = require("slugify")
const cloudinary = require("../helpers/imageUpload")
const bookModel = require("../models/Book/book");

//======== Category Create ============//

exports.create = async (req, res)=>{
    try{
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message: "Name is Required"})
        }

        const existingCategory = await categoryModel.find({ name });
        if(existingCategory.length>0){
            return res.status(200).send({
                success: false,
                message: "Category Already Exists"
            })
        }

        const file = req?.files?.photo;
        console.log(req.file)
        if(!file){
            return res.status(401).send({message: "Photo not found"})
        }

        const hostedPhoto = await cloudinary.uploader.upload(file.tempFilePath, (err, result)=>{
            console.log(result)
        })

        const category = await new categoryModel({
            name,
            slug: slugify(name),
            photoUrl: hostedPhoto.url,
            photoId: hostedPhoto.public_id
        }).save();
        res.status(201).send({
            success: true,
            message: "new category created",
            category
        });

    }catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Category"
        })
    }
}


//============= Update Category ============//

exports.update = async (req, res)=>{
    try{
        const {name} = req.body;
        const {id} = req.params;

        const category = await categoryModel.findByIdAndUpdate(
            id,
            {name, slug: slugify(name)},
            {new: true}
        );
        res.status(200).send({
            success: true,
            message: "Category Updated Successfully",
            category,
        });
        
    }catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Category"
        })
    }
}


//============== Delete Category ==================//
exports.remove = async (req, res) => {
    const {categoryName}=req.body
    try {
        const books=  await bookModel.aggregate([
            {$match:{category:categoryName}}
        ])

        if(books.length > 0){
            return res.json({error:"this category have a book ,so u cant delete this author"})
        }else{
            console.log('esechi')
            const {_id,photoId}=await categoryModel.findOne({name:categoryName});
            console.log(_id)
            if(!_id && !photoId){
                return res.json({error:"author name not found"})
            }
            await cloudinary.uploader.destroy(photoId);
            await categoryModel.findByIdAndDelete(_id)
            return   res.status(200).json({ success: true, message: "deleted successfully"});
        }
    } catch (err) {
        res.status(500).json({success: false, data: err, message: "delete fail"})
    }
};



//============= List Category ==============//
exports.list = async (req, res)=>{
    try{
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: "All Categories List",
            category
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting all categories",
            error
        })
    }

}

//=========== Read Category ==============//
exports.read = async (req, res)=>{
    try{
        const Category = await categoryModel.findOne({_id: req.params._id})
        res.json(Category)
    }catch(error){
        console.log(error)
        return res.status(400).json(error.message)
    }
}

//================ Book By Category =============//
exports.booksByCategory = async (req, res)=>{
    try{
        const {categoryName}=req.params;
        const books=  await bookModel.aggregate([
            {
                $match: {
                    category:categoryName
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
    catch (e) {

    }

}