// src/components/search/SearchFilterWrap.jsx
import React, { useState, useEffect } from "react";
import "../../styles/components/search/SearchFilterWrap.scss";

const normalize = (s) =>
    (s || "").toLowerCase().replace(/\s+/g, "");

const SearchFilterWrap = ({ filters, onFilterChange, onSearch, hotels = [] }) => {
    const [keyword, setKeyword] = useState(filters.destination || "");
    const [checkIn, setCheckIn] = useState(filters.checkIn || "");
    const [checkOut, setCheckOut] = useState(filters.checkOut || "");
    const [guestOption, setGuestOption] = useState(filters.guests || { rooms: 1, guests: 2 });

    // ⭐ 자동완성 상태
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    // 날짜 변경 시 상위 필터 반영
    useEffect(() => {
        if (onFilterChange) onFilterChange("checkIn", checkIn);
    }, [checkIn]);

    useEffect(() => {
        if (onFilterChange) onFilterChange("checkOut", checkOut);
    }, [checkOut]);

    // 🔍 검색 실행
    const handleSearch = () => {
        if (onSearch) {
            onSearch({
                destination: keyword,
                checkIn,
                checkOut,
                guests: guestOption,
            });
        }
        setSuggestions([]);
    };

    // 자동완성 업데이트
    useEffect(() => {
        const term = normalize(keyword);

        if (!term) {
            setSuggestions([]);
            return;
        }

        const matches = hotels
            .filter((hotel) => normalize(hotel.name).includes(term))
            .slice(0, 5);

        setSuggestions(matches);
        setActiveIndex(-1);
    }, [keyword, hotels]);

    // ⌨ Enter / Arrow navigation
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                const selectedName = suggestions[activeIndex].name;
                setKeyword(selectedName);
                onFilterChange?.("destination", selectedName);
                setSuggestions([]);
                handleSearch();
            } else {
                handleSearch();
            }
        }

        if (e.key === "ArrowDown") {
            setActiveIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        }

        if (e.key === "ArrowUp") {
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }
    };

    return (
        <div className="search-bar-wrapper">
            <div className="search-bar inner">

                {/* Destination */}
                <div className="search-item">
                    <label>호텔명 검색</label>

                    <div className="input-box autocomplete-wrapper">
                        <span className="icon">🏨</span>

                        <input
                            type="text"
                            placeholder="신라스테이 플러스, 서울"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                onFilterChange?.("destination", e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                        />

                        {/* 🔥 자동완성 리스트 */}
                        {suggestions.length > 0 && (
                            <ul className="autocomplete-list">
                                {suggestions.map((hotel, idx) => (
                                    <li
                                        key={hotel.id}
                                        className={idx === activeIndex ? "active" : ""}
                                        onMouseDown={() => {
                                            setKeyword(hotel.name);
                                            onFilterChange?.("destination", hotel.name);
                                            setSuggestions([]);
                                            handleSearch();
                                        }}
                                    >
                                        {hotel.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Check In */}
                <div className="search-item">
                    <label>체크인</label>
                    <div className="input-box">
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                {/* Check Out */}
                <div className="search-item">
                    <label>체크아웃</label>
                    <div className="input-box">
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => {
                                // 체크아웃이 체크인보다 빠를 경우 자동 교정
                                if (checkIn && e.target.value < checkIn) return;
                                setCheckOut(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                {/* Guests */}
                <div className="search-item">
                    <label>객실 및 인원</label>
                    <div className="input-box">
                        <span className="icon">👤</span>
                        <select
                            value={`${guestOption.rooms}-${guestOption.guests}`}
                            onChange={(e) => {
                                const [rooms, guests] = e.target.value.split("-");
                                const newValue = {
                                    rooms: Number(rooms),
                                    guests: Number(guests),
                                };
                                setGuestOption(newValue);
                                onFilterChange?.("guests", newValue);
                            }}
                        >
                            <option value="1-2">1 객실, 2명</option>
                            <option value="1-1">1 객실, 1명</option>
                            <option value="2-4">2 객실, 4명</option>
                        </select>
                    </div>
                </div>

                {/* Search Button */}
                <button className="search-button" onClick={handleSearch}>
                    🔍
                </button>
            </div>
        </div>
    );
};

export default SearchFilterWrap;
