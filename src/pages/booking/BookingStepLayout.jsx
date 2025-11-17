import { Outlet } from "react-router-dom";

const BookingStepLayout = () => {
  return (
    <div>
      <div>{/* 예약 단계 표시 */}</div>
      <Outlet />
    </div>
  );
};

export default BookingStepLayout;
