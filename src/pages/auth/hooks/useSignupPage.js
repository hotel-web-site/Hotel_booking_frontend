import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import img1 from "../../../assets/image1.jpeg";
import img2 from "../../../assets/image2.jpeg";
import img3 from "../../../assets/image3.jpeg";

const imageList = [img1, img2, img3];

export default function useSignupPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [message, setMessage] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [modal, setModal] = useState(null); // 'terms' | 'privacy' | null

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageList.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const phoneRegex = /^01[016789][0-9]{7,8}$/;
    if (!phoneRegex.test(form.phone)) {
      setMessage("올바른 휴대폰 번호를 입력하세요. (숫자만, 11자리)");
      return;
    }
    if (form.password.length < 8 || form.password.length > 12) {
      setMessage("비밀번호는 8자리 이상 12자리 이하로 입력해야 합니다.");
      return;
    }
    if (form.password !== form.confirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!form.agree) {
      setMessage("약관에 동의해야 가입이 가능합니다.");
      return;
    }
    try {
      await axios.post(`${apiUrl}/users/register`, {
        name: `${form.first}${form.last}`,
        email: form.email,
        password: form.password,
        phoneNumber: form.phone,
        marketingAgree: form.agree,
      });
      alert("회원가입 완료!");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "회원가입 실패");
    }
  };

  return {
    apiUrl,
    navigate,
    current,
    setCurrent,
    message,
    setMessage,
    showPw,
    setShowPw,
    showPw2,
    setShowPw2,
    form,
    setForm,
    modal,
    setModal,
    handleChange,
    handleSubmit,
    imageList,
  };
}
