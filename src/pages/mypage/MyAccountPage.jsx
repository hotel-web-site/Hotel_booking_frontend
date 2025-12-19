import React, { useState, useEffect } from "react";
import "../../styles/mypage/MyAccountPage.scss";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import axiosInstance from "../../api/axiosConfig"; // API 연동용

const MyAccountPage = () => {
    const navigate = useNavigate();

    const [coverImage, setCoverImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "********", // 비밀번호는 보안상 표시하지 않음
        phone: "",
        address: "",
        birth: "",
    });

    // 1. 초기 데이터 로드 (백엔드 GET /users/me 호출)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // localStorage 정보보다는 백엔드 최신 데이터를 가져오는 것이 정확합니다.
                const response = await axiosInstance.get("/users/me");
                const user = response.data.data;

                setForm({
                    name: user.name || "",
                    email: user.email || "",
                    password: "********",
                    phone: user.phoneNumber || user.phone || "", // 백엔드 필드명(phoneNumber) 대응
                    address: user.address || "",
                    birth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "", // 날짜 형식 변환
                });

                if (user.profileImg) setProfileImage(user.profileImg);
                // coverImage는 백엔드 스키마에 따라 추가 구현 필요
            } catch (err) {
                console.error("사용자 정보 로드 실패:", err);
                // 토큰 만료 등의 경우 로그인 페이지로 이동
                if (err.response?.status === 401) navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    // 2. 이미지 업로드 (Preview만 생성 - 저장은 API 연동 필요)
    const handleCoverUpload = (e) => {
        const file = e.target.files[0];
        if (file) setCoverImage(URL.createObjectURL(file));
        // TODO: 서버 업로드 API 호출
    };

    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (file) setProfileImage(URL.createObjectURL(file));
        // TODO: 서버 업로드 API 호출
    };

    // 3. 필드별 수정 로직 (백엔드 PATCH /users/me 연동)
    const handleUpdateField = async (key, label) => {
        const newValue = prompt(`${label} 수정:`, form[key] === "********" ? "" : form[key]);

        if (newValue === null || newValue === form[key]) return;

        try {
            setLoading(true);

            // 백엔드 필드명 매핑 (프론트 key -> 백엔드 key)
            const fieldMapping = {
                name: "name",
                phone: "phoneNumber",
                address: "address",
                birth: "dateOfBirth"
            };

            const targetKey = fieldMapping[key] || key;

            // API 호출
            await axiosInstance.patch("/users/me", { [targetKey]: newValue });

            // 로컬 상태 업데이트
            setForm(prev => ({ ...prev, [key]: newValue }));

            // localStorage 정보 동의화 (필요 시)
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...storedUser, [targetKey]: newValue }));

            alert(`${label}이(가) 수정되었습니다.`);
        } catch (err) {
            console.error("수정 실패:", err);
            alert(err.response?.data?.message || "수정 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-page">
            {/* 🔥 공통 프로필 헤더 */}
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
                    { label: "이메일", key: "email", readonly: true }, // 이메일은 보통 수정 불가
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
                                        navigate("/findpassword"); // 비밀번호 변경 페이지로 유도
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