import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import FindPasswordPage from "./pages/auth/FindPasswordPage";
import EmailAuth from "./pages/auth/EmailAuth";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";   // 🔥 추가

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/loginpage" element={<LoginPage />} />

      <Route path="/signuppage" element={<SignupPage />} />

      {/* 비밀번호 찾기 (이메일 입력 화면) */}
      <Route path="/findpassword" element={<FindPasswordPage />} />

      {/* 이메일 인증 */}
      <Route path="/emailauth" element={<EmailAuth />} />

      {/* 새 비밀번호 설정 */}
      <Route path="/resetpassword" element={<ResetPasswordPage />} />  {/* 🔥 핵심 */}
    </Routes>
  );
}

export default App;
