import React from "react";
import "../../styles/components/search/SearchFilterWrap.scss";

const SearchFilterWrap = () => {
    return (
        <div className="search-bar-wrapper">
            <div className="search-bar inner">
                
                {/* Destination */}
                <div className="search-item">
                    <label>호텔명 검색</label>
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
                    <label>체크인</label>
                    <div className="input-box">
                        <input type="date" defaultValue="2025-12-02" />
                    </div>
                </div>

                {/* Check Out */}
                <div className="search-item">
                    <label>체크아웃</label>
                    <div className="input-box">
                        <input type="date" defaultValue="2025-12-04" />
                    </div>
                </div>

                {/* Rooms & Guests */}
                <div className="search-item">
                    <label>객실 및 인원</label>
                    <div className="input-box">
                        <span className="icon">👤</span>
                        <select>
                            <option>1 객실, 2명</option>
                            <option>1 객실, 1명</option>
                            <option>2 객실, 4명</option>
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
