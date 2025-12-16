import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/FindPasswordPage.scss";

import img1 from "../../assets/image1.jpeg";
import img2 from "../../assets/image2.jpeg";
import img3 from "../../assets/image3.jpeg";

const imageList = [img1, img2, img3];

const FindPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // 자동 이미지 슬라이더
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageList.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // 이메일 제출
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return alert("이메일을 입력하세요!");

    // 백엔드 연결 전 — 틀만 구성
    navigate("/emailauth", { state: { email } });
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">

        {/* ← Back to login */}
        <button className="back-btn" onClick={() => navigate("/login")}>
          ← 로그인 페이지로
        </button>

        <h2 className="title">비밀번호 찾기</h2>
        <p className="subtitle">비밀번호를 찾아보세요</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="john.doe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="submit-btn">제출</button>
        </form>

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

      {/* RIGHT SLIDER */}
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

export default FindPasswordPage;
