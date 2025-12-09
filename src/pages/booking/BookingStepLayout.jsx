import { Outlet, useLocation, useParams, useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingStepLayout.scss";

const BookingStepLayout = () => {
  const location = useLocation();
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();

  const steps = [
    { path: `/booking/${hotelId}`, label: "날짜 선택" },
    { path: `/booking/${hotelId}/room`, label: "객실 선택" },
    { path: `/booking/${hotelId}/payment`, label: "결제" },
    { path: `/booking/${hotelId}/complete`, label: "완료" }
  ];

  /* ===========================================================
      ⭐ 현재 단계 계산 – URL 기반
     =========================================================== */
  const getCurrentStepIndex = () => {
    const pathname = location.pathname;

    if (pathname.endsWith("/complete")) return 3;
    if (pathname.endsWith("/payment")) return 2;
    if (pathname.endsWith("/room")) return 1;

    // 날짜 선택 단계
    return 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="booking-layout">
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

      <Outlet />
    </div>
  );
};

export default BookingStepLayout;
