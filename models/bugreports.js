const mongoose = require("mongoose")

const bugreportsSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId, ref: "accounts",
    },
    title: {
        type: String,
    },
    photo: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps: true })

module.exports = mongoose.model("bugreports", bugreportsSchema)