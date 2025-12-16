import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import MyPageLayout from "./components/layouts/MyPageLayout";
import SearchLayout from "./components/layouts/SearchLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AddPaymentPage from "./pages/payment/AddPaymentPage";
import RankingPage from "./pages/ranking/RankingPage";

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

import MyBookingDetail from "./pages/mypage/MyBookingDetailPage";
import MyBookingDetailItem from "./pages/mypage/MyBookingDetailItem";
import MyBookingDetailView from "./pages/mypage/MyBookingDetailView";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import KakaoCallbackPage from "./pages/auth/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";
import FindPasswordPage from "./pages/auth/FindPasswordPage";

import MyAccountPage from "./pages/mypage/MyAccountPage";
import MyPaymentPage from "./pages/mypage/MyPaymentPage";
import ProfilePage from "./pages/mypage/ProfilePage";
import MyBookingsPage from "./pages/mypage/MyBookingsPage";
import MyReviewsPage from "./pages/mypage/MyReviewsPage";
import WishlistPage from "./pages/mypage/WishlistPage";
import MyCouponsPage from "./pages/mypage/MyCouponsPage";
import MyPointsPage from "./pages/mypage/MyPointsPage";
import MyInquiriesPage from "./pages/mypage/MyInquiriesPage";

import FaqPage from "./pages/support/FaqPage";
import NoticeListPage from "./pages/support/NoticeListPage";
import NoticeDetailPage from "./pages/support/NoticeDetailPage";
import Help from "./pages/support/Help";
import ContactPage from "./pages/support/ContactPage";
import InquiryHistoryPage from "./pages/support/InquiryHistoryPage";

import NotFoundPage from "./pages/common/NotFoundPage";
import ScrollToTop from "./components/common/ScrollToTop";

/* ============================
   비회원 예약조회 페이지
============================ */
import GuestBookingSearchPage from "./pages/guest/GuestBookingSearchPage";
import GuestBookingResultPage from "./pages/guest/GuestBookingResultPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ============================
            MAIN LAYOUT (헤더 + 푸터)
        ============================ */}
        <Route path="/" element={<MainLayout />}>

          {/* 홈 */}
          <Route index element={<HomePage />} />

          {/* 호텔 리스트 */}
          <Route path="hotels">
            <Route index element={<HotelListPage />} />
            <Route path=":hotelId" element={<HotelDetailPage />} />
          </Route>

          {/* 검색 페이지 */}
          <Route element={<SearchLayout />}>
            <Route path="search" element={<SearchPage />} />
          </Route>

          {/* 예약 (회원) */}
          <Route
            path="booking/:hotelId"
            element={
              <ProtectedRoute>
                <BookingStepLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<BookingStepDates />} />
            <Route path="room" element={<BookingStepRoom />} />
            <Route path="extras" element={<BookingStepExtras />} />
            <Route path="payment" element={<BookingStepPayment />} />
            <Route path="complete" element={<BookingComplete />} />
          </Route>

          {/* 예약 (비회원) */}
          <Route path="booking-guest/:hotelId" element={<BookingStepLayout />}>
            <Route index element={<BookingStepDates />} />
            <Route path="room" element={<BookingStepRoom />} />
            <Route path="extras" element={<BookingStepExtras />} />
            <Route path="payment" element={<BookingStepPayment />} />
            <Route path="complete" element={<BookingComplete />} />
          </Route>

          {/* ============================
              비회원 예약조회 (NEW)
          ============================ */}
          <Route path="guest">
            <Route path="booking" element={<GuestBookingSearchPage />} />
            <Route path="booking-result" element={<GuestBookingResultPage />} />
          </Route>

          {/* 고객센터 */}
          <Route path="support">
            <Route index element={<FaqPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="notices" element={<NoticeListPage />} />
            <Route path="notices/:noticeId" element={<NoticeDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="help" element={<Help />} />
            <Route path="inquiryhistory" element={<InquiryHistoryPage />} />
          </Route>

          {/* 랭킹 페이지 */}
          <Route path="ranking" element={<RankingPage />} />
        </Route>

        {/* ============================
            MYPAGE (로그인 필요)
        ============================ */}
        <Route
          path="mypage"
          element={
            <ProtectedRoute>
              <MyPageLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyAccountPage />} />
          <Route path="account" element={<MyAccountPage />} />

          <Route path="bookings">
            <Route index element={<MyBookingsPage />} />
            <Route path=":bookingId" element={<MyBookingDetail />} />
            <Route path="view/:bookingId" element={<MyBookingDetailView />} />
            <Route path="item/:bookingId" element={<MyBookingDetailItem />} />
          </Route>

          <Route path="payment" element={<MyPaymentPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="reviews" element={<MyReviewsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="coupons" element={<MyCouponsPage />} />
          <Route path="points" element={<MyPointsPage />} />
          <Route path="inquiries" element={<MyInquiriesPage />} />
        </Route>

        {/* ============================
            인증 레이아웃 (AuthLayout)
        ============================ */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/findpassword" element={<FindPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/add-payment" element={<AddPaymentPage />} />

          <Route
            path="/oauth/kakao/callback"
            element={<KakaoCallbackPage />}
          />
          <Route
            path="/oauth/google/callback"
            element={<GoogleCallbackPage />}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
