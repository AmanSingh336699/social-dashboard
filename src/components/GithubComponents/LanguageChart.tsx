"use client";
import React from 'react'
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface LanguageChartProps {
  languages: { [key: string]: number };
}

const LanguageChart: React.FC<LanguageChartProps> = ({ languages }) => {
  const chartOptions = {
    chart: {
      type: "donut" as "donut",
      width: "100%", // Set chart width to 100% for flexibility
    },
    labels: Object.keys(languages),
    responsive: [
      {
        breakpoint: 1200, // Large desktop
        options: {
          chart: {
            width: "70%", // 70% of the container on large desktops
          },
          legend: {
            position: "right",
            floating: false,
            fontSize: "14px",
          },
        },
      },
      {
        breakpoint: 1024, // Tablet and smaller devices
        options: {
          chart: {
            width: "80%", // 80% width on tablets
          },
          legend: {
            position: "right",
            floating: false,
            fontSize: "14px",
          },
        },
      },
      {
        breakpoint: 768, // Mobile landscape
        options: {
          chart: {
            width: "90%", // 90% width on mobile landscape
          },
          legend: {
            position: "bottom", // Move legend to bottom for better mobile experience
            horizontalAlign: "center",
          },
        },
      },
      {
        breakpoint: 480, // Mobile portrait
        options: {
          chart: {
            width: "100%", // Full width on smaller mobile screens
          },
          legend: {
            position: "bottom", // Keep legend at the bottom
            horizontalAlign: "center",
          },
        },
      },
    ],
  };

  const chartSeries = Object.values(languages);

  return (
    <div className="flex justify-center items-center mt-6">
      <Chart options={chartOptions} series={chartSeries} type="donut" />
    </div>
  );
};

export default React.memo(LanguageChart);