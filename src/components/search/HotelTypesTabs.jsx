import React, { useState } from "react";
import "../../styles/components/search/HotelTypesTabs.scss";

const HotelTypesTabs = () => {
    const [activeTab, setActiveTab] = useState("hotels");

    const tabs = [
        { id: "hotels", label: "호텔", count: 257 },
        { id: "motels", label: "모텔", count: 51 },
        { id: "resorts", label: "리조트", count: 72 },
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
