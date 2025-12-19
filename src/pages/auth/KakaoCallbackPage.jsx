import React, { useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const KakaoCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // Strict Mode에서의 중복 실행 방지
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;

    // 카카오 로그인 후 백엔드가 리다이렉트시킨 해시(#) 파싱
    const hash = location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("token");
      const name = params.get("name");
      const email = params.get("email");

      if (token) {
        isProcessed.current = true;

        const userData = {
          id: email,
          email: email,
          nickname: decodeURIComponent(name || "카카오 사용자"),
          profileImg: "/default_profile.png",
          role: "user"
        };

        // 1. 전역 상태 및 로컬 스토리지 저장
        login(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", token);

        // 2. 알럿 및 주소창 정리
        alert(`${userData.nickname}님, 카카오 로그인 성공!`);
        window.history.replaceState({}, document.title, window.location.pathname);

        // 3. 홈으로 이동
        navigate("/", { replace: true });
      } else {
        console.error("카카오 토큰 누락");
        navigate("/login");
      }
    }
  }, [location, navigate, login]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>카카오 로그인 처리 중...</h2>
    </div>
  );
};

export default KakaoCallbackPage;