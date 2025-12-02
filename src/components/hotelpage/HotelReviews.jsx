import React from "react";
import "../../styles/components/hotelpage/HotelReviews.scss";

import {
    renderStars,
    getRatingLabel,
    calculateAverageRating,
} from "../../util/reviewHelper";

const HotelReviews = ({
    hotelId,
    rating,
    reviewCount,
    createReview,
    updateReview,
    deleteReview,
    reviews = [],
    getReviews,
}) => {
    // ⭐ 평균 평점 계산 (문자열 방지)
    const rawAvg = calculateAverageRating(reviews);
    const avgRating = Number(rawAvg) || 0;
    const avgLabel = getRatingLabel(avgRating);
    const verifiedCount = reviewCount || reviews.length;

    return (
        <div className="hotel-reviews">
            {/* 상단 타이틀 + 버튼 */}
            <div className="header-row">
                <h3 className="reviews-title">Reviews</h3>
                <button className="give-review-btn">Give your review</button>
            </div>

            {/* 평균 평점 영역 */}
            <div className="avg-row">
                <div className="avg-score">{avgRating.toFixed(1)}</div>

                <div className="avg-meta">
                    <div className="avg-label">{avgLabel}</div>
                    <div className="avg-count">{verifiedCount} verified reviews</div>
                </div>
            </div>

            {/* 리뷰 리스트 */}
            <ul className="review-list">
                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => {
                        const label = getRatingLabel(review.rating);
                        const created =
                            review.createdAt || review.date || new Date().toISOString();

                        return (
                            <li key={review.id} className="review-item">
                                {/* 왼쪽: 프로필 + 내용 */}
                                <div className="review-main">
                                    <div className="profile-image">
                                        <img
                                            src="https://via.placeholder.com/40"
                                            alt={review.userId?.name || "익명"}
                                        />
                                    </div>

                                    <div className="review-content">
                                        <div className="review-header">
                                            <span className="review-score">
                                                {Number(review.rating).toFixed(1)}
                                            </span>
                                            <span className="review-label">{label}</span>
                                            <span className="review-author">
                                                {review.userId?.name || "익명"}
                                            </span>
                                        </div>

                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                </div>

                                {/* 오른쪽 깃발 아이콘 */}
                                <button
                                    type="button"
                                    className="flag-btn"
                                    aria-label="Report review"
                                >
                                    ⚑
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <li className="no-review">리뷰가 없습니다.</li>
                )}
            </ul>

            {/* 하단 페이지네이션 */}
            <div className="review-pagination">
                <button className="page-arrow" disabled>
                    ◀
                </button>
                <span className="page-text">1 of 40</span>
                <button className="page-arrow">▶</button>
            </div>
        </div>
    );
};

export default HotelReviews;
