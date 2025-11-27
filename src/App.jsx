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

function App() {
  const location = useLocation();  // ← 현재 URL 가져오기

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/payment" element={<AddPaymentPage />} />
        <Route path="/findpassword" element={<FindPasswordPage />} />
        <Route path="/emailauth" element={<EmailAuth />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
      </Routes>

      {/* 새 비밀번호 설정 */}
      <Route path="/resetpassword" element={<ResetPasswordPage />} />  {/* 🔥 핵심 */}
    </Routes>
    <Footer />
    </>
  );
}

export default App;
