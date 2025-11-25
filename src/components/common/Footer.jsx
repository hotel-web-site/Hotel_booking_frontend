import React from "react";
import { socialLinks, footerNavData } from "../../api/mockFooter";
import "../../styles/components/common/Footer.scss";

const Footer = () => {
    return (
        <footer className="footer">

            {/* 🔥 Newsletter Area – Figma 그대로 */}
            <div className="newsletter-wrapper">

                <div className="newsletter-text">
                    <h2>구독서비스 신청해보세요</h2>

                    <div className="newsletter-subtitle">The Travel</div>
                    <p>구독하고 쿠폰, 최신 이벤트를 받아보세요</p>

                    <div className="newsletter-form">
                        <input type="email" placeholder="Your email address" />
                        <button>Subscribe</button>
                    </div>
                </div>

                {/* 우측 우체통 이미지 */}
                <div className="newsletter-image"></div>
            </div>

            {/* 🔥 Footer Links */}
            <div className="footer-links">
                <div className="inner">
                    
                    {/* 소셜 아이콘 */}
                    <div className="social-section">
                        <div className="social-icons">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className={`social-link ${social.className}`}
                                ></a>
                            ))}
                        </div>
                    </div>

                    {/* 네비게이션 컬럼 */}
                    <div className="link-columns">
                        {footerNavData.map((column, idx) => (
                            <div key={idx} className="link-column">
                                <h4>{column.title}</h4>
                                <ul>
                                    {column.links.map((link, i) => (
                                        <li key={i}>
                                            <a href={link.href}>{link.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Follow Us */}
                    <div className="follow-us">
                        <h4>Follow Us</h4>
                        <div className="follow-icons">
                            <a className="follow-link facebook"></a>
                            <a className="follow-link instagram"></a>
                            <a className="follow-link youtube"></a>
                        </div>
                    </div>

                </div>
            </div>

            {/* 🔥 Footer Bottom */}
            <div className="footer-bottom">
                <div className="inner">
                    <div className="company-info">
                        (주)호텔허브 | 대표: 홍길동 | 사업자등록번호: 123-45-67890 <br />
                        주소: 서울특별시 강남구 테헤란로 123, 4567 | 통신판매업신고: 제2025-서울강남-1234호
                    </div>

                    <div className="copyright">
                        © 2025 HotelHub Inc. All rights reserved.
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
