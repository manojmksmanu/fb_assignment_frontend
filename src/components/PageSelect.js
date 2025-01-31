// components/PageSelect.js
import React from "react";

const PageSelect = ({ pages, setSelectedPage }) => {
  return (
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
  );
};

export default PageSelect;
