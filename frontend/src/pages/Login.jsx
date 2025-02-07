import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    await login(data);
    navigate("/");
  };

  const handleGuestLogin = async () => {
    await guestLogin();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="flex flex-col items-center justify-center px-4">
        <AuthForm type="login" onSubmit={handleLogin} />
        <div className="mt-6 text-center">
          <button
            onClick={handleGuestLogin}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
