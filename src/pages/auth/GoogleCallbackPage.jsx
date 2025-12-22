import React, { useEffect, useContext, useRef } from "react"; // useRef 추가
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // 🔥 중복 실행을 막기 위한 flag (Strict Mode 대비)
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;

    const hash = location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("token");
      const name = params.get("name");
      const email = params.get("email");

      if (token) {
        isProcessed.current = true;

        /* -------------------------------------------------------
           ⭐ 닉네임 정제 로직
           1. name이 "User_..." 형태라면 이메일 앞부분을 사용하거나 자름
           2. decodeURIComponent 후에도 ID 형태라면 깔끔하게 처리
        ------------------------------------------------------- */
        let rawName = decodeURIComponent(name || "");
        let cleanNickname = "사용자";

        if (rawName && !rawName.startsWith("User_")) {
          // 1) "User_"로 시작하지 않는 정상적인 이름일 경우 그대로 사용
          cleanNickname = rawName;
        } else if (email) {
          // 2) 이름이 ID 형태이거나 없을 경우 이메일의 @ 앞부분 추출 (ex: gemini@gmail.com -> gemini)
          cleanNickname = email.split("@")[0];
        }

        const userData = {
          id: email,
          email: email,
          nickname: cleanNickname, // 가공된 닉네임 적용
          profileImg: "/default_profile.png",
          role: "user"
        };

        // 1. 데이터 저장
        login(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", token);

        // 2. 알럿 (가공된 이름으로 환영)
        alert(`${userData.nickname}님, 소셜 로그인 성공!`);

        window.history.replaceState({}, document.title, window.location.pathname);
        navigate("/", { replace: true });
      } else {
        navigate("/login");
      }
    }
  }, [location, navigate, login]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>소셜 로그인 처리 중...</h2>
    </div>
  );
};

export default GoogleCallbackPage;