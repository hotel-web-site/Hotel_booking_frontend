import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth/SignupPage.scss";

import img1 from "../../assets/image1.jpeg";
import img2 from "../../assets/image2.jpeg";
import img3 from "../../assets/image3.jpeg";

const imageList = [img1, img2, img3];

const SignupPage = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [message, setMessage] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);

    const [form, setForm] = useState({
        first: "",
        last: "",
        email: "",
        phone: "",
        password: "",
        confirm: "",
        agree: false,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % imageList.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // 휴대폰 번호 유효성 검사 (숫자만, 11자리)
        const phoneRegex = /^01[016789][0-9]{7,8}$/;
        if (!phoneRegex.test(form.phone)) {
            setMessage("올바른 휴대폰 번호를 입력하세요. (숫자만, 11자리)");
            return;
        }



        if (form.password.length < 8 || form.password.length > 12) {
            setMessage("비밀번호는 8자리 이상 12자리 이하로 입력해야 합니다.");
            return;
        }

        if (form.password !== form.confirm) {
            setMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!form.agree) {
            setMessage("약관에 동의해야 가입이 가능합니다.");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                name: `${form.first} ${form.last}`, // User 모델 name 필드
                email: form.email,
                password: form.password,             // backend pre-save hook에서 해싱
                phoneNumber: form.phone,
                marketingAgree: form.agree,
            });

            alert("회원가입 완료!");
            navigate("/loginpage");
        } catch (err) {
            setMessage(err.response?.data?.message || "회원가입 실패");
        }
    };

    return (
        <div className="page-wrapper">
            <div className="slider-container">
                <div
                    className="slider-track"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {imageList.map((src, i) => (
                        <img key={i} src={src} className="slide-image" />
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

            <div className="signup-container">
                <div className="sign-up-text">
                    <h1>Sign up</h1>
                </div>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="row">
                        <input
                            type="text"
                            name="first"
                            placeholder="First Name"
                            value={form.first}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="last"
                            placeholder="Last Name"
                            value={form.last}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="row">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="pw-box">
                        <input
                            type={showPw ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            onCopy={e => e.preventDefault()}
                            onPaste={e => e.preventDefault()}
                            onCut={e => e.preventDefault()}
                        />
                        <span className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                            {showPw ? (
                                // 눈(보임) 아이콘
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="12" cy="12" rx="8" ry="5" stroke="#222" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="2" fill="#222" />
                                </svg>
                            ) : (
                                // 눈에 슬래시(숨김) 아이콘
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="12" cy="12" rx="8" ry="5" stroke="#222" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="2" fill="#222" />
                                    <line x1="4" y1="20" x2="20" y2="4" stroke="#222" strokeWidth="2" />
                                </svg>
                            )}
                        </span>
                    </div>

                    <div className="pw-box">
                        <input
                            type={showPw2 ? "text" : "password"}
                            name="confirm"
                            placeholder="Confirm Password"
                            value={form.confirm}
                            onChange={handleChange}
                            required
                            onCopy={e => e.preventDefault()}
                            onPaste={e => e.preventDefault()}
                            onCut={e => e.preventDefault()}
                        />
                        <span className="pw-toggle" onClick={() => setShowPw2(!showPw2)}>
                            {showPw2 ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="12" cy="12" rx="8" ry="5" stroke="#222" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="2" fill="#222" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="12" cy="12" rx="8" ry="5" stroke="#222" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="2" fill="#222" />
                                    <line x1="4" y1="20" x2="20" y2="4" stroke="#222" strokeWidth="2" />
                                </svg>
                            )}
                        </span>
                    </div>

                    <label className="agree-row">
                        <input
                            type="checkbox"
                            name="agree"
                            checked={form.agree}
                            onChange={handleChange}
                        />
                        동의하기
                    </label>

                    <button type="submit" className="create-btn">
                        계정 생성
                    </button>

                    <button
                        type="button"
                        className="back-login"
                        onClick={() => navigate("/login")}
                    >
                        로그인
                    </button>
                </form>

                {message && <p className="error-msg">{message}</p>}

                <div className="divider">
                    <span>Or Sign up with</span>
                </div>

                <div className="social-box">
                    {/* 카카오 로그인 */}
                    <button
                        className="social-btn kakao"
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
                        className="social-btn google"
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
                        className="social-btn naver"
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
        </div>
    );
};

export default SignupPage;