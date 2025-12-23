
import React from "react";
import "../../styles/pages/wishlist/WishlistPage.scss";
import WishlistTabs from "../../components/wishlist/WishlistTabs";
import WishlistCard from "../../components/wishlist/WishlistCard";
import ProfilePage from "../mypage/ProfilePage";
import useWishlistPage from "./hooks/useWishlistPage";

const WishlistPage = () => {
  const {
    items,
    user,
    profileImage,
    coverImage,
    removeItem,
  } = useWishlistPage();

  return (
    <div className="wishlist-page">
      <ProfilePage
        activeTab="wishlist"
        coverImage={coverImage}
        profileImage={profileImage}
        name={user.name}
        email={user.email}
      />

      <h2 className="title" style={{ marginTop: "30px" }}>찜 목록</h2>

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