import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useMyBookingDetailPage() {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("예정됨");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedBookings = localStorage.getItem("bookings");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm({ name: user.name || "", email: user.email || "" });
      if (user.profileImage) setProfileImage(user.profileImage);
      if (user.coverImage) setCoverImage(user.coverImage);
    }
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const filteredBookings = bookings.filter((item) => item.status === filterStatus);

  const handleCancel = (itemId) => {
    const updated = bookings.map(b => b.id === itemId ? { ...b, status: "취소됨" } : b);
    localStorage.setItem("bookings", JSON.stringify(updated));
    setBookings(updated);
  };

  const handleRebook = (hotelId) => {
    if (hotelId) {
      navigate(`/hotels/${hotelId}`);
    } else {
      alert("호텔 정보를 찾을 수 없습니다.");
    }
  };

  return {
    coverImage,
    setCoverImage,
    profileImage,
    setProfileImage,
    form,
    setForm,
    bookings,
    setBookings,
    filterStatus,
    setFilterStatus,
    filteredBookings,
    handleCoverUpload,
    handleProfileUpload,
    handleCancel,
    handleRebook,
    navigate,
  };
}
