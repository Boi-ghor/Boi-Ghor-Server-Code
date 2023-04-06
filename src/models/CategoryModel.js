const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    name: {
        type: String
    },
    slug: {
        type: String,
        lowercase: true
    },
    photoUrl: {
        type: String,
        required: true
    },
    photoId: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;