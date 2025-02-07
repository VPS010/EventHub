import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import axios from 'axios'

const EventCard = ({ event }) => {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    setIsPast(new Date(event.date) < new Date());
  }, [event.date]);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const handleJoinEvent = async () => {
    try {
      await api.post(`/events/join/${eventId}`);
      setIsAttending(true);
      toast.success("Successfully joined the event!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to join event");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              isPast
                ? "bg-gray-100 text-gray-600"
                : "bg-indigo-100 text-indigo-600"
            }`}
          >
            {isPast ? "Past Event" : "Upcoming"}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            <span>{format(parseISO(event.date), "MMM d, yyyy h:mm a")}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-600" />
            <span>{event.attendees.length} Attendees</span>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Link
            to={`/events/${event._id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            View Details
          </Link>
          {!isPast && (
            <button
              onClick={handleJoinEvent}
              className="flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200"
            >
              <Clock className="h-5 w-5 mr-2" />
              Join Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
