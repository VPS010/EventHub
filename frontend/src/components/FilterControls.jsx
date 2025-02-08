import { Sliders } from "lucide-react";

const FilterControls = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex items-center mb-4">
        <Sliders className="h-6 w-6 text-indigo-600 mr-2" />
        <h3 className="text-lg font-semibold">Filter Events</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="All">All Categories</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Networking">Networking</option>
            <option value="Festival">Festival</option>
            <option value="Music">Music</option>
            <option value="Dance">Dance</option>
            <option value="Sports">Sports</option>
            <option value="Meetup">Meetup</option>
            <option value="Social">Social</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
