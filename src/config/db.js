import mongoose from "mongoose";

async function connectDB() {
    try {

        await mongoose.connect(process.env.MONGO_URI)
        console.log("DATABASE CONNECTED")

    } catch (error) {
        console.log("FAILED TO CONNECT DATABASE")
        process.exit(1)
    }
}

export default connectDB