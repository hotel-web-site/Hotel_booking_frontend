import React from "react";
import AppRouter from "./AppRouter"; // 라우트 정의 파일

const App = () => {
  // 백엔드 연결 테스트
  fetch("/api/hotels")
    .then((res) => res.json())
    .then((data) => console.log("✅ GET /api/hotels:", data))
    .catch((err) => console.error("❌ GET /api/hotels error:", err));

  fetch("/api/rooms")
    .then((res) => res.json())
    .then((data) => console.log("✅ GET /api/rooms:", data))
    .catch((err) => console.error("❌ GET /api/rooms error:", err));

  fetch("/api/reviews")
    .then((res) => res.json())
    .then((data) => console.log("✅ GET /api/reviews:", data))
    .catch((err) => console.error("❌ GET /api/reviews error:", err));

  return <AppRouter />;
};

export default App;
