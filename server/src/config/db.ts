import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        if (!process.env.MONOGO_URI) {
            throw new Error("Mongo db Uri Not found")
        }
        const connect = await mongoose.connect(process.env.MONOGO_URI)
        console.log(`conncted ${connect.connection.host}`)
    } catch (error) {
        console.log("Error on Mongodb Connecting",error)
    }
}