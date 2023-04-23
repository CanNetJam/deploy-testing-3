const mongoose = require("mongoose")

const logsSchema = new mongoose.Schema({
    type: {
        type: String,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId, ref: "accounts",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "accounts",
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId, ref: "projects",
    }
}, { timestamps: true })

module.exports = mongoose.model("logs", logsSchema)