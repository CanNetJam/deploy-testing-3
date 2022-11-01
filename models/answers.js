const mongoose = require("mongoose")

const answersSchema = new mongoose.Schema({
    candidate: { 
        type: mongoose.Schema.Types.ObjectId, ref: "accounts",
    },
    project: { 
        type: mongoose.Schema.Types.ObjectId, ref: "projects",
    },
    answers: [String]
}, { timestamps: true })

module.exports = mongoose.model("answers", answersSchema)