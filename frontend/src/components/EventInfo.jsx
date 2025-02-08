import React from "react";
import { UserPen, Calendar, MapPin, Users } from "lucide-react";
import { format, parseISO } from "date-fns";

const EventInfo = ({ event }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-start">
        <UserPen className="h-5 w-5 mr-2 text-indigo-600" />
        <div>
          <p className="text-sm text-gray-500">Organizer</p>
          <p className="font-medium">{event.organizer.name}</p>
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
  );
};

export default EventInfo;
