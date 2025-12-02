import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth/LoginPage.scss";

import img1 from "../../assets/image1.jpeg";
import img2 from "../../assets/image2.jpeg";
import img3 from "../../assets/image3.jpeg";

const imageList = [img1, img2, img3];

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageList.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setRemember(checked);
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );

      const { token } = res.data.data || {};
      if (!token) throw new Error("토큰 없음");

      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <div className="page-wrapper">
      {/* LEFT LOGIN */}
      <div className="auth-container">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label className="remember-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={handleChange}
            />
            비밀번호 기억하기
          </label>

          <button type="submit" className="login-btn">로그인</button>

          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>

          <button
            type="button"
            className="resetpw-btn"
            onClick={() => navigate("/findpassword")}
          >
            비밀번호 찾기
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="social-divider">
          <span>Or login with</span>
        </div>

        <div className="social-login-box">
          <button className="social-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" />
          </button>
          <button className="social-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" />
          </button>
          <button className="social-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/179/179309.png" />
          </button>
        </div>
      </div>

      {/* RIGHT SLIDER */}
      <div className="slider-container">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${current * 100}%)`
          }}
        >
          {imageList.map((src, i) => (
            <img key={i} src={src} className="slide-image" />
          ))}
        </div>

        <div className="indicator-box">
          {imageList.map((_, i) => (
            <div
              key={i}
              className={`indicator ${current === i ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
