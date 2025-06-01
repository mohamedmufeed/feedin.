import { IUser } from "../../types/userTypes";

export const userDto = (user: IUser) => {
    return {
        _id: user._id,
        lastName:user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin
    }
}

export const profileDto = (user: IUser) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth:user.dateOfBirth,
        phone:user.phone,
        email: user.email,
        preferences:user.preferences,
        profileImage: user.profileImage,

    }
}