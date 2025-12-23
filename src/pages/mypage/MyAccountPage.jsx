import React from "react";
import "../../styles/mypage/MyAccountPage.scss";
import ProfilePage from "./ProfilePage";
import useMyAccountPage from "./hooks/useMyAccountPage";

const MyAccountPage = () => {
    const {
        coverImage,
        profileImage,
        loading,
        form,
        handleCoverUpload,
        handleProfileUpload,
        handleUpdateField,
        navigate,
    } = useMyAccountPage();

    return (
        <div className="account-page">
            <ProfilePage
                coverImage={coverImage}
                profileImage={profileImage}
                name={form.name}
                email={form.email}
                activeTab="account"
                onCoverUpload={handleCoverUpload}
                onProfileUpload={handleProfileUpload}
            />
            <div className="account-box">
                <h2>계정 정보</h2>
                {[
                    { label: "이름", key: "name" },
                    { label: "이메일", key: "email", readonly: true },
                    { label: "비밀번호", key: "password", special: "changePassword" },
                    { label: "전화번호", key: "phone" },
                    { label: "주소", key: "address" },
                    { label: "생년월일", key: "birth" },
                ].map((item) => (
                    <div className="account-row" key={item.key}>
                        <div className="account-left">
                            <p className="item-label">{item.label}</p>
                            <p className="item-value">{form[item.key] || "—"}</p>
                        </div>
                        {!item.readonly && (
                            <button
                                className="change-btn"
                                disabled={loading}
                                onClick={() => {
                                    if (item.special === "changePassword") {
                                        navigate("/findpassword");
                                    } else {
                                        handleUpdateField(item.key, item.label);
                                    }
                                }}
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png"
                                    alt="edit"
                                    className="edit-icon"
                                />
                                수정
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyAccountPage;