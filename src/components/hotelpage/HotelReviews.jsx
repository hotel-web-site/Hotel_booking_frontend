import React, { useState } from "react";
import "../../styles/components/hotelpage/HotelReviews.scss";
import ReviewModal from "./ReviewModal";
import { getRatingLabel, calculateAverageRating, renderStars } from "../../util/reviewHelper";

const HotelReviews = ({ hotelId, createReview, reviews = [], getReviews }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const reviewsPerPage = 5;

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const totalCount = safeReviews.length;
  const avgRating = calculateAverageRating(safeReviews);
  const avgLabel = getRatingLabel(avgRating, totalCount);

  const totalPages = Math.ceil(totalCount / reviewsPerPage) || 1;
  const currentReviews = safeReviews.slice((page - 1) * reviewsPerPage, page * reviewsPerPage);

  const handleSubmitReview = async (reviewData) => {
    try {
      // 1. 서버에 리뷰 등록
      await createReview(hotelId, reviewData.rating, reviewData.comment);

      // 2. 부모 컴포넌트의 데이터 갱신 (ID 전달)
      if (getReviews) await getReviews(hotelId);

      setPage(1); // 첫 페이지로 이동
      setIsModalOpen(false);
      alert("리뷰가 등록되었습니다!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="hotel-reviews">
      <div className="header-row">
        <h3 className="reviews-title">리뷰 {totalCount}개</h3>
        <button className="give-review-btn" onClick={() => setIsModalOpen(true)}>
          {totalCount === 0 ? "첫 리뷰 작성하기" : "리뷰 작성하기"}
        </button>
      </div>

      {avgRating !== null ? (
        <div className="avg-row">
          <div className="avg-score">{avgRating.toFixed(1)}</div>
          <div className="avg-meta">
            <div className="avg-label">{avgLabel}</div>
            <div className="avg-count">{totalCount}개 인증 리뷰</div>
          </div>
        </div>
      ) : (
        <div className="no-review-summary">아직 평점이 없습니다. 첫 리뷰를 기다리고 있어요!</div>
      )}

      <ul className="review-list">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <li key={review._id || review.id} className="review-item">
              <div className="review-main">
                <div className="profile-image">
                  <img
                    src={review.userId?.profileImage || "https://placehold.co/40"}
                    alt="user"
                    onError={(e) => { e.target.src = "https://placehold.co/40"; }}
                  />
                </div>
                <div className="review-content">
                  <div className="review-header">
                    <span className="review-stars" style={{ color: "#ffc107" }}>
                      {renderStars(review.rating)}
                    </span>
                    <span className="review-author">{review.userId?.name || review.userName || "익명"}</span>
                    {/* 날짜 표시가 필요한 경우 추가 */}
                    {(review.createdAt || review.date) && (
                      <span className="review-date">
                        {new Date(review.createdAt || review.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              </div>
              <button type="button" className="flag-btn">⚑</button>
            </li>
          ))
        ) : (
          <li className="no-review-item">작성된 리뷰가 없습니다.</li>
        )}
      </ul>

      {/* 페이지네이션 UI (레이아웃 유지) */}
      {totalPages > 1 && (
        <div className="review-pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>◀</button>
          <span className="page-text">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>▶</button>
        </div>
      )}

      {isModalOpen && (
        <ReviewModal
          closeModal={() => setIsModalOpen(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default HotelReviews;