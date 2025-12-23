import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosConfig";
import { AuthContext } from "../../../context/AuthContext";
import img1 from "../../../assets/image1.jpeg";
import img2 from "../../../assets/image2.jpeg";
import img3 from "../../../assets/image3.jpeg";

const imageList = [img1, img2, img3];

export default function useLoginPage() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [remember, setRemember] = useState(false);
    const [message, setMessage] = useState("");
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % imageList.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") setRemember(checked);
        else setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await axiosInstance.post("/users/login", {
                email: formData.email,
                password: formData.password,
            });
            const resBody = response.data;
            const resData = resBody.data || resBody;
            const token =
                resData.token ||
                resData.accessToken ||
                resBody.token ||
                resBody.accessToken;
            const user = resData.user || resBody.user;
            if (!token) {
                throw new Error("서버 응답에 인증 토큰이 포함되어 있지 않습니다.");
            }
            const userData = {
                id: user?.id || user?._id,
                email: user?.email,
                nickname: user?.name || user?.nickname || "사용자",
                profileImg: user?.profileImg || "/default_profile.png",
                role: user?.role,
                token: token,
            };
            login(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("accessToken", token);
            localStorage.setItem("token", token);
            const refreshToken = resData.refreshToken || resBody.refreshToken;
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }
            alert("로그인 성공!");
            navigate("/");
        } catch (err) {
            console.error("Login Error Details:", err);
            const errorText =
                err.response?.data?.message ||
                err.message ||
                "로그인에 실패했습니다.";
            setMessage(errorText);
        }
    };

    return {
        apiUrl,
        formData,
        setFormData,
        remember,
        setRemember,
        message,
        setMessage,
        current,
        setCurrent,
        navigate,
        handleChange,
        handleSubmit,
        imageList,
    };
}
