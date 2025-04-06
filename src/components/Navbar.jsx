import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sun, Moon } from 'lucide-react'; // Import icons for the toggle

const Navbar = () => {
  // State for dropdown menu visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // State for theme mode (true = dark, false = light)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference on initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to system preference if no saved theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const navigate = useNavigate();

  // Effect to apply the theme class to the HTML element and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]); // Re-run effect when isDarkMode changes

  // Function to toggle the theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to handle user logout
  const handleLogout = () => {
    axios.post(`https://back-c06a.onrender.com/api/logout`)
      .then(() => {
        // Clear user data from local storage
        localStorage.removeItem("user");
        // Redirect to login page
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        // Handle logout error (e.g., show error message)
        alert("Logout failed. Please try again.");
      });
  };

  // Placeholder function for navigation links
  const handleNavClick = (path) => {
      console.log(`Navigating to ${path}`);
      // Replace with actual navigation logic if using react-router-dom
      // navigate(path);
  }

  return (
    <nav className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-4 shadow-md transition-colors duration-300"> {/* Adjusted background for light mode */}
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side: Brand and Navigation */}
        <div className="flex items-center space-x-8">
            {/* Logo/Brand Name */}
            <h1 className="text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                AI Digest
            </h1>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
                <button
                    onClick={() => handleNavClick('/services')}
                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                    Services
                </button>
                <button
                    onClick={() => handleNavClick('/about')}
                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                    About Us
                </button>
                <button
                    onClick={() => handleNavClick('/contact')}
                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                    Contact Us
                </button>
            </div>
        </div>


        {/* Right side controls: Theme Toggle and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button - Added */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors duration-200"
            aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {/* User Avatar Placeholder */}
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-gray-200 dark:ring-offset-gray-900 ring-purple-400"> {/* Adjusted ring offset */}
                <span className="text-sm font-medium text-white">U</span> {/* Ensured text is visible */}
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  Logout
                </button>
                {/* Add other dropdown items here (e.g., Profile, Settings) */}
              </div>
            )}
          </div>
          {/* Add a Mobile Menu Button Here if needed for smaller screens */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
