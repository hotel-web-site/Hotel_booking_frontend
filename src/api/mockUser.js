// 임시 유저 데이터
const mockUsers = [
    {
        email: "user@test.com",
        password: "1234",
        name: "홍길동",
        id: 1,
    },
    {
        email: "admin@test.com",
        password: "admin",
        name: "관리자",
        id: 2,
    },
];

// 로그인 인증 함수
export function authenticateUser(email, password) {
    const user = mockUsers.find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        };
    }

    return {
        success: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        token: "mock-access-token",
    };
}
