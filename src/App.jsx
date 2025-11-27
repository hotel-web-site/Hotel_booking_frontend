import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import FindPasswordPage from "./pages/auth/FindPasswordPage";
import EmailAuth from "./pages/auth/EmailAuth";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import HomePage from "./pages/home/HomePage";
import AddPaymentPage from "./pages/payment/AddPaymentPage";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import MyAccountPage from "./pages/mypage/MyAccountPage";
import MyBookingDetailPage from "./pages/mypage/MyBookingDetailPage";
import MyPaymentPage from "./pages/mypage/MyPaymentPage"

function App() {
  const location = useLocation();  // ← 현재 URL 가져오기

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/myaccountpage" element={<MyAccountPage/>}/>
        <Route path="/mybookingdetailpage" element={<MyBookingDetailPage/>}/>
        <Route path="/mypaymentpage" element={<MyPaymentPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/payment" element={<AddPaymentPage />} />
        <Route path="/findpassword" element={<FindPasswordPage />} />
        <Route path="/emailauth" element={<EmailAuth />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
