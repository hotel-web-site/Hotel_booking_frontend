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
          {/* 카카오 로그인 */}
          <button
            className="social-btn"
            onClick={() => {
              const KAKAO_AUTH_URL =
                "https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_KAKAO_REDIRECT_URI&response_type=code";
              window.location.href = KAKAO_AUTH_URL;
            }}
          >
            <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_small.png" alt="카카오 로그인" />
          </button>
          {/* 구글 로그인 */}
          <button
            className="social-btn"
            onClick={() => {
              const GOOGLE_AUTH_URL =
                "https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_GOOGLE_REDIRECT_URI&response_type=code&scope=email%20profile";
              window.location.href = GOOGLE_AUTH_URL;
            }}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="구글 로그인" />
          </button>
          {/* 네이버 로그인 */}
          <button
            className="social-btn"
            onClick={() => {
              const NAVER_AUTH_URL =
                "https://nid.naver.com/oauth2.0/authorize?client_id=YOUR_NAVER_CLIENT_ID&redirect_uri=YOUR_NAVER_REDIRECT_URI&response_type=code";
              window.location.href = NAVER_AUTH_URL;
            }}
          >
            <img src="https://cdn.simpleicons.org/naver/03C75A" alt="네이버 로그인" />
          </button>
        </div>
      </div>

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
