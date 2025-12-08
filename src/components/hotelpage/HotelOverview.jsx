import React from "react";
import {
    FaStar,
    FaTree,
    FaGlassMartini,
    FaTheaterMasks,
    FaBroom,
} from "react-icons/fa";
import "../../styles/components/hotelpage/HotelOverview.scss";

const HotelOverview = ({ description, rating, reviewCount, tags = [] }) => {
    // 태그에 따른 아이콘 매핑
    const tagIcons = {
        park: { icon: <FaTree />, label: "공원 근처" },
        nightlife: { icon: <FaGlassMartini />, label: "나이트라이프 근처" },
        theater: { icon: <FaTheaterMasks />, label: "극장 근처" },
        clean: { icon: <FaBroom />, label: "청결한 호텔" },
        luxury: { icon: <FaStar />, label: "럭셔리" },
        beach: { icon: <FaTree />, label: "해변 근처" },
        family: { icon: <FaStar />, label: "가족 친화적" },
    };

    // 평점 텍스트 변환
    const getRatingText = (rating) => {
        if (rating >= 4.5) return "최고";
        if (rating >= 4.0) return "아주 좋음";
        if (rating >= 3.5) return "좋음";
        if (rating >= 3.0) return "보통";
        return "평균";
    };

    return (
        <div className="hotel-overview">
            <h2 className="overview-title">호텔 개요</h2>

            <div className="overview-features">
                {/* 평점 카드 */}
                <div className="feature-card rating-card">
                    <div className="rating-score">{rating?.toFixed(1) || "N/A"}</div>
                    <div className="rating-label">{getRatingText(rating)}</div>
                    <div className="review-count">{reviewCount || 0}개 리뷰</div>
                </div>

                {/* 태그/특징 카드들 */}
                {tags.slice(0, 4).map((tag, index) => {
                    const tagKey = tag.toLowerCase();
                    const tagData = tagIcons[tagKey] || { icon: <FaStar />, label: tag };

                    return (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{tagData.icon}</div>
                            <div className="feature-label">{tagData.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* 호텔 설명 */}
            <div className="overview-description">
                <p>{description || "호텔 설명이 없습니다."}</p>
            </div>
        </div>
    );
};

export default HotelOverview;
