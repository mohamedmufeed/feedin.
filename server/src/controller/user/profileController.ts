import { Request, Response } from "express"
import HttpStatus from "../../utils/httpStatusCodes"
import User from "../../model/user"
import { profileDto } from "../../utils/dto/userDto"
import { IUser } from "../../types/userTypes"
import Preference from "../../model/preference"

export const getProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        if (!id) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "User id is missing" })
            return
        }
        const user = await User.findById(id)
        if (!user) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" })
            return
        }

        res.status(HttpStatus.OK).json({ user: profileDto(user), message: "User found sucsess fully" })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}

export const editProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { firstName, phone, lastName, email, dateOfBirth, profileImage, preferences } = req.body;

        const user = await User.findById(id);
        if (!user) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
            return
        }
        const updateFields: Partial<IUser> = {};
        if (firstName) updateFields.firstName = firstName;
        if (phone) updateFields.phone = phone
        if (lastName) updateFields.lastName = lastName;
        if (email) updateFields.email = email;
        if (profileImage) updateFields.profileImage = profileImage;
        if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
        if (preferences) updateFields.preferences = preferences
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });
        if (!updatedUser) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to update user profile" });
            return
        }

        res.status(HttpStatus.OK).json({
            user: profileDto(updatedUser),
            message: "User profile updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};


export const getPreferences = async (req: Request, res: Response) => {
    try {
        const preferences = await Preference.find()
        res.status(HttpStatus.OK).json({ success: true, message: " Preferences fetch sucsessfuly", preferences })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}