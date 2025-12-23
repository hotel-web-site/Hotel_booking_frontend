import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHotels } from "../../../api/hotelClient";

export default function useHotelListPage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hotel");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await getHotels({ type: activeTab });
        setHotels(data.list || []);
        setTotal(data.total || 0);
        setStats(data.typeStats || {});
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [activeTab]);

  return {
    hotels,
    total,
    stats,
    loading,
    activeTab,
    setActiveTab,
    navigate,
  };
}
