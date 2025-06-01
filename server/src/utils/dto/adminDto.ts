import { IUser } from "../../types/userTypes";

 export const mappedUser=(user:IUser)=>{
    return {
        _id:user._id,
        profileImage:user.profileImage,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        createdAt:user.createdAt,
        isBlocked:user.isBlocked
    }
}