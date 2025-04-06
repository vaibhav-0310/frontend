// src/components/ModelDetailModal.jsx
import React, { useEffect, useMemo } from 'react';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import LineChart from './LineChart'; // Import the chart component

// --- Helper Functions ---

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Using a slightly more detailed format including time
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: 'numeric', hour12: true // Added time
        });
    } catch (e) {
        console.warn("Error formatting date:", dateString, e);
        return 'Invalid Date';
    }
};

// --- ADDED BACK formatNumber function ---
const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(Number(num))) {
         return 'N/A'; // Handle non-numeric values gracefully
    }
    return Number(num).toLocaleString('en-US'); // Ensure it's a number before formatting
};

const getPlatformStyle = (platform) => {
    // Defensive check for input type
    const platformLower = typeof platform === 'string' ? platform.toLowerCase() : '';

    switch (platformLower) {
        case 'hugging face':
            return { icon: '🤗', color: 'bg-yellow-400 text-gray-800', name: 'Hugging Face' };
        case 'github':
            return { icon: 'G', color: 'bg-gray-700 text-white', name: 'GitHub' };
        case 'arxiv': // Handle potential variations
            return { icon: 'Ar', color: 'bg-red-600 text-white', name: 'ArXiv' };
        case 'models': // Added missing case
            return { icon: 'M', color: 'bg-blue-600 text-white', name: 'Models' };
        default:
            console.warn(`Unknown platform encountered in getPlatformStyle: "${platform}"`);
            return { icon: '?', color: 'bg-gray-400 text-white', name: platform || 'Unknown' };
    }
};

