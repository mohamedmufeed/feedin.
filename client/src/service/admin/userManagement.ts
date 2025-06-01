import { AxiosError } from "axios";
import api from "../api";


export const fetchUsers = async (page = 1, limit = 5, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`admin/users`, {
      params: {
        page,
        limit,
        q: searchQuery
      },
      signal
    });
    return response.data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    if (error instanceof AxiosError) {
      console.error("Fetching Error:", error);
      throw new Error(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};


export const blockUser = async (userId: string) => {
  try {
    const response = await api.patch(`admin/users/${userId}/block`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error on  block user :", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  }
}


