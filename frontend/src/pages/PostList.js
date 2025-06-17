// src/pages/PostList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/posts/')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('게시글 불러오기 오류:', error);
      });
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      color: 'white',
      padding: '40px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto'
    }}>
      <div style={{ color: 'skyblue', marginBottom: '80px' }}></div>
      <ul style={{ listStyle: 'none', padding: 0, width: '60%' }}>
        {posts.map(post => (
          <li
            key={post.id}
            style={{
              marginBottom: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'transform 0.2s ease, background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {/* 왼쪽: 파란 구 + 제목 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* 파란 구 형태의 점 */}
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, #00bfff, #007fff)',
                  boxShadow: '0 0 6px #00bfff',
                  marginRight: '10px',
                  flexShrink: 0,
                }}
              />
              {/* 게시글 제목 */}
              <Link
                to={`/post/${post.id}`}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '18px',
                  transition: 'color 0.2s ease, text-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'skyblue';
                  e.currentTarget.style.textShadow = '0 0 8px rgba(135, 206, 250, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                <div style={{ color: 'skyblue' }}>{post.title}</div>
              </Link>
            </div>

            {/* 오른쪽: 작성자 */}
            <span style={{ color: 'gray', fontSize: '14px', flexShrink: 0 }}>
              {post.author}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
