import { Suspense, useEffect } from "react";
import BannerImage from "../../assets/Publish article-cuate.svg";
import LoginForm from "../../components/authForms/LoginForm";
import SignupForm from "../../components/authForms/SignupForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const renderForm = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {location.pathname === "/signup" ? (
          <SignupForm />
        ) : (
          <LoginForm />
        )}
      </Suspense>
    );
  };
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  useEffect(() => {
    if (user) {
      navigate("/")
    } 
  }, [navigate, user])
  return (
    <div className="min-h-screen flex items-center  justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 " style={{ fontFamily: "Mulish, sans-serif" }} >
      <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="lg:w-1/2 hidden sm:block   items-center justify-center p-8 bg-gray-50">
          <div className="flex justify-center pt-10">
            <h1 className="font-bold text-2xl sm:text-3xl">
              feedin.
            </h1>
          </div>

          <img
            src={BannerImage}
            alt="Illustration of a person publishing an article"
            className="max-w-full h-auto"
            loading="lazy"
          />
        </div>
        <div className="lg:w-1/2 p-8">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;