"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../../controller/user/authController");
const profileController_1 = require("../../controller/user/profileController");
const articleController_1 = require("../../controller/user/articleController");
const authMiddlwware_1 = __importDefault(require("../../middleware/authMiddlwware"));
const router = express_1.default.Router();
//auth
router
    .route("/auth/signup")
    .post(authController_1.register);
router
    .route("/auth/login")
    .post(authController_1.login);
router
    .route("/auth/logout/:id")
    .post(authController_1.logout);
router
    .route("/refresh")
    .post(authController_1.refreshToken);
//profile    
router
    .route("/:id/profile")
    .get(authMiddlwware_1.default, profileController_1.getProfile);
router
    .route("/profile/:id/edit")
    .put(authMiddlwware_1.default, profileController_1.editProfile);
router
    .route("/profile/:id/myarticles")
    .get(authMiddlwware_1.default, articleController_1.userArticles);
// article
router
    .route("/article/:id/create")
    .post(authMiddlwware_1.default, articleController_1.createArticle);
router
    .route("/article/:id/personalized-feed")
    .get(authMiddlwware_1.default, articleController_1.getPersonalizedFeed);
router
    .route("/article/feed")
    .get(articleController_1.getFeed);
router
    .route("/article/:id")
    .get(authMiddlwware_1.default, articleController_1.getArticleDetails);
router
    .route("/article/:id/like")
    .put(authMiddlwware_1.default, articleController_1.tooggleLike);
router
    .route("/article/:id/dislike")
    .put(authMiddlwware_1.default, articleController_1.toggleDislike);
router
    .route("/article/block")
    .patch(authMiddlwware_1.default, articleController_1.blockArticle);
router
    .route("/article/:id/edit")
    .put(authMiddlwware_1.default, articleController_1.editArticle);
router
    .route("/article/:id/delete")
    .patch(authMiddlwware_1.default, articleController_1.deleteArticle);
router
    .route("/article/search")
    .get(articleController_1.searchResult);
router
    .route("/article")
    .get(articleController_1.getLatestArticle);
exports.default = router;
