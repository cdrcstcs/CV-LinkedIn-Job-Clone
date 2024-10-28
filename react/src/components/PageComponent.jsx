import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PageComponent({ title, buttons = "", children, pageType }) {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("latest");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
    // Automatically navigate when sort changes
    navigate(`/?search=${searchValue}&sort=${event.target.value}`);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/?search=${searchValue}&sort=${sortValue}`);
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          {buttons && <div className="flex-shrink-0">{buttons}</div>}
          {pageType !== "yours" && (
          <form onSubmit={handleSearchSubmit} className="flex items-center mt-4 space-x-2 w-2/3">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search job by company name or description"
              className="border border-gray-300 rounded-l-md p-2 flex-1"
            />
            <button type="submit" className="ml-2 bg-blue-500 text-white rounded-md px-4 py-2">
              Search
            </button>
            <select
              value={sortValue}
              onChange={handleSortChange}
              className="border border-gray-300 p-2 rounded-md"
              style={{ paddingRight: '2.5rem' }} // Padding for dropdown icon
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              {/* Add more sorting options as needed */}
            </select>
          </form>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </>
  );
}
