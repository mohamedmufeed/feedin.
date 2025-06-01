import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatusCodes";
import Article from "../../model/article";
import User from "../../model/user";
import mongoose from "mongoose";
import { IArticle } from "../../types/articleTypes";
import { IUser } from "../../types/userTypes";

export const createArticle = async (req: Request, res: Response) => {
    try {
        const author = req.params.id
        const { title, subtitle, coverImage, category, content } = req.body
        if (!title || !content || !category || !author) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Missing required fields" });
            return
        }
        const newArticle = await Article.create({
            title,
            subtitle,
            coverImage,
            category,
            content,
            author,
        })
        res.status(HttpStatus.OK).json({ success: true, message: "Article Created", article: newArticle })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}

export const getPersonalizedFeed = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" })
            return
        }
        const userpreferences = user.preferences
        const articles = await Article.find({ category: { $in: userpreferences }, _id: { $nin: user.blockedArticles }, isDeleted: false }).populate("author", "profileImage firstName lastName").sort({ createdAt: -1 })
        res.status(HttpStatus.OK).json({ success: true, message: "Personalized articles found sucsesssfull", articles })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}
export const getFeed = async (req: Request, res: Response) => {
    try {
        const articles = await Article.find({ isDeleted: false }).populate("author", "profileImage firstName lastName").sort({ createdAt: -1 })
        res.status(HttpStatus.OK).json({ success: true, message: "articles found sucsesssfull", articles })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}

export const getArticleDetails = async (req: Request, res: Response) => {
    try {
        const artileId = req.params.id
        const article = await Article.findById(artileId).populate("author", "profileImage firstName lastName")
        if (!article) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "Article not found" })
            return
        }
        res.status(HttpStatus.OK).json({ success: true, message: "Applcation not found", article })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}

export const tooggleLike = async (req: Request, res: Response) => {
    try {
        const artileId = req.params.id
        const { userId } = req.body;

        const article = await Article.findById(artileId)
        if (!article) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "Article not found" })
            return
        }
        const hasLiked = article.likes.includes(userId)
        const hasDisliked = article.dislikes.includes(userId);
        if (hasLiked) {
            article.likes.pull(userId);
        } else {
            article.likes.push(userId);
            if (hasDisliked) article.dislikes.pull(userId);
        }
        await article.save();
        res.status(HttpStatus.OK).json({ message: hasLiked ? 'Unliked' : 'Liked', article });

    } catch (error) {
        console.log("error", error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}

export const toggleDislike = async (req: Request, res: Response) => {
    try {
        const articleId = req.params.id;
        const { userId } = req.body;
        const article = await Article.findById(articleId);
        if (!article) {
            res.status(HttpStatus.NOT_FOUND).json({ message: 'Article not found' });
            return
        }

        const hasLiked = article.likes.includes(userId);
        const hasDisliked = article.dislikes.includes(userId);

        if (hasDisliked) {
            article.dislikes.pull(userId);
        } else {
            article.dislikes.push(userId);
            if (hasLiked) article.likes.pull(userId);
        }

        await article.save();
        res.status(HttpStatus.OK).json({ message: hasDisliked ? 'Undisliked' : 'Disliked', article });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};


export const blockArticle = async (req: Request, res: Response) => {
    try {
        const { articleId, userId } = req.body
        if (!userId || !articleId) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Missing data" })
            return
        }
        const user = await User.findById(userId)
        if (user && !user?.blockedArticles.includes(articleId)) {
            user?.blockedArticles.push(articleId)
            await user.save();
        }
        res.status(HttpStatus.OK).json({ success: true, message: "Article blocked" })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}



export const userArticles = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const { page = 1, limit = 10, searchQuery = "", } = req.query as { page?: string; limit?: string; searchQuery?: string; };

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Valid User ID is required", });
            return
        }

        const numericPage = parseInt(page as string, 10);
        const numericLimit = parseInt(limit as string, 10);
        const skip = (numericPage - 1) * numericLimit;

        const filter: any = { author: userId, isDeleted: false };

        if (searchQuery) {

            filter.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { subtitle: { $regex: searchQuery, $options: "i" } },
            ];
        }
        const articles = await Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(numericLimit);
        const totalArticles = await Article.countDocuments(filter)
        const totalPages = Math.ceil(totalArticles / numericLimit);
        res.status(HttpStatus.OK).json({
            success: true,
            message: "User articles fetched successfully",
            articles,
            totalArticles,
            totalPages,
            currentPage: numericPage,
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
}

export const editArticle = async (req: Request, res: Response) => {
    try {
        const { title, subtitle, coverImage, category, content } = req.body
        const articleId = req.params.id
        const article = await Article.findById(articleId)
        if (!article) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "Article not found" })
            return
        }

        const updatedField: Partial<IArticle> = {}
        if (title) updatedField.title = title
        if (subtitle) updatedField.subtitle = subtitle
        if (coverImage) updatedField.coverImage = coverImage
        if (category) updatedField.category = category
        if (content) updatedField.content = content
        const updatedArticle = await Article.findByIdAndUpdate(articleId, updatedField, { new: true })
        if (!updatedArticle) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "updated Article is not found" })
            return
        }
        res.status(HttpStatus.OK).json({ success: true, message: "Article edited sucessfully", article: updatedArticle })

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
}


export const deleteArticle = async (req: Request, res: Response) => {
    try {
        const articleId = req.params.id
        const article = await Article.findById(articleId)
        if (!article) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "Article not found" })
            return
        }
        const updatedArticle = await Article.findByIdAndUpdate(articleId, { isDeleted: true }, { new: true })
        if (!updatedArticle) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "updated Article is not found" })
            return
        }

        res.status(HttpStatus.OK).json({ success: true, message: "Article soft delete sucessfully", article: updatedArticle })
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
}

export const getLatestArticle = async (req: Request, res: Response) => {
    try {
        const articles = await Article.find({ isDeleted: false }).populate("author", "profileImage firstName lastName").sort({ createdAt: -1 }).limit(3);
        res.status(HttpStatus.OK).json({ success: true, message: "Latest articles found successfully", articles, });
    } catch (error) {
        console.error("Error fetching latest articles:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Interwnal server error", error });
    }
};


export const searchResult = async (req: Request, res: Response) => {
    try {

        const q = req.query.q as string;
        const filter: any = { isDeleted: false };
        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: "i" } },
                { subtitle: { $regex: q, $options: "i" } },
            ];
        }
        const articles = await Article.find(filter)
            .populate("author", "firstName lastName profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, articles });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Search failed" });
    }
}