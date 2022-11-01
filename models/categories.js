const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
      name: String,
      tags: {
        type: Array,
      },
      tagscount: {
        type: Number,
        default: 1
      },
}, { timestamps: true })

module.exports = mongoose.model("categories", categoriesSchema)