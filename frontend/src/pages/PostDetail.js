// src/pages/PostDetail.js

import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import RotatingSphere from '../components/RotatingSphere';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const token = sessionStorage.getItem('access_token');
  const storedUserId = sessionStorage.getItem('user_id');
  const currentUserId = storedUserId && !isNaN(Number(storedUserId)) ? Number(storedUserId) : null;

  useEffect(() => {
    axios.get(`http://localhost:8000/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(() => setError('해당 게시글을 불러올 수 없습니다.'));

    axios.get(`http://localhost:8000/posts/${id}/comments`)
      .then(response => setComments(response.data))
      .catch(error => console.error("댓글 불러오기 실패:", error));
  }, [id]);

  const handleDelete = () => {
    axios.delete(`http://localhost:8000/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert("삭제가 완료되었습니다.");
        window.location.href = '/';
      })
      .catch(error => {
        console.error('삭제 오류:', error);
        setError('삭제 중 문제가 발생했습니다.');
      });
  };

  const startEdit = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };

  const handleCommentUpdate = (commentId) => {
    axios.patch(`http://localhost:8000/comments/${commentId}`, {
      content: editedContent,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setEditingCommentId(null);
        setEditedContent('');
        return axios.get(`http://localhost:8000/posts/${id}/comments`);
      })
      .then(response => setComments(response.data))
      .catch(error => console.error("댓글 수정 실패:", error));
  };

  const handleCommentSubmit = () => {
    if (!commentAuthor.trim() || !commentContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    axios.post(`http://localhost:8000/posts/${id}/comments`, {
      author: commentAuthor,
      content: commentContent,
      user_id: currentUserId
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
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        return axios.get(`http://localhost:8000/posts/${id}/comments`);
      })
      .then(response => setComments(response.data))
      .catch(error => {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제 중 오류가 발생했습니다.");
      });
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        {!post ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <RotatingSphere />
          </div>
        ) : (
          <>
            <h2 style={{ color: 'skyblue', marginBottom: '10px',  }}>{post.title}</h2>
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
              {/* <strong>작성자:</strong> {post.author} */}
              <strong>{post.author}</strong>
            </div>
            <hr style={{ borderColor: '#444' }} />
            <p style={{ marginTop: '10px', whiteSpace: 'pre-line'}}>{post.content}</p>

            {post.user_id === currentUserId && (
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Link to={`/edit/${post.id}`}>
                  <button style={buttonStyle}>수정</button>
                </Link>
                <button onClick={handleDelete} style={buttonStyle}>삭제</button>
              </div>
            )}

            <h3 style={{ marginTop: '40px', color: 'skyblue' }}>댓글</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {comments.map((c) => (
                <li key={c.id} style={{ marginBottom: '25px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                  <p style={{ color: 'skyblue', fontWeight: 'bold', marginBottom: '5px' }}>{c.author}</p>
                  {editingCommentId === c.id ? (
                    <>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        style={textareaStyleSmall}
                      />
                      <button onClick={() => handleCommentUpdate(c.id)} style={smallButtonStyle}>완료</button>
                    </>
                  ) : (
                    <p style={{ marginBottom: '5px' }}>{c.content}</p>
                  )}

                  {c.user_id === currentUserId && (
                    <div style={{ marginTop: '5px' }}>
                      <button onClick={() => startEdit(c.id, c.content)} style={smallButtonStyle}>수정</button>
                      <button onClick={() => handleCommentDelete(c.id)} style={smallButtonStyle}>삭제</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {currentUserId ? (
              <div style={{ marginTop: '30px' }}>
                <h4 style={{ color: 'skyblue' }}>댓글 작성</h4>
                <input
                  type="text"
                  placeholder="작성자"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  style={inputStyle}
                /><br />
                <textarea
                  placeholder="내용"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  style={textareaStyleSmall}
                /><br />
                <button onClick={handleCommentSubmit} style={buttonStyle}>등록</button>
              </div>
            ) : (
              <p style={{ color: 'gray', marginTop: '20px' }}>댓글 작성을 위해 로그인해주세요.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// 스타일 정의
const outerStyle = {
  width: '100vw',
  minHeight: '100vh',
  backgroundColor: 'black',
  color: 'white',
  padding: '40px',
  paddingTop: '150px', // 상단 여백 추가
  boxSizing: 'border-box',
  overflowY: 'auto', //  스크롤 가능하도록
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  alignItems: 'flex-start', // 상단 정렬
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
  marginBottom: '10px',
  borderRadius: '5px',
  backgroundColor: '#222',
  color: 'white',
  border: '1px solid #555',
};

const textareaStyleSmall = {
  width: '100%',
  height: '80px',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  backgroundColor: '#222',
  color: 'white',
  border: '1px solid #555',
  marginBottom: '10px',
};

const buttonStyle = {
  marginLeft: '10px',
  marginTop: '10px',
  padding: '8px 16px',
  fontSize: '14px',
  backgroundColor: 'skyblue',
  color: 'black',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const smallButtonStyle = {
  marginRight: '6px',
  marginTop: '6px',
  padding: '4px 10px',
  fontSize: '12px',
  backgroundColor: 'skyblue',
  color: 'black',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

