import React from "react";
import "../../styles/components/ranking/RankingList.scss";
import { useRankingList } from "./hooks/useRankingList";

const RankingList = ({ hotels }) => {
    const { sorted, goToHotel } = useRankingList(hotels);
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
                            onClick={() => goToHotel(hotel.id)}
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
