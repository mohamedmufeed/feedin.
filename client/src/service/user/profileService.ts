import { AxiosError } from "axios";
import api from "../api"
import type { UserRegistration } from "../../types/userTypes";
import { Rss } from "lucide-react";

export const getProfile = async (userId: string) => {
    try {
        const response = await api.get(`user/${userId}/profile`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on Get profile:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}

export const editProfile = async (userId: string, data: Partial<UserRegistration>) => {
    try {
        const response = await api.put(`user/profile/${userId}/edit`, data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on editing profile:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}

export const getPreferences = async () => {
    try {
        const response = await api.get(`user/preferences`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on  fetching preferences:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}