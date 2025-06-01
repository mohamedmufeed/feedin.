import express from "express";
import { login, register, refreshToken, logout } from "../../controller/user/authController";
import { editProfile, getPreferences, getProfile } from "../../controller/user/profileController";
import { blockArticle, createArticle, deleteArticle, editArticle, getArticleDetails, getFeed, getLatestArticle, getPersonalizedFeed, searchResult, toggleDislike, tooggleLike, userArticles } from "../../controller/user/articleController";
import protect from "../../middleware/authMiddlwware";


const router = express.Router()

//auth

router
    .route("/auth/signup")
    .post(register)

router
    .route("/auth/login")
    .post(login)

router
    .route("/auth/logout/:id")
    .post(logout)

router
    .route("/refresh")
    .post(refreshToken)

// Public route   

router.
    route("/article/search").
    get(searchResult);

router
    .route("/article")
    .get(getLatestArticle)

router
    .route("/preferences")
    .get(getPreferences)
//profile    

router
    .route("/:id/profile")
    .get(protect, getProfile)

router
    .route("/profile/:id/edit")
    .put(protect, editProfile)

router
    .route("/profile/:id/myarticles")
    .get(protect, userArticles)


// article

router
    .route("/article/:id/create")
    .post(protect, createArticle)

router
    .route("/article/:id/personalized-feed")
    .get(protect, getPersonalizedFeed)

router
    .route("/article/feed")
    .get(getFeed)

router
    .route("/article/:id")
    .get(protect, getArticleDetails)

router
    .route("/article/:id/like")
    .put(protect, tooggleLike)

router
    .route("/article/:id/dislike")
    .put(protect, toggleDislike)

router
    .route("/article/block")
    .patch(protect, blockArticle)

router
    .route("/article/:id/edit")
    .put(protect, editArticle)
router
    .route("/article/:id/delete")
    .patch(protect, deleteArticle)




export default router