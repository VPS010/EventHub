import React from "react";
import { Edit, Trash } from "lucide-react";

const EventHeader = ({ event, isOrganizer, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
      {isOrganizer && (
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            <Trash className="h-5 w-5 mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EventHeader;
