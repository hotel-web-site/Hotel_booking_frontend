// src/pages/mypage/MyReviewsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/mypage/MyReviewsPage.scss";
import ProfilePage from "./ProfilePage";
import { getMyReviews } from "../../api/reviewClient";

const MyReviewsPage = () => {
  const navigate = useNavigate();

  // 유저 정보 상태
  const [user, setUser] = useState({ id: null, name: "", nickname: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // 리뷰 리스트 및 로딩 상태
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailReview, setDetailReview] = useState(null);

  // 1. localStorage에서 유저 정보 로드
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser({
          id: u._id || u.id || null,
          name: u.name || "",
          nickname: u.nickname || "",
          email: u.email || "",
        });
        if (u.profileImage) setProfileImage(u.profileImage);
        if (u.coverImage) setCoverImage(u.coverImage);
      } catch (e) {
        console.error("user 파싱 오류:", e);
      }
    }
  }, []);

  // 2. 내 리뷰 불러오기 (⭐ 수정됨: 인자 없이 호출)
  useEffect(() => {
    const fetchReviews = async () => {
      // 토큰이 없으면 호출하지 않음
      if (!localStorage.getItem("token")) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // ⭐ reviewClient에서 수정된 getMyReviews 호출
        const list = await getMyReviews();
        setReviews(list);
      } catch (err) {
        console.error("내 리뷰 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []); // 마운트 시 한 번 실행

  // ... 헬퍼 함수 (formatDate, renderStars 등) 및 이벤트 핸들러 (handleGoHotel, openDetail) 동일 ...
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("ko-KR");
  };

  const handleGoHotel = (review) => {
    const id = review.hotelId || review.hotel?._id;
    if (id) navigate(`/hotels/${id}`);
  };

  const openDetail = (e, review) => {
    e.stopPropagation();
    setDetailReview(review);
  };

  const closeDetail = () => setDetailReview(null);

  const displayName = user.name || user.nickname || "사용자";

  const renderStars = (rating) => {
    const value = Number(rating) || 0;
    const full = Math.round(value);
    return (
      <div className="detail-stars">
        {Array.from({ length: 5 }).map((_, idx) => (
          <span key={idx} className={idx < full ? "star filled" : "star"}>★</span>
        ))}
        <span className="detail-score">{value.toFixed(1)}</span>
      </div>
    );
  };

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
            {renderStars(detailReview.rating)}
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