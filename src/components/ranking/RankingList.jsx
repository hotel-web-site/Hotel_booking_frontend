import React from "react";
import "../../styles/components/ranking/RankingList.scss";
import { useRankingList } from "./hooks/useRankingList";

const RankingList = ({ hotels = [] }) => {
    const { sorted, goToHotel } = useRankingList(hotels);

    if (sorted.length === 0) {
        return <div className="ranking-list empty">표시할 랭킹이 없습니다.</div>;
    }

    return (
        <div className="ranking-list">
            {sorted.map((hotel, index) => (
                <div className="ranking-card" key={hotel.id || hotel._id}>
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
                                    ⭐ {hotel.ratingAverage}
                                    <span className="rating-count">
                                        ({hotel.ratingCount || 0} 리뷰)
                                    </span>
                                </span>

                                <span className="price">
                                    최저가{" "}
                                    {(hotel.price ?? 0).toLocaleString()}원 / 1박
                                </span>
                            </div>
                        </div>

                        <button
                            className="go-book-btn"
                            onClick={() => goToHotel(hotel.id || hotel._id)}
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
