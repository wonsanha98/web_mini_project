// src/pages/PostDetail.js
/*
// 1차
// 사용자가 게시글을 클릭했을 때, 상세 내용을 보여주는 페이지 컴포넌트이다.
// react-router-dom 에서 제공하는 useParams 훅을 가져온다.
// URL에 포함된 파라미터 값을 가져오는 기능을 한다.
import {useParams} from 'react-router-dom';

// PostDetail 라는 함수형 컴포넌트를 정의한다.
// React에서 하나의 페이지 역할을 한다.
function PostDetail(){
  // useParams()를 호출해서 현재 URL의 파라미터 중 id 값을 가져온다.
  const {id} = useParams();
  // 게시글을 담은 더미 데이터 배열을 정의한다.
  // 아직 백엔드 연동이 없으므로 가짜 데이터를 하드코딩한 상태이다.
  // 각 객체는 하나의 게시글을 의미하며 id, title, content, author 속성을 가진다.
  const posts = [
    {id: '1', title: '첫 번째 게시글', content: '내용입니다.', author: '홍길동'},
    {id: '2', title: '두 번째 게시글', content: '두 번째 내용입니다.', author: '이순신'},
    {id: '3', title: 'React 프로젝트', content: '리액트를 배우는 중입니다.', author: '원산하'},
  ];

  // posts 배열에서 id가 URL에서 받은 id와 일치하는 게시글을 찾는다.
  // .find()는 조건에 맞는 첫 번째 항목만 반환한다.
  const post = posts.find(p => p.id === id);

  // 만약 조건에 맞는 게시글이 없다면 (post === undefined)
  // 에러 메시지를 보여주는 조건부 렌더링이다.
  // 백엔드 연동이 되었을 때는 404 에러를 띄우는 용도로도 사용할 수 있다.
  if(!post){
    return <div>❌ 게시글을 찾을 수 없습니다.</div>;
  }
  
  // 게시글을 정상적으로 찾았다면 제목, 작성자, 내용 정보를 출력한다.
  // 각 항목은 HTML <strong> 태그로 라벨을 강조하고 그 옆에 값을 출력한다.
  return (
    <div>
      <h2><strong>제목:</strong> {post.title}</h2>
      <p><strong>작성자:</strong> {post.author}</p>
      <p><strong>내용:</strong> {post.content}</p>
    </div>
  );
}

// PostDetail 컴포넌트를 외부에서도 사용할 수 있도록 export 한다.
// App.js에서 <Route path="/post/:id" element={<PostDetail />}/>처럼 불러서 사용한다.
export default PostDetail;
*/

import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';

export default function PostDetail(){
  const{id} = useParams();                
  const[post, setPost] = useState(null);
  const[error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/posts/${id}`)
    .then(response => setPost(response.data))
    .catch(err => setError('해당 게시글을 불러올 수 없습니다.'));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!post) return <p>⏳ 게시글을 불러오는 중...</p>

  return (
    <div>
      <h2>{post.title}</h2>
      <p><string>작성자:</string> {post.author}</p>
      <hr />
      <p>{post.content}</p>
    </div>
  )
}