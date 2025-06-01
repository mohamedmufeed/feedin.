import { AxiosError } from "axios";
import api from "../api";
import type { UserLoginData, UserRegistration } from "../../types/userTypes";

export const signup = async (data: UserRegistration) => {
    try {
        const response = await api.post("user/auth/signup", data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on user signup:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}

export const userlogin = async (data: UserLoginData) => {
    try {
        const response = await api.post("user/auth/login", data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on user login:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}


export const userLogout = async (userId: string) => {
    try {
        const response = await api.post(`user/auth/logout/${userId}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on user logout:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
            };
        }
    }
}