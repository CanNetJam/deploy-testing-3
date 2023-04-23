const mongoose = require("mongoose")

const gallerySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "accounts",
    },
    username: {
        type: String,
    },
    title: {
        type: String,
    },
    photo: {
        type: String,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps: true })

module.exports = mongoose.model("gallery", gallerySchema)