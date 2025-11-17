import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 로그인 상태 여부
  const isAuthed = !!user;

  // 로그인 처리 (토큰, 유저정보 저장)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 로그아웃 처리
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // 새로고침 후에도 로그인 유지
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthed, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};