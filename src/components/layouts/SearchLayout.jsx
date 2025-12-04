import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import SearchFilterWrap from "../search/SearchFilterWrap";
import FilterSidebar from "../search/FilterSidebar";
import './styles/SearchLayout.scss';

const SearchLayout = () => {
    const [filters, setFilters] = useState({
        destination: "",
        checkIn: "",
        checkOut: "",
        guests: { rooms: 1, guests: 2 },
        priceRange: [0, 1000],
        rating: [],
        freebies: [],
        amenities: [],
    });

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
    };

    return (
        <div className="search-layout">
            <Header />
            <div className="search-container">
                {/* 🔍 검색바 영역 */}
                <div className="search-top-bar">
                    <SearchFilterWrap 
                        filters={filters} 
                        onFilterChange={handleFilterChange} 
                    />
                </div>
                <div className="search-content">
                    {/* 🧭 왼쪽 필터 사이드바 */}
                    <aside className="search-sidebar">
                        <FilterSidebar 
                            filters={filters} 
                            onFilterChange={handleFilterChange} 
                        />
                    </aside>
                    {/* 🏨 오른쪽 메인 (탭 + 정렬 + 호텔 리스트) */}
                    <main className="search-main">
                        <Outlet context={{ filters }} />
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SearchLayout;
