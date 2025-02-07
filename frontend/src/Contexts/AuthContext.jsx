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
    setUser(res.data.user);
    console.log(user);
    toast.success("Guest login successful!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully!");
  };

  // Add to axios instance creation in AuthContext.jsx
  // In AuthContext.jsx, ensure proper axios instance creation
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
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
      const res = await api.get("/auth/check");
      setUser({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        isGuest: res.data.isGuest,
      });
    } catch (error) {
      // Only logout on 401 unauthorized errors
      if (error.response?.status === 401) {
        logout();
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
