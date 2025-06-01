import { useState, useEffect } from "react";
import Input from "../Input";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../service/user/authService";
import { getPreferences } from "../../service/user/profileService";


interface IPreferences {
    _id: string,
    name: string,
}
const SignupForm = () => {
    const [step, setStep] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [preferences, setPreferences] = useState<IPreferences[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        dateOfBirth: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const fetchPreferences = async () => {
        setIsLoading(true);
        try {
            const response = await getPreferences()
            console.log(response.preferences)
            setPreferences(response.preferences);
            setApiError(null);
        } catch (error) {
            setApiError("Failed to load preferences. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (step === 3) {
            fetchPreferences();
        }
    }, [step]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setErrors({ ...errors, preferences: "" });
    };

    const validateStepOne = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.phone || !/^\+?\d{10,15}$/.test(formData.phone))
            newErrors.phone = "Please enter a valid phone number (10-15 digits)";
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Please enter a valid email";
        return newErrors;
    };

    const validateStepTwo = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.password || formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        return newErrors;
    };

    const validateStepThree = () => {
        const newErrors: { [key: string]: string } = {};
        if (selectedPreferences.length < 2)
            newErrors.preferences = "Please select at least 2 preferences";
        return newErrors;
    };

    const handleNextFromStep1 = () => {
        const newErrors = validateStepOne();
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) setStep(2);
    };

    const handleNextFromStep2 = () => {
        const newErrors = validateStepTwo();
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) setStep(3);
    };

    const handleBack = () => {
        setErrors({});
        if (step === 3) setSearchQuery("");
        setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateStepThree();
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                const data = { ...formData, preferences: selectedPreferences }
                const response = await signup(data)
                if (!response.user) {
                    setErrors({ general: response.message })
                } else {
                    navigate("/login")
                }
                console.log("the res", response)
            } catch (error) {
                setErrors({ general: "Signup failed. Please try again." });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const filteredPreferences = preferences.filter((pref) =>
        pref.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const togglePreference = (prefName: string) => {
        setSelectedPreferences((prev) =>
            prev.includes(prefName) ? prev.filter((p) => p !== prefName) : [...prev, prefName]
        );

        if (errors.preferences) {
            setErrors((prev) => ({ ...prev, preferences: "" }));
        }
    };



    return (
        <div className="flex flex-col items-center justify-center p-4 px-2 sm:px-2 lg:px-2" style={{ fontFamily: "Mulish, sans-serif" }} >
            <form
                onSubmit={step === 3 ? handleSubmit : undefined}
                className="w-full max-w-md rounded-xl pt-1 space-y-6"
            >
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-5">
                        {step === 1
                            ? "Create Your Account"
                            : step === 2
                                ? "Set Up Your "
                                : "Choose Your Interests"}
                    </h1>
                    <p className="text-gray-500 mb-6">
                        {step === 1
                            ? "Join us! Please enter your details"
                            : step === 2
                                ? "Almost there! "
                                : "Personalize your experience"}
                    </p>
                </div>

                {/* Step 1 Personal Information */}
                {step === 1 && (
                    <div className="space-y-5">
                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                            placeholder="Enter your first name..."
                            aria-label="First name"
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                            placeholder="Enter your last name..."
                            aria-label="Last name"
                        />
                        <Input
                            label="Phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            placeholder="Enter your phone number..."
                            aria-label="Phone number"
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="Enter your email..."
                            aria-label="Email address"
                        />
                        <button
                            type="button"
                            onClick={handleNextFromStep1}
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Step 2 Account Setup */}
                {step === 2 && (
                    <div className="space-y-5">
                        <Input
                            label="Date of Birth"
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            error={errors.dateOfBirth}
                            placeholder="Select your date of birth..."
                            aria-label="Date of birth"
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Enter your password..."
                            aria-label="Password"
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            placeholder="Confirm your password..."
                            aria-label="Confirm password"
                        />
                        {errors.general && (
                            <p className="text-red-500 text-sm text-center">{errors.general}</p>
                        )}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-gray-600 hover:underline"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextFromStep2}
                                disabled={isLoading}
                                className={`px-4 py-3 rounded-lg font-medium text-white transition-all duration-200 ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Preferences */}
                {step === 3 && (
                    <div className="space-y-5">
                        <label className="block font-medium text-gray-700 mb-2">
                            Select Your Interests (at least 2)
                        </label>
                        <Input
                            label="Search Preferences"
                            name="searchPreferences"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search interests..."
                            aria-label="Search preferences"
                        />
                        {apiError && (
                            <p className="text-red-500 text-sm text-center">{apiError}</p>
                        )}
                        {isLoading ? (
                            <p className="text-gray-500 text-sm text-center">Loading preferences...</p>
                        ) : filteredPreferences.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center">No preferences found</p>
                        ) : (
                            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                                {filteredPreferences.map((pref) => (
                                    <button
                                        type="button"
                                        key={pref._id}
                                        onClick={() => togglePreference(pref.name)}
                                        className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${selectedPreferences.includes(pref.name)
                                                ? "bg-black text-white border-black"
                                                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                                            }`}
                                        aria-pressed={selectedPreferences.includes(pref.name)}
                                        role="checkbox"
                                    >
                                        {pref.name}
                                    </button>
                                ))}

                            </div>

                        )}
                        {errors.preferences && (
                            <p className="text-red-500 text-sm text-center">{errors.preferences}</p>
                        )}
                        {errors.general && (
                            <p className="text-red-500 text-sm text-center">{errors.general}</p>
                        )}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-gray-600 hover:underline"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-4 py-3 rounded-lg font-medium text-white transition-all duration-200 ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                                    }`}
                            >
                                {isLoading ? "Signing up..." : "Sign Up"}
                            </button>
                        </div>
                    </div>
                )}
                {/* Divider */}
                <div className="flex items-center px-7 space-x-4">
                    <div className="flex-1 h-px bg-gray-300" />
                    <p className="text-gray-500 text-sm">Or</p>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* Google Signup */}
                <div className="px-10">
                    <button
                        type="button"
                        disabled={isLoading}
                        className={`w-full h-11 bg-white text-black border border-gray-500 rounded-lg flex items-center justify-center space-x-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        <FcGoogle className="w-7 h-7" />
                        <span className="font-medium">Sign up with Google</span>
                    </button>
                </div>

                {/* Login Link */}
                <div>
                    <p className="mt-4 text-center text-black">
                        Already have an account?{" "}
                        <span className="font-bold cursor-pointer hover:underline">
                            <Link to="/login">Log in</Link>
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignupForm;