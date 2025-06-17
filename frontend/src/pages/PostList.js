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
      {/* <h2 style={{ color: 'skyblue', marginBottom: '30px' }}>게시글 목록</h2> */}
      <ul style={{ listStyle: 'none', padding: 0, width: '60%' }}>
        {posts.map(post => (
          <li key={post.id} style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
            <Link to={`/post/${post.id}`} style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
              <strong style={{ color: 'skyblue' }}>{post.title}</strong> - {post.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
