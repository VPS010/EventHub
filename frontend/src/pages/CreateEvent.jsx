import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import EventForm from "../components/EventForm";
import axios from "axios";
import { toast } from "react-toastify";

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isGuest) {
      navigate("/");
    }
  }, [user, navigate]);

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

  const handleSubmit = async (eventData) => {
    try {
      await api.post("/events", eventData);
      toast.success("Event created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Event
        </h1>
        <EventForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateEvent;
