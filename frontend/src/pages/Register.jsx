import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    await register(data);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="flex flex-col items-center justify-center px-4">
        <AuthForm type="register" onSubmit={handleRegister} />
      </div>
    </div>
  );
};

export default Register;
