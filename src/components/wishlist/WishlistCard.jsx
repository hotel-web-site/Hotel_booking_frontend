import React from "react";
import "../../styles/components/wishlist/WishlistCard.scss";
import { useNavigate } from "react-router-dom";
import { removeFromWishlist } from "../../util/wishlistService";

const WishlistCard = ({ hotel, onRemove }) => {
    const navigate = useNavigate();

    const handleRemove = () => {
        const id = hotel._id || hotel.id;
        removeFromWishlist(id);

        if (onRemove) onRemove(id);
    };

    return (
        <div className="wishlist-card">
            {/* 이미지 */}
            <div className="image-wrap">
                <img src={hotel.images?.[0]} alt={hotel.name} />
                <span className="badge">{hotel.images?.length} images</span>
            </div>

            {/* 오른쪽 정보 */}
            <div className="content">
                <h3 className="name">{hotel.name}</h3>
                <p className="location">{hotel.location}</p>

                {/* 별점 */}
                <div className="rating">
                    ⭐ {hotel.rating} · {hotel.reviewCount} 리뷰
                </div>

                {/* ⭐ 버튼 두 개 추가된 부분 */}
                <div className="button-row">
                    <button
                        className="view-btn"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
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