// --- Component ---
function ModelDetailModal({ isOpen, onClose, model: item }) { // Renamed prop to 'item'

    // Prevent rendering if not open or no item data
    if (!isOpen || !item) {
        return null;
    }

    // --- Derived State ---
    const platformStyle = useMemo(() => getPlatformStyle(item.platform), [item.platform]);

    // --- Chart Data Simulation ---
    const simulatedChartData = useMemo(() => {
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const generateRandomTrend = (base) => {
            const numericBase = Number(base) || 0; // Ensure base is a number
            return labels.map(() => Math.max(0, numericBase + Math.floor(Math.random() * (numericBase || 50) * 0.5) - Math.floor(Math.random() * (numericBase || 50) * 0.3)));
        }

        // Use standardized 'upvotes' field for the combined metric chart
        const downloadsData = generateRandomTrend(item.hf_downloads); // Keep if hf_downloads specific field is relevant
        const likesOrStarsData = generateRandomTrend(item.upvotes); // Standardized field from combineData

        // Cap last point to current value for slight realism
        downloadsData[labels.length - 1] = Number(item.hf_downloads) ?? downloadsData[labels.length - 1];
        likesOrStarsData[labels.length - 1] = Number(item.upvotes) ?? likesOrStarsData[labels.length - 1];


        return {
            labels,
            datasets: [
                {
                    label: 'Downloads (Simulated)',
                    data: downloadsData,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    fill: true,
                },
                {
                    label: 'Likes/Stars (Simulated)',
                    data: likesOrStarsData, // Use the combined upvotes metric
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1,
                    fill: true,
                },
            ],
        };
    }, [item]); // Depend only on the item prop

    // --- Chart Options ---
    const chartOptions = useMemo(() => {
        // Determine text color based on theme for better readability
        const isDarkMode = document.documentElement.classList.contains('dark');
        const textColor = isDarkMode ? '#e5e7eb' : '#374151'; // Tailwind gray-200 / gray-700
        const gridColor = isDarkMode ? '#4b5563' : '#d1d5db'; // Tailwind gray-600 / gray-300
        const titleColor = isDarkMode ? '#f9fafb' : '#1f2937'; // Tailwind gray-50 / gray-800

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: textColor } },
                title: { display: true, text: 'Simulated Growth Trends (Demo Only)', color: titleColor, font: { size: 16 } },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.9)', // gray-700 / white
                    titleColor: isDarkMode ? '#f9fafb' : '#1f2937', // gray-50 / gray-800
                    bodyColor: textColor,
                    borderColor: gridColor,
                    borderWidth: 1,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        };
    }, []); // Re-calculate options only if theme changes (could pass theme as prop)

    // --- Event Handlers ---
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) { onClose(); }
    };

    useEffect(() => {
        const handleKeyDown = (event) => { if (event.key === 'Escape') { onClose(); } };
        if (isOpen) { document.addEventListener('keydown', handleKeyDown); }
        return () => { document.removeEventListener('keydown', handleKeyDown); };
    }, [isOpen, onClose]);


    // --- Render ---
    return (
        // Backdrop
        <div
            className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleBackdropClick}
        >
            {/* Modal Content Container */}
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transition-transform duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

                {/* Modal Header */}
                <div className="flex items-start sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
                    <div className="flex items-center space-x-3 min-w-0"> {/* Added min-w-0 */}
                         <span className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${platformStyle.color}`}>
                             {platformStyle.icon}
                         </span>
                         {/* Use item.title */}
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate pr-2" title={item.title}>
                             {item.title}
                         </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-2 flex-shrink-0 p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Description/Summary */}
                    { (item.summary || item.description) && // Only show if there's content
                        <div>
                            <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed prose dark:prose-invert max-w-none">
                                {item.summary || item.description}
                            </p>
                        </div>
                    }

                    {/* --- UNCOMMENTED and UPDATED Key Metrics --- */}
                    <div>
                        <h4 className="text-base font-semibold mb-3 text-gray-700 dark:text-gray-300">Metrics</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                            {/* Use optional chaining and formatNumber */}
                            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg shadow-inner">
                                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider">Downloads</div>
                                <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{formatNumber(item.hf_downloads)}</div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg shadow-inner">
                                {/* Display standardized 'upvotes' which combines likes/stars */}
                                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider">Likes/Stars</div>
                                <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{formatNumber(item.upvotes)}</div>
                            </div>
                             {/* Only show GitHub stars specifically if it's a GitHub item and has stars */}
                            {item.platform === 'GitHub' && item.github_stars > 0 && (
                                <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg shadow-inner">
                                    <div className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider">GitHub Stars</div>
                                    <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{formatNumber(item.github_stars)}</div>
                                </div>
                            )}
                             {/* Optionally show trending score */}
                             {item.sourceData?.trendingScore !== undefined && (
                                 <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg shadow-inner">
                                     <div className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider">Trend Score</div>
                                     <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{formatNumber(item.sourceData.trendingScore)}</div>
                                 </div>
                              )}
                        </div>
                    </div>

                    {/* Simulated Trend Chart */}
                    <div>
                         <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Activity Trend (Simulated Data)</h4>
                         <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">Note: Historical trend data is simulated for demonstration purposes.</p>
                         <div className="h-64 w-full bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg shadow-inner">
                            <LineChart chartData={simulatedChartData} chartOptions={chartOptions} />
                        </div>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                        <div>
                             <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Tags</h4>
                             <div className="flex flex-wrap gap-2">
                                {/* Limit displayed tags for cleaner UI */}
                                {item.tags.slice(0, 15).map((tag, index) => (
                                    <span key={index} className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 rounded-full text-xs font-medium">
                                         {tag}
                                    </span>
                                ))}
                                 {item.tags.length > 15 && <span className="text-xs text-gray-400">...</span>}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div>
                        <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">Details</h4>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                             <div className="sm:col-span-1"><dt className="font-medium text-gray-500 dark:text-gray-400">Platform</dt><dd className="text-gray-900 dark:text-gray-100">{platformStyle.name}</dd></div>
                             <div className="sm:col-span-1"><dt className="font-medium text-gray-500 dark:text-gray-400">Type</dt><dd className="text-gray-900 dark:text-gray-100">{item.common_type || item.pipeline_tag || 'N/A'}</dd></div>
                              {/* UNCOMMENTED Created At */}
                              <div className="sm:col-span-1"><dt className="font-medium text-gray-500 dark:text-gray-400">Created At</dt><dd className="text-gray-900 dark:text-gray-100">{formatDate(item.createdAt)}</dd></div>
                              {/* Optionally add Updated At if available */}
                              {item.updatedAt && <div className="sm:col-span-1"><dt className="font-medium text-gray-500 dark:text-gray-400">Last Updated</dt><dd className="text-gray-900 dark:text-gray-100">{formatDate(item.updatedAt)}</dd></div>}
                             {/* Add other relevant details */}
                             {item.hf_modelId && <div className="sm:col-span-2"><dt className="font-medium text-gray-500 dark:text-gray-400">Model ID</dt><dd className="text-gray-900 dark:text-gray-100 font-mono text-xs break-all">{item.hf_modelId}</dd></div>}
                             {item.library_name && <div className="sm:col-span-1"><dt className="font-medium text-gray-500 dark:text-gray-400">Library</dt><dd className="text-gray-900 dark:text-gray-100">{item.library_name}</dd></div>}

                        </dl>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 rounded-b-xl z-10">
                     <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors">
                          View Original Source
                         <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                     </a>
                     <button type="button" onClick={onClose} className="ml-3 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-white dark:focus:ring-offset-gray-800"> Close </button>
                </div>
            </div>
        </div>
    );
}

export default ModelDetailModal;