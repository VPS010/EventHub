import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2, Calendar, MapPin, Text, AlignLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const EventForm = ({ initialValues, onSubmit, isEditing }) => {
  const [imageUrl, setImageUrl] = useState(initialValues?.image || "");
  const [uploading, setUploading] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.date().required("Date is required"),
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
      image: "",
    },
    validationSchema,
    onSubmit: async (values) => {
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
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImageUrl(res.data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
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
              <option value="Social">Social</option>
              <option value="Networking">Networking</option>
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
                className="w-full p-2 border rounded-lg cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                ) : imageUrl ? (
                  "Image Uploaded ✓"
                ) : (
                  "Upload Image"
                )}
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
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
