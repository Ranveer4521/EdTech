import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({

    dob: {
        type: String
    },

    gender: {
        type: String
    },

    about: {
        type: String
    },

    contactNumber: {
        type: Number,
        trim: true
    }
})

module.exports = mongoose.model("Profile", profileSchema)