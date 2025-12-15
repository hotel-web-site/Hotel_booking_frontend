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
          ← Back to login
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
