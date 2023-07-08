const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    firstname: String,
    lastname: String,
    middlename: String,
    age: Number,
    address: String,
    location: {
        region: {type: String}, 
        province: {type:String},
        city: {type:String}
    },
    sex: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    skill: [String],
    about: {
        type: String,
        default: "",
    },
    photo: {
        type: String,
    },
    image: {
        type: String,
    },
    resume: {
        type: String,
    },
    ratings: [Number],
    averagerating: {
        type: Number,
        default: 0,
    },
    company: String,
    position: String,
    companyinfo: {
        companyname: String,
        establishdate: Number,
        details: String,
        logo: String,
        companysize: Number,
        location: {
            region: {type: String}, 
            province: {type:String},
            city: {type:String}
        }
    },
    currentprojects: [
        { type: mongoose.Schema.Types.ObjectId, ref: "projects" }
    ],
    lastactive: {
        type: Date,
        default: () => Date.now(),
    },
    phone: Number,
    candidatetype: String,
    degree: {
        school: String,
        course: String,
        degreetitle: String
    },
    citizenship: String,
}, { timestamps: true })

module.exports = mongoose.model("accounts", userSchema)


