import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Calendar } from "lucide-react";
import EventCard from "../components/EventCard";
import FilterControls from "../components/FilterControls";
import useEvents from "../hooks/useEvents";
import { useAuth } from "../Contexts/AuthContext";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { events = [], loading, error } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  if (authLoading)
    return <div className="text-center py-8">Checking authentication...</div>;

  const filteredEvents =
    events?.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesDate = selectedDate
        ? new Date(event.date).toDateString() ===
          new Date(selectedDate).toDateString()
        : true;
      if (selectedCategory == "All") {
        return matchesDate;
      }
      return matchesCategory && matchesDate;
    }) || [];

  const categories = Array.isArray(events)
    ? [...new Set(events.map((event) => event.category))]
    : [];

  // Early return for loading state
  if (loading) return <div className="text-center py-8">Loading events...</div>;

  // Early return for error state
  if (error)
    return (
      <div className="text-center py-8 text-red-500">Please Login {error}</div>
    );

  // Check if user exists and is not a guest before rendering create button
  const showCreateButton = user && !user?.isGuest;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Upcoming Events
            </h1>
            {showCreateButton && (
              <Link
                to="/create-event"
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Link>
            )}
          </div>

          <FilterControls
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            {filteredEvents.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-xl">
                  No events found matching your criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
