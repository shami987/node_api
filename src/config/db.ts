// This part will help me to connect node.js application to a mongodb database
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/node_api");
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connectinon failed", error);
        process.exit(1); // Exit process with failure
    }
}
export default connectDB; 