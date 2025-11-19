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

        if (form.password !== form.confirm) {
            setMessage("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!form.agree) {
            setMessage("약관에 동의해야 가입이 가능합니다.");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, {
                email: form.email,
                password: form.password,
                firstName: form.first,
                lastName: form.last,
                phone: form.phone,
            });

            alert("회원가입 완료!");
            navigate("/loginpage");
        } catch (err) {
            setMessage(err.response?.data?.message || "회원가입 실패");
        }
    };

    return (
        <div className="page-wrapper">

            {/* LEFT → 이미지 슬라이더 */}
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

            {/* RIGHT → 회원가입 폼 */}
            <div className="signup-container">
                <div className="sign-up-text"><h1>Sign up</h1></div>

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
                        />
                        <span className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                            👁
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
                        />
                        <span className="pw-toggle" onClick={() => setShowPw2(!showPw2)}>
                            👁
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
                        onClick={() => navigate("/loginpage")}
                    >
                        로그인
                    </button>
                </form>

                {message && <p className="error-msg">{message}</p>}

                <div className="divider"><span>Or Sign up with</span></div>

                <div className="social-box">
                    <button className="social-btn fb">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" />
                    </button>
                    <button className="social-btn google">
                        <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" />
                    </button>
                    <button className="social-btn apple">
                        <img src="https://cdn-icons-png.flaticon.com/512/179/179309.png" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default SignupPage;
