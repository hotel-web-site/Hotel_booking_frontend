import React from "react";
import "../../styles/components/search/HotelResultsHeader.scss";
import { useHotelResultsHeader } from "./hooks/useHotelResultsHeader";

const HotelResultsHeader = ({ total, showing, onSort }) => {
    const { open, sortBy, options, handleSelect, handleDropdown } = useHotelResultsHeader(onSort);
    return (
        <div className="hotel-results-header">
            <div className="results-info">
                총 <strong>{total}</strong>개 중{" "}
                <strong>{showing}</strong>개 표시
            </div>

            <div className="sort-area">
                <span className="label">정렬</span>

                <div className="dropdown" onClick={handleDropdown}>
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
