// src/pages/mypage/MyReviewsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/mypage/MyReviewsPage.scss";
import ProfilePage from "./ProfilePage";
import { getMyReviews } from "../../api/reviewClient";

const MyReviewsPage = () => {
  const navigate = useNavigate();

  // 유저 정보
  const [user, setUser] = useState({
    id: null,
    name: "",
    nickname: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // 리뷰 리스트
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 상세 모달용
  const [detailReview, setDetailReview] = useState(null);

  // localStorage에서 유저 정보 로드
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
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // 내 리뷰 불러오기 (id + 이름 기준)
  useEffect(() => {
    const fetchReviews = async () => {
      const displayName = user.name || user.nickname;
      if (!displayName && !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const list = await getMyReviews(displayName, user.id);
        setReviews(list);
      } catch (err) {
        console.error("내 리뷰 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.id || user.name || user.nickname) {
      fetchReviews();
    }
  }, [user.id, user.name, user.nickname]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("ko-KR");
  };

  const displayName = user.name || user.nickname;

  // 🔹 호텔 상세 페이지로 이동 (라우트 패턴에 맞게 수정해도 됨)
  const handleGoHotel = (review) => {
    if (!review.hotelId) return;
    // 프로젝트에서 실제 사용 중인 경로에 맞게 수정:
    // 예: /hotels/:hotelId 또는 /hotel/:hotelId
    navigate(`/hotels/${review.hotelId}`);
  };

  // 🔹 리뷰 상세 모달 열기
  const openDetail = (e, review) => {
    e.stopPropagation(); // 카드 클릭으로 인한 이동 막기
    setDetailReview(review);
  };

  // 🔹 모달 닫기
  const closeDetail = () => setDetailReview(null);

  // 별점 표시용 작은 헬퍼
  const renderStars = (rating) => {
    const value = Number(rating) || 0;
    const full = Math.round(value);
    return (
      <div className="detail-stars">
        {Array.from({ length: 5 }).map((_, idx) => (
          <span
            key={idx}
            className={idx < full ? "star filled" : "star"}
          >
            ★
          </span>
        ))}
        <span className="detail-score">
          {value ? value.toFixed(1) : "-"}
        </span>
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

        {!displayName && !user.id && (
          <div className="empty">
            로그인 정보가 없습니다. 로그인을 다시 진행해주세요.
          </div>
        )}

        {(displayName || user.id) && loading && (
          <div className="empty">리뷰를 불러오는 중입니다...</div>
        )}

        {(displayName || user.id) &&
          !loading &&
          reviews.length === 0 && (
            <div className="empty">아직 작성한 리뷰가 없습니다.</div>
          )}

        {(displayName || user.id) &&
          !loading &&
          reviews.length > 0 && (
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
                        {review.hotelName ||
                          review.hotel?.name ||
                          `호텔 #${review.hotelId}`}
                      </span>
                    </div>

                    {/* 🔹 오른쪽: 리뷰 자세히 보기 버튼 */}
                    <button
                      className="detail-btn"
                      onClick={(e) => openDetail(e, review)}
                    >
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

      {/* 🔹 리뷰 상세 모달 */}
      {detailReview && (
        <div className="review-detail-overlay" onClick={closeDetail}>
          <div
            className="review-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="detail-title">리뷰 상세</h3>
            <div className="detail-hotel">
              {detailReview.hotelName ||
                detailReview.hotel?.name ||
                `호텔 #${detailReview.hotelId}`}
            </div>

            {/* 별점 + 점수 */}
            {renderStars(detailReview.rating)}

            {/* 코멘트 */}
            <div className="detail-comment-box">
              <p>{detailReview.comment}</p>
            </div>

            <div className="detail-date">
              작성일: {formatDate(detailReview.date || detailReview.createdAt)}
            </div>

            <button className="detail-close-btn" onClick={closeDetail}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;
