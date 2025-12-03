import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/LoginPage.scss";
import { authenticateUser } from "../../api/mockUser";
import { AuthContext } from "../../context/AuthContext";

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

  // 🔥 AuthContext 가져오기
  const { login } = useContext(AuthContext);

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

  // ✅ mockUser.js로 로그인 처리 + AuthContext 로그인 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    // mockUser.js 인증 실행
    const result = authenticateUser(formData.email, formData.password);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    // 🔥 Header가 원하는 구조로 userData 변환
    const userData = {
      id: result.user.id,
      email: result.user.email,
      nickname: result.user.name,               // Header에서 nickname 사용
      profileImg: "/default_profile.png",       // Header에서 profileImg 사용
      token: result.token,
    };

    // 🔥 AuthContext에 로그인 상태 저장 → Header 즉시 변경됨
    login(userData);

    // 🔥 localStorage에도 저장 (새로고침 유지)
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", result.token);

    // 홈으로 이동
    navigate("/");
  };

  return (
    <div className="page-wrapper">
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

      <div className="slider-container">
        <img src={imageList[current]} className="slide-image" />
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
