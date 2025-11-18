import "./styles/Footer.scss";

const Footer = () => {
    return (
        <footer className="footer">
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
