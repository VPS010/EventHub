import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Formik } from "formik";


const PasswordInput = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = "Enter password",
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" aria-label="Hide password" />
        ) : (
          <Eye className="h-5 w-5" aria-label="Show password" />
        )}
      </button>
      {touched && error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PasswordInput;
