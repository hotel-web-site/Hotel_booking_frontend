import React from "react";
import Newsletter from "./Newsletter";
import { socialLinks, footerNavData } from "../../api/mockFooter";
import "../../styles/components/common/Footer.scss";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-wrap">
                <Newsletter />
                <div className="footer-links">
                    <div className="inner">
                        <div className="social-links">
                            <div className="logo">HotelHub</div>
                            <p className="description">
                                혁신적 호텔 여행의 모든 순간, HotelHub과 함께하세요.
                            </p>
                        </div>
                        <div className="footer-menu">

                            <div className="link-columns">
                                {footerNavData.map((column, columnIndex) => (
                                    <div key={columnIndex} className="link-column">
                                        <h4>{column.title}</h4>
                                        <ul>
                                            {column.links.map((link, linkIndex) => (
                                                <li key={linkIndex}>
                                                    <a href={link.href}>{link.name}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="follow-us">
                                <h4 className="follow-title">Follow Us</h4>
                                <div className="follow-icons">
                                    <a href="#" className="follow-link" aria-label="Facebook">
                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="facebook" className="icon-img" />
                                    </a>
                                    <a href="#" className="follow-link" aria-label="Twitter">
                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="twitter" className="icon-img" />
                                    </a>
                                    <a href="#" className="follow-link" aria-label="YouTube">
                                        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="youtube" className="icon-img" />
                                    </a>
                                    <a href="#" className="follow-link" aria-label="Instagram">
                                        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="instagram" className="icon-img" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="inner">
                        <div className="footer-info">
                            <div className="company-info">
                                (주)호텔허브 | 대표: 홍길동 | 사업자등록번호: 123-45-67890
                                <br />
                                주소: 서울특별시 강남구 테헤란로 123, 4567 | 통신판매업신고:
                                제2025-서울강남-1234호
                            </div>
                            <div className="copyright">© 2025 HotelHub Inc. All rights reserved.</div>
                        </div>
                        <div className="footer-contact">
                            <div className="contact-info">
                                고객센터: 1588-0000 (09:00 - 18:00) | 이메일: support@hotelhub.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;