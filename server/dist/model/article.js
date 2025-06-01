"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const articleSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    coverImage: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'User',
        },
    ],
    dislikes: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {
    timestamps: true,
});
const Article = (0, mongoose_1.model)('Article', articleSchema);
exports.default = Article;
