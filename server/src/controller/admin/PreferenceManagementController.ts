import { Request, Response } from "express";
import Preference from "../../model/preference";
import HttpStatus from "../../utils/httpStatusCodes";

export const addPreference = async (req: Request, res: Response) => {
    try {
        const { preference } = req.body;

        if (!Array.isArray(preference) || preference.length === 0) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid preferences data" });
            return
        }

        const preferences = preference.map((name: string) => ({ name: name.trim() }));
        const insertedPreferences = await Preference.insertMany(preferences, { ordered: false });
        res.status(HttpStatus.OK).json({ success: true, message: "Preferences added successfully", preferences: insertedPreferences });

    } catch (error: any) {
        if (error.name === 'BulkWriteError' || error.code === 11000) {
            res.status(HttpStatus.CONFLICT).json({ success: false, message: "Some preferences already exist. Others were added.", });
            return
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", })
    }
};



export const getPreferences = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, q = "" } = req.query

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const searchFilter = q
            ? {
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                ],
            }
            : {};

        const preferences = await Preference.find(searchFilter).skip(skip).limit(limitNum);
        const totalPreferences = await Preference.countDocuments(searchFilter);
        const totalPages = Math.ceil(totalPreferences / limitNum);
        res.status(HttpStatus.OK).json({ preferences: preferences, totalPreferences, totalPages, });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", });
    }
}

export const removePreference = async (req: Request, res: Response) => {
    try {
        const preferenceId = req.params.id
        if (!preferenceId) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Missing required data" })
            return
        }
        const removedPreference = await Preference.findByIdAndDelete(preferenceId)
        if (!removedPreference) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "Preference not found" })
            return
        }
        res.status(HttpStatus.OK).json({ success: true, message: "Preference Removed successfully", preferences: removedPreference })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", })
    }
}