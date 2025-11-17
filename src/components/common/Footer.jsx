import "./styles/Footer.scss";

const Footer = () => {
    return (
        <footer className="footer">
            {/* ───────────── 구독박스 ───────────── */}
            <div className="subscribe-box">
                <div className="text-area">
                    <h2>구독서비스 신청해보세요</h2>
                    <p>The Travel<br/>구독하고 쿠폰, 최신 이벤트를 받아보세요</p>

                    <div className="input-area">
                        <input type="email" placeholder="Your email address" />
                        <button>Subscribe</button>
                    </div>

                    <div className="sns">
                        <i className="fa-brands fa-facebook-f"></i>
                        <i className="fa-brands fa-twitter"></i>
                        <i className="fa-brands fa-youtube"></i>
                        <i className="fa-brands fa-instagram"></i>
                    </div>
                </div>

                <div className="image-area">
                    <img src="/footer_mailbox.png" alt="mailbox" />
                </div>
            </div>

            {/* ───────────── 푸터 메뉴 ───────────── */}
            <div className="footer-menu">
                <div className="column">
                    <h4>Our Destinations</h4>
                    <p>Canada</p>
                    <p>Alaska</p>
                    <p>France</p>
                    <p>Iceland</p>
                </div>

                <div className="column">
                    <h4>Our Activities</h4>
                    <p>Northern Lights</p>
                    <p>Cruising & sailing</p>
                    <p>Multi-activities</p>
                    <p>Kayaking</p>
                </div>

                <div className="column">
                    <h4>Travel Blogs</h4>
                    <p>Bali Travel Guide</p>
                    <p>Sri Lanka Travel Guide</p>
                    <p>Peru Travel Guide</p>
                    <p>Bali Travel Guide</p>
                </div>

                <div className="column">
                    <h4>About Us</h4>
                    <p>Our Story</p>
                    <p>Work with us</p>
                </div>

                <div className="column">
                    <h4>Contact Us</h4>
                    <p>Our Story</p>
                    <p>Work with us</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
