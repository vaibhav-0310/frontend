import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate and useParams
import Card from "./Card";
import Navbar from "./Navbar";
import ModelDetailModal from "./ModelDetailModal"; // Import the modal component

const Dashboard = () => {
  // State variables for models, search, subscription, and modal
  const [allModels, setAllModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false); // Moved from Navbar
  const [selectedModel, setSelectedModel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user ID from URL parameters
  let { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate

  // Function to fetch AI models from the API
  const fetchModels = async () => {
    try {
      const res = await axios.get(`https://back-c06a.onrender.com/api/models`);
      setAllModels(res.data);
      setFilteredModels(res.data);
    } catch (err) {
      console.error("Error fetching models:", err);
      // Handle error (e.g., show error message to user)
    }
  };

  // Function to handle search input changes and filter models
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Filter models based on search input across various fields
    if (value.trim() === "") {
      setFilteredModels(allModels); // Show all models if search is empty
    } else {
      setFilteredModels(
        allModels.filter((model) => {
          const lowerCaseValue = value.toLowerCase();
          // Check if search term matches name, platform, description, tags, or other string fields
          const nameMatch = model.name?.toLowerCase().includes(lowerCaseValue);
          const platformMatch = model.common_platform?.toLowerCase().includes(lowerCaseValue);
          const descriptionMatch = model.description?.toLowerCase().includes(lowerCaseValue);
          const tagsMatch = model.tags?.some(tag => tag.toLowerCase().includes(lowerCaseValue));
          // Check other string properties dynamically
          const displayedTagsMatch = Object.keys(model).some(key => {
            if (typeof model[key] === 'string' && !['name', 'common_platform', 'description'].includes(key)) {
              return model[key].toLowerCase().includes(lowerCaseValue);
            }
            return false;
          });

          return nameMatch || platformMatch || descriptionMatch || tagsMatch || displayedTagsMatch;
        })
      );
    }
  };

  // Function to handle showing model details in a modal
  const handleShowDetails = (model) => {
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  // Function to close the model details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedModel(null); // Clear selected model when closing
  };

  // Function to handle user subscription
  const handleSubscribe = async () => {
    if (!id) {
      console.error("User ID is not available for subscription.");
      // Optionally navigate to login or show an error
      // navigate("/login");
      alert("Please log in to subscribe.");
      return;
    }
    try {
      // Make API call to subscribe the user
      await axios.post(`https://back-c06a.onrender.com/api/subscribe/${id}`);

      // Make API call to send a welcome email
      await axios.post(`https://back-c06a.onrender.com/api/send-email/${id}`);

      // Update subscription state and notify the user
      setIsSubscribed(true);
      alert("You're now subscribed and a welcome email has been sent!"); // Use a more sophisticated notification system if available
    } catch (err) {
      console.error("Subscription or email failed:", err);
      alert("Subscription failed. Please try again later."); // Inform user about the failure
    }
  };

  // Fetch models when the component mounts
  useEffect(() => {
    fetchModels();
    // You might want to check the initial subscription status here as well
    // e.g., fetch user data that includes subscription status
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Pass necessary props to Navbar, excluding subscription state */}
      <Navbar />

      <div className="container mx-auto p-6">
        {/* Subscription Section - Removed max-w-2xl and mx-auto for full width */}
        {!isSubscribed && ( // Only show subscription section if not already subscribed
          <div className="mb-8 text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Subscribe now to get weekly digest
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get the latest AI model updates, trending news, and more delivered straight to your inbox.
            </p>
            <button
              onClick={handleSubscribe}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Subscribe Now
            </button>
          </div>
        )}

        {/* Search Bar Section - Still centered */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by platform or model name (e.g., GitHub, llama, Qwen)"
                value={searchInput}
                onChange={handleSearchInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {/* Search Icon */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {/* Update Button */}
            <button
              onClick={fetchModels} // Refreshes the model list
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              title="Refresh model list" // Add title for accessibility
            >
              Update
            </button>
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.length > 0 ? (
            filteredModels.map((model, index) => (
              <Card
                key={model.id || index} // Use a unique ID from the model if available
                item={model}
                onShowDetails={handleShowDetails}
              />
            ))
          ) : (
            // Display message when no models match the search
            <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
              {searchInput ? `No models found matching "${searchInput}"` : "Loading models..."}
            </div>
          )}
        </div>
      </div>

      {/* Model Detail Modal */}
      <ModelDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        model={selectedModel}
      />
    </div>
  );
};

export default Dashboard;

