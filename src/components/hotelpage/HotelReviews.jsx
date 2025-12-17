import React, { useState } from "react";
import "../../styles/components/hotelpage/HotelReviews.scss";
import ReviewModal from "./ReviewModal";

import {
  getRatingLabel,
  calculateAverageRating,
} from "../../util/reviewHelper";

const HotelReviews = ({
  hotelId,
  createReview,
  updateReview,
  deleteReview,
  reviews = [],
  getReviews,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ⭐ 페이지네이션 상태 */
  const reviewsPerPage = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const start = (page - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(start, start + reviewsPerPage);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  /* ✅ 리뷰 작성 처리 */
  const handleSubmitReview = async (reviewData) => {
    const payload = {
      ...reviewData,
      hotelId: reviewData.hotelId ?? hotelId,
    };

    await createReview(payload);
    await getReviews();     // 리뷰 목록 갱신
    setPage(1);             // 최신 리뷰가 보이도록
    closeModal();

    alert(
      "리뷰 작성이 완료되었습니다.\n마이페이지 → 내 리뷰에서 확인하실 수 있습니다."
    );
  };

  /* ⭐ 평균 평점 + 라벨 */
  const avgRating = Number(calculateAverageRating(reviews)) || 0;
  const avgLabel = getRatingLabel(avgRating);

  /* ✅ 리뷰 개수는 실제 배열 기준 */
  const verifiedCount = reviews.length;

  return (
    <div className="hotel-reviews">
      {/* 헤더 */}
      <div className="header-row">
        <h3 className="reviews-title">리뷰</h3>
        <button className="give-review-btn" onClick={openModal}>
          리뷰 작성하기
        </button>
      </div>

      {/* 평균 평점 */}
      <div className="avg-row">
        <div className="avg-score">{avgRating.toFixed(1)}</div>
        <div className="avg-meta">
          <div className="avg-label">{avgLabel}</div>
          <div className="avg-count">{verifiedCount}개 인증 리뷰</div>
        </div>
      </div>

      {/* 리뷰 리스트 */}
      <ul className="review-list">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => {
            const label = getRatingLabel(review.rating);

            return (
              <li key={review.id} className="review-item">
                <div className="review-main">
                  <div className="profile-image">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="profile"
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

                <button type="button" className="flag-btn">
                  ⚑
                </button>
              </li>
            );
          })
        ) : (
          <li className="no-review">리뷰가 없습니다.</li>
        )}
      </ul>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="review-pagination">
          <button
            className="page-arrow"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ◀
          </button>

          <span className="page-text">
            {page} / {totalPages}
          </span>

          <button
            className="page-arrow"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            ▶
          </button>
        </div>
      )}

      {/* 리뷰 작성 모달 */}
      {isModalOpen && (
        <ReviewModal
          closeModal={closeModal}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default HotelReviews;
