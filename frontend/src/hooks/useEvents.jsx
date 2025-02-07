import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events");
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
