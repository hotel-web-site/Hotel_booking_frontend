import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../../styles/components/common/Header.scss";
const Header = () => {
  return (
    <header className="site-header">
      <div className="inner">
        {/* 로고 영역 */}
        <h1 className="logo">
          <Link to="/">HotelHub</Link>
        </h1>

        {/* 네비게이션 메뉴 */}
        <nav className="nav">
          <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : "")}>
            호텔검색
          </NavLink>
          {/* <NavLink to="/mypage" className={({ isActive }) => (isActive ? "active" : "")}>
            마이페이지
          </NavLink> */}
          <NavLink to="/support" className={({ isActive }) => (isActive ? "active" : "")}>
            고객센터
          </NavLink>
        </nav>

        {/* 우측 로그인/회원가입 */}
        <div className="auth-links">
          <Link to="/login" className="btn--sm btn--primary">
            로그인
          </Link>
          <Link to="/signup" className="btn--sm btn--outline">
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;