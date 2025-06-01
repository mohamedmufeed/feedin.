import { useEffect, useState, useCallback, type ChangeEvent, useMemo } from "react";
import Navbar from "../../components/home/Navbar";
import Input from "../../components/Input";
import SettingsSideBar from "../../components/profile/SettingsSideBar";
import { editProfile, getPreferences, getProfile } from "../../service/user/profileService";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import type { ProfileForm } from "../../types/userTypes";

interface IPreferences {
  _id: string,
  name: string,
}

type ProfileErrors = Partial<Record<keyof ProfileForm, string>>;
const Profile = () => {
  const [formData, setFormData] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    profileImage: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState<ProfileErrors>({});
  const [preferences, setPreferences] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cloudinaryImagePath, setCloudinaryImagePath] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [availablePreferences, setAvailablePreferences] = useState<IPreferences[]>([])
  const userId = useSelector((state: RootState) => state.auth.user);

  // const availablePreferences = [
  //   "Technology",
  //   "Science",
  //   "Health",
  //   "Travel",
  //   "Education",
  //   "Finance",
  //   "Sports",
  //   "Entertainment",
  //   "Artificial Intelligence",
  //   "Machine Learning",
  //   "Design",
  //   "Photography",
  //   "Music",
  //   "Cooking",
  //   "Gaming",
  //   "Books",
  //   "Movies",
  //   "Fitness",
  // ];

  const validateForm = useCallback((): boolean => {
    const newErrors: ProfileErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 5 || age > 120) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);


  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await getProfile(userId);
        const user = response.user;
        const formattedDOB = user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "";

        setFormData(prev => ({
          ...prev,
          ...user,
          dateOfBirth: formattedDOB,
        }));

        if (user.profileImage) {
          setImagePreview(user.profileImage);
          setCloudinaryImagePath(user.profileImage);
        }

        if (Array.isArray(user.preferences)) {
          setPreferences(user.preferences);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrors({ email: "Failed to load profile data" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));


    if (errors[name as keyof ProfileForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (successMessage) {
      setSuccessMessage(null);
    }
  };


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        setImageError("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setImageError("Please select a valid image file");
        return;
      }

      setIsUploading(true);
      setImageError(null);

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const uploadedImageUrl = await uploadToCloudinary(file);
        if (uploadedImageUrl) {
          setCloudinaryImagePath(uploadedImageUrl);
          setFormData(prev => ({ ...prev, profileImage: uploadedImageUrl }));
        } else {
          setImageError("Image upload failed. Please try again.");
          setImagePreview(null);
        }
      } catch (error) {
        setImageError("Image upload failed. Please try again.");
        setImagePreview(null);
      } finally {
        setIsUploading(false);
      }
    }
  };



  useEffect(() => {
    const fetchPreferences = async () => {
      setIsLoading(true);
      try {
        const response = await getPreferences();
        setAvailablePreferences(response.preferences);
 
      } catch (error) {
        setErrors({ email: "Failed to load preferences. Please try again." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, [userId]);


  const addPreference = (preferenceName: string) => {
    if (!preferences.includes(preferenceName)) {
      setPreferences((prev) => [...prev, preferenceName]);
      setSearchTerm("");
    }
  };

  const removePreference = (preferenceName: string) => {
    setPreferences((prev) => prev.filter((p) => p !== preferenceName));
  };

const filteredPreferences = useMemo(() => {
  return availablePreferences.filter(
    (pref) =>
      pref.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !preferences.includes(pref.name)
  );
}, [availablePreferences, searchTerm, preferences]);
       console.log("availble",availablePreferences)

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage(null);

    try {
      if (!userId) return
      const updateData = {
        ...formData,
        profileImage: cloudinaryImagePath,
        preferences,
      };
      await editProfile(userId, updateData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ email: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };






  if (isLoading && !formData.firstName) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex">
        <SettingsSideBar />

        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                {successMessage}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image Section */}
            <div className="w-45 h-50 shrink-0 flex flex-col justify-center items-center mx-auto md:mx-0 relative">
              <div
                className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors relative"
                onClick={() => !isUploading && document.getElementById("profileImageInput")?.click()}
              >
                <img
                  src={imagePreview || "/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="profileImageInput"
                className="hidden"
                disabled={isUploading}
              />

              <button
                type="button"
                onClick={() => document.getElementById("profileImageInput")?.click()}
                disabled={isUploading}
                className="mt-2 text-sm text-black-600 hover:text-blue-800 disabled:text-gray-400"
              >
                {isUploading ? "Uploading..." : "Change Photo"}
              </button>

              {imageError && (
                <p className="text-red-500 text-xs text-center mt-2 max-w-40">
                  {imageError}
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="Enter your first name..."
                  aria-label="First name"
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="Enter your last name..."
                  aria-label="Last name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="Enter your email..."
                  aria-label="Email"
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="Enter your phone number..."
                  aria-label="Phone"
                />
              </div>

              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={errors.dateOfBirth}
                aria-label="Date of birth"
              />
            </div>
          </div>

          {/* Preferences Section */}
          <div className="pt-12 space-y-6">
            <h2 className="text-xl font-semibold">Preferences</h2>

            {/* Current Preferences */}
            {preferences.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Preferences:</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.map((pref) => (
                    <span
                      key={pref}
                      className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm"
                    >
                      {pref}
                      <button
                        type="button"
                        onClick={() => removePreference(pref)}
                        className="text-white hover:text-red-300 ml-1 font-bold"
                        aria-label={`Remove ${pref} preference`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add Preferences */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Add Preferences:</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search and add preferences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <div className="absolute bg-white shadow-lg border border-gray-200 rounded-lg w-full mt-1 z-10 max-h-48 overflow-y-auto">
                    {filteredPreferences.length > 0 ? (
                      filteredPreferences.map((suggestion) => (
                        <div
                          key={suggestion._id} 
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => addPreference(suggestion.name)} 
                        >
                          {suggestion.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">No matching preferences found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isLoading || isUploading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;