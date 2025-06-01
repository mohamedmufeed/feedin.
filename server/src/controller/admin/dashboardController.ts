import { Request, Response } from "express";
import Article from "../../model/article"
import Preference from "../../model/preference"
import User from "../../model/user"


export const dashBoardStats = async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    const preferenceCount = await Preference.countDocuments();
    const articleCount = await Article.countDocuments();

    return res.status(200).json({ success: true,
      data: {
        users: userCount,
        preferences: preferenceCount,
        articles: articleCount,
      },
    });
  } catch (error) {
    return res.status(500).json({success: false,message: "Failed to fetch dashboard statistics",});
  }
};
