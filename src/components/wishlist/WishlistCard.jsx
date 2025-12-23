import React from "react";
import "../../styles/components/wishlist/WishlistCard.scss";
import { useWishlistCard } from "./hooks/useWishlistCard";

const WishlistCard = ({ hotel, index, onRemove }) => {
    const { handleRemove, goToDetail } = useWishlistCard(hotel, onRemove);
    return (
        <div className="wishlist-card">
            <img
                src={hotel.images?.[0]}
                alt={hotel.name}
                className="wishlist-img"
            />
            <div className="wishlist-content">
                <div className="text-group">
                    <h3 className="hotel-name">{hotel.name}</h3>
                    <p className="hotel-location">{hotel.location}</p>
                    <div className="hotel-meta">
                        <span className="rating-box">
                            ⭐ {hotel.ratingAverage || hotel.rating}
                            <span className="rating-count">
                                ({hotel.reviewCount} 리뷰)
                            </span>
                        </span>
                        {hotel.price && (
                            <span className="price">
                                최저가 {hotel.price.toLocaleString()}원 / 1박
                            </span>
                        )}
                    </div>
                </div>
                <div className="button-row">
                    <button
                        className="view-btn"
                        onClick={goToDetail}
                    >
                        보러가기
                    </button>
                    <button className="remove-btn" onClick={handleRemove}>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistCard;
