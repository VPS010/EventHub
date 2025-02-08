import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSocket } from "../Contexts/SocketContext";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import EventForm from "../components/EventForm";
import EventHeader from "../components/EventHeader";
import EventInfo from "../components/EventInfo";
import EventAttendees from "../components/EventAttendees";
import api from "../hooks/api";

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
        navigate("/dashboard");
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <EventHeader
              event={event}
              isOrganizer={isOrganizer}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeleteEvent}
            />

            <EventInfo event={event} />

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
            <EventAttendees
              attendees={event.attendees}
              isAttending={isAttending}
              isOrganizer={isOrganizer}
              eventHasNotPassed={eventHasNotPassed}
              onToggleAttendance={handleToggleAttendance}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
