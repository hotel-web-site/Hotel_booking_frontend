import React, { useState, useEffect } from "react";
import "../../styles/components/search/SearchFilterWrap.scss";

const normalize = (s) => (s || "").toLowerCase().replace(/\s+/g, "");

const DEFAULT_GUESTS = { adults: 2, children: 0, total: 2 };

const SearchFilterWrap = ({ filters = {}, onFilterChange, onSearch, hotels = [] }) => {
    // 1. 상태 선언 (기존 구조 유지)
    const [keyword, setKeyword] = useState(filters.destination || "");
    const [checkIn, setCheckIn] = useState(filters.checkIn || "");
    const [checkOut, setCheckOut] = useState(filters.checkOut || "");
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    // 2. 인원수 상태 (안전한 초기값 설정)
    const [guests, setGuests] = useState(() => {
        if (filters.guests) {
            const a = Number(filters.guests.adults) || 2;
            const c = Number(filters.guests.children) || 0;
            return { adults: a, children: c, total: a + c };
        }
        return DEFAULT_GUESTS;
    });

    // 3. 인원 변경 시 total 자동 계산 및 부모에 즉시 알림
    useEffect(() => {
        const total = Number(guests.adults) + Number(guests.children);
        if (guests.total !== total) {
            const updatedGuests = { ...guests, total };
            setGuests(updatedGuests);
            // 필터가 변경되었음을 부모에게 알림 (사이드바 등과 동기화)
            onFilterChange?.("guests", updatedGuests);
        }
    }, [guests.adults, guests.children, onFilterChange]);

    // 4. 외부 filters 변경 시 동기화 (URL 파라미터나 초기화 버튼 대응)
    useEffect(() => {
        setKeyword(filters.destination || "");
        setCheckIn(filters.checkIn || "");
        setCheckOut(filters.checkOut || "");
        if (filters.guests) {
            setGuests({
                adults: Number(filters.guests.adults) || 2,
                children: Number(filters.guests.children) || 0,
                total: (Number(filters.guests.adults) || 2) + (Number(filters.guests.children) || 0)
            });
        }
    }, [filters]);

    // 5. 검색 실행 함수
    const handleSearch = () => {
        const payload = {
            destination: keyword,
            checkIn,
            checkOut,
            guests,
        };

        onSearch?.(payload);

        // URL 업데이트 (기존 로직 유지)
        const params = new URLSearchParams();
        if (keyword) params.set("destination", keyword);
        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);
        params.set("adults", guests.adults);
        params.set("children", guests.children);
        params.set("guests", guests.total);

        window.history.replaceState(null, "", `?${params.toString()}`);
    };

    // 6. 자동완성 로직 (기존 유지)
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
            setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        }
        if (e.key === "ArrowUp") {
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }
    };

    return (
        <div className="search-bar-wrapper">
            <div className="search-bar inner">
                {/* Destination: 기존 마크업 보존 */}
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
                                            // 선택 즉시 검색 실행 로직 유지
                                            setTimeout(handleSearch, 0);
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
                            onChange={(e) => {
                                setCheckIn(e.target.value);
                                onFilterChange?.("checkIn", e.target.value);
                            }}
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
                                onFilterChange?.("checkOut", e.target.value);
                            }}
                        />
                    </div>
                </div>

                {/* Guests - 성인/어린이 카운터: 기존 마크업 보존 */}
                <div className="search-item">
                    <label>투숙객</label>
                    <div className="guest-counter">
                        <div className="guest-row">
                            <span>성인</span>
                            <div className="counter">
                                <button onClick={() => setGuests(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}>-</button>
                                <span>{guests.adults}</span>
                                <button onClick={() => setGuests(p => ({ ...p, adults: p.adults + 1 }))}>+</button>
                            </div>
                        </div>

                        <div className="guest-row">
                            <span>어린이</span>
                            <div className="counter">
                                <button onClick={() => setGuests(p => ({ ...p, children: Math.max(0, p.children - 1) }))}>-</button>
                                <span>{guests.children}</span>
                                <button onClick={() => setGuests(p => ({ ...p, children: p.children + 1 }))}>+</button>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="search-button" onClick={handleSearch}>
                    🔍
                </button>
            </div>
        </div>
    );
};

export default SearchFilterWrap;