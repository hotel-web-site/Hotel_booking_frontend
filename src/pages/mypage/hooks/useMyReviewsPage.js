import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyReviews } from "../../../api/reviewClient";

export default function useMyReviewsPage() {
  const navigate = useNavigate();

  // 유저 정보 상태
  const [user, setUser] = useState({ id: null, name: "", nickname: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // 리뷰 리스트 및 로딩 상태
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailReview, setDetailReview] = useState(null);

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

  useEffect(() => {
    const fetchReviews = async () => {
      if (!localStorage.getItem("token")) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const list = await getMyReviews();
        setReviews(list);
      } catch (err) {
        console.error("내 리뷰 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

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
    return { value, full };
  };

  return {
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
  };
}
