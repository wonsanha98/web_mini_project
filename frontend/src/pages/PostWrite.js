// src/pages/PostWrite.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PostWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem('access_token');
      
      if (!title.trim() || !content.trim()) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }
      await axios.post(
        'http://localhost:8000/posts',
        {
          title,
          content,
          author: '작성자닉네임',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('게시글이 등록되었습니다.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('게시글 등록 실패');
    }
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        <h2 style={{ color: 'skyblue', marginBottom: '30px' }}> 새 글 작성</h2>

        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        /><br />

        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={textareaStyle}
        /><br />

        <button onClick={handleSubmit} style={buttonStyle}>작성하기</button>
      </div>
    </div>
  );
}

// 스타일 상수 정의
const outerStyle = {
  width: '100vw',
  height: '100vh',
  backgroundColor: 'black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  overflowY: 'auto',
  padding: '40px',
  boxSizing: 'border-box',
};

const innerStyle = {
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  marginBottom: '20px',
  borderRadius: '5px',
  backgroundColor: '#222',
  color: 'white',
  border: '1px solid #555',
};

const textareaStyle = {
  width: '100%',
  height: '200px',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  backgroundColor: '#222',
  color: 'white',
  border: '1px solid #555',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: 'skyblue',
  color: 'black',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
