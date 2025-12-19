import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import { format, isBefore, startOfToday } from "date-fns";
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
  const [loading, setLoading] = useState(true);

  // 🔥 비회원 모드 감지 로직 유지
  const isGuest = searchParams.get("guest") === "1";
  const basePath = isGuest ? "/booking-guest" : "/booking";

  /* -----------------------------------------------------
      1. URL 파라미터 적용 및 백엔드 데이터 로드
  ----------------------------------------------------- */
  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    setAdults(Number(searchParams.get("adults")) || 2);
    setChildren(Number(searchParams.get("children")) || 0);

    if (checkIn) {
      const fromDate = new Date(checkIn);
      const toDate = checkOut ? new Date(checkOut) : undefined;

      // 오늘 이전 날짜가 URL에 있을 경우를 대비한 방어 코드
      const today = startOfToday();
      setRange({
        from: isBefore(fromDate, today) ? today : fromDate,
        to: toDate && isBefore(toDate, fromDate) ? undefined : toDate,
      });
    }

    // 백엔드 API 호출
    setLoading(true);
    getHotelDetail(hotelId)
      .then((res) => {
        // 백엔드 응답 구조(res.hotel 또는 res)에 유연하게 대응
        const hotelData = res?.hotel || res;
        if (hotelData) setHotel(hotelData);
      })
      .catch((err) => console.error("호텔 정보 로드 실패:", err))
      .finally(() => setLoading(false));
  }, [hotelId, searchParams]);

  /* -----------------------------------------------------
      2. 숙박일수 계산 (안정성 강화)
  ----------------------------------------------------- */
  const calculateNights = () => {
    if (!range?.from || !range?.to) return 0;
    const diffTime = Math.abs(range.to - range.from);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  /* -----------------------------------------------------
      3. 다음 단계로 이동 (URL 파라미터 직렬화)
  ----------------------------------------------------- */
  const handleContinue = () => {
    if (!range?.from || !range?.to) {
      alert("체크인과 체크아웃 날짜를 모두 선택해주세요.");
      return;
    }

    const params = new URLSearchParams(searchParams); // 기존 파라미터 복사

    const formatDate = (d) => format(d, "yyyy-MM-dd");
    params.set("checkIn", formatDate(range.from));
    params.set("checkOut", formatDate(range.to));
    params.set("adults", adults);
    params.set("children", children);
    params.set("guests", adults + children);

    // 비회원/회원 모드 상태값 보존
    if (isGuest) params.set("guest", "1");

    navigate(`${basePath}/${hotelId}/room?${params.toString()}`);
  };

  if (loading) return <div className="booking-dates loading">호텔 정보를 확인 중입니다...</div>;

  return (
    <div className="booking-dates">
      {hotel && (
        <div className="hotel-top-info">
          {/* 백엔드 필드명(name) 대응 */}
          <h1 className="title">{hotel.name}</h1>
          <div className="meta-row">
            {/* 백엔드 평점 필드(ratingAverage) 대응 */}
            <span className="rating">⭐ {hotel.ratingAverage || hotel.rating || "0.0"}</span>
            <span className="location">{hotel.address || hotel.location}</span>
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
              disabled={{ before: new Date() }} // 오늘 이전 날짜 선택 불가
              defaultMonth={range?.from || new Date()}
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
                <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                <span className="count">{adults}</span>
                <button type="button" onClick={() => setAdults(adults + 1)}>+</button>
              </div>
            </div>

            <div className="guest-controls">
              <div className="guest-info">
                <div className="guest-type">어린이</div>
                <div className="guest-desc">만 18세 이하</div>
              </div>
              <div className="counter">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children === 0}
                >
                  -
                </button>
                <span className="count">{children}</span>
                <button type="button" onClick={() => setChildren(children + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-summary">
          {hotel && (
            <div className="summary-hotel">
              {/* 이미지 배열 혹은 단일 문자열 대응 */}
              <img
                src={Array.isArray(hotel.images) ? hotel.images[0] : (hotel.images || hotel.image || "/default-hotel.jpg")}
                alt={hotel.name}
              />
              <div className="detail-row">
                <div>
                  <span className="label">체크인</span>
                  <span className="value">
                    {range?.from ? format(range.from, "PPP", { locale: ko }) : "날짜 선택"}
                  </span>
                </div>

                <div>
                  <span className="label">체크아웃</span>
                  <span className="value">
                    {range?.to ? format(range.to, "PPP", { locale: ko }) : "날짜 선택"}
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