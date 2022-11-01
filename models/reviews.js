const mongoose = require("mongoose")

const reviewsSchema = new mongoose.Schema({
    projectId: {
        type: String,
    },
    candidate: {
        type: String,
    },
    freename: {
        type: String,
    },
    photo: {
        type: String,
    },
    description: {
        type: String,
    },
    uploadedby: {
        type: String,
    },
    empname: {
        type: String,
    },
    rating: {
        type: Number,
    },
}, { timestamps: true })

module.exports = mongoose.model("reviews", reviewsSchema)