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
 /*
// 2차
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';

// React Router의 <Link> 컴포넌트를 사용하기 위해 import 한다.(페이지 새로고침 없이 부드럽게 이동 가능하게 함)
import {Link} from 'react-router-dom'; 

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
  // 현재 게시글의 ID를 이용해 /edit/3 처럼 수정 페이지로 이동할 수 있도록 버튼을 만든다.
  return (
    <div>
      <h2>{post.title}</h2>
      <p><string>작성자:</string> {post.author}</p>
      <hr />
      <p>{post.content}</p>
      <Link to={`/edit/${post.id}`}>
        <button>✏️ 수정</button>
      </Link>
      <button onClick={handleDelete} style={{marginTop: '20px', color: 'red'}}>
        🗑 삭제하기
      </button>
    </div>
  )
}
*/

// 3차

import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'; 

export default function PostDetail(){
  const{id} = useParams();                
  const[post, setPost] = useState(null);
  const[error, setError] = useState(null);

  // 상태(state) 변수 추가
  // comments: 현재 게시글에 달린 댓글 목록을 저장할 상태 변수이다. 초기값은 빈 배열이다.
  const[comments, setComments] = useState([]);
  // 댓글 작성 시 입력할 작성자명과 내용을 저장할 상태 변수이다.
  const[commentAuthor, setCommentAuthor] = useState('');
  const[commentContent, setCommentContent] = useState('');


  useEffect(() => {
    axios.get(`http://localhost:8000/posts/${id}`)
    .then(response => setPost(response.data))
    .catch(err => setError('해당 게시글을 불러올 수 없습니다.'));
    
    // useEffect 내부에 댓글 목록 불러오기 추가
    // 해당 게시글의 댓글 목록을 백엔드에서 불러와 comments 상태에 저장한다.
    // 게시글 상세 정보와 함께 한 번 호출되도록 useEffect 내부에 작성한다.
    axios.get(`http://localhost:8000/posts/${id}/comments`)
    .then(response => setComments(response.data))
    .catch(error => console.error("댓글 불러오기 실패:", error));
  }, [id]);
  

  const handleDelete = () => {
    axios.delete(`http://localhost:8000/posts/${id}`)
    .then(() => {
      alert("삭제가 완료되었습니다.");
      window.location.href = '/';
    }) 
    .catch(error => {
      console.error('삭제 오류:', error);
      setError('삭제 중 문제가 발생했습니다.');
    });
  }

  // 댓글 작성 함수 추가
  // 댓글 등록 버튼 클릭 시 실행된다.
  // commentAuthor, commentContent 값이 비어 있으면 경고창을 띄운다.
  // POST 요청으로 댓글을 전송하고, 작성 후에는 입력창을 비우고 댓글 목록을 다시 불러온다.
  const handleCommentSubmit = () => {
    if(!commentAuthor || !commentContent){
      alert("작성자와 내용을 모두 입력해주세요.");
      return;
    }

    axios.post(`http://localhost:8000/posts/${id}/comments`, {
      author: commentAuthor,
      content: commentContent
    })
    .then(() => {
      setCommentAuthor('');
      setCommentContent('');
      return axios.get(`http://localhost:8000/posts/${id}/comments`);
    })
    .then(response => setComments(response.data))
    .catch(error => console.error("댓글 작성 실패:", error));
  };


  if (error) return <p>{error}</p>;
  if (!post) return <p>⏳ 게시글을 불러오는 중...</p>

  
  return (
    <div>
      <h2>{post.title}</h2>
      <p><string>작성자:</string> {post.author}</p>
      <hr />
      <p>{post.content}</p>
      <Link to={`/edit/${post.id}`}>
        <button>✏️ 수정</button>
      </Link>
      <button onClick={handleDelete} style={{marginTop: '20px', color: 'red'}}>
        🗑 삭제하기
      </button>
      {/* 댓글 출력 UI 추가
      댓글 목록을 화면에 출력한다. 작성자 이름과 댓글 내용을 나열한다. */}
      <h3>💬 댓글</h3>
      <ul>
        {comments.map((c, index) => (
          <li key={index}>
            <strong>{c.author}</strong>: {c.content}
          </li>
        ))}
      </ul>
      
      {/* 댓글 입력 UI 추가
      댓글 작성 폼이다. 작성자와 내용 입력 후 '등록'버튼 클릭시 handleCommentSubmit()이 실행된다. */}
      <h4>댓글 작성</h4>
      <input
        type="text"
        placeholder="작성자"
        value={commentAuthor}
        onChange={(e) => setCommentAuthor(e.target.value)}
      /><br />
      <textarea
        placeholder="내용"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
      ></textarea><br />
      <button onClick={handleCommentSubmit} style={{marginTop: '10px'}}>등록</button>
    </div>
  )
}