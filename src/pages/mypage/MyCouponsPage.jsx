// src/pages/mypage/MyCouponsPage.jsx
import React, { useEffect, useState } from "react";
import "../../styles/mypage/MyCouponsPage.scss";
import ProfilePage from "./ProfilePage";
import { getMyCoupons } from "../../api/couponClient";

const MyCouponsPage = () => {
  // 프로필용 유저 정보
  const [user, setUser] = useState({ name: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser({ name: u.name, email: u.email });
      if (u.profileImage) setProfileImage(u.profileImage);
      if (u.coverImage) setCoverImage(u.coverImage);
    }
  }, []);

  // 쿠폰 리스트
  const [coupons, setCoupons] = useState([]);
  const [filter, setFilter] = useState("available"); // available | used | expired
  const [loading, setLoading] = useState(true);

  // 내 포인트 (BookingStepPayment / Header와 동일한 localStorage 키 사용)
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // 쿠폰 불러오기
    const loadCoupons = async () => {
      setLoading(true);
      const data = await getMyCoupons();
      setCoupons(data);
      setLoading(false);
    };
    loadCoupons();

    // 포인트 불러오기
    const stored = localStorage.getItem("userPoints");
    if (stored) {
      const num = Number(stored);
      if (!Number.isNaN(num)) setPoints(num);
    }
  }, []);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("ko-KR").format(Number(amount || 0));

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("ko-KR");
  };

  const filteredCoupons = coupons.filter((c) => {
    if (filter === "available") return c.status === "unused";
    if (filter === "used") return c.status === "used";
    if (filter === "expired") return c.status === "expired";
    return true;
  });

  const getStatusLabel = (status) => {
    if (status === "unused") return "사용 가능";
    if (status === "used") return "사용 완료";
    if (status === "expired") return "기간 만료";
    return status;
  };

  return (
    <div className="my-coupons-page">
      {/* 상단 프로필 영역 */}
      <ProfilePage
        activeTab="coupons"
        coverImage={coverImage}
        profileImage={profileImage}
        name={user.name}
        email={user.email}
      />

      <div className="coupons-wrapper">
        <h2 className="title">내 쿠폰함</h2>

        {/* 🔹 보유 포인트 표시 */}
        <div className="points-box">
          현재 보유 포인트:{" "}
          <strong>{formatPrice(points)}</strong>
          P
        </div>

        {/* 필터 탭 */}
        <div className="coupon-tabs">
          <button
            className={`tab ${filter === "available" ? "active" : ""}`}
            onClick={() => setFilter("available")}
          >
            사용 가능
          </button>
          <button
            className={`tab ${filter === "used" ? "active" : ""}`}
            onClick={() => setFilter("used")}
          >
            사용 완료
          </button>
          <button
            className={`tab ${filter === "expired" ? "active" : ""}`}
            onClick={() => setFilter("expired")}
          >
            기간 만료
          </button>
        </div>

        {/* 쿠폰 리스트 */}
        {loading ? (
          <div className="empty">쿠폰 정보를 불러오는 중...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="empty">해당 조건의 쿠폰이 없습니다.</div>
        ) : (
          <div className="coupon-list">
            {filteredCoupons.map((c) => (
              <div key={c.id} className={`coupon-card status-${c.status}`}>
                <div className="coupon-main">
                  <div className="coupon-left">
                    <div className="coupon-title">{c.title}</div>
                    <div className="coupon-desc">{c.description}</div>

                    <div className="coupon-meta">
                      <span className="meta-item">
                        종류:{" "}
                        {c.type === "percent"
                          ? `${c.discountValue}% 할인`
                          : `${formatPrice(c.discountValue)}원 할인`}
                      </span>
                      {c.minAmount && (
                        <span className="meta-item">
                          최소 {formatPrice(c.minAmount)}원 이상 결제 시
                        </span>
                      )}
                      {c.maxDiscount && (
                        <span className="meta-item">
                          최대 {formatPrice(c.maxDiscount)}원 할인
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="coupon-right">
                    <div className="status-badge">
                      {getStatusLabel(c.status)}
                    </div>
                    <div className="source">{c.source}</div>
                    <div className="expires">
                      유효기간: {formatDate(c.expiresAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCouponsPage;
