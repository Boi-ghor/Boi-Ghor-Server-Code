const categoryModel = require("../models/CategoryModel")
const slugify = require("slugify")
const cloudinary = require("../helpers/imageUpload")

//======== Category Create ============//

exports.create = async (req, res)=>{
    try{
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message: "Name is Required"})
        }

        const existingCategory = await categoryModel.find({ name });
        if(existingCategory){
            return res.status(200).send({
                success: false,
                message: "Category Already Exists"
            })
        }

        const file = req?.file?.photo;
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
exports.remove = async (req, res)=>{
    try{
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Category Deleted Successfully",
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error while deleting category",
            error
        })
    }
}


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
        const Category = await categoryModel.find({slug: req.params.slug})
        res.json(Category)
    }catch(error){
        console.log(error)
        return res.status(400).json(error.message)
    }
}

//================ Book By Category =============//
exports.booksByCategory = async (req, res)=>{
    try{
        const Category = await categoryModel.find({slug: req.params.slug})
        // Here is Books model implement

        res.status(200).send({
            success: true,
            Category,
            //book
        })
    }catch(error){
        console.log(err)

    }
}