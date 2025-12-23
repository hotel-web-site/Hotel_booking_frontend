import React from "react";
import "../../styles/auth/SignupPage.scss";
import PolicyModal from "../../components/auth/PolicyModal";
import useSignupPage from "./hooks/useSignupPage";

function SignupPage() {
    const {
        apiUrl,
        navigate,
        current,
        setCurrent,
        message,
        setMessage,
        showPw,
        setShowPw,
        showPw2,
        setShowPw2,
        form,
        setForm,
        modal,
        setModal,
        handleChange,
        handleSubmit,
        imageList,
    } = useSignupPage();

    return (
            <div className="page-wrapper">
                <div className="slider-container">
                    <div
                        className="slider-track"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {imageList.map((src, i) => (
                            <img key={i} src={src} className="slide-image" alt={`slide-${i}`} />
                        ))}
                    </div>
                    <div className="indicator-box">
                        {imageList.map((_, i) => (
                            <div
                                key={i}
                                className={`indicator ${current === i ? "active" : ""}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="signup-container">
                    <div className="sign-up-text">
                        <h1>Sign up</h1>
                    </div>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="row">
                            <input
                                type="text"
                                name="first"
                                placeholder="First Name"
                                value={form.first}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="last"
                                placeholder="Last Name"
                                value={form.last}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="row">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="pw-box">
                            <input
                                type={showPw ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                onCopy={e => e.preventDefault()}
                                onPaste={e => e.preventDefault()}
                                onCut={e => e.preventDefault()}
                            />
                            <span className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                                {showPw ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="12" cy="12" rx="8" ry="5" stroke="#222" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="2" fill="#222" />
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="12" cy="12" rx="8" ry="5" stroke="#222" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="2" fill="#222" />
                                        <line x1="4" y1="20" x2="20" y2="4" stroke="#222" strokeWidth="2" />
                                    </svg>
                                )}
                            </span>
                        </div>
                        <div className="pw-box">
                            <input
                                type={showPw2 ? "text" : "password"}
                                name="confirm"
                                placeholder="Confirm Password"
                                value={form.confirm}
                                onChange={handleChange}
                                required
                                onCopy={e => e.preventDefault()}
                                onPaste={e => e.preventDefault()}
                                onCut={e => e.preventDefault()}
                            />
                            <span className="pw-toggle" onClick={() => setShowPw2(!showPw2)}>
                                {showPw2 ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="12" cy="12" rx="8" ry="5" stroke="#222" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="2" fill="#222" />
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="12" cy="12" rx="8" ry="5" stroke="#222" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="2" fill="#222" />
                                        <line x1="4" y1="20" x2="20" y2="4" stroke="#222" strokeWidth="2" />
                                    </svg>
                                )}
                            </span>
                        </div>
                        <label className="agree-row">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={form.agree}
                                onChange={handleChange}
                            />
                            DM HOTEL의
                            <button type="button" className="link-btn" onClick={() => setModal('terms')}>이용 약관</button>
                            및
                            <button type="button" className="link-btn" onClick={() => setModal('privacy')}>개인 정보 보호 정책</button>
                            에 동의하시겠습니까?
                        </label>
                        <button type="submit" className="create-btn">
                            계정 생성
                        </button>
                        <button
                            type="button"
                            className="back-login"
                            onClick={() => navigate("/login")}
                        >
                            로그인
                        </button>
                    </form>
                    {message && <p className="error-msg">{message}</p>}
                    {/* 약관/정책 모달 */}
                {modal === 'terms' && (
                        <PolicyModal
                            title="이용 약관"
                            content={
                                <div>
                                    <p><strong>제1조(목적)</strong><br />이 약관은 DM HOTEL(이하 "회사")가 제공하는 호텔 예약 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                                    <p><strong>제2조(정의)</strong><br />1. "회원"이란 본 약관에 동의하고 DM HOTEL 서비스를 이용하는 자를 말합니다.<br />2. "회사"란 DM HOTEL을 의미합니다.</p>
                                    <p><strong>제3조(서비스의 제공 및 변경)</strong><br />1. 회사는 호텔 예약, 결제, 취소, 후기 작성 등 다양한 서비스를 제공합니다.<br />2. 회사는 서비스의 내용을 변경할 수 있으며, 변경 시 사전 공지합니다.</p>
                                    <p><strong>제4조(회원의 의무)</strong><br />1. 회원은 본 약관 및 관련 법령을 준수해야 하며, 타인의 정보를 도용하거나 허위 정보를 제공해서는 안 됩니다.<br />2. 회원은 서비스 이용 시 선량한 관리자의 주의의무를 다해야 합니다.</p>
                                    <p><strong>제5조(계약 해지 및 이용 제한)</strong><br />1. 회원은 언제든지 서비스 이용을 중단(탈퇴)할 수 있습니다.<br />2. 회사는 회원이 약관을 위반할 경우 서비스 이용을 제한하거나 회원 자격을 박탈할 수 있습니다.</p>
                                    <p><strong>제6조(면책조항)</strong><br />회사는 천재지변, 불가항력적 사유, 회원의 귀책사유로 인한 서비스 장애에 대해 책임을 지지 않습니다.</p>
                                    <p style={{marginTop:'16px', color:'#888'}}>※ 본 약관은 DM HOTEL 서비스 예시이며, 실제 운영 정책에 따라 달라질 수 있습니다.</p>
                                </div>
                            }
                            onClose={() => setModal(null)}
                        />
                    )}
                    {modal === 'privacy' && (
                        <PolicyModal
                            title="개인 정보 보호 정책"
                            content={
                                <div>
                                    <p><strong>1. 수집하는 개인정보 항목</strong><br />DM HOTEL은 회원가입, 예약, 결제, 고객문의 등 서비스 제공을 위해 이름, 이메일, 휴대폰번호, 비밀번호 등 최소한의 개인정보를 수집합니다.</p>
                                    <p><strong>2. 개인정보의 수집 및 이용 목적</strong><br />수집된 개인정보는 회원 식별, 예약/결제 서비스 제공, 고객 문의 응대, 마케팅 및 이벤트 안내 등 DM HOTEL 서비스 운영에 활용됩니다.</p>
                                    <p><strong>3. 개인정보의 보유 및 이용 기간</strong><br />회원 탈퇴 시 또는 관련 법령에 따라 일정 기간 후 안전하게 파기합니다.</p>
                                    <p><strong>4. 개인정보의 제3자 제공</strong><br />DM HOTEL은 원칙적으로 회원의 동의 없이 개인정보를 외부에 제공하지 않으며, 법령에 의거한 경우에만 예외적으로 제공합니다.</p>
                                    <p><strong>5. 이용자의 권리</strong><br />회원은 언제든지 자신의 개인정보를 조회, 수정, 삭제 요청할 수 있으며, DM HOTEL은 이에 신속히 조치합니다.</p>
                                    <p style={{marginTop:'16px', color:'#888'}}>※ 본 방침은 DM HOTEL 서비스 예시이며, 실제 운영 정책에 따라 달라질 수 있습니다.</p>
                                </div>
                            }
                            onClose={() => setModal(null)}
                        />
                    )}
                    <div className="divider">
                        <span>Or Sign up with</span>
                    </div>
                    <div className="social-box">
                        {/* ✅ 수정된 소셜 로그인 박스 */}
                        <button
                            className="social-btn"
                            onClick={() => window.location.href = `${apiUrl}/auth/kakao`}
                        >
                            <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_small.png" alt="카카오 로그인" />
                        </button>
                        <button
                            className="social-btn"
                            onClick={() => window.location.href = `${apiUrl}/auth/google`}
                        >
                            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="구글 로그인" />
                        </button>
                        <button
                            className="social-btn"
                            onClick={() => window.location.href = `${apiUrl}/auth/naver`}
                        >
                            <img src="https://cdn.simpleicons.org/naver/03C75A" alt="네이버 로그인" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    export default SignupPage;