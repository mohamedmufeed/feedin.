import { AxiosError } from "axios";
import type { IArticle } from "../../types/articleTypes";
import api from "../api";

export const createArticle = async (articleData: Partial<IArticle>, userId: string) => {
    try {
        const response = await api.post(`user/article/${userId}/create`, articleData)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on create article:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}

export const getPersonalizedFeed = async (userId: string, page:number, limit:number) => {
    try {
        const response = await api.get(`user/article/${userId}/personalized-feed`,{
            params:{
                page,
                limit
            }
        })
        return response.data

    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on fetching user feed article:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}
export const getUserFeed = async (page:number, limit:number) => {
    try {
        const response = await api.get(`user/article/feed`,{
            params:{
                page,
                limit
            }
        })
        return response.data

    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on fetching user feed article:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}

export const getArticleDetails = async (articleId: string) => {
    try {
        const response = await api.get(`user/article/${articleId}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on fetching article details:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}


export const tooggleLike = async (articleId: string, userId: string) => {
    try {
        const response = await api.put(`user/article/${articleId}/like`, { userId })
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on Like article", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}
export const tooggleDislike = async (articleId: string, userId: string) => {
    try {
        const response = await api.put(`user/article/${articleId}/dislike`, { userId })
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on dislike article", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}

export const blockArticle = async (articleId: string, userId: string) => {
    try {
        const response = await api.patch(`user/article/block`, { articleId, userId })
        return response.data

    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on block article", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}

export const userArticles = async (userId: string, page = 1, limit = 10, searchQuery = "") => {
    try {
        const response = await api.get(`user/profile/${userId}/myarticles`, { params: { page, limit, searchQuery } })
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on fetching user article", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}


export const editArticle = async (articleData: Partial<IArticle>, articleId: string) => {
    try {
        const response = await api.put(`user/article/${articleId}/edit`, articleData)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on editing article:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}
export const deleteArticle = async (articleId: string) => {
    try {

        const response = await api.patch(`user/article/${articleId}/delete`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on delete article:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}
export const getLatestArticle = async () => {
    try {
        const response = await api.get(`user/article`)
        return response.data

    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on fetching latest article:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}

export const getSearchResult = async (query:string) => {
    try {
        const response = api.get(`user/article/search`,  { params: { q: query } })
        return (await response).data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on search article:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}