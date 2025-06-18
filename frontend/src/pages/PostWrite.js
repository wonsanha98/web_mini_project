// src/pages/PostWrite.js
// 3차

import {useState} from 'react';
import axios from 'axios';
// 페이지 이동(redirect)을 위해 React Router의 useNavigate 훅을 사용한다.
import {useNavigate} from 'react-router-dom';

export default function PostWrite(){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // 게시글 작성후 목록 페이지(/)로 이동하기 위해 navigate 함수를 생성한다.
  const navigate = useNavigate();

  // 버튼 클릭 시 실행될 비동기 함수이다.
  const handleSubmit = async () => {
    // JWT 토큰을 브라우저 로컬스토리지에서 꺼낸다.(인증용)
    try{
      const token = sessionStorage.getItem('access_token');      
      // 토큰이 없는 경우 아예 요청을 보내지 않도록 한다.
      // 백엔드 서버의 게시글 등록 API(POST /posts)에 요청을 보낸다.
      const response = await axios.post(
        'http://localhost:8000/posts',
        // 전송할 데이터로 제목, 내용, 작성자명을 포함한다.
        {
          title,
          content,
          author: '작성자닉네임',
        },
        // 요청 헤더에 JWT 토큰을 포함시켜 인증된 사용자임을 증명한다.
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('게시글이 등록되었습니다.');
      navigate('/');
    } catch(err){
      console.error(err);
      alert('게시글 등록 실패');
    }
  };

  return(
    <div className="retro-container">
      <h2 >🖋 새 글 작성</h2>
      <input 
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br />
      <textarea 
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      /><br />
      <button className="retro-button" onClick={handleSubmit}>작성하기</button>
    </div>
  )
}