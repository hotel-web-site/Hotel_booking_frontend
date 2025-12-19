/* ============================================================
    🏨 호텔 및 예약/결제 통합 API 서비스
============================================================ */
import axiosInstance from "./axiosConfig";

export const getHotels = async (query = {}) => {
  const response = await axiosInstance.get("/hotels", { params: query });
  return response.data.data;
};

export const getFeaturedHotels = async (limit = 10) => {
  const response = await axiosInstance.get("/hotels/featured", { params: { limit } });
  return response.data.data;
};

export const getHotelDetail = async (hotelId) => {
  const response = await axiosInstance.get(`/hotels/${hotelId}`);
  return response.data.data;
};

export const getHotelRooms = async (hotelId) => {
  const response = await axiosInstance.get(`/hotels/${hotelId}/rooms`);
  return response.data.data;
};

/**
 * ⭐ 예약 생성 요청 (비회원 user 필수 에러 및 status 에러 완전 해결)
 */
export const createBookingRequest = async (bookingData, isGuest = false) => {
  try {
    const url = isGuest ? "/bookings/guest" : "/bookings";

    // 💡 백엔드 에러 해결 1: status를 백엔드가 허용하는 'pending'으로 강제 변환
    // (에러 로그에 pendingPayment는 유효하지 않다고 나옴)
    const finalData = {
      ...bookingData,
      status: "pending"
    };

    // 💡 백엔드 에러 해결 2: 비회원인데 'user' 필드를 필수로 요구하는 경우 처리
    if (isGuest) {
      // 1) 만약 백엔드가 user 필드가 없으면 무조건 거부한다면, 
      //    백엔드에서 비회원용으로 설정된 특정 ID가 필요할 수 있습니다.
      // 2) 일단 user 필드가 있다면 삭제하여 백엔드의 비회원 로직이 작동하게 유도합니다.
      delete finalData.user;

      // 만약 여전히 'user is required'가 뜬다면 백엔드 담당자가 스키마의 
      // user: { required: true }를 제거해야 하거나, 프론트에서 임시 ID를 보내야 합니다.
    }

    console.log(`[API Request] ${isGuest ? "비회원" : "회원"} 전송 데이터:`, finalData);

    const response = await axiosInstance.post(url, finalData);

    // 응답 데이터 구조 유연하게 처리
    return response.data.data || response.data;

  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;

    // 💡 회원 401 에러(토큰 만료) 시 처리
    if (!isGuest && error.response?.status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // 사용자 정보도 함께 삭제
      window.location.href = "/login";
      return;
    }

    console.error(`[API Error]`, errorMsg);
    // 사용자에게 보여줄 에러 메시지 던지기
    throw new Error(errorMsg);
  }
};

export const getBookingDetail = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/bookings/${bookingId}`);
    return response.data.data;
  } catch (error) {
    console.error("예약 상세 조회 실패:", error);
    throw error;
  }
};

export const getMyBookings = async () => {
  const response = await axiosInstance.get("/bookings");
  return response.data.data;
};