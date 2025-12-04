import React, { useState } from "react";
import "../../styles/components/search/HotelResultsHeader.scss";

const HotelResultsHeader = ({ total, showing }) => {
    const [open, setOpen] = useState(false);
    const [sortBy, setSortBy] = useState("Recommended");

    const options = ["Recommended", "Price: Low to High", "Price: High to Low", "Rating"];

    const handleSelect = (option) => {
        setSortBy(option);
        setOpen(false);
    };

    return (
        <div className="hotel-results-header">
            <div className="results-info">
                Showing <strong>{showing}</strong> of{" "}
                <strong className="total">{total} places</strong>
            </div>

            <div className="sort-area">
                <span className="label">Sort by</span>

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
