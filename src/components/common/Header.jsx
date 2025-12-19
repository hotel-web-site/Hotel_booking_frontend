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
          // 돋보기
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
          // 헤드셋
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
          // 하트
          <svg viewBox="0 0 24 24" className="qm-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 21s-7.2-4.35-9.6-8.4C.6 9.15 2.4 6 6 6c2 0 3.2 1.2 4 2 0.8-0.8 2-2 4-2 3.6 0 5.4 3.15 3.6 6.6C19.2 16.65 12 21 12 21z"
            />
          </svg>
        ),
      },
      {
        key: "guestLookup",
        label: "비회원 예약조회",
        onClick: () => navigate("/guest/booking"),
        icon: (
          // 사용자
          <svg viewBox="0 0 24 24" className="qm-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 12a4 4 0 10-4-4 4 4 0 004 4zm0 2c-4.418 0-8 2.015-8 4.5V21h16v-2.5C20 16.015 16.418 14 12 14z"
            />
          </svg>
        ),
      },
      {
        key: "notice",
        label: "공지사항",
        onClick: () => navigate("/support/notices"),
        icon: (
          // 글로브(공지)
          <svg viewBox="0 0 24 24" className="qm-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.17a15.6 15.6 0 00-1.2-5.02A8.02 8.02 0 0119.93 11zM12 4c.9 0 2.16 2.02 2.79 7H9.21C9.84 6.02 11.1 4 12 4zM4.07 13h3.17a15.6 15.6 0 001.2 5.02A8.02 8.02 0 014.07 13zM7.24 11H4.07a8.02 8.02 0 014.37-5.02A15.6 15.6 0 007.24 11zm2 2h5.52c-.63 4.98-1.89 7-2.76 7-.9 0-2.16-2.02-2.76-7zm6.32 5.02A15.6 15.6 0 0016.76 13h3.17a8.02 8.02 0 01-4.37 5.02z"
            />
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
