// components/Insights.js
"use client"
import React from "react";
import { BarChart, Users, Eye, ThumbsUp } from "lucide-react";

const Insights = ({ data }) => {
  const getMetricIcon = (metricName) => {
    if (metricName.includes("fan"))
      return <Users className="w-6 h-6 text-blue-500" />;
    if (metricName.includes("impressions"))
      return <Eye className="w-6 h-6 text-green-500" />;
    if (metricName.includes("reactions"))
      return <ThumbsUp className="w-6 h-6 text-purple-500" />;
    return <BarChart className="w-6 h-6 text-orange-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Page Insights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((metric) => (
          <div
            key={metric.id}
            className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              {getMetricIcon(metric.name.toLowerCase())}
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {metric.name
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {parseInt(metric.values[0].value).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
