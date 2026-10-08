import mongoose from "mongoose";

const SubSectionSchema = new mongoose.Schema({

    name: {
        type: String
    },

    description: {
        type: String
    },

    videoUrl: {
        type: String
    },

    timeDuration: {
        type: String
    }
    
})

module.exports = mongoose.model("SubSection", SubSectionSchema)