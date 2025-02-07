import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Calendar, Users, Clock, User } from "lucide-react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { useSocket } from "../Contexts/SocketContext";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";

const EventDetails = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${eventId}`);
        setEvent(res.data);
        setIsAttending(res.data.attendees.includes(user?.id));
      } catch (error) {
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    if (socket) {
      socket.emit("join_event", eventId);
      socket.on("attendee_joined", handleAttendeeUpdate);
    }

    return () => {
      if (socket) {
        socket.off("attendee_joined", handleAttendeeUpdate);
      }
    };
  }, [eventId, socket, user]);

  const handleAttendeeUpdate = ({ userId }) => {
    if (userId === user?.id) {
      setIsAttending(true);
    }
    setEvent((prev) => ({
      ...prev,
      attendees: [...prev.attendees, userId],
    }));
  };

  const handleJoinEvent = async () => {
    try {
      await axios.post(`/api/events/${eventId}/join`);
      setIsAttending(true);
      toast.success("Successfully joined the event!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to join event");
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading event details...</div>;

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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Attendees ({event.attendees.length})
                  </h2>
                  {!isAttending && new Date(event.date) > new Date() && (
                    <button
                      onClick={handleJoinEvent}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      Join Event
                    </button>
                  )}
                  {isAttending && (
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                      You're attending
                    </span>
                  )}
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
                  {event.attendees.length === 0 && (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      No attendees yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventDetails;
