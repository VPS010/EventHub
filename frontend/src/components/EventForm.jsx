import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2, Calendar, MapPin, Text, AlignLeft } from "lucide-react";
import { toast } from "react-toastify";
import api from "../hooks/api";

const EventForm = ({ initialValues, onSubmit, isEditing }) => {
  const [imageUrl, setImageUrl] = useState(initialValues?.image || "");
  const [uploading, setUploading] = useState(false);

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.date()
      .required("Date is required")
      .min(today, "Cannot create events in the past")
      .test("is-future", "Event date must be in the future", function (value) {
        if (!value) return true; // Let the required validation handle null/undefined
        return true;
      }),
    image: Yup.string().url("Invalid image URL"),
    location: Yup.string().required("Location is required"),
    category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      title: "",
      description: "",
      date: "",
      location: "",
      category: "",
      image: "https://sampleimage.png"
    },
    validationSchema,
    onSubmit: async (values) => {
      // Double-check date validation before submitting
      const eventDate = new Date(values.date);
      const now = new Date();
      if (eventDate < now) {
        toast.error("Cannot create events in the past");
        return;
      }
      await onSubmit({ ...values, image: imageUrl });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData);
      setImageUrl(res.data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed");
      e.target.value = ""; // Reset file input
    } finally {
      setUploading(false);
    }
  };

  // Get the minimum allowed date-time string for the input
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title
          </label>
          <div className="relative">
            <Text className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="title"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <div className="relative">
            <AlignLeft className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <textarea
              name="description"
              rows="4"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              {...formik.getFieldProps("description")}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.description}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="datetime-local"
                name="date"
                min={getMinDateTime()}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                {...formik.getFieldProps("date")}
              />
              {formik.touched.date && formik.errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.date}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="location"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                {...formik.getFieldProps("location")}
              />
              {formik.touched.location && formik.errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.location}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              {...formik.getFieldProps("category")}
            >
              <option value="">Select a category</option>
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
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="w-full p-2 border rounded-lg cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                ) : imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-20 w-20 object-cover mb-2 rounded-md"
                    />
                    <span className="text-sm">Change Image</span>
                  </>
                ) : (
                  "Upload Image"
                )}
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting || uploading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
        >
          {formik.isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : isEditing ? (
            "Update Event"
          ) : (
            "Create Event"
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
