import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        // Debug logging
        console.log("API Response:", res);
        console.log("Response data:", res.data);

        // Ensure we're setting an array
        const eventsData = Array.isArray(res.data)
          ? res.data
          : res.data?.events
          ? res.data.events
          : [];

        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.response?.data?.msg || "Failed to fetch events");
        toast.error(err.response?.data?.msg || "Failed to fetch events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return { events, loading, error };
};

export default useEvents;
