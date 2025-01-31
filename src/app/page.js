// app/page.js
"use client";
import React, { useState } from "react";
import axios from "axios";
import FacebookLoginButton from "../components/FacebookLoginButton";
import Insights from "../components/Insights";
import ErrorMessage from "../components/ErrorMessage";
import PageSelect from "../components/PageSelect";

const Page = () => {
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
    const { accessToken } = user;
    try {
      const insightsRes = await axios.get(
        `https://fb-assignment.onrender.com/page-insights?page_id=${selectedPage}&access_token=${accessToken}`
      );
      setInsights(insightsRes.data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching insights:", error);
    }
  };

  return (
    <>
      {error && <ErrorMessage message={error} />}
      {!user ? (
        <FacebookLoginButton onSuccess={responseFacebook} onError={setError} />
      ) : (
        <div className="space-y-6">
          <PageSelect pages={pages} setSelectedPage={setSelectedPage} />
          <button
            onClick={fetchInsights}
            disabled={!selectedPage}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Insights
          </button>

          {insights && <Insights data={insights} />}
        </div>
      )}
    </>
  );
};

export default Page;
