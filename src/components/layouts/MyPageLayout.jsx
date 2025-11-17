import { Outlet } from "react-router-dom";

const MyPageLayout = () => {
  return (
    <div className="mypage-layout">
      <aside>{/* 사이드바 네비게이션 */}</aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MyPageLayout;
