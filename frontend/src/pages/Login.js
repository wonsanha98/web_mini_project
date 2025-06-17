
// src/pages/Login.js
import { useState } from 'react';
import axios from 'axios';

import RotatingSphere from '../components/RotatingSphere';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', new URLSearchParams({
        username: username,
        password: password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, user_id } = response.data;
      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('user_id', user_id);
      alert('로그인 성공!');
      window.location.href = '/';
    } catch (err) {
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      overflowY: 'auto',
    }}>
      
      {/* 문구: 상단 중앙 정렬 */}
      <p style={{
        color: 'gray',
        fontSize: '18px',
        textAlign: 'center',
        marginTop: '80px',
        marginBottom: '20px'
      }}>
        One post. One comment. One shared space.
      </p>
  
      {/* 회전 구체 */}
      <RotatingSphere />
  
      {/* 로그인 폼 */}
      <h2 style={{ color: 'skyblue', marginBottom: '30px' }}>Login</h2>
      
      <input
        type="text"
        placeholder="ID"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: '300px',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '20px',
          color: 'white',
          backgroundColor: '#222',
          borderRadius: '5px'
        }}
      /><br />
  
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: '300px',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '20px',
          color: 'white',
          backgroundColor: '#222',
          borderRadius: '5px'
        }}
      /><br />
  
      <button
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'skyblue',
          color: 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Login
      </button>
  
      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
}

