import React, { useState, useEffect } from "react";
import "../../styles/mypage/MyAccountPage.scss";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage"; // ⭐ 추가

const MyAccountPage = () => {
    const navigate = useNavigate();

    const [coverImage, setCoverImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        birth: "",
    });

    // 로그인 정보 불러오기
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);

            setForm({
                name: user.name || "",
                email: user.email || "",
                password: "********",
                phone: user.phone || "",
                address: user.address || "",
                birth: user.birth || "",
            });

            if (user.profileImage) setProfileImage(user.profileImage);
            if (user.coverImage) setCoverImage(user.coverImage);
        }
    }, []);

    // 이미지 업로드 핸들러
    const handleCoverUpload = (e) => {
        const file = e.target.files[0];
        if (file) setCoverImage(URL.createObjectURL(file));
    };

    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (file) setProfileImage(URL.createObjectURL(file));
    };

    const handleInputChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = (key) => {
        alert(`${key} 수정 기능은 API 연동 후 적용됩니다.`);
    };

    return (
        <div className="account-page">

            {/* 🔥 공통 프로필 헤더 적용 */}
            <ProfilePage
                coverImage={coverImage}
                profileImage={profileImage}
                name={form.name}
                email={form.email}
                activeTab="account"
                onCoverUpload={handleCoverUpload}
                onProfileUpload={handleProfileUpload}
            />

            {/* 🔽 아래는 기존 Account 정보 박스만 유지 */}
            <div className="account-box">
                <h2>Account</h2>

                {[
                    { label: "Name", key: "name" },
                    { label: "Email", key: "email" },
                    { label: "Password", key: "password" },
                    { label: "Phone number", key: "phone" },
                    { label: "Address", key: "address" },
                    { label: "Date of birth", key: "birth" },
                ].map((item) => (
                    <div className="account-row" key={item.key}>
                        <div className="account-left">
                            <p className="item-label">{item.label}</p>
                            <p className="item-value">{form[item.key] || "—"}</p>
                        </div>

                        <button
                            className="change-btn"
                            onClick={() => {
                                const newValue = prompt(
                                    `${item.label} 수정:`,
                                    form[item.key] || ""
                                );
                                if (newValue !== null)
                                    handleInputChange(item.key, newValue);

                                handleSave(item.label);
                            }}
                        >
                            Change
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyAccountPage;
