import React, { useState } from "react";
import "../../styles/components/search/HotelResultsHeader.scss";

const HotelResultsHeader = ({ total, showing }) => {
    const [open, setOpen] = useState(false);
    const [sortBy, setSortBy] = useState("추천순");

    const options = ["추천순", "가격 낮은순", "가격 높은순", "평점순"];

    const handleSelect = (option) => {
        setSortBy(option);
        setOpen(false);
    };

    return (
        <div className="hotel-results-header">
            <div className="results-info">
                총 <strong>{total}</strong>개 중 <strong>{showing}</strong>개 표시
            </div>

            <div className="sort-area">
                <span className="label">정렬</span>

                <div className="dropdown" onClick={() => setOpen(!open)}>
                    {sortBy}
                    <span className="arrow">▾</span>

                    {open && (
                        <ul className="dropdown-menu">
                            {options.map((opt) => (
                                <li key={opt} onClick={() => handleSelect(opt)}>
                                    {opt}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HotelResultsHeader;
