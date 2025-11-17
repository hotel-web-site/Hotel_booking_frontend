import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Header.scss";

const Header = ({ user }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const isLoggedIn = !!user;

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">HotelHub</Link>

                <nav className="nav">
                    <Link to="/search">호텔검색</Link>
                    <Link to="/help">고객센터</Link>
                </nav>
            </div>

            <div className="header-right">
                {/* 🔹 로그아웃 상태 */}
                {!isLoggedIn && (
                    <>
                        <Link to="/login" className="btn login-btn">로그인</Link>
                        <Link to="/signup" className="btn signup-btn">회원가입</Link>
                    </>
                )}

                {/* 🔹 로그인 상태 */}
                {isLoggedIn && (
                    <>
                        {/* ❤️ 찜하기 */}
                        <Link to="/wishlist" className="wish-btn">
                            <i className="fa-regular fa-heart"></i>
                            찜하기
                        </Link>

                        {/* 👤 프로필 */}
                        <div className="profile-area">
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

                            {/* 🔽 드롭다운 메뉴 */}
                            {openMenu && (
                                <div className="profile-menu">
                                    <Link className="item" to="/profile">계정</Link>
                                    <Link className="item" to="/payments">결제내역</Link>
                                    <Link className="item" to="/settings">설정</Link>

                                    <div className="divider"></div>

                                    <Link className="item logout" to="/logout">
                                        로그아웃
                                    </Link>
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
