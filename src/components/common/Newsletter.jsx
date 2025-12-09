import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Newsletter.scss";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const Newsletter = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    // 🔹 로그인 상태 확인 (localStorage의 user 기준)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                // 유저 이메일이 있으면 기본값으로 넣어주기
                if (parsed.email) setEmail(parsed.email);
            } catch (e) {
                console.error("user 파싱 오류:", e);
            }
        }
    }, []);

    // 🔹 구독 버튼 클릭
    const handleSubscribe = async () => {
        // 1) 로그인 안 되어 있으면 로그인 유도
        if (!user) {
            const goLogin = window.confirm(
                "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
            );
            if (goLogin) {
                navigate("/login");
            }
            return;
        }

        // 2) 이메일 검증
        if (!email.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }

        setLoading(true);

        try {
            // 3) 백엔드에 구독 정보 저장 (예시 API 경로)
            const res = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    userId: user._id || user.id, // 둘 중 있는 값 사용
                    name: user.name || "",       // 선택적으로 이름도 보냄
                }),
            });

            if (!res.ok) {
                throw new Error("구독 요청 실패");
            }

            alert("구독이 완료되었습니다.");
            setSubscribed(true);
        } catch (error) {
            console.error("구독 에러:", error);
            alert("구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="newsletter-wrapper">
            <div className="newsletter">

                {/* 왼쪽 텍스트 */}
                <div className="newsletter-left">
                    <h2 className="newsletter-title">
                        구독서비스<br />신청해보세요
                    </h2>

                    <div className="newsletter-desc">
                        <p className="travel-title">DM</p>
                        <p className="travel-sub">구독하고 쿠폰, 최신 이벤트를 받아보세요</p>
                    </div>

                    {/* 🎉 구독 여부에 따라 UI 전환 */}
                    {!subscribed ? (
                        <>
                            {/* 🔹 구독 전: 이메일 입력 + 버튼 */}
                            <div className="newsletter-input-wrapper">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="newsletter-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    className="newsletter-btn"
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                >
                                    {loading ? "처리 중..." : "Subscribe"}
                                </button>
                            </div>

                            {/* 로그인 안내 메시지 (로그인 안 되어 있을 때만 노출) */}
                            {!user && (
                                <p className="newsletter-login-notice">
                                    ※ 구독은 로그인한 상태에서만 가능합니다.
                                </p>
                            )}
                        </>
                    ) : (
                        // 🔹 구독 후: 혜택 나열
                        <div className="newsletter-benefits">
                            <h3>구독 혜택</h3>
                            <ul>
                                <li>업데이트 예정입니다.</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* 우측 이미지 */}
                <div className="newsletter-right">
                    <img
                        src="/newsletter.png"
                        alt="hotel-subscribe"
                        className="newsletter-img"
                    />
                </div>

            </div>
        </section>
    );
};

export default Newsletter;
