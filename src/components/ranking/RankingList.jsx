// src/components/ranking/RankingList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/ranking/RankingList.scss";

const sortHotels = (hotels) => {
    return [...hotels]
        .sort((a, b) => {
            if (b.ratingAverage !== a.ratingAverage)
                return b.ratingAverage - a.ratingAverage;

            return (b.ratingCount || 0) - (a.ratingCount || 0);
        })
        .slice(0, 10);
};

const RankingList = ({ hotels }) => {
    const sorted = sortHotels(hotels);
    const navigate = useNavigate();

    return (
        <div className="ranking-list">
            {sorted.map((hotel, index) => (
                <div className="ranking-card" key={hotel.id}>
                    <div className="rank-badge">#{index + 1}</div>

                    <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="hotel-img"
                    />

                    <div className="hotel-content">
                        <div className="hotel-text">
                            <h3 className="hotel-name">{hotel.name}</h3>
                            <p className="hotel-location">{hotel.location}</p>

                            <div className="hotel-meta">
                                <span className="rating-box">
                                    ⭐ {hotel.ratingAverage}{" "}
                                    <span className="rating-count">
                                        ({hotel.ratingCount} 리뷰)
                                    </span>
                                </span>
                                <span className="price">
                                    최저가 {hotel.price.toLocaleString()}원 / 1박
                                </span>
                            </div>
                        </div>

                        <button
                            className="go-book-btn"
                            onClick={() => navigate(`/hotels/${hotel.id}`)}
                        >
                            예약하러가기
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RankingList;
