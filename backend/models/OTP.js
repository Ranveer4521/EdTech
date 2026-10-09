import mongoose from "mongoose";
import mailSender from '../utils/mailSender'

const OTPschema = new mongoose.Schema({

    email:{
        type: String,
        required: true
    },

    otp: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
})

const sendVerficationEmail = async (email, otp) => {

    try{
        const mailResponse = await mailSender(email, "Verification email from StudyNotion", otp)
        console.log("Mail sent successfully: ", mailResponse)
    
    } catch(error){
        console.log("error: ", error)
        throw error
    } 
}

OTPschema.pre("save", async function(next){

    await sendVerficationEmail(this.email, this.otp)
    return next()
})


module.exports = mongoose.model("OTP", OTPschema)