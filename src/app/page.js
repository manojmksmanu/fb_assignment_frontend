"use client";
import React, { useState } from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import { Layout, BarChart } from "lucide-react";

const Page = () => {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  console.log(pages);
  const fetchInsights = async (dateRange) => {
    if (!selectedPage) return;
    const pageData = pages.find((item) => item.id === selectedPage);
    if (!pageData || !pageData.access_token) {
      console.error("No page data or access token found for selected page");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://fb-assignment.onrender.com/page-insights?access_token=${pageData.access_token}&page_id=${selectedPage}`
      );
      console.log(response.data, "response");
      setInsights(response.data);
    } catch (error) {
      setError("Failed to fetch insights");
    } finally {
      setLoading(false);
    }
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
                    onClick={() => fetchInsights(dateRange)}
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

                {/* Insights section */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h2>Page Insights</h2>
                    {insights?.success && insights.data.length > 0 ? (
                      <div>
                        {insights.data.map((metric, index) => (
                          <div key={index}>
                            <h3>{metric.title}</h3>
                            <p>{metric.description}</p>
                            <ul>
                              {metric.values.map((value, i) => (
                                <li key={i}>
                                  {value.end_time}: {value.value}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No data available for the requested metrics.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
