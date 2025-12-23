import React from "react";
import "../../styles/auth/LoginPage.scss";
import useLoginPage from "./hooks/useLoginPage";

function LoginPage() {
  const {
    apiUrl,
    formData,
    setFormData,
    remember,
    setRemember,
    message,
    setMessage,
    current,
    setCurrent,
    navigate,
    handleChange,
    handleSubmit,
    imageList,
  } = useLoginPage();

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
}

export default LoginPage;
