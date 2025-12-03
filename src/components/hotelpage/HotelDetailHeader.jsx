import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaHeart, FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/components/hotelpage/HotelDetailHeader.scss";

const HotelDetailHeader = ({ hotel }) => {
    if (!hotel) {
        return <div className="hotel-detail-header loading">Loading...</div>;
    }
    const navigate = useNavigate();

    const {
        name = "호텔명 없음",
        ratingAverage = 0,
        ratingCount = 0,
        address = "주소 정보 없음",
        images = [],
        city = "",
        location = "",
    } = hotel;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={i < fullStars ? "star-filled" : "star-empty"}
                />
            );
        }
        return stars;
    };

    const handleBookNow = () => {
    navigate(`/booking/${hotel._id || hotel.id}`);
};


    return (
        <div className="hotel-detail-header">
            {/* breadcrumb */}
            <div className="header-top">
                <div className="breadcrumb">
                    <span>{city}</span> &gt; <span>{location}</span> &gt; <span>{name}</span>
                </div>
            </div>
            {/* 메인 정보 라인 */}
            <div className="hotel-info">
                {/* 왼쪽 호텔 정보 */}
                <div className="hotel-title-section">
                    <h1 className="hotel-name">{name}</h1>

                    <div className="rating-section">
                        <div className="stars">{renderStars(ratingAverage)}</div>
                        <span className="rating-text">{ratingAverage} Star Hotel</span>
                    </div>

                    <div className="location-section">
                        <FaMapMarkerAlt className="location-icon" />
                        <span className="address">{address}</span>
                    </div>

                    <div className="review-section">
                        <span className="review-score">{ratingAverage}</span>
                        <span className="review-text">Very Good</span>
                        <span className="review-count">{ratingCount} reviews</span>
                    </div>
                </div>

                {/* 오른쪽 가격 + 버튼 */}
                <div className="price-actions-wrap">
                    <div className="price-section">
                        <span className="price">
                            ₩{(hotel.basePrice ?? hotel.price ?? 0).toLocaleString()}
                        </span>
                        <span className="price-unit">/night</span>
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn">
                            <FaHeart />
                        </button>
                        <button className="icon-btn">
                            <FaShare />
                        </button>

                        <button className="book-top-btn" onClick={handleBookNow}>
                            Book now
                        </button>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default HotelDetailHeader;
