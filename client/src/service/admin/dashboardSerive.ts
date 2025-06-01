import { AxiosError } from "axios";
import api from "../api"

export const dashBoardStats = async () => {
    try {
        const response = await api.get("admin/stats")
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on getting stats :", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}