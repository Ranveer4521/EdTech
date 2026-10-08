import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    accountType: {
        type: String,
        enum: ["Admin", "Instructor", "Student"],
        required: true
    },

    profile: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Profile'
    },

    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses"
        }
    ],

    image: {
        type: String,
        requird: true
    },

    courseProgress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress"
    }

})

module.exports = mongoose.model("User", userSchema)