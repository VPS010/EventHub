import React from "react";
import { User, Clock } from "lucide-react";

const EventAttendees = ({
  attendees,
  isAttending,
  isOrganizer,
  eventHasNotPassed,
  onToggleAttendance,
}) => {
  const renderAttendanceButton = () => {
    if (isOrganizer || !eventHasNotPassed) {
      return null;
    }

    return (
      <button
        onClick={onToggleAttendance}
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
    <div className="border-t mt-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Attendees ({attendees.length})
        </h2>
        <div className="flex items-center gap-4">
          {renderAttendanceStatus()}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {attendees.map((attendee) => (
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
  );
};

export default EventAttendees;
