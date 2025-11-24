import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/auth/ResetPasswordPage.scss";

import img1 from "../../assets/image1.jpeg";
import img2 from "../../assets/image2.jpeg";
import img3 from "../../assets/image3.jpeg";

const imageList = [img1, img2, img3];

const ResetPasswordPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email || ""; // EmailAuth에서 전달된 이메일

  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageList.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password.trim() || !confirmPw.trim()) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    if (password !== confirmPw) {
      alert("비밀번호가 서로 다릅니다.");
      return;
    }

    // 실제 백엔드 연결은 나중에
    alert("비밀번호가 성공적으로 변경되었습니다!");
    navigate("/loginpage");
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">

        <h2 className="title">비밀번호 설정</h2>
        <p className="subtitle">비밀번호를 다시 설정하기</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Password */}
          <label>Create Password</label>
          <div className="pw-input-box">
            <input
              type={showPw ? "text" : "password"}
              placeholder="새 비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPw(!showPw)}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Confirm Password */}
          <label>Re-enter Password</label>
          <div className="pw-input-box">
            <input
              type={showConfirmPw ? "text" : "password"}
              placeholder="비밀번호 다시 입력"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirmPw(!showConfirmPw)}
            >
              {showConfirmPw ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="submit-btn">
            비밀번호 설정
          </button>
        </form>
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

export default ResetPasswordPage;
