// src/components/NavBar.js

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const handleWheel = (event) => {
      // 기존 timeout이 있다면 제거
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 일정 시간 후에 처리 (디바운스 효과)
      timeoutRef.current = setTimeout(() => {
        if (event.deltaY > 5) {
          setShowNav(false); // 꽤 아래로 스크롤했을 때만 NavBar 숨김
        } else if (event.deltaY < -5) {
          setShowNav(true);  // 꽤 위로 올렸을 때만 다시 표시
        }
      }, 100); // 100ms 동안의 휠 동작을 모아서 반응
    };

    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_id');
    alert("로그아웃 되었습니다.");
    setIsAuthenticated(false);
    navigate('/login');
  };

  const linkStyle = {
    color: 'skyblue', //링크 글색
    textDecoration: 'none',
    fontSize: '16px'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: showNav ? '20px' : '-80px',
        left: '50%',
        transform: 'translateX(-50%)',
        transition: 'top 0.4s ease',
        zIndex: 10,
        backdropFilter: 'blur(10px)',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '10px 20px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}
    >
      <Link to="/" style={linkStyle}>홈</Link>
      <Link to="/list" style={linkStyle}>목록</Link>
      <Link to="/write" style={linkStyle}>글쓰기</Link>
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          style={{
            ...linkStyle,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          로그아웃
        </button>
      ) : (
        <>
          <Link to="/login" style={linkStyle}>로그인</Link>
          <Link to="/register" style={linkStyle}>회원가입</Link>
        </>
      )}
    </div>
  );
}

