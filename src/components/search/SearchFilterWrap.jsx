import React from "react";
import "../../styles/components/search/SearchFilterWrap.scss";

const SearchFilterWrap = () => {
    return (
        <div className="search-bar-wrapper">
            <div className="search-bar inner">
                
                {/* Destination */}
                <div className="search-item">
                    <label>Enter Destination</label>
                    <div className="input-box">
                        <span className="icon">🏨</span>
                        <input
                            type="text"
                            placeholder="신라스테이 플러스, 서울"
                        />
                    </div>
                </div>

                {/* Check In */}
                <div className="search-item">
                    <label>Check In</label>
                    <div className="input-box">
                        <input type="date" defaultValue="2025-12-02" />
                    </div>
                </div>

                {/* Check Out */}
                <div className="search-item">
                    <label>Check Out</label>
                    <div className="input-box">
                        <input type="date" defaultValue="2025-12-04" />
                    </div>
                </div>

                {/* Rooms & Guests */}
                <div className="search-item">
                    <label>Rooms & Guests</label>
                    <div className="input-box">
                        <span className="icon">👤</span>
                        <select>
                            <option>1 room, 2 guests</option>
                            <option>1 room, 1 guest</option>
                            <option>2 rooms, 4 guests</option>
                        </select>
                    </div>
                </div>

                {/* Search Button */}
                <button className="search-button">
                    🔍
                </button>
            </div>
        </div>
    );
};

export default SearchFilterWrap;
