import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSocket } from "../Contexts/SocketContext";

const useEvents = () => {
  const socket = useSocket();
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

    const handleAttendeeJoined = (data) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === data.eventId
            ? { ...event, attendees: [...event.attendees, data.user] }
            : event
        )
      );
    };

    const handleAttendeeLeft = (data) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === data.eventId
            ? {
                ...event,
                attendees: event.attendees.filter(
                  (attendee) => attendee._id !== data.userId
                ),
              }
            : event
        )
      );
    };

    if (socket) {
      socket.on("attendee_joined", handleAttendeeJoined);
      socket.on("attendee_left", handleAttendeeLeft);
    }

    return () => {
      if (socket) {
        socket.off("attendee_joined", handleAttendeeJoined);
        socket.off("attendee_left", handleAttendeeLeft);
      }
    };
  }, [socket]);

  return { events, loading, error };
};

export default useEvents;
