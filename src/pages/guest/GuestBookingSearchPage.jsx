// src/pages/guest/GuestBookingSearchPage.jsx
import React from "react";
import "../../styles/pages/guest/GuestBookingSearchPage.scss";
import useGuestBookingSearchPage from "./hooks/useGuestBookingSearchPage";

const GuestBookingSearchPage = () => {
    const { form, handleChange, handleSubmit } = useGuestBookingSearchPage();
    return (
        <div className="guest-booking-search">
            <h1 className="title">비회원 예약확인</h1>
            <form className="search-form" onSubmit={handleSubmit}>
                <label>
                    이용자명
                    <input
                        type="text"
                        name="name"
                        placeholder="이름을 입력하세요"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    이용자 전화번호
                    <input
                        type="text"
                        name="phone"
                        placeholder="휴대폰 번호"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    입실일자
                    <input
                        type="date"
                        name="checkIn"
                        value={form.checkIn}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    예약번호
                    <input
                        type="text"
                        name="bookingNumber"
                        placeholder="예: 1234"
                        value={form.bookingNumber}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit" className="submit-btn">
                    조회하기
                </button>
            </form>
        </div>
    );
};

export default GuestBookingSearchPage;
