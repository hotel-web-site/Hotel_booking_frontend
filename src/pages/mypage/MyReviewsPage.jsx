// src/pages/mypage/MyReviewsPage.jsx
import React, { useEffect, useState } from "react";
import "../../styles/mypage/MyReviewsPage.scss";
import ProfilePage from "./ProfilePage";
import { getMyReviews } from "../../api/reviewClient";

const MyReviewsPage = () => {
  // 유저 정보
  const [user, setUser] = useState({
    name: "",
    nickname: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // 리뷰 리스트
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // localStorage에서 유저 정보 로드
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser({
          name: u.name || "",
          nickname: u.nickname || "",
          email: u.email || "",
        });
        if (u.profileImage) setProfileImage(u.profileImage);
        if (u.coverImage) setCoverImage(u.coverImage);
      } catch (e) {
        console.error("user 파싱 오류:", e);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // 내 리뷰 불러오기 (이름 기준)
  useEffect(() => {
    const fetchReviews = async () => {
      const displayName = user.name || user.nickname;
      if (!displayName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const list = await getMyReviews(displayName);
        setReviews(list);
      } catch (err) {
        console.error("내 리뷰 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    // 이름/닉네임이 세팅된 뒤에 호출
    if (user.name || user.nickname) {
      fetchReviews();
    }
  }, [user.name, user.nickname]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("ko-KR");
  };

  return (
    <div className="my-reviews-page">
      <ProfilePage
        activeTab="reviews"
        coverImage={coverImage}
        profileImage={profileImage}
        name={user.name || user.nickname}
        email={user.email}
      />

      <div className="reviews-wrapper">
        <h2 className="title">내가 작성한 리뷰</h2>

        {!user.name && !user.nickname && (
          <div className="empty">
            로그인 정보가 없습니다. 로그인을 다시 진행해주세요.
          </div>
        )}

        {(user.name || user.nickname) && loading && (
          <div className="empty">리뷰를 불러오는 중입니다...</div>
        )}

        {(user.name || user.nickname) &&
          !loading &&
          reviews.length === 0 && (
            <div className="empty">아직 작성한 리뷰가 없습니다.</div>
          )}

        {(user.name || user.nickname) &&
          !loading &&
          reviews.length > 0 && (
            <ul className="my-review-list">
              {reviews.map((review) => (
                <li
                  key={review.id || review._id}
                  className="my-review-item"
                >
                  <div className="top-row">
                    <div className="hotel-info">
                      <span className="hotel-name">
                        {review.hotelName ||
                          review.hotel?.name ||
                          `호텔 #${review.hotelId}`}
                      </span>
                    </div>

                    <div className="rating">
                      <span className="score">
                        {Number(review.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="comment">{review.comment}</p>

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
    </div>
  );
};

export default MyReviewsPage;
