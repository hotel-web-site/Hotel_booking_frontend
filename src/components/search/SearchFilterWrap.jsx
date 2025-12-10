// src/components/search/SearchFilterWrap.jsx
import React, { useState, useEffect } from "react";
import "../../styles/components/search/SearchFilterWrap.scss";

const normalize = (s) => (s || "").toLowerCase().replace(/\s+/g, "");

const DEFAULT_GUESTS = { adults: 2, children: 0, total: 2 };

const SearchFilterWrap = ({ filters = {}, onFilterChange, onSearch, hotels = [] }) => {
    // 🔥 기본값 안전하게 세팅
    const [keyword, setKeyword] = useState(filters.destination || "");
    const [checkIn, setCheckIn] = useState(filters.checkIn || "");
    const [checkOut, setCheckOut] = useState(filters.checkOut || "");

    const initialGuests = filters.guests
        ? {
              adults: Number(filters.guests.adults) || 2,
              children: Number(filters.guests.children) || 0,
              total:
                  (Number(filters.guests.adults) || 2) +
                  (Number(filters.guests.children) || 0),
          }
        : DEFAULT_GUESTS;

    const [guests, setGuests] = useState(initialGuests);

    // ------------------------------------------
    // 🔥 guests.total 자동 계산 (NaN 절대 방지)
    // ------------------------------------------
    useEffect(() => {
        setGuests((prev) => ({
            ...prev,
            total: Number(prev.adults) + Number(prev.children),
        }));
    }, [guests.adults, guests.children]);

    // ------------------------------------------
    // filters 변경 시 동기화 (URL 반영 등)
    // ------------------------------------------
    useEffect(() => {
        setKeyword(filters.destination || "");
        setCheckIn(filters.checkIn || "");
        setCheckOut(filters.checkOut || "");

        if (filters.guests) {
            setGuests({
                adults: Number(filters.guests.adults) || 2,
                children: Number(filters.guests.children) || 0,
                total:
                    (Number(filters.guests.adults) || 2) +
                    (Number(filters.guests.children) || 0),
            });
        }
    }, [filters]);

    // ------------------------------------------
    // 🔍 검색 실행
    // ------------------------------------------
    const handleSearch = () => {
        const payload = {
            destination: keyword,
            checkIn,
            checkOut,
            guests,
        };

        onSearch?.(payload);

        // URL 파라미터 생성
        const params = new URLSearchParams();
        if (keyword) params.set("destination", keyword);
        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);

        params.set("adults", guests.adults);
        params.set("children", guests.children);
        params.set("guests", guests.total);

        window.history.replaceState(null, "", `?${params.toString()}`);
    };

    // ------------------------------------------
    // 자동완성
    // ------------------------------------------
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        const term = normalize(keyword);
        if (!term) return setSuggestions([]);

        const matches = hotels
            .filter((hotel) => normalize(hotel.name).includes(term))
            .slice(0, 5);

        setSuggestions(matches);
    }, [keyword, hotels]);

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
                                if (checkIn && e.target.value < checkIn) return;
                                setCheckOut(e.target.value);
                            }}
                        />
                    </div>
                </div>

                {/* 🔥 Guests - 성인/어린이 카운터 */}
                <div className="search-item">
                    <label>투숙객</label>

                    <div className="guest-counter">
                        {/* Adults */}
                        <div className="guest-row">
                            <span>성인</span>
                            <div className="counter">
                                <button
                                    onClick={() =>
                                        setGuests((prev) => ({
                                            ...prev,
                                            adults: Math.max(1, prev.adults - 1),
                                        }))
                                    }
                                >
                                    -
                                </button>
                                <span>{guests.adults}</span>
                                <button
                                    onClick={() =>
                                        setGuests((prev) => ({
                                            ...prev,
                                            adults: prev.adults + 1,
                                        }))
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Children */}
                        <div className="guest-row">
                            <span>어린이</span>
                            <div className="counter">
                                <button
                                    onClick={() =>
                                        setGuests((prev) => ({
                                            ...prev,
                                            children: Math.max(0, prev.children - 1),
                                        }))
                                    }
                                >
                                    -
                                </button>
                                <span>{guests.children}</span>
                                <button
                                    onClick={() =>
                                        setGuests((prev) => ({
                                            ...prev,
                                            children: prev.children + 1,
                                        }))
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 검색 버튼 */}
                <button className="search-button" onClick={handleSearch}>
                    🔍
                </button>
            </div>
        </div>
    );
};

export default SearchFilterWrap;
