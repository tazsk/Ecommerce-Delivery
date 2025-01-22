import mongoose from "mongoose";

const connectDB = () => {
    try {
            mongoose.connect(process.env.MONGO_URL);
            console.log(('MongoDB connected'));
    }
    catch (err) {
                    console.log(err.message);
    }
}

export default connectDB;