import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  UserPen,
  Clock,
  User,
  Edit,
  Trash,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { useSocket } from "../Contexts/SocketContext";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import EventForm from "../components/EventForm";

const EventDetails = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [key, setKey] = useState(0);

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

  const isOrganizer = user?.id === event?.organizer?._id;
  const eventHasNotPassed = event ? new Date(event.date) > new Date() : false;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
        setIsAttending(
          res.data.attendees.some((attendee) => attendee._id === user?.id)
        );
      } catch (error) {
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user?.id, key]);

  useEffect(() => {
    if (!socket || !event) return;

    const handleAttendeeJoined = (data) => {
      if (data.eventId !== eventId) return;
      setEvent((prev) => ({
        ...prev,
        attendees: [...prev.attendees, data.user],
      }));
      if (data.user._id === user?.id) {
        setIsAttending(true);
      }
    };

    const handleAttendeeLeft = (data) => {
      if (data.eventId !== eventId) return;
      setEvent((prev) => ({
        ...prev,
        attendees: prev.attendees.filter(
          (attendee) => attendee._id !== data.userId
        ),
      }));
      if (data.userId === user?.id) {
        setIsAttending(false);
      }
    };

    socket.on("attendee_joined", handleAttendeeJoined);
    socket.on("attendee_left", handleAttendeeLeft);

    return () => {
      socket.off("attendee_joined", handleAttendeeJoined);
      socket.off("attendee_left", handleAttendeeLeft);
    };
  }, [socket, eventId, user?.id, event]);

  const handleToggleAttendance = async () => {
    try {
      await api.post(`/events/join/${eventId}`);

      // Force a refresh of the event data
      setKey((prevKey) => prevKey + 1);

      toast.success(
        `Successfully ${!isAttending ? "joined" : "left"} the event!`
      );
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to toggle attendance");
    }
  };

  const handleEditSubmit = async (eventData) => {
    try {
      const res = await api.put(`/events/${eventId}`, eventData);
      setEvent(res.data);
      setIsEditing(false);
      handleToggleAttendance();
      toast.success("Event updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update event");
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${eventId}`);
        toast.success("Event deleted successfully!");
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to delete event");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading event details...</div>;
  }

  if (!event) {
    return <div className="text-center py-8">Event not found</div>;
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>
          <EventForm
            initialValues={{
              title: event.title,
              description: event.description,
              date: format(parseISO(event.date), "yyyy-MM-dd'T'HH:mm"),
              location: event.location,
              category: event.category,
              image: event.image,
            }}
            onSubmit={handleEditSubmit}
            isEditing={true}
          />
        </div>
      </div>
    );
  }

  const renderAttendanceButton = () => {
    if (isOrganizer || !eventHasNotPassed) {
      return null;
    }

    return (
      <button
        onClick={handleToggleAttendance}
        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
      >
        <Clock className="h-5 w-5 mr-2" />
        {isAttending ? "Leave Event" : "Join Event"}
      </button>
    );
  };

  const renderAttendanceStatus = () => {
    if (isAttending) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
          You're attending
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>
              {isOrganizer && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteEvent}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash className="h-5 w-5 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <UserPen className="h-5 w-5 mr-2 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Organizer</p>
                  <p className="font-medium"> {event.organizer.name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {format(parseISO(event.date), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Attendees</p>
                  <p className="font-medium">{event.attendees.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="border-t mt-8 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Attendees ({event.attendees.length})
                </h2>
                <div className="flex items-center gap-4">
                  {renderAttendanceStatus()}
                  {renderAttendanceButton()}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.attendees.map((attendee) => (
                  <div
                    key={attendee._id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <User className="h-6 w-6 text-gray-600 mr-3" />
                    <span className="font-medium">{attendee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
