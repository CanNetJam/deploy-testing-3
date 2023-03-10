const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    requeststatus: {
        type: String,
        default: "Pending",
    },
    status: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    skillrequired: {
        type: String,
        required: true,
    },
    sallary: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    location: {
        region: {type: String}, 
        province: {type:String},
        city: {type:String}
    },
    employmenttype: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    image: {
        type: String,
    },
    employer: { 
        type: mongoose.Schema.Types.ObjectId, ref: "accounts",
    },
    tempfree: {
        type: String,
    },
    candidate: { 
        type: mongoose.Schema.Types.ObjectId, ref: "accounts",
    },
    slots: {
        type: Number,
        required: true,
    },
    tempcandidate: [{
        applicantid: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
        employmentstatus: {type: String},
        accepted: { 
            type: String,
            default: "No",
        },
    }],
    candidatelist: [{
        applicantid: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
        employmentstatus: {type: String},
        acceptedAt: {type: Date},
        accepted: { 
            type: String,
            default: "No",
        },
    }],
    accepted: { 
        type: String,
        default: "No",
    },
    gallery: {
        photo: {type: String}, 
        description: {type:String}
    },
    applicants: [{
        applicantid: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
        appliedAt: {type: Date}
    }],
    creationdate: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    approvaldate: {
        type: Date,
    },
    acceptdate: {
        type: Date,
    },
    completiondate: {
        type: Date,
    },
    notes: [{
        notesender: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
        note: {type: String}
    }],
    others:  {
        type: String,
    },
    minimumreq:  {
        what: {type: String},
        note: {type: String}
    },
    questions: [String],
    note: {
        type: String,
    }
})

module.exports = mongoose.model("projects", projectSchema)