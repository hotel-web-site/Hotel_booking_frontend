// src/components/common/Header.jsx
import { useState, useContext, useEffect } from "react";
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

    const formatPoints = (p) =>
        new Intl.NumberFormat("ko-KR").format(Number(p || 0));

    // ⭐ 페이지 이동 시 프로필 메뉴 자동 닫기
    useEffect(() => {
        setOpenMenu(false);
    }, [location]);

    return (
        <header className="header">
            {/* LEFT: 로고 */}
            <div className="header-left">
                <Link to="/" className="logo">
                    <img
                        src="/logo.png"
                        alt="HotelHub Logo"
                        className="logo-image"
                    />
                </Link>
            </div>

            {/* CENTER: 메뉴 */}
            <div className="header-center">
                <nav className="nav">
                    <Link to="/search">호텔검색</Link>
                    <Link to="/support/help">고객센터</Link>
                    <Link to="/search?guest=1">비회원 예약</Link>
                    <Link to="/guest/booking">비회원 예약조회</Link>
                    <Link to="/support/notices">공지사항</Link>
                </nav>
            </div>

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
                        <div
                            className="profile"
                            onClick={() => setOpenMenu(!openMenu)}
                        >
                            <img
                                src={user.profileImg || "/default_profile.png"}
                                alt="profile"
                            />
                            <span>{user.nickname}</span>
                        </div>

                        {/* 드롭다운 메뉴 */}
                        {openMenu && (
                            <div
                                className="profile-menu"
                                onMouseLeave={() => setOpenMenu(false)}
                            >
                                <div className="user-menu-layout">
                                    <div className="left-info">
                                        <div className="avatar">
                                            {user.nickname?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="user-details">
                                            <span className="username">{user.nickname}</span>
                                            <span className="status">Online</span>
                                            <span className="points">
                                                나의 포인트:{" "}
                                                <strong>{formatPoints(points)}</strong>P
                                            </span>
                                        </div>
                                    </div>

                                    <div className="right-menu">
                                        <Link className="item" to="/mypage/account">
                                            계정
                                        </Link>
                                        <Link className="item" to="/mypage/bookings/:bookingId">
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
    );
};

export default Header;
