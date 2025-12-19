import React, { useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const NaverCallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    // Strict Mode에서 두 번 실행되는 것을 방지
    const isProcessed = useRef(false);

    useEffect(() => {
        if (isProcessed.current) return;

        // 네이버는 보통 URL 뒤에 # 대신 ?(Query)나 #(Hash) 둘 다 올 수 있으므로 통합 처리
        const hash = location.hash || location.search;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get("token");
            const name = params.get("name");
            const email = params.get("email");

            if (token) {
                isProcessed.current = true;

                /* -------------------------------------------------------
                   ⭐ 닉네임 정제 (네이버 식별자 User_... 대응)
                ------------------------------------------------------- */
                let rawName = decodeURIComponent(name || "");
                let cleanNickname = "사용자";

                // 이름이 ID 형태(User_...)거나 너무 길면 이메일 아이디 사용
                if (rawName && !rawName.startsWith("User_") && rawName.length < 15) {
                    cleanNickname = rawName;
                } else if (email) {
                    cleanNickname = email.split("@")[0];
                }

                const userData = {
                    id: email,
                    email: email,
                    nickname: cleanNickname,
                    profileImg: "/default_profile.png",
                    role: "user"
                };

                // 1. 데이터 저장
                login(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("accessToken", token);

                // 2. 환영 메시지
                alert(`${userData.nickname}님, 네이버 로그인 성공!`);

                // 3. 보안을 위해 URL 정리 및 이동
                window.history.replaceState({}, document.title, window.location.pathname);
                navigate("/", { replace: true });
            } else {
                console.error("네이버 토큰을 찾을 수 없습니다.");
                navigate("/login");
            }
        }
    }, [location, navigate, login]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>네이버 로그인 처리 중...</h2>
        </div>
    );
};

export default NaverCallbackPage;