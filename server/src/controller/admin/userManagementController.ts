import { Request, Response } from "express";
import { GetPaginationQuery } from "../../types/adminTypes";
import User from "../../model/user";
import HttpStatus from "../../utils/httpStatusCodes";
import { mappedUser } from "../../utils/dto/adminDto";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, q = "" } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const searchFilter = q
            ? {
                $or: [
                    { firstName: { $regex: q, $options: 'i' } },
                    { lastName: { $regex: q, $options: 'i' } },
                    { phone: { $regex: q, $options: 'i' } },
                    { email: { $regex: q, $options: 'i' } },
                ],
            }
            : {};

        const users = await User.find(searchFilter).skip(skip).limit(limitNum);
        const totalUsers = await User.countDocuments(searchFilter);
        const totalPages = Math.ceil(totalUsers / limitNum);

        res.status(HttpStatus.OK).json({ users: users.map((user) => mappedUser(user)), totalUsers, totalPages, });

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}


export const blockOrUnblockUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "User ID is required" });
            return
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
            return
        }

        const newStatus = !user.isBlocked;
        const updatedUser = await User.findByIdAndUpdate( userId,{ isBlocked: newStatus },{ new: true });
        res.status(HttpStatus.OK).json({success: true,message: `User ${newStatus ? "blocked" : "unblocked"} successfully`,user: updatedUser,});

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};