import React, { useState } from "react";
import "../../styles/components/hotelpage/Amenities.scss";

const Amenities = ({ amenities = [] }) => {
    const [showAll, setShowAll] = useState(false);

    // 아이콘 매핑
    const getAmenityIcon = (amenity) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes("pool") || amenityLower.includes("수영장"))
            return "🏊";
        if (amenityLower.includes("spa") || amenityLower.includes("스파"))
            return "💆";
        if (amenityLower.includes("wifi") || amenityLower.includes("와이파이"))
            return "📶";
        if (
            amenityLower.includes("fitness") ||
            amenityLower.includes("피트니스") ||
            amenityLower.includes("헬스")
        )
            return "💪";
        if (
            amenityLower.includes("restaurant") ||
            amenityLower.includes("레스토랑") ||
            amenityLower.includes("식당")
        )
            return "🍽️";
        if (amenityLower.includes("bar") || amenityLower.includes("바")) return "🍸";
        if (amenityLower.includes("parking") || amenityLower.includes("주차"))
            return "🅿️";
        if (
            amenityLower.includes("room service") ||
            amenityLower.includes("룸서비스")
        )
            return "🛎️";
        if (
            amenityLower.includes("coffee") ||
            amenityLower.includes("tea") ||
            amenityLower.includes("커피")
        )
            return "☕";
        if (amenityLower.includes("lounge") || amenityLower.includes("라운지"))
            return "🛋️";
        if (amenityLower.includes("garden") || amenityLower.includes("정원"))
            return "🌳";
        if (amenityLower.includes("bbq") || amenityLower.includes("바비큐"))
            return "🍖";
        if (amenityLower.includes("bike") || amenityLower.includes("자전거"))
            return "🚴";
        return "✓";
    };

    const displayedAmenities = showAll ? amenities : amenities.slice(0, 10);
    const hasMore = amenities.length > 10;

    return (
        <div className="amenities">
            <h3 className="amenities-title">편의시설</h3>

            <div className="amenities-grid">
                {displayedAmenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                        <span className="amenity-icon">{getAmenityIcon(amenity)}</span>
                        <span className="amenity-name">{amenity}</span>
                    </div>
                ))}
            </div>

            {hasMore && (
                <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "접기" : `+${amenities.length - 10}개 더보기`}
                </button>
            )}
        </div>

    );
};

export default Amenities;
