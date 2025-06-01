import axios from "axios";

   export const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Aspivo");

    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/do4wdvbcy/image/upload`,
        formData
      );
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };