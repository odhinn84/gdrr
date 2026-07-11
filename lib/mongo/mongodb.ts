import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined");
        }
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectMongoDB;
