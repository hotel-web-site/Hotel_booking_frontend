// src/pages/mypage/MyReviewsPage.jsx

import React from "react";
import "../../styles/mypage/MyReviewsPage.scss";
import ProfilePage from "./ProfilePage";
import useMyReviewsPage from "./hooks/useMyReviewsPage";

const MyReviewsPage = () => {
  const {
    coverImage,
    profileImage,
    displayName,
    user,
    reviews,
    loading,
    detailReview,
    formatDate,
    handleGoHotel,
    openDetail,
    closeDetail,
    renderStars,
  } = useMyReviewsPage();

  return (
    <div className="my-reviews-page">
      <ProfilePage
        activeTab="reviews"
        coverImage={coverImage}
        profileImage={profileImage}
        name={displayName}
        email={user.email}
      />

      <div className="reviews-wrapper">
        <h2 className="title">내가 작성한 리뷰</h2>

        {loading ? (
          <div className="empty">리뷰를 불러오는 중입니다...</div>
        ) : reviews.length === 0 ? (
          <div className="empty">아직 작성한 리뷰가 없습니다.</div>
        ) : (
          <ul className="my-review-list">
            {reviews.map((review) => (
              <li
                key={review.id || review._id}
                className="my-review-item"
                onClick={() => handleGoHotel(review)}
              >
                <div className="top-row">
                  <div className="hotel-info">
                    <span className="hotel-name">
                      {review.hotel?.name || review.hotelName || `숙소 정보 없음`}
                    </span>
                  </div>
                  <button className="detail-btn" onClick={(e) => openDetail(e, review)}>
                    리뷰 자세히 보기
                  </button>
                </div>
                <div className="meta-row">
                  <span className="created-at">
                    작성일: {formatDate(review.date || review.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 모달 레이아웃 유지 */}
      {detailReview && (
        <div className="review-detail-overlay" onClick={closeDetail}>
          <div className="review-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="detail-title">리뷰 상세</h3>
            <div className="detail-hotel">{detailReview.hotel?.name || "숙소 정보"}</div>
            <div className="detail-stars">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span key={idx} className={idx < (renderStars(detailReview.rating).full) ? "star filled" : "star"}>★</span>
              ))}
              <span className="detail-score">{renderStars(detailReview.rating).value.toFixed(1)}</span>
            </div>
            <div className="detail-comment-box">
              <p>{detailReview.comment}</p>
            </div>
            <div className="detail-date">
              작성일: {formatDate(detailReview.date || detailReview.createdAt)}
            </div>
            <button className="detail-close-btn" onClick={closeDetail}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;