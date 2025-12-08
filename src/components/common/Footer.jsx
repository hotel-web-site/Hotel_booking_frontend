import React from "react";
import Newsletter from "./Newsletter";
import "../../styles/components/common/Footer.scss";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-wrap">
                <Newsletter />

                <div className="footer-links">
                    <div className="inner">
                        {/* 왼쪽: 로고 + 텍스트 묶음 */}
                        <div className="footer-left">
                            <div className="logo">
                                <img
                                    src="/logo.png"
                                    alt="HotelHub Logo"
                                    className="logo-image"
                                />
                            </div>

                            <div className="footer-text-group">
                                <p className="description">
                                    Team Damin | DM | 대표: 하다민
                                </p>

                                <div className="company-info">
                                    주소: 서울특별시 강남구 역삼로 123, 4층 | 사업자등록번호: 000-00-00000
                                    <br />
                                    통신판매업신고: 제2025-서울강남-0000호
                                </div>

                                <div className="copyright">
                                    © 2025 dm. All rights reserved.
                                </div>

                                <div className="contact-info">
                                    고객센터: 1600-1234 (09:00 - 18:00) | 이메일: support@dm.com
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽 SNS 영역 */}
                        <div className="follow-us">
                            <h4 className="follow-title">Follow Us</h4>
                            <div className="follow-icons">
                                <a href="#" className="follow-link" aria-label="Facebook">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                                        alt="facebook"
                                        className="icon-img"
                                    />
                                </a>
                                <a href="#" className="follow-link" aria-label="Twitter">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                                        alt="twitter"
                                        className="icon-img"
                                    />
                                </a>
                                <a href="#" className="follow-link" aria-label="YouTube">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                                        alt="youtube"
                                        className="icon-img"
                                    />
                                </a>
                                <a href="#" className="follow-link" aria-label="Instagram">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                                        alt="instagram"
                                        className="icon-img"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
