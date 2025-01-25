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
  const chartType = "donut" as "donut"

  const chartOptions = {
    chart: {
      type: chartType,
      width: "100%", 
    },
    labels: Object.keys(languages),
    responsive: [
      {
        breakpoint: 1200,
        options: {
          chart: {
            width: "70%", 
          },
          legend: {
            position: "right",
            floating: false,
            fontSize: "14px",
          },
        },
      },
      {
        breakpoint: 1024, 
        options: {
          chart: {
            width: "80%",
          },
          legend: {
            position: "right",
            floating: false,
            fontSize: "14px",
          },
        },
      },
      {
        breakpoint: 768, 
        options: {
          chart: {
            width: "90%", 
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
          },
        },
      },
      {
        breakpoint: 480, 
        options: {
          chart: {
            width: "100%", 
          },
          legend: {
            position: "bottom", 
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