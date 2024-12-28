import mongoose from "mongoose";

const ConnectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Monogo db connected ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

export { ConnectDB };