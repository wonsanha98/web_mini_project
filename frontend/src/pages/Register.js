// src/pages/Register.js

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import RotatingSphere from '../components/RotatingSphere';


export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8000/register', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('회원가입 실패: 이미 존재하는 사용자일 수 있습니다.');
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
      {/* 상단에 구 삽입 */}
      <RotatingSphere />

      <h2 style={{ color: 'skyblue', marginBottom: '30px' }}>Sign up</h2>

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
        onClick={handleRegister}
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
        Sign up
      </button>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
}
