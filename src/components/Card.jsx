// src/components/Card.jsx
import React from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, ArrowUpIcon } from '@heroicons/react/24/outline';

// --- Helper Functions ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    } catch (e) { return 'Invalid Date'; }
};

const getPlatformStyle = (platform) => {
    const platformLower = typeof platform === 'string' ? platform.toLowerCase() : '';
    switch (platformLower) {
        case 'hugging face': return { icon: '🤗', color: 'bg-yellow-400 text-gray-800', name: 'Hugging Face' };
        case 'github': return { icon: 'G', color: 'bg-gray-700 text-white', name: 'GitHub' };
        case 'arxiv': return { icon: 'Ar', color: 'bg-red-600 text-white', name: 'ArXiv' };
        case 'models': return { icon: 'M', color: 'bg-blue-600 text-white', name: 'Models' }; // Added Models case
        default:
            console.warn(`Unknown platform: "${platform}"`);
            return { icon: '?', color: 'bg-gray-400 text-white', name: platform || 'Unknown' };
    }
};

// Accept onShowDetails prop (the prop is now being used)
function Card({ item, isFavorite, onToggleFavorite, hasUpvoted, onUpvoteToggle, onShowDetails }) {
    const platformStyle = getPlatformStyle(item.platform);
    const itemId = item.uniqueId; // Use the unique ID

    const handleUpvoteClick = (e) => {
        e.stopPropagation(); // Prevent potential event bubbling if needed later
        if (onUpvoteToggle) {
            onUpvoteToggle(itemId);
        }
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Prevent potential event bubbling
        if (onToggleFavorite) {
            onToggleFavorite(itemId);
        }
    }

    // Handler for the "View Details" button click
    const handleViewDetailsClick = () => {
        if (onShowDetails) {
            onShowDetails(item); // Call the function passed from Dashboard
        } else {
            console.warn("onShowDetails prop missing from Card component");
        }
    };

    return (
        // Main card container remains non-clickable
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                {/* Platform Info */}
                <div className="flex items-center flex-grow min-w-0 mr-2">
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${platformStyle.color} text-sm font-bold mr-3 flex-shrink-0`}>{platformStyle.icon}</div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate" title={platformStyle.name}>{platformStyle.name}</span>
                </div>
                {/* Action Buttons (Upvote/Favorite) */}
                <div className="flex items-center flex-shrink-0 space-x-1.5">
                     {/* Upvote Button - Styles assumed to be defined or adjust */}
                     <button onClick={handleUpvoteClick} className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs transition-colors ${hasUpvoted ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`} title={hasUpvoted ? "Remove Upvote" : "Upvote"}>
                        <ArrowUpIcon className={`h-4 w-4 ${hasUpvoted ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                        <span>{item.upvotes ?? 0}</span>
                    </button>
                     {/* Favorite Button - Styles assumed to be defined or adjust */}
                     <button onClick={handleFavoriteClick} className={`p-1 rounded-full transition-colors ${isFavorite ? 'text-yellow-500 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900' : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`} title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
                        {isFavorite ? <StarSolid className="h-5 w-5" /> : <StarOutline className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-grow">
                <h3 className="text-base font-semibold mb-1 text-gray-800 dark:text-gray-100">
                    {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {formatDate(item.createdAt)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-3">
                    {item.summary}
                </p>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
                <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 5).map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                                {tag}
                            </span>
                        ))}
                        {item.tags.length > 5 && <span className="text-xs text-gray-400">...</span>}
                    </div>
                </div>
            )}

            {/* Footer with View Details Button */}
            <div className="px-4 pt-3 pb-4 border-t border-gray-100 dark:border-gray-700 mt-auto text-center">
                {/* View Details Button that now triggers the modal */}
                <button
                    onClick={handleViewDetailsClick}
                    className="inline-flex items-center px-4 py-1.5 border border-gray-300 dark:border-gray-500 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default Card;