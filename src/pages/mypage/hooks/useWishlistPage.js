import { useEffect, useState } from "react";

export default function useWishlistPage() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState({ name: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

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

  const removeItem = (id) => {
    const updated = items.filter(
      (hotel) => (hotel._id || hotel.id) !== id
    );
    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return {
    items,
    user,
    profileImage,
    coverImage,
    removeItem,
  };
}
