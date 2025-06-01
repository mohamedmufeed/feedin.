"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchResult = exports.getLatestArticle = exports.deleteArticle = exports.editArticle = exports.userArticles = exports.blockArticle = exports.toggleDislike = exports.tooggleLike = exports.getArticleDetails = exports.getFeed = exports.getPersonalizedFeed = exports.createArticle = void 0;
const httpStatusCodes_1 = __importDefault(require("../../utils/httpStatusCodes"));
const article_1 = __importDefault(require("../../model/article"));
const user_1 = __importDefault(require("../../model/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = req.params.id;
        const { title, subtitle, coverImage, category, content } = req.body;
        if (!title || !content || !category || !author) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "Missing required fields" });
            return;
        }
        const newArticle = yield article_1.default.create({
            title,
            subtitle,
            coverImage,
            category,
            content,
            author,
        });
        res.status(httpStatusCodes_1.default.OK).json({ success: true, message: "Article Created", article: newArticle });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.createArticle = createArticle;
const getPersonalizedFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: "User not found" });
            return;
        }
        const userpreferences = user.preferences;
        const articles = yield article_1.default.find({ category: { $in: userpreferences }, _id: { $nin: user.blockedArticles }, isDeleted: false }).populate("author", "profileImage firstName lastName").sort({ createdAt: -1 });
        res.status(httpStatusCodes_1.default.OK).json({ success: true, message: "Personalized articles found sucsesssfull", articles });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.getPersonalizedFeed = getPersonalizedFeed;
const getFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield article_1.default.find({ isDeleted: false }).populate("author", "profileImage firstName lastName").sort({ createdAt: -1 });
        res.status(httpStatusCodes_1.default.OK).json({ success: true, message: "articles found sucsesssfull", articles });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.getFeed = getFeed;
const getArticleDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artileId = req.params.id;
        const article = yield article_1.default.findById(artileId).populate("author", "profileImage firstName lastName");
        if (!article) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: "Article not found" });
            return;
        }
        res.status(httpStatusCodes_1.default.OK).json({ success: true, message: "Applcation not found", article });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.getArticleDetails = getArticleDetails;
const tooggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artileId = req.params.id;
        const { userId } = req.body;
        const article = yield article_1.default.findById(artileId);
        if (!article) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: "Article not found" });
            return;
        }
        const hasLiked = article.likes.includes(userId);
        const hasDisliked = article.dislikes.includes(userId);
        if (hasLiked) {
            article.likes.pull(userId);
        }
        else {
            article.likes.push(userId);
            if (hasDisliked)
                article.dislikes.pull(userId);
        }
        yield article.save();
        res.status(httpStatusCodes_1.default.OK).json({ message: hasLiked ? 'Unliked' : 'Liked', article });
    }
    catch (error) {
        console.log("error", error);
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.tooggleLike = tooggleLike;
const toggleDislike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params.id;
        const { userId } = req.body;
        const article = yield article_1.default.findById(articleId);
        if (!article) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: 'Article not found' });
            return;
        }
        const hasLiked = article.likes.includes(userId);
        const hasDisliked = article.dislikes.includes(userId);
        if (hasDisliked) {
            article.dislikes.pull(userId);
        }
        else {
            article.dislikes.push(userId);
            if (hasLiked)
                article.likes.pull(userId);
        }
        yield article.save();
        res.status(httpStatusCodes_1.default.OK).json({ message: hasDisliked ? 'Undisliked' : 'Disliked', article });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.toggleDislike = toggleDislike;
const blockArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId, userId } = req.body;
        if (!userId || !articleId) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ message: "Missing data" });
            return;
        }
        const user = yield user_1.default.findById(userId);
        if (user && !(user === null || user === void 0 ? void 0 : user.blockedArticles.includes(articleId))) {
            user === null || user === void 0 ? void 0 : user.blockedArticles.push(articleId);
            yield user.save();
        }
        res.status(httpStatusCodes_1.default.OK).json({ success: true, message: "Article blocked" });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});
exports.blockArticle = blockArticle;
const userArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { page = 1, limit = 10, searchQuery = "", } = req.query;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(httpStatusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Valid User ID is required", });
            return;
        }
        const numericPage = parseInt(page, 10);
        const numericLimit = parseInt(limit, 10);
        const skip = (numericPage - 1) * numericLimit;
        const filter = { author: userId, isDeleted: false };
        if (searchQuery) {
            filter.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { subtitle: { $regex: searchQuery, $options: "i" } },
            ];
        }
        const articles = yield article_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(numericLimit);
        const totalArticles = yield article_1.default.countDocuments(filter);
        const totalPages = Math.ceil(totalArticles / numericLimit);
        res.status(httpStatusCodes_1.default.OK).json({
            success: true,
            message: "User articles fetched successfully",
            articles,
            totalArticles,
            totalPages,
            currentPage: numericPage,
        });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
});
exports.userArticles = userArticles;
const editArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, subtitle, coverImage, category, content } = req.body;
        const articleId = req.params.id;
        const article = yield article_1.default.findById(articleId);
        if (!article) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: "Article not found" });
            return;
        }
        const updatedField = {};
        if (title)
            updatedField.title = title;
        if (subtitle)
            updatedField.subtitle = subtitle;
        if (coverImage)
            updatedField.coverImage = coverImage;
        if (category)
            updatedField.category = category;
        if (content)
            updatedField.content = content;
        const updatedArticle = yield article_1.default.findByIdAndUpdate(articleId, updatedField, { new: true });
        if (!updatedArticle) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: "updated Article is not found" });
            return;
        }
        res.status(httpStatusCodes_1.default.OK).json({ success: true, message: "Article edited sucessfully", article: updatedArticle });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
});
exports.editArticle = editArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params.id;
        const article = yield article_1.default.findById(articleId);
        if (!article) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: "Article not found" });
            return;
        }
        const updatedArticle = yield article_1.default.findByIdAndUpdate(articleId, { isDeleted: true }, { new: true });
        if (!updatedArticle) {
            res.status(httpStatusCodes_1.default.NOT_FOUND).json({ message: "updated Article is not found" });
            return;
        }
        res.status(httpStatusCodes_1.default.OK).json({ success: true, message: "Article soft delete sucessfully", article: updatedArticle });
    }
    catch (error) {
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
});
exports.deleteArticle = deleteArticle;
const getLatestArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield article_1.default.find({ isDeleted: false }).populate("author", "profileImage firstName lastName").sort({ createdAt: -1 }).limit(3);
        res.status(httpStatusCodes_1.default.OK).json({ success: true, message: "Latest articles found successfully", articles, });
    }
    catch (error) {
        console.error("Error fetching latest articles:", error);
        res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ success: false, message: "Interwnal server error", error });
    }
});
exports.getLatestArticle = getLatestArticle;
const searchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("hai");
        const q = req.query.q;
        const filter = { isDeleted: false };
        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: "i" } },
                { subtitle: { $regex: q, $options: "i" } },
            ];
        }
        const articles = yield article_1.default.find(filter)
            .populate("author", "firstName lastName profileImage")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, articles });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Search failed" });
    }
});
exports.searchResult = searchResult;
