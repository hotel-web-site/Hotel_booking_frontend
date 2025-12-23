import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../../api/axiosConfig';

export default function useMyAccountPage() {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "********",
    phone: "",
    address: "",
    birth: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/users/me");
        const user = response.data.data;
        setForm({
          name: user.name || "",
          email: user.email || "",
          password: "********",
          phone: user.phoneNumber || user.phone || "",
          address: user.address || "",
          birth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
        });
        if (user.profileImg) setProfileImage(user.profileImg);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleUpdateField = async (key, label) => {
    const newValue = prompt(`${label} 수정:`, form[key] === "********" ? "" : form[key]);
    if (newValue === null || newValue === form[key]) return;
    try {
      setLoading(true);
      const fieldMapping = {
        name: "name",
        phone: "phoneNumber",
        address: "address",
        birth: "dateOfBirth"
      };
      const targetKey = fieldMapping[key] || key;
      await axiosInstance.patch("/users/me", { [targetKey]: newValue });
      setForm(prev => ({ ...prev, [key]: newValue }));
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}" );
      localStorage.setItem("user", JSON.stringify({ ...storedUser, [targetKey]: newValue }));
      alert(`${label}이(가) 수정되었습니다.`);
    } catch (err) {
      alert(err.response?.data?.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return {
    coverImage,
    setCoverImage,
    profileImage,
    setProfileImage,
    loading,
    form,
    setForm,
    handleCoverUpload,
    handleProfileUpload,
    handleUpdateField,
    navigate,
  };
}
