import React from "react";
import "../../styles/components/search/HotelTypesTabs.scss";
import { useHotelTypesTabs } from "./hooks/useHotelTypesTabs";

const HotelTypesTabs = ({ hotels = [], activeTab, setActiveTab }) => {
    const { counts } = useHotelTypesTabs(hotels);
    const tabs = [
        { id: "hotels", label: "호텔", count: counts.hotels },
        { id: "motels", label: "모텔", count: counts.motels },
        { id: "resorts", label: "리조트", count: counts.resorts },
    ];
    return (
        <div className="hotel-types-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span className="tab-label">{tab.label}</span>
                    <span className="tab-count">{tab.count}개</span>
                </button>
            ))}
        </div>
    );
};

export default HotelTypesTabs;