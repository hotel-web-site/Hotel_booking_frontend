import React, { useEffect, useState } from "react";
import "../../styles/pages/wishlist/WishlistPage.scss";
import WishlistTabs from "../../components/wishlist/WishlistTabs";
import WishlistCard from "../../components/wishlist/WishlistCard";
import ProfilePage from "../mypage/ProfilePage"; // ⭐ 공통 헤더 추가

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  // ⭐ 유저 정보 상태 추가
  const [user, setUser] = useState({ name: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // 로컬스토리지 로드 (위시리스트 + 유저정보)
  useEffect(() => {
    // 1. 위시리스트 아이템 로드
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setItems(saved);

    // 2. 유저 정보 로드 (헤더용)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser({ name: u.name, email: u.email });
      if (u.profileImage) setProfileImage(u.profileImage);
      if (u.coverImage) setCoverImage(u.coverImage);
    }
  }, []);

  // ⭐ 찜 취소하기 기능
  const removeItem = (id) => {
    const updated = items.filter(
      (hotel) => (hotel._id || hotel.id) !== id
    );

    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="wishlist-page">
      {/* ⭐ 공통 프로필 헤더 적용 */}
      <ProfilePage
        activeTab="wishlist"
        coverImage={coverImage}
        profileImage={profileImage}
        name={user.name}
        email={user.email}
      />

      <h2 className="title" style={{ marginTop: "30px" }}>찜 목록</h2>

      {/* Tabs */}
      <WishlistTabs />

      <div className="wishlist-list">
        {items.length === 0 ? (
          <p className="empty">아직 찜한 장소가 없습니다.</p>
        ) : (
          items.map((hotel) => (
            <WishlistCard
              key={hotel._id || hotel.id}
              hotel={hotel}
              onRemove={removeItem}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WishlistPage;