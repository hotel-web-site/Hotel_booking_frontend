import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // 로그인 안 된 경우 → 로그인 페이지로 이동
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 로그인 된 경우 → 원래 페이지 렌더링
  return children;
};

export default ProtectedRoute;
