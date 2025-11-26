import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/AddPaymentPage.scss";

import img1 from "../../assets/image1.jpeg";
import img2 from "../../assets/image2.jpeg";
import img3 from "../../assets/image3.jpeg";

const imageList = [img1, img2, img3];

const AddPaymentPage = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

    const [form, setForm] = useState({
        cardNumber: "",
        exp: "",
        cvc: "",
        name: "",
        country: "",
        saveOneTouch: false,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("결제수단이 추가되었습니다.");
    };

    return (
        <div className="payment-page-wrapper">

            {/* LEFT 이미지 슬라이더 */}
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

            {/* RIGHT 결제 폼 */}
            <div className="payment-container">

                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <h1 className="title">결제수단 추가</h1>
                {/* 🔥 문구 삭제됨 */}
                {/* <p className="sub">결제수단을 추가해주세요</p> */}

                <form className="payment-form" onSubmit={handleSubmit}>

                    <label className="input-label">Card Number</label>
                    <input
                        type="text"
                        name="cardNumber"
                        placeholder="4321 4321 4321 4321"
                        value={form.cardNumber}
                        onChange={handleChange}
                        required
                    />

                    <div className="row">
                        <div className="col">
                            <label className="input-label">Exp. Date</label>
                            <input
                                type="text"
                                name="exp"
                                placeholder="02/27"
                                value={form.exp}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col">
                            <label className="input-label">CVC</label>
                            <input
                                type="text"
                                name="cvc"
                                placeholder="123"
                                value={form.cvc}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <label className="input-label">Name on Card</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <label className="input-label">Country or Region</label>
                    <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        required
                    >
                        <option value="United States">United States</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Japan">Japan</option>
                        <option value="China">China</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                    </select>

                    <label className="save-row">
                        <input
                            type="checkbox"
                            name="saveOneTouch"
                            checked={form.saveOneTouch}
                            onChange={handleChange}
                        />
                        저장하고 one 터치로 결제하기
                    </label>

                    <button type="submit" className="payment-btn">
                        결제수단 추가
                    </button>

                    <p className="small-info">
                        By confirming your subscription, you allow our company to charge
                        your card for this payment and future payments in accordance with their terms.
                        You can always cancel your subscription.
                    </p>

                </form>
            </div>
        </div>
    );
};

export default AddPaymentPage;
