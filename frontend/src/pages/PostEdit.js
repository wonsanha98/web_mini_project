// src/pages/PostEdit.js

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    author: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(() => alert("게시글을 불러올 수 없습니다."));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const token = sessionStorage.getItem('access_token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.title.trim() || !post.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await axios.patch(`http://localhost:8000/posts/${id}`, post, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      alert("게시글이 수정되었습니다.");
      navigate(`/post/${id}`);
    } catch {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        <h2 style={{ color: 'skyblue', marginBottom: '30px' }}>게시글 수정</h2>

        <input
          type="text"
          name="title"
          placeholder="제목을 입력하세요"
          value={post.title}
          onChange={handleChange}
          style={inputStyle}
        /><br />

        <textarea
          name="content"
          placeholder="내용을 입력하세요"
          value={post.content}
          onChange={handleChange}
          style={textareaStyle}
        /><br />

        <button type="submit" onClick={handleSubmit} style={buttonStyle}>수정 완료</button>
      </div>
    </div>
  );
}

// 동일한 스타일 상수 재사용
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

