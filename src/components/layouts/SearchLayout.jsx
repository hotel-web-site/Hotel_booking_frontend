
import React from "react";
import { Outlet } from "react-router-dom";
import SearchFilterWrap from "../search/SearchFilterWrap";
import FilterSidebar from "../search/FilterSidebar";
import "./styles/SearchLayout.scss";
import { useSearchLayout } from "./hooks/useSearchLayout";

const SearchLayout = () => {
  const { hotels, filters, handleFilterChange, handleSearch } = useSearchLayout();

  return (
    <div className="search-layout">
      <div className="search-container">
        <div className="search-top-bar">
          <SearchFilterWrap
            filters={filters}
            hotels={hotels}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>
        <div className="search-content">
          <aside className="search-sidebar">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>
          <main className="search-main">
            <Outlet context={{ filters, hotels }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchLayout;