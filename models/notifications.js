const mongoose = require("mongoose")

const notificationsSchema = new mongoose.Schema({
    type: {
        type: String,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId, ref: "accounts",
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId, ref: "accounts",
    },
    subject: {
        type: String,
    },
    action: {
        type: String,
    },
    cleared: {
        type: String,
        default: "No",
    },
}, { timestamps: true })

module.exports = mongoose.model("notifications", notificationsSchema)