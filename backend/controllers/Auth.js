import User from '../models/User'
import OTP from '../models/OTP'
import Profile from '../models/Profile'
import bcrypt from 'bcrypt'
import otpGenerator from 'otp-generator'
import jwt from 'jsonwebtoken'


// send otp controller 

exports.sendOtp = async (req, res) => {

    try {

        const { email } = req.body

        const ifUserAlreadyExits = await User.findOne({ email })

        if (ifUserAlreadyExits) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }


        // otp generation

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        let result = await OTP.findOne({ otp: otp })
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }


        const otpPayload = { email, otp }
        const otpBody = await OTP.create(otpPayload)

        res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
            otp,
        })

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }

}



// signUp controller

exports.signup = async (req, res) => {

    try {
        const { firstName, lastName, email, password, confirmPassword, contactNumber, accountType, otp } = req.body

        if (!firstName || !lastName || !email || !password || !confirmPassword, !otp) {
            return res.status(403).json({
                success: false,
                message: 'Enter all the fields'
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            })
        }

        const checkIfUserExists = await User.findOne({ email })
        if (checkIfUserExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1)

        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: 'Enter complete OTP'
            })
        } else if (recentOtp.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            })
        }


        // Hashing the password
        const hashPassword = await bcrypt.hash(password, 10)


        // entry create in db
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumer: null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
        })

        return res.status(200).json({
            success: true,
            message: 'User is registered Successfully',
            user,
        });

    } catch (error) {

        console.log(error)
        return res.status(400).json({
            success: false,
            message: 'Could not register, try again'
        })
    }

}


// login controller

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Enter all the fields'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Sign up first'
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            })
        }

        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2h'
        })

        user.token = token
        user.password = undefined

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            user,
            token,
            message: 'Logged in successfully'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login Failure, please try again',
        })
    }
}