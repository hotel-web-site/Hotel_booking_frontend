import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/components/common/Header.scss";

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const { user, logout } = useContext(AuthContext); // 🔹 Context에서 로그인 상태 및 로그아웃 함수 가져오기
    const navigate = useNavigate();
    const isLoggedIn = !!user; // 🔹 로그인 여부 확인

    // 🔹 포인트 상태 (임시로 localStorage 사용, 나중에 백엔드 연동 시 API로 교체)
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem("userPoints");
        if (stored) {
            const num = Number(stored);
            if (!Number.isNaN(num)) setPoints(num);
        }
    }, []);

    const formatPoints = (p) =>
        new Intl.NumberFormat("ko-KR").format(Number(p || 0));

    // 🔹 로그아웃 처리
    const handleLogout = () => {
        logout(); // Context 로그아웃
        navigate("/"); // 로그아웃 후 홈으로 이동
    };

    return (
        <header className="header">
            {/* 🔹 좌측 로고 및 네비게이션 */}
            <div className="header-left">
                <Link to="/" className="logo">
                    <img
                        src="/logo.png"
                        alt="HotelHub Logo"
                        className="logo-image"
                    />
                </Link>

                <nav className="nav">
                    <Link to="/search">호텔검색</Link>
                    <Link to="/support/help">고객센터</Link>
                </nav>
            </div>

            {/* 🔹 우측 로그인/회원가입 또는 사용자 메뉴 */}
            <div className="header-right">
                {/* 🔹 로그아웃 상태일 때 */}
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

                {/* 🔹 로그인 상태일 때 */}
                {isLoggedIn && (
                    <>
                        {/* 🔹 프로필 드롭다운 */}
                        <div className="profile-area">
                            <div
                                className="profile"
                                onClick={() => setOpenMenu(!openMenu)} // 드롭다운 토글
                            >
                                <img
                                    src={
                                        user.profileImg || "/default_profile.png"
                                    }
                                    alt="profile"
                                />
                                <span>{user.nickname}</span>
                            </div>

                            {/* 🔹 드롭다운 메뉴 표시 */}
                            {openMenu && (
                                <div className="profile-menu">
                                    <div className="user-menu-layout">
                                        {/* ◀ 왼쪽: 유저 정보 */}
                                        <div className="left-info">
                                            <div className="avatar">
                                                {user.nickname
                                                    ?.[0]
                                                    ?.toUpperCase()}
                                            </div>
                                            <div className="user-details">
                                                <span className="username">
                                                    {user.nickname}
                                                </span>
                                                <span className="status">
                                                    Online
                                                </span>
                                                {/* 🔹 포인트 표시 */}
                                                <span className="points">
                                                    나의 포인트:{" "}
                                                    <strong>
                                                        {formatPoints(points)}
                                                    </strong>
                                                    P
                                                </span>
                                            </div>
                                        </div>

                                        {/* ▶ 오른쪽: 메뉴 리스트 */}
                                        <div className="right-menu">
                                            <Link
                                                className="item"
                                                to="/mypage/account"
                                            >
                                                계정
                                            </Link>
                                            <Link
                                                className="item"
                                                to="/mypage/bookings/:bookingId"
                                            >
                                                결제내역
                                            </Link>
                                            <Link
                                                className="item"
                                                to="/payment"
                                            >
                                                결제수단
                                            </Link>
                                            <Link
                                                className="item"
                                                to="/mypage/coupons"
                                            >
                                                쿠폰 목록
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="divider"></div>

                                    {/* 🔹 로그아웃 버튼 */}
                                    <button
                                        className="item logout"
                                        onClick={handleLogout}
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
