import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, CalendarPlus, Menu, X } from "lucide-react";
import { useAuth } from "../Contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      {user ? (
        <>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">
              {user.name} {user.isGuest && "(Guest)"}
            </span>
          </div>
          {!user.isGuest && (
            <Link
              to="/create-event"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <CalendarPlus className="h-5 w-5 mr-2" />
              Create Event
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </>
      ) : (
        <div className="flex sm:flex-row flex-col sm:space-x-4 space-y-2 sm:space-y-0">
          <Link
            to="/login"
            className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            EventHub
          </Link>

          {/* Mobile menu button - only visible on phone screens */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Regular menu - visible on all screens except phones */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <NavLinks />
          </div>
        </div>

        {/* Mobile menu - only for phone screens */}
        {isOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3 flex flex-col items-start">
              <NavLinks />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
