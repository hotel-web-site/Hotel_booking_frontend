import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings } from '../../../api/hotelClient';
import axiosInstance from '../../../api/axiosConfig';

export default function useMyBookingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, bookingData] = await Promise.all([
          axiosInstance.get("/users/me"),
          getMyBookings()
        ]);
        setUser(userRes.data.data);
        setBookings(bookingData || []);
      } catch (err) {
        // 에러 핸들링
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBookings = bookings.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  return {
    user,
    bookings,
    loading,
    filterStatus,
    setFilterStatus,
    filteredBookings,
    navigate,
  };
}
