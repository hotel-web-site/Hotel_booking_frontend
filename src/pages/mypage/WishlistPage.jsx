import React, { useEffect, useState } from "react";
import "../../styles/pages/wishlist/WishlistPage.scss";
import WishlistTabs from "../../components/wishlist/WishlistTabs";
import WishlistCard from "../../components/wishlist/WishlistCard";

const WishlistPage = () => {
  const [items, setItems] = useState([]);

  // 로컬스토리지 로드
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setItems(saved);
  }, []);

  // ⭐ 찜 취소하기 기능 (WishlistCard에서 실행됨)
  const removeItem = (id) => {
    const updated = items.filter(
      (hotel) => (hotel._id || hotel.id) !== id
    );

    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="wishlist-page">
      <h2 className="title">찜 목록</h2>

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
              onRemove={removeItem}  // ⭐ 여기 추가
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
