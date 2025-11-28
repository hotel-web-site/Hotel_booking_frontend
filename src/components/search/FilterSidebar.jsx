import React, { useState } from "react";
import "../../styles/components/search/FilterSidebar.scss";

const FilterSidebar = () => {
    const [open, setOpen] = useState({
        price: true,
        rating: true,
        freebies: true,
        amenities: true,
    });

    const toggle = (key) => {
        setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <aside className="filter-sidebar">
            <h3 className="filter-title">Filters</h3>

            {/* PRICE */}
            <div className="filter-box">
                <div className="filter-header" onClick={() => toggle("price")}>
                    <h4>Price</h4>
                    <span className={`arrow ${open.price ? "open" : ""}`}>⌃</span>
                </div>

                <div className={`filter-body ${open.price ? "show" : ""}`}>
                    <input type="range" min="50" max="1200" className="price-slider" />

                    <div className="price-labels">
                        <span>$50</span>
                        <span>$1200</span>
                    </div>
                </div>
            </div>

            {/* RATING */}
            <div className="filter-box">
                <div className="filter-header" onClick={() => toggle("rating")}>
                    <h4>Rating</h4>
                    <span className={`arrow ${open.rating ? "open" : ""}`}>⌃</span>
                </div>

                <div className={`filter-body ${open.rating ? "show" : ""}`}>
                    <div className="rating-options">
                        <button>0+</button>
                        <button>1+</button>
                        <button>2+</button>
                        <button>3+</button>
                        <button>4+</button>
                    </div>
                </div>
            </div>

            {/* FREEBIES */}
            <div className="filter-box">
                <div className="filter-header" onClick={() => toggle("freebies")}>
                    <h4>Freebies</h4>
                    <span className={`arrow ${open.freebies ? "open" : ""}`}>⌃</span>
                </div>

                <div className={`filter-body ${open.freebies ? "show" : ""}`}>
                    <div className="checkbox-list">
                        <label><input type="checkbox" /> 조식포함</label>
                        <label><input type="checkbox" /> 무료주차</label>
                        <label><input type="checkbox" /> WIFI</label>
                        <label><input type="checkbox" /> 공항셔틀버스</label>
                        <label><input type="checkbox" /> 무료취소</label>
                    </div>
                </div>
            </div>

            {/* AMENITIES */}
            <div className="filter-box">
                <div className="filter-header" onClick={() => toggle("amenities")}>
                    <h4>Amenities</h4>
                    <span className={`arrow ${open.amenities ? "open" : ""}`}>⌃</span>
                </div>

                <div className={`filter-body ${open.amenities ? "show" : ""}`}>
                    <div className="checkbox-list">
                        <label><input type="checkbox" /> 24시 프론트데스크</label>
                        <label><input type="checkbox" /> 에어컨</label>
                        <label><input type="checkbox" /> 피트니스</label>
                        <label><input type="checkbox" /> 수영장</label>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
