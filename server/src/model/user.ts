import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/userTypes";


const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        // preferences: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Preference"
        // }]
        preferences: {
            type: [String],
            default: [],
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
        ,
        isBlocked: {
            type: Boolean,
            default: false
        },
        blockedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }]
    },
    { timestamps: true }
)
export type UserDocument = IUser & Document;
const User = mongoose.model<UserDocument>("User", userSchema);
export default User;