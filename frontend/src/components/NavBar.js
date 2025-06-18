// src/components/NavBar.js

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_id');
    alert("로그아웃 되었습니다.")
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="retro-navbar">
      <Link to="/">✉ 목록</Link> |{' '}
      <Link to="/write">🖋 글쓰기</Link> |{' '}
      {isAuthenticated ? (
        <button className="retro-button" onClick={handleLogout} style={{ marginLeft: '10px' }}>로그아웃</button>
      ) : (
        <>
          <Link to="/login"> 로그인</Link> |{' '}
          <Link to="/register">✎회원가입</Link>
        </>
      )}
    </nav>
  );
}
