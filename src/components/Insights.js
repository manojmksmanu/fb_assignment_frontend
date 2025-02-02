import React, { useEffect, useState } from "react";
import axios from "axios";

const Insights = ({ page_id, access_token }) => {
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    const fetchInsights = async () => {
      try {
        const response = await axios.get("/page-insights", {
          params: {
            page_id,
            access_token,
          },
        });
        setInsightsData(response.data);
      } catch (err) {
        setError("Failed to fetch insights");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [page_id, access_token]);

  if (loading) return <div>Loading insights...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Page Insights</h2>
      {insightsData?.success ? (
        <div>
          {insightsData.data.map((metric, index) => (
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
  );
};

export default Insights;
