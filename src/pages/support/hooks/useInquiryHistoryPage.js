import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function useInquiryHistoryPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInquiryHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/inquiry/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInquiries(res.data.inquiries || []);
    } catch (error) {
      console.error("문의 내역 불러오기 실패:", error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiryHistory();
    // eslint-disable-next-line
  }, []);

  return {
    inquiries,
    loading,
    navigate,
  };
}
