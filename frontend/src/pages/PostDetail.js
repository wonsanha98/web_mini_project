// src/pages/PostDetail.js

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

  const[editingCommentId, setEditingCommentId] = useState(null);
  const[editedContent, setEditedContent] = useState('');

  const token = sessionStorage.getItem('access_token');
  const storedUserId = sessionStorage.getItem('user_id');
  const currentUserId = storedUserId && !isNaN(Number(storedUserId)) 
  ? Number(storedUserId) 
  : null;

  const startEdit = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };


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
    axios.delete(`http://localhost:8000/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      alert("삭제가 완료되었습니다.");
      window.location.href = '/';
    }) 
    .catch(error => {
      console.error('삭제 오류:', error);
      setError('삭제 중 문제가 발생했습니다.');
    });
  }

  const handleCommentUpdate = (commentId) => {
    axios.patch(`http://localhost:8000/comments/${commentId}`, {
      content: editedContent, 
    }, {
      headers: {Authorization: `Bearer ${token}`},
    })
    .then(() => {
      setEditingCommentId(null);
      setEditedContent('');
      return axios.get(`http://localhost:8000/posts/${id}/comments`);
    })
    .then(response => setComments(response.data))
    .catch(error => console.error("댓글 수정 실패:", error));
  };


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
      content: commentContent,
      user_id: currentUserId        // user_id 추가
    })
    .then(() => {
      setCommentAuthor('');
      setCommentContent('');
      return axios.get(`http://localhost:8000/posts/${id}/comments`);
    })
    .then(response => setComments(response.data))
    .catch(error => console.error("댓글 작성 실패:", error));
  };

  const handleCommentDelete = (commentId) => {
    axios.delete(`http://localhost:8000/posts/${id}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(() => {
      // 삭제 후 댓글 목록 다시 불러오기
      return axios.get(`http://localhost:8000/posts/${id}/comments`);
    })
    .then(response => setComments(response.data))
    .catch(error => {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    });
  };


  if (error) return <p>{error}</p>;
  if (!post) return <p>⏳ 게시글을 불러오는 중...</p>


  return (
    <div>
      <h2>{post.title}</h2>
      <p><strong>작성자:</strong> {post.author}</p>
      <hr />
      <p>{post.content}</p>
      {post.user_id === currentUserId && (
        <>
          <Link to={`/edit/${post.id}`}>
            <button>✏️ 수정</button>
          </Link>
          <button onClick={handleDelete} style={{marginTop: '20px', color: 'red'}}>
            🗑 삭제하기
          </button>
        </>
      )}
      {/* 댓글 출력 UI 추가
      댓글 목록을 화면에 출력한다. 작성자 이름과 댓글 내용을 나열한다. */}
      <h3>💬 댓글</h3>
      <ul>
        {comments.map((c, index) => (
          <li key={index}>
            <strong>{c.author}</strong>:{" "}
            {editingCommentId === c.id ? (
              <>
                <textarea 
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={() => handleCommentUpdate(c.id)}>완료</button>
              </>
            ) : (
              c.content
            )}

            {c.user_id && currentUserId && c.user_id === currentUserId && (
              <>
                <button 
                onClick={() => startEdit(c.id, c.content)}
                style={{marginLeft: '10px'}}>✏️ 수정</button>
                <button 
                onClick={() => handleCommentDelete(c.id)}
                style={{color: 'red', marginLeft: '10px'}}>🗑 삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
      
      {/* 댓글 입력 UI 추가
      댓글 작성 폼이다. 작성자와 내용 입력 후 '등록'버튼 클릭시 handleCommentSubmit()이 실행된다. */}
      {/* <h4>댓글 작성</h4>
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
      <button onClick={handleCommentSubmit} style={{marginTop: '10px'}}>등록</button> */}
      {currentUserId ? (
        <>
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
          /><br />
          <button onClick={handleCommentSubmit} style={{marginTop:'10px'}}>등록</button>
        </>
      ) : (
        <p style={{color:'gray'}}>댓글 작성을 위해 로그인해주세요.</p>
        )}
    </div>
  )
}