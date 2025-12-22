import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/LoginPage.scss";
import axiosInstance from "../../api/axiosConfig";
import { AuthContext } from "../../context/AuthContext";

import img1 from "../../assets/image1.jpeg";
import img2 from "../../assets/image2.jpeg";
import img3 from "../../assets/image3.jpeg";

const imageList = [img1, img2, img3];

const LoginPage = () => {
  // ✅ Vite 환경 변수 설정 (기본값 /api)
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // AuthContext에서 로그인 함수 가져오기
  const { login } = useContext(AuthContext);

  // 배경 이미지 슬라이더 로직
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

  // 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axiosInstance.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      const resBody = response.data;
      const resData = resBody.data || resBody;

      const token =
        resData.token ||
        resData.accessToken ||
        resBody.token ||
        resBody.accessToken;

      const user = resData.user || resBody.user;

      if (!token) {
        throw new Error("서버 응답에 인증 토큰이 포함되어 있지 않습니다.");
      }

      const userData = {
        id: user?.id || user?._id,
        email: user?.email,
        nickname: user?.name || user?.nickname || "사용자",
        profileImg: user?.profileImg || "/default_profile.png",
        role: user?.role,
        token: token,
      };

      login(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", token);
      localStorage.setItem("token", token);

      const refreshToken = resData.refreshToken || resBody.refreshToken;
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      alert("로그인 성공!");
      navigate("/");
    } catch (err) {
      console.error("Login Error Details:", err);
      const errorText =
        err.response?.data?.message ||
        err.message ||
        "로그인에 실패했습니다.";
      setMessage(errorText);
    }
  };

  return (
    <div className="page-wrapper">
      {/* 왼쪽 로그인 폼 구역 */}
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

          <button type="submit" className="login-btn">
            로그인
          </button>

          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>

          {/* ✅ 비회원 예약 버튼 */}
          <button
            type="button"
            className="guest-reserve-btn"
            onClick={() => navigate("/search?guest=1")}
          >
            비회원으로 예약하기
          </button>

          <button
            type="button"
            className="resetpw-btn"
            onClick={() => navigate("/findpassword")}
          >
            비밀번호 찾기
          </button>
        </form>

        {message && (
          <p
            className="auth-message"
            style={{
              color: "#ff4d4f",
              marginTop: "10px",
              fontSize: "14px",
            }}
          >
            {message}
          </p>
        )}

        <div className="social-divider">
          <span>Or login with</span>
        </div>

        {/* 소셜 로그인 */}
        <div className="social-login-box">
          <button
            className="social-btn"
            onClick={() =>
              (window.location.href = `${apiUrl}/auth/kakao`)
            }
          >
            <img
              src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_small.png"
              alt="카카오"
            />
          </button>

          <button
            className="social-btn"
            onClick={() =>
              (window.location.href = `${apiUrl}/auth/google`)
            }
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
              alt="구글"
            />
          </button>

          <button
            className="social-btn"
            onClick={() =>
              (window.location.href = `${apiUrl}/auth/naver`)
            }
          >
            <img
              src="https://cdn.simpleicons.org/naver/03C75A"
              alt="네이버"
            />
          </button>
        </div>
      </div>

      {/* 오른쪽 이미지 슬라이더 구역 */}
      <div className="slider-container">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {imageList.map((src, i) => (
            <img
              key={i}
              src={src}
              className="slide-image"
              alt={`slide-${i}`}
            />
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
