"use client";
import React, { useState } from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import { Layout, BarChart, Users, Eye, ThumbsUp } from "lucide-react";
import { PAGES_DIR_ALIAS } from "next/dist/lib/constants";

const page = () => {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  const responseFacebook = async (response) => {
    if (!response.accessToken) {
      setError("Failed to get access token");
      return;
    }

    try {
      // Get user details
      const userResponse = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,picture&access_token=${response.accessToken}`
      );
      setUser({
        ...userResponse.data,
        accessToken: response.accessToken,
      });

      // Get pages
      const pagesRes = await axios.get(
        `https://fb-assignment.onrender.com/pages?access_token=${response.accessToken}`
      );
      setPages(pagesRes.data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error);
    }
  };

  const fetchInsights = async () => {
    if (!selectedPage) return;

    const access_token = pages.find((item) => item.id === selectedPage);

    console.log(access_token.access_token, "page token");
    try {
      const insightsRes = await axios.get(
        `https://fb-assignment.onrender.com/page-insights`,
        {
          params: {
            page_id: selectedPage,
            access_token: access_token,
          },
        }
      );
      console.log(insightsRes.data, "insite data ");
      setInsights(insightsRes.data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching insights:", error);
    }
  };

  const getMetricIcon = (metricName) => {
    if (metricName.includes("fan"))
      return <Users className="w-6 h-6 text-blue-500" />;
    if (metricName.includes("impressions"))
      return <Eye className="w-6 h-6 text-green-500" />;
    if (metricName.includes("reactions"))
      return <ThumbsUp className="w-6 h-6 text-purple-500" />;
    return <BarChart className="w-6 h-6 text-orange-500" />;
  };

  console.log(pages);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 ">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Layout className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                FB Insights Dashboard (Mojo Assignment)
              </span>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <img
                  src={user.picture?.data?.url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-blue-500"
                />
                <span className="text-gray-700">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Welcome to FB Insights Dashboard
            </h1>
            <FacebookLogin
              appId="914299164196328"
              onSuccess={responseFacebook}
              onFail={(error) => {
                setError(error.message);
              }}
              scope="public_profile,email,pages_show_list,pages_read_engagement,read_insights"
              render={({ onClick }) => (
                <button
                  onClick={onClick}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login with Facebook
                </button>
              )}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <select
                  className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setSelectedPage(e.target.value)}
                  value={selectedPage}
                >
                  <option value="">Select a Page</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchInsights}
                  disabled={!selectedPage}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Get Insights
                </button>
              </div>
            </div>

            {insights && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Page Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {insights.map((metric) => (
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
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
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
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default page;
