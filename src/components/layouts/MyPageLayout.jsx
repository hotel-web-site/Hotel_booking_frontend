import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import "../../styles/components/layout/MyPageLayout.scss";

const MyPageLayout = () => {
  return (
    <>
      <Header />
      <div className="mypage-layout">
        <aside>{/* 사이드바 네비게이션 */}</aside>

        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default MyPageLayout;
