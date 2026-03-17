import mongoose from "mongoose";

const connectDB = async () => {
    // 1. Check if we are already connected (The Serverless Trick)
    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to database");
        return;
    }

    try {
        // 2. Connect to the database
        await mongoose.connect(`${process.env.MONGODB_URL}/pingup`);
        console.log('Database connected');
    } catch (error) {
        // 3. Throw the error so the app stops and shows us the real problem
        console.log("Database connection failed:", error.message);
        throw error; 
    }
}

export default connectDB;