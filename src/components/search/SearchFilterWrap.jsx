import React from "react";
import "../../styles/components/search/SearchFilterWrap.scss";
import { useSearchFilterWrap } from "./hooks/useSearchFilterWrap";

const SearchFilterWrap = ({ filters = {}, onFilterChange, onSearch, hotels = [] }) => {
    const {
        keyword, setKeyword,
        checkIn, setCheckIn,
        checkOut, setCheckOut,
        guests, setGuests,
        suggestions, setSuggestions,
        activeIndex, setActiveIndex,
        handleSearch, handleKeyDown
    } = useSearchFilterWrap({ filters, onFilterChange, onSearch, hotels });

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