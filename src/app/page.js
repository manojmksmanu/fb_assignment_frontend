"use client";
import React, { useState } from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import {
  Layout,
  BarChart,
  Users,
  Eye,
  ThumbsUp,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Page = () => {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
    since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    until: new Date().toISOString().split("T")[0],
  });

  const responseFacebook = async (response) => {
    if (!response.accessToken) {
      setError("Failed to get access token");
      return;
    }

    setLoading(true);
    try {
      const userResponse = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,picture&access_token=${response.accessToken}`
      );
      setUser({
        ...userResponse.data,
        accessToken: response.accessToken,
      });

      const pagesRes = await axios.get(
        ` https://fb-assignment.onrender.com/pages?access_token=${response.accessToken}`
      );
      setPages(pagesRes.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async (customDateRange = null) => {
    if (!selectedPage) return;

    const pageData = pages.find((item) => item.id === selectedPage);
    if (!pageData || !pageData.access_token) {
      console.error("No page data or access token found for selected page");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let params = {
        page_id: selectedPage,
        access_token: pageData.access_token,
      };

      if (customDateRange) {
        params.since = Math.floor(
          new Date(customDateRange.since).getTime() / 1000
        );
        params.until = Math.floor(
          new Date(customDateRange.until).getTime() / 1000
        );
        setIsFiltered(true);
      } else {
        setIsFiltered(false);
      }

      const insightsRes = await axios.get(
        "https://fb-assignment.onrender.com/page-insights",
        { params }
      );

      if (insightsRes.data.error) {
        setError(insightsRes.data.error);
        return;
      }

      setInsights(insightsRes.data.data);
      setShowDateFilter(true);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(pages, "pages");

  console.log(insights, "insites");

  const applyDateFilter = () => {
    fetchInsights(dateRange);
  };

    const removeFilter = () => {
      setIsFiltered(false);
      setDateRange({
        since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        until: new Date().toISOString().split("T")[0],
      });
      fetchInsights(); // This will fetch lifetime data
    };


  const getMetricIcon = (metricName) => {
    switch (metricName) {
      case "page_fans":
        return <Users className="w-6 h-6 text-blue-500" />;
      case "page_engaged_users":
        return <BarChart className="w-6 h-6 text-orange-500" />;
      case "page_impressions":
        return <Eye className="w-6 h-6 text-green-500" />;
      case "page_reactions_total":
        return <ThumbsUp className="w-6 h-6 text-purple-500" />;
      default:
        return <BarChart className="w-6 h-6 text-gray-500" />;
    }
  };

const getMetricName = (metricName) => {
  const nameMap = {
    page_fans: "Total Followers",
    page_engaged_users: "Total Engagement",
    page_impressions: "Total Impressions",
    page_reactions_total: "Total Reactions",
  };
  return nameMap[metricName] || metricName;
};
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Layout className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                FB Insights Dashboard
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
                  {loading ? "Loading..." : "Login with Facebook"}
                </button>
              )}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <select
                    className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                    onChange={(e) => {
                      setSelectedPage(e.target.value);
                      setShowDateFilter(false);
                      setInsights(null);
                    }}
                    value={selectedPage}
                    disabled={loading}
                  >
                    <option value="">Select a Page</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => fetchInsights()}
                    disabled={!selectedPage || loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <BarChart className="w-4 h-4 mr-2" />
                        Get Insights
                      </>
                    )}
                  </button>
                </div>

                {showDateFilter && insights && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={() => setShowDateFilter(!showDateFilter)}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {isFiltered
                          ? "Custom Date Range Applied"
                          : "Custom Date Range"}
                        {showDateFilter ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>

                      {isFiltered && (
                        <button
                          onClick={removeFilter}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Remove Filter
                        </button>
                      )}
                    </div>

                    {showDateFilter && (
                      <div className="flex flex-wrap gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={dateRange.since}
                            onChange={(e) =>
                              setDateRange((prev) => ({
                                ...prev,
                                since: e.target.value,
                              }))
                            }
                            className="border border-gray-300 rounded-md p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={dateRange.until}
                            onChange={(e) =>
                              setDateRange((prev) => ({
                                ...prev,
                                until: e.target.value,
                              }))
                            }
                            className="border border-gray-300 rounded-md p-2"
                          />
                        </div>
                        <button
                          onClick={() => fetchInsights(dateRange)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Apply Filter
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                      <div className="flex-1 space-y-6">
                        <div className="h-2 bg-slate-200 rounded"></div>
                        <div className="space-y-3">
                          <div className="h-2 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : insights && insights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {insights.data.map((metric, index) => (
                  <div
                    key={metric.name || index}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      {getMetricIcon(metric.name)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">
                          {getMetricName(metric.name)}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                          {metric.values && metric.values[0]
                            ? parseInt(metric.values[0].value).toLocaleString()
                            : "0"}
                        </p>
                        {metric.values && metric.values[0]?.end_time && (
                          <p className="mt-1 text-xs text-gray-500">
                            Last updated:{" "}
                            {new Date(
                              metric.values[0].end_time
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedPage ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">
                  Select a page and click "Get Insights" to view the analytics
                  data
                </p>
                {error && (
                  <p className="text-sm text-red-500 mt-2">Error: {error}</p>
                )}
              </div>
            ) : null} */}
            <h1>
              New one
            </h1>
            {insights && insights.length > 0 ? (
              <div>
                {/* Filter Status and Controls */}
                {showDateFilter && (
                  <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span className="font-medium text-gray-700">
                          {isFiltered ? "Filtered Data" : "Lifetime Data"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        {isFiltered ? (
                          <>
                            <span className="text-sm text-gray-600">
                              {new Date(dateRange.since).toLocaleDateString()} -{" "}
                              {new Date(dateRange.until).toLocaleDateString()}
                            </span>
                            <button
                              onClick={removeFilter}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Reset to Lifetime
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setShowDateFilter(true)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Add Date Filter
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Date Range Selector */}
                    {showDateFilter && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-4 items-end">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={dateRange.since}
                              onChange={(e) =>
                                setDateRange((prev) => ({
                                  ...prev,
                                  since: e.target.value,
                                }))
                              }
                              className="border border-gray-300 rounded-md p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={dateRange.until}
                              onChange={(e) =>
                                setDateRange((prev) => ({
                                  ...prev,
                                  until: e.target.value,
                                }))
                              }
                              className="border border-gray-300 rounded-md p-2"
                            />
                          </div>
                          <button
                            onClick={() => fetchInsights(dateRange)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Apply Filter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {insights.map((metric, index) => (
                    <div
                      key={metric.name || index}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        {getMetricIcon(metric.name)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">
                            {getMetricName(metric.name)}
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-gray-900">
                            {metric.values && metric.values[0]
                              ? parseInt(
                                  metric.values[0].value
                                ).toLocaleString()
                              : "0"}
                          </p>
                          {metric.values && metric.values[0]?.end_time && (
                            <p className="mt-1 text-xs text-gray-500">
                              Last updated:{" "}
                              {new Date(
                                metric.values[0].end_time
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">
                  Select a page and click "Get Insights" to view the analytics
                  data
                </p>
                {error && (
                  <p className="text-sm text-red-500 mt-2">Error: {error}</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
