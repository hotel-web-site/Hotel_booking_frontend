import React, { useMemo } from "react";
import "../../styles/components/search/HotelTypesTabs.scss";

// ⭐ Props로 상태와 함수를 받아옵니다.
const HotelTypesTabs = ({ hotels = [], activeTab, setActiveTab }) => {

    const counts = useMemo(() => {
        if (!hotels || hotels.length === 0) return { hotels: 0, motels: 0, resorts: 0 };

        return {
            hotels: hotels.filter(h =>
                (h.type === "호텔" || h.category === "hotel" || h.type === "hotel")
            ).length,
            motels: hotels.filter(h =>
                (h.type === "모텔" || h.category === "motel" || h.type === "motel")
            ).length,
            resorts: hotels.filter(h =>
                (h.type === "리조트" || h.category === "resort" || h.type === "resort")
            ).length
        };
    }, [hotels]);

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
                    // ⭐ 클릭 시 부모의 setActiveTab 호출
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