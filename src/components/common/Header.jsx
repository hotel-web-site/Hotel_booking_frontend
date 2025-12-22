// src/components/common/Header.jsx
import { useState, useContext, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/components/common/Header.scss";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!user;

  const [points, setPoints] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("userPoints");
    if (stored) {
      const num = Number(stored);
      if (!Number.isNaN(num)) setPoints(num);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatPoints = (p) => new Intl.NumberFormat("ko-KR").format(Number(p || 0));

  // ⭐ 페이지 이동 시 프로필 메뉴 자동 닫기
  useEffect(() => {
    setOpenMenu(false);
  }, [location]);

  return (
    <>
      <header className="header">
        {/* LEFT: 로고 */}
        <div className="header-left">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="HotelHub Logo" className="logo-image" />
          </Link>
        </div>

        {/* ✅ CENTER 메뉴 제거 */}

        {/* RIGHT: 로그인 / 프로필 */}
        <div className="header-right">
          {!isLoggedIn && (
            <>
              <Link to="/login" className="btn login-btn">
                로그인
              </Link>
              <Link to="/signup" className="btn signup-btn">
                회원가입
              </Link>
            </>
          )}

          {isLoggedIn && (
            <div className="profile-area">
              {/* 프로필 버튼 */}
              <div className="profile" onClick={() => setOpenMenu(!openMenu)}>
                <img src={user.profileImg || "/default_profile.png"} alt="profile" />
                <span>{user.nickname}</span>
              </div>

              {/* 드롭다운 메뉴 */}
              {openMenu && (
                <div className="profile-menu" onMouseLeave={() => setOpenMenu(false)}>
                  <div className="user-menu-layout">
                    <div className="left-info">
                      <div className="avatar">{user.nickname?.[0]?.toUpperCase()}</div>
                      <div className="user-details">
                        <span className="username">{user.nickname}</span>
                        <span className="status">Online</span>
                        <span className="points">
                          나의 포인트: <strong>{formatPoints(points)}</strong>P
                        </span>
                      </div>
                    </div>

                    <div className="right-menu">
                      <Link className="item" to="/mypage/account">
                        계정
                      </Link>
                      <Link className="item" to="/mypage/bookings">
                        결제내역
                      </Link>
                      <Link className="item" to="/mypage/payment">
                        결제수단
                      </Link>
                      <Link className="item" to="/mypage/coupons">
                        쿠폰 목록
                      </Link>
                      <Link className="item" to="/mypage/reviews">
                        내 리뷰
                      </Link>
                      <Link className="item" to="/mypage/wishlist">
                        찜 목록
                      </Link>
                    </div>
                  </div>

                  <div className="divider"></div>
                  <button className="logout" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ✅ 헤더에서 뺀 메뉴들을 이미지처럼 플로팅 메뉴로 */}
      <FloatingQuickMenu />
    </>
  );
};

export default Header;

/* ===============================
   Floating Quick Menu
   - 이미지처럼 오른쪽 아래 고정
   - + 버튼으로 펼치기/접기
================================ */
const FloatingQuickMenu = () => {
  const [open, setOpen] = useState(true); // 원하면 false로 시작(접힌 상태)
  const navigate = useNavigate();
  const location = useLocation();

  // 페이지 이동하면 자동으로 접히게(원하면 제거 가능)
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const items = useMemo(
    () => [
      {
        key: "search",
        label: "호텔검색",
        onClick: () => navigate("/search"),
        icon: (
          <svg viewBox="0 0 24 24" className="qm-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
            />
          </svg>
        ),
      },

      {
        key: "support",
        label: "고객센터",
        onClick: () => navigate("/support/help"),
        icon: (
          <svg viewBox="0 0 24 24" className="qm-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3a8 8 0 00-8 8v5a3 3 0 003 3h1v-7H7v-1a5 5 0 0110 0v1h-1v7h1a3 3 0 003-3v-5a8 8 0 00-8-8z"
            />
          </svg>
        ),
      },

      {
        key: "guestReserve",
        label: "비회원 예약",
        onClick: () => navigate("/search?guest=1"),
        icon: (
          <svg
            viewBox="0 0 24 24"
            className="qm-icon"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
            <path d="M4 20c0-3.31 3.58-6 8-6" />
            <path d="M16 18l2 2 4-4" />
          </svg>
        ),
      },

      {
        key: "guestLookup",
        label: "비회원 예약조회",
        onClick: () => navigate("/guest/booking"),
        icon: (
          <svg
            viewBox="0 0 24 24"
            className="qm-icon"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 네모 문서 */}
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />

            {/* 돋보기 (정중앙) */}
            <circle cx="11" cy="11" r="3" />
            <path d="M14 14l3 3" />
          </svg>
        ),
      },

      {
        key: "notice",
        label: "공지사항",
        onClick: () => navigate("/support/notices"),
        icon: (
          <svg viewBox="0 0 24 24" className="qm-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.17a15.6 15.6 0 00-1.2-5.02A8.02 8.02 0 0119.93 11zM12 4c.9 0 2.16 2.02 2.79 7H9.21C9.84 6.02 11.1 4 12 4zM4.07 13h3.17a15.6 15.6 0 001.2 5.02A8.02 8.02 0 014.07 13zM7.24 11H4.07a8.02 8.02 0 014.37-5.02A15.6 15.6 0 007.24 11zm2 2h5.52c-.63 4.98-1.89 7-2.76 7-.9 0-2.16-2.02-2.76-7zm6.32 5.02A15.6 15.6 0 0016.76 13h3.17a8.02 8.02 0 01-4.37 5.02z"
            />
          </svg>
        ),
      },

      /* ✅ 위로 가기 버튼 */
      {
        key: "scrollTop",
        label: "위로",
        onClick: () =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          }),
        icon: (
          <svg
            viewBox="0 0 24 24"
            className="qm-icon"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        ),
      },
    ],
    [navigate]
  );


  return (
    <div className="quick-menu">
      <div className={`quick-menu__stack ${open ? "is-open" : ""}`}>
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            className="quick-menu__btn"
            onClick={it.onClick}
            aria-label={it.label}
            title={it.label}
          >
            {it.icon}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="quick-menu__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "퀵메뉴 접기" : "퀵메뉴 펼치기"}
        title={open ? "접기" : "펼치기"}
      >
        <span className={`qm-plus ${open ? "is-open" : ""}`}>+</span>
      </button>
    </div>
  );
};
