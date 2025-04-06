// src/components/LineChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, // x axis
    LinearScale, // y axis
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // For area fill if needed
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function LineChart({ chartData, chartOptions }) {
    // Basic check to prevent rendering without data
    if (!chartData || !chartData.labels || !chartData.datasets) {
        return <div>Loading chart data...</div>;
    }

    return <Line options={chartOptions} data={chartData} />;
}

export default LineChart;