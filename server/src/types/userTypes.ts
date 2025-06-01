import { Document, Types } from "mongoose";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    profileImage:string;
    // preferences: Types.ObjectId[];
    preferences: string[];
    isBlocked: boolean;
    isAdmin: boolean;
    blockedArticles:Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

 export interface JwtPayloadCustom extends jwt.JwtPayload {
  id: string;
  isAdmin: boolean;
}
