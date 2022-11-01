const mongoose = require("mongoose")

const conversationsSchema = new mongoose.Schema({
        members: {
            type: Array,
        },
        messages: {
            type: Number,
            default: 0
        },
}, { timestamps: true })

module.exports = mongoose.model("conversations", conversationsSchema)