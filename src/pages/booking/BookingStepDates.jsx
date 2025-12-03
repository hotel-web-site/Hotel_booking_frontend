import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import "../../styles/components/booking/BookingStepDates.scss";

const BookingStepDates = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    // URL 파라미터에서 데이터 가져오기
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = searchParams.get("guests");

    if (checkIn) {
      setRange({
        from: new Date(checkIn),
        to: checkOut ? new Date(checkOut) : undefined,
      });
    }
    if (guests) setAdults(parseInt(guests));

    // TODO: 호텔 정보 API 호출
    setHotel({
      _id: hotelId,
      name: "그랜드 호텔 서울",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      rating: 4.5,
    });
  }, [hotelId, searchParams]);

  const calculateNights = () => {
    if (!range?.from || !range?.to) return 0;
    const diffTime = Math.abs(range.to - range.from);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleContinue = () => {
    if (!range?.from || !range?.to) {
      alert("날짜를 선택해주세요");
      return;
    }
    const params = new URLSearchParams();
    params.append("checkIn", range.from.toISOString());
    params.append("checkOut", range.to.toISOString());
    params.append("adults", adults);
    params.append("children", children);
    navigate(`/booking/${hotelId}/room?${params.toString()}`);
  };

  return (
    <div className="booking-dates">
      <div className="booking-header">
        <h1>날짜 및 인원 선택</h1>
        {hotel && (
          <div className="hotel-info">
            <span className="hotel-name">{hotel.name}</span>
            <span>⭐ {hotel.rating}</span>
          </div>
        )}
      </div>
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
              modifiersClassNames={{
                selected: "day-selected",
                today: "day-today",
                disabled: "day-disabled",
              }}
            />
          </div>

          <div className="guests-section">
            <h3>투숙객 정보</h3>
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
                <button onClick={() => setAdults(Math.min(10, adults + 1))}>
                  +
                </button>
              </div>
            </div>

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
                <button onClick={() => setChildren(Math.min(10, children + 1))}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-summary">
            {hotel && (
              <div className="summary-hotel">
                <img src={hotel.image} alt={hotel.name} />
                <div className="detail-row">

                  <div className="ditail-in">
                    <span className="label">체크인</span>
                    <span className="value">
                      {range?.from
                        ? format(range.from, "PPP", { locale: ko })
                        : "-"}
                    </span>
                  </div>
                  <div className="ditail-in">
                    <span className="label">체크아웃</span>
                    <span className="value">
                      {range?.to ? format(range.to, "PPP", { locale: ko }) : "-"}
                    </span>
                  </div>
                  <div className="ditail-in">
                    <div>
                      <span className="label">숙박 기간</span>
                      <span className="value">{calculateNights()}박</span>
                    </div>
                    <div>
                      <span className="label">투숙객 정보</span>
                      <span className="value">
                        {adults}명 성인, {children}명 어린이
                      </span>
                    </div>
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