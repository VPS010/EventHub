import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const register = async (data) => {
    const res = await axios.post("/api/auth/register", data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    toast.success("Registration successful!");
  };

  const login = async (data) => {
    const res = await axios.post("/api/auth/login", data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    toast.success("Login successful!");
  };

  const guestLogin = async () => {
    const res = await axios.post("/api/auth/guest-login");
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    toast.success("Guest login successful!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully!");
  };

  // Add to axios instance creation in AuthContext.jsx
  const api = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL,
  });

  // Add this interceptor
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Update the checkAuthStatus method:
  const checkAuthStatus = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      logout();
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
