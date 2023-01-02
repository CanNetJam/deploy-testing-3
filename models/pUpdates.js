const mongoose = require("mongoose")

const pUpdatesSchema = new mongoose.Schema({
    projectId: {
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
    uploadedby: {
        type: String,
    },
    note: {
        type: String,
    },
}, { timestamps: true })

module.exports = mongoose.model("pUpdates", pUpdatesSchema)