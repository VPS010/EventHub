import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const LandingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex mt-0 p-0 flex-col justify-center bg-indigo-50">
      {/* Hero Section */}
      <div className="items-center mb-40 justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Discover, Connect, and Create
              <span className="text-indigo-600"> Unforgettable Events</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Elevate your event management experience with our comprehensive
              platform. Create, organize, and track events seamlessly.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 space-y-3 sm:space-y-0 sm:space-x-3">
              {user ? (
                <button
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 md:py-4 md:text-lg md:px-8"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 md:py-4 md:text-lg md:px-8"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
