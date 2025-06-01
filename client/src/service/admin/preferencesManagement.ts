import { AxiosError } from "axios";
import api from "../api";

export const addPreference = async (preference: { preference: string[]; }) => {
    try {
        const response = await api.post(`admin/preferences`, preference)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on add preferences :", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }

}

export const getPreference = async (page = 1, limit = 10, searchQuery = "", signal?: AbortSignal) => {
    try {
        const response = await api.get(`admin/preferences`, {
            params: {
                page,
                limit,
                q: searchQuery
            },
            signal
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on fetch preferences :", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
};

export const removePrefrence = async (preferenceId: string) => {
    try {
        const response = await api.delete(`admin/preferences/${preferenceId}`)
        return response.data

    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on removing preferences :", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}