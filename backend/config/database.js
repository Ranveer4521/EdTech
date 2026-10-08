import mongoose from "mongoose";
import 'dotenv/config'

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
    .then( () => console.log('DB connected successfully') )
    .catch( (error) => {
        console.log('DB not connected'),
        console.log(error),
        process.exit(1)
    } )
}

export default connectDB