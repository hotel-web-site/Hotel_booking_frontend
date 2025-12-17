import React from "react";
import { Outlet, useLocation, useParams, useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingStepLayout.scss";

const BookingStepLayout = () => {
  const location = useLocation();
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();

  // ⭐ booking / booking-guest 구분
  const isGuest = location.pathname.startsWith("/booking-guest");
  const basePath = isGuest ? "/booking-guest" : "/booking";

  // ⭐ 단계별 라벨 및 경로
  const steps = [
    { path: `${basePath}/${hotelId}`, label: "날짜 선택" },
    { path: `${basePath}/${hotelId}/room`, label: "객실 선택" },
    { path: `${basePath}/${hotelId}/payment`, label: "결제" },
    { path: `${basePath}/${hotelId}/complete`, label: "완료" }
  ];

  // ⭐ 현재 단계 인덱스 계산
  const getCurrentStepIndex = () => {
    const pathname = location.pathname;

    if (pathname.endsWith("/complete")) return 3;
    if (pathname.endsWith("/payment")) return 2;
    if (pathname.endsWith("/room")) return 1;

    return 0; // 날짜 선택
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="booking-layout">
      {/* 진행상태 바 */}
      <div className="booking-progress">
        {steps.map((step, index) => (
          <div
            key={step.path}
            className={`progress-step ${
              index <= currentStepIndex ? "active" : ""
            } ${index === currentStepIndex ? "current" : ""}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step.label}</div>
            {index < steps.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      {/* 하위 페이지 */}
      <Outlet />
    </div>
  );
};

export default BookingStepLayout;
