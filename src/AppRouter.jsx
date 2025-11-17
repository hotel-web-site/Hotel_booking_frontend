import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import MyPageLayout from "./components/layouts/MyPageLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// pages
import HomePage from "./pages/home/HomePage";
import SearchPage from "./pages/search/SearchPage";
import HotelListPage from "./pages/search/HotelListPage";
import HotelDetailPage from "./pages/hotel/HotelDetailPage";

import BookingStepLayout from "./pages/booking/BookingStepLayout";
import BookingStepDates from "./pages/booking/BookingStepDates";
import BookingStepRoom from "./pages/booking/BookingStepRoom";
import BookingStepExtras from "./pages/booking/BookingStepExtras";
import BookingStepPayment from "./pages/booking/BookingStepPayment";
import BookingComplete from "./pages/booking/BookingComplete";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import KakaoCallbackPage from "./pages/auth/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";

import MyOverviewPage from "./pages/mypage/MyOverviewPage";
import ProfilePage from "./pages/mypage/ProfilePage";
import MyBookingsPage from "./pages/mypage/MyBookingsPage";
import MyBookingDetailPage from "./pages/mypage/MyBookingDetailPage";
import MyReviewsPage from "./pages/mypage/MyReviewsPage";
import WishlistPage from "./pages/mypage/WishlistPage";
import MyCouponsPage from "./pages/mypage/MyCouponsPage";
import MyPointsPage from "./pages/mypage/MyPointsPage";
import MyInquiriesPage from "./pages/mypage/MyInquiriesPage";

import FaqPage from "./pages/support/FaqPage";
import NoticeListPage from "./pages/support/NoticeListPage";
import NoticeDetailPage from "./pages/support/NoticeDetailPage";
import ContactPage from "./pages/support/ContactPage";

import NotFoundPage from "./pages/common/NotFoundPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* main landing */}
        <Route path="/" element={<MainLayout />}>
          {/* 검색 / 리스트 */}
          <Route index element={<HomePage />} />

          <Route path="search" element={<SearchPage />} />
          <Route path="hotels">
            <Route index element={<HotelListPage />} />
            <Route path=":hotelId" element={<HotelDetailPage />} />
          </Route>
        </Route>
        {/* 예약 플로우 - 로그인 필요 */}
        <Route
          path="booking/:hotelId"
          element={
            <ProtectedRoute>
              <BookingStepLayout />
            </ProtectedRoute>
          }
        >
          {/* /booking/:hotelId */}
          <Route index element={<BookingStepDates />} />
          {/* /booking/:hotelId/room */}
          <Route path="room" element={<BookingStepRoom />} />
          {/* /booking/:hotelId/extras */}
          <Route path="extras" element={<BookingStepExtras />} />
          {/* /booking/:hotelId/payment */}
          <Route path="payment" element={<BookingStepPayment />} />
          {/* /booking/:hotelId/complete */}
          <Route path="complete" element={<BookingComplete />} />
        </Route>

        {/* 고객센터 / 공지 / FAQ / 문의 */}
        <Route path="support">
          <Route index element={<FaqPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="notices" element={<NoticeListPage />} />
          <Route path="notices/:noticeId" element={<NoticeDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* 마이페이지 - 로그인 필요 */}
        <Route
          path="mypage"
          element={
            <ProtectedRoute>
              <MyPageLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyOverviewPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="bookings">
            <Route index element={<MyBookingsPage />} />
            <Route path=":bookingId" element={<MyBookingDetailPage />} />
          </Route>
          <Route path="reviews" element={<MyReviewsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="coupons" element={<MyCouponsPage />} />
          <Route path="points" element={<MyPointsPage />} />
          <Route path="inquiries" element={<MyInquiriesPage />} />
        </Route>

        {/* 인증 레이아웃: 헤더 최소, 센터 정렬 등 */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />

          {/* 소셜 로그인 콜백 (카카오, 구글) */}
          <Route path="oauth">
            <Route path="kakao/callback" element={<KakaoCallbackPage />} />
            <Route path="google/callback" element={<GoogleCallbackPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
