import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import "../../styles/components/booking/BookingStepDates.scss";

import { getHotelDetail } from "../../api/hotelClient";

const BookingStepDates = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [hotel, setHotel] = useState(null);

  /* -----------------------------------------------------
     URL에서 받아온 정보 적용
     checkIn, checkOut, adults, children, guests, roomId
  ----------------------------------------------------- */
  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    const a = Number(searchParams.get("adults")) || 2;
    const c = Number(searchParams.get("children")) || 0;

    setAdults(a);
    setChildren(c);

    if (checkIn) {
      setRange({
        from: new Date(checkIn),
        to: checkOut ? new Date(checkOut) : undefined,
      });
    }

    getHotelDetail(hotelId).then((res) => {
      if (res?.hotel) setHotel(res.hotel);
    });
  }, [hotelId, searchParams]);

  /* -----------------------------------------------------
     숙박일수 계산
  ----------------------------------------------------- */
  const calculateNights = () => {
    if (!range?.from || !range?.to) return 0;
    return Math.ceil((range.to - range.from) / (1000 * 60 * 60 * 24));
  };

  /* -----------------------------------------------------
     다음 단계로 이동 (객실 선택)
     URL 파라미터 유지 + 인원 수정 가능
  ----------------------------------------------------- */
  const handleContinue = () => {
    if (!range?.from || !range?.to) {
      alert("날짜를 선택해주세요.");
      return;
    }

    const params = new URLSearchParams();

    // 날짜를 YYYY-MM-DD로 저장
    const formatDate = (d) => format(d, "yyyy-MM-dd");

    params.set("checkIn", formatDate(range.from));
    params.set("checkOut", formatDate(range.to));

    params.set("adults", adults);
    params.set("children", children);
    params.set("guests", adults + children);

    // 기존에 선택한 객실(roomId)
    const roomId = searchParams.get("roomId");
    if (roomId) params.set("roomId", roomId);

    navigate(`/booking/${hotelId}/room?${params.toString()}`);
  };

  return (
    <div className="booking-dates">
      {hotel && (
        <div className="hotel-top-info">
          <h1 className="title">{hotel.name}</h1>
          <div className="meta-row">
            <span className="rating">⭐ {hotel.ratingAverage}</span>
            <span className="location">{hotel.location}</span>
          </div>
        </div>
      )}

      <div className="date-wrapper">
        <div className="date-selection">
          <h2>숙박 날짜를 선택하세요</h2>

          <div className="calendar-wrapper">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              locale={ko}
              disabled={{ before: new Date() }}
            />
          </div>

          {/* ======================================
              투숙객 정보
          ====================================== */}
          <div className="guests-section">
            <h3>투숙객 정보</h3>

            {/* 성인 */}
            <div className="guest-controls">
              <div className="guest-info">
                <div className="guest-type">성인</div>
                <div className="guest-desc">만 19세 이상</div>
              </div>
              <div className="counter">
                <button onClick={() => setAdults(Math.max(1, adults - 1))}>
                  -
                </button>
                <span className="count">{adults}</span>
                <button onClick={() => setAdults(adults + 1)}>+</button>
              </div>
            </div>

            {/* 어린이 */}
            <div className="guest-controls">
              <div className="guest-info">
                <div className="guest-type">어린이</div>
                <div className="guest-desc">만 18세 이하</div>
              </div>
              <div className="counter">
                <button
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children === 0}
                >
                  -
                </button>
                <span className="count">{children}</span>
                <button onClick={() => setChildren(children + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================
            우측 요약 박스
        ====================================== */}
        <div className="booking-summary">
          {hotel && (
            <div className="summary-hotel">
              <img src={hotel.images?.[0] || hotel.image} alt={hotel.name} />
              <div className="detail-row">
                <div>
                  <span className="label">체크인</span>
                  <span className="value">
                    {range?.from ? format(range.from, "PPP", { locale: ko }) : "-"}
                  </span>
                </div>

                <div>
                  <span className="label">체크아웃</span>
                  <span className="value">
                    {range?.to ? format(range.to, "PPP", { locale: ko }) : "-"}
                  </span>
                </div>

                <div>
                  <span className="label">숙박 기간</span>
                  <span className="value">{calculateNights()}박</span>
                </div>

                <div>
                  <span className="label">투숙객</span>
                  <span className="value">
                    성인 {adults}명, 어린이 {children}명 (총 {adults + children}명)
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            className="btn-continue"
            onClick={handleContinue}
            disabled={!range?.from || !range?.to}
          >
            객실 선택하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingStepDates;
