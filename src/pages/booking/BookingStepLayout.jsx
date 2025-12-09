import { Outlet, useLocation, useParams } from "react-router-dom";
import "../../styles/components/booking/BookingStepLayout.scss";

const BookingStepLayout = () => {
  const location = useLocation();
  const { hotelId } = useParams();

  const steps = [
    { path: `/booking/${hotelId}`, label: "날짜 선택", exact: true },
    { path: `/booking/${hotelId}/room`, label: "객실 선택", exact: false },
    { path: `/booking/${hotelId}/payment`, label: "결제", exact: false },
    { path: `/booking/${hotelId}/complete`, label: "완료", exact: false }
  ];

  const getCurrentStepIndex = () => {
    const pathname = location.pathname;

    if (pathname.includes("/complete")) return 3;
    if (pathname.includes("/payment")) return 2;
    if (pathname.includes("/room")) return 1;

    // 날짜 선택 단계인데 객실에서 예약하기 버튼을 통해 진입한 경우
    if (pathname === `/booking/${hotelId}`) {
      if (location.state?.selectedRoomId) {
        return 1; // 객실 자동 선택이므로 객실 선택 단계 활성화
      }
      return 0; // 기본 접근 → 날짜 선택 단계
    }

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
