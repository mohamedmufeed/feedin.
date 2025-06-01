import { useState } from "react";
import Input from "../Input";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { userlogin } from "../../service/user/authService";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store/store";
import { login } from "../../redux/features/authSlice";

const LoginForm = () => {
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let valid = true;
        setEmailError(undefined);
        setPasswordError(undefined);

        if (!email) {
            setEmailError("Email is required");
            valid = false;
        } else if (!validateEmail(email)) {
            setEmailError("Please enter a valid email");
            valid = false;
        }

        if (!password) {
            setPasswordError("Password is required");
            valid = false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            valid = false;
        }

        if (valid) {
            setIsLoading(true);
            try {
                const data = { email, password }
                const response = await userlogin(data)
                if (response.success === false) {
                    setError(response.message)
                } else {
                    dispatch(login(response.user))
                    navigate("/")
             
                }

            } catch (error) {
                setEmailError("Login failed. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-10 px-2 sm:px-2 lg:px-2" style={{ fontFamily: "Mulish, sans-serif" }} >
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md rounded-xl pt-1 space-y-6"
            >
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 mb-6">Welcome Back! Please enter your details</p>
                </div>
                {error && <span className="text-sm text-red-500">{error}</span>}
                {/* Input Fields */}
                <div className="space-y-5 pt-1">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError && validateEmail(e.target.value)) {
                                setEmailError(undefined);
                            }
                        }}
                        error={emailError}
                        placeholder="Enter your email..."
                        aria-label="Email address"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError && e.target.value.length >= 6) {
                                setPasswordError(undefined);
                            }
                        }}
                        error={passwordError}
                        placeholder="Enter your password..."
                        aria-label="Password"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 cursor-pointer ${isLoading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-black hover:bg-black"
                            }`}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center px-7 space-x-4">
                    <div className="flex-1 h-px bg-gray-300" />
                    <p className="text-gray-500 text-sm">Or</p>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* Google Login */}
                <div className="px-10">
                    <button
                        type="button"
                        className="w-full h-11 bg-white text-black border border-gray-500 rounded-lg flex items-center justify-center space-x-2"
                    >
                        <FcGoogle className="w-7 h-7" />
                        <span className="font-medium">Sign in with Google</span>
                    </button>
                </div>

                {/* Signup Link */}
                <div>
                    <p className="mt-4 text-center text-black">
                        Don't have an account?{" "}
                        <span className="font-bold cursor-pointer hover:underline">
                            <Link to={"/signup"}>Sign up</Link>
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
