import { useEffect, useState } from "react";
import { getMyCoupons } from "../../../api/couponClient";

export default function useMyCouponsPage() {
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

  // 내 포인트
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

  return {
    user,
    profileImage,
    coverImage,
    points,
    filter,
    setFilter,
    loading,
    filteredCoupons,
    formatPrice,
    formatDate,
    getStatusLabel,
  };
}
