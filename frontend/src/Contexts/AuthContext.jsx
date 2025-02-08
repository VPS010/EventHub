import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../hooks/api";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    toast.success("Registration successful!");
  };

  const login = async (data) => {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    toast.success("Login successful!");
  };

  const guestLogin = async () => {
    const res = await api.post("/auth/guest-login");
    localStorage.setItem("token", res.data.token);
    // Ensure isGuest is set to true for guest users
    setUser(res.data.user);
    toast.success("Guest login successful!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully!");
  };


  const checkAuthStatus = async () => {
    try {
      const res = await api.get("/auth/check");
      if (res.data.user) {
        setUser({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          isGuest: res.data.user.isGuest,
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        guestLogin,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
