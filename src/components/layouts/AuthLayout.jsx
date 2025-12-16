import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AuthLayout;
