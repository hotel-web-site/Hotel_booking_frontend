import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/auth/EmailAuth.scss";

import img1 from "../../assets/image1.jpeg";
import img2 from "../../assets/image2.jpeg";
import img3 from "../../assets/image3.jpeg";

const imageList = [img1, img2, img3];

const EmailAuth = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [current, setCurrent] = useState(0);

  const email = state?.email || ""; // FindPasswordPage에서 전달된 이메일

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageList.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // 인증코드 재전송
  const handleResend = () => {
    if (!email) return alert("이메일 정보가 없습니다.");
    alert("인증번호가 다시 전송되었습니다. (백엔드 연결 예정)");
  };

  // 인증하기
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!code.trim()) {
      alert("인증번호를 입력하세요!");
      return;
    }

    // 인증 성공 → 새 비밀번호 설정 화면으로 이동
    navigate("/resetpassword", { state: { email } });
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">

        {/* ← Back to login */}
        <button className="back-btn" onClick={() => navigate("/loginpage")}>
          ← Back to login
        </button>

        <h2 className="title">인증하기</h2>
        <p className="subtitle">이메일로 받은 인증번호를 입력해주세요</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Enter Code</label>

          <div className="code-input-box">
            <input
              type={showCode ? "text" : "password"}
              placeholder="인증번호 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            {/* 눈 아이콘 */}
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="button" className="resend-btn" onClick={handleResend}>
            재전송하기
          </button>

          <button type="submit" className="submit-btn">
            인증하기
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

export default EmailAuth;
