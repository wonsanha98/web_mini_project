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
 
// 2차
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';

export default function PostDetail(){
  const{id} = useParams();                
  // 서버에서 데이터가 도착하기 전에는 null로 설정해두고, 도착 후에 setPost(response.data)로 업데이트.
  const[post, setPost] = useState(null);
  const[error, setError] = useState(null);

  // 백엔드 서버(FastAPI)로부터 id값에 해당하는 게시글을 GET 요청으로 받아와 post 상태에 저장.
  // .then(...): 응답 데이터를 상태로 저장(setPost).
  // .catch(...): 오류 발생 시 콘솔에 출력.
  useEffect(() => {
    axios.get(`http://localhost:8000/posts/${id}`)
    .then(response => setPost(response.data))
    .catch(err => setError('해당 게시글을 불러올 수 없습니다.'));
  }, [id]);

  // 사용자가 "삭제하기"버튼을 클릭했을 때 실행될 함수이다.
  const handleDelete = () => {
    // 백엔드(FastAPI)에 DELETE/posts/{id} 요청을 보낸다.
    // 현재 게시글의 ID 값을 URL에 포함시켜 삭제 요청을 보낸다.
    axios.delete(`http://localhost:8000/posts/${id}`)
    // 삭제 요청이 성공적으로 처리되었을 때 실행되는 부분이다.
    .then(() => {
      alert("삭제가 완료되었습니다.");
      // 삭제 후 메인 페이지(/)로 이동하여 게시글 목록을 다시 확인할 수 있게 한다.
      window.location.href = '/';
    }) 
    // 삭제 요청 중 오류가 발생하면 실행된다.
    .catch(error => {
      console.error('삭제 오류:', error);
      // 사용자에게도 UI 상으로 오류 메시지를 보여줄 수 있도록 error 상태를 업데이트한다.
      setError('삭제 중 문제가 발생했습니다.');
    });
  }

  if (error) return <p>{error}</p>;
  // 서버 응답을 기다리는 동안 화면에 '로딩 중...'이라는 임시 메시지를 출력.
  // post가 아직 null이면 렌더링을 중단하고 위 문장을 출력함.
  if (!post) return <p>⏳ 게시글을 불러오는 중...</p>

  // HTML 버튼 요소, 클릭 시 handleDelete() 함수가 실행된다.
  return (
    <div>
      <h2>{post.title}</h2>
      <p><string>작성자:</string> {post.author}</p>
      <hr />
      <p>{post.content}</p>
      <button onClick={handleDelete} style={{marginTop: '20px', color: 'red'}}>
        🗑 삭제하기
      </button>
    </div>
  )
}