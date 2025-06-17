// src/pages/PostList.js

// React에서 제공하는 훅(hock)을 가져온다.
// - useState: 컴포넌트의 상태(데이터)를 관리하기 위한 훅
// - useEffct: 컴포넌트가 처음 렌더링되거나, 상태가 바뀌었을때 실행되는 부수 효과(예: API 호출)를 정의함
// import {useEffect, useState} from 'react';
// // HTTP 요청을 쉽게 보내기 위한 라이브러리 axios를 불러온다.
// // 여기서는 백엔드 API로 데이터를 가져오기 위해 사용한다.
// import axios from 'axios';
// import {Link} from 'react-router-dom';    //추가 사항

// // React의 함수형 컴포넌트 선언이다. PostList는 게시글 목록을 보여주는 UI를 정의한다.
// function PostList(){
//   // posts는 게시글 데이터를 저장하는 상태(state) 변수이다.
//   // setPosts는 이 상태를 바꾸는 함수이다.
//   // useState([])는 초기 값으로 빈 배열을 설정한다. -> 처음에는 게시글이 없다는 의미
//   const [posts, setPosts] = useState([]);

//   // 이 함수는 컴포넌트가 마운트(처음 화면에 나타날 때)되면 자동으로 실행된다.
//   // 보통은 API 요청, 타이머 설정 등 부수 효과(side effect)를 여기에 작성한다.
//   useEffect(() => {
//     // Django 백엔드 서버로 GET 요청을 보낸다.
//     // http://localhost:8000/api/post/는 게시글 목록을 불러오는 API 엔드포인트이다.
//     // axios.get(...)은 비동기 함수이다. ->서버 응답을 기다린다.
//     axios.get('http://localhost:8000/posts/')
//     // 백엔드가 성공적으로 응답을 보내면, 그 결과(response.data)를 posts 상태에 저장한다.
//     // 이렇게 하면 React가 자동으로 UI를 다시 렌더링하여 화면에 게시글 목록을 보여준다.
//     .then(response => {
//       setPosts(response.data);
//     })
//     // 요청 중 오류가 발생하면 콜솔에 에로 메시지를 출력한다.
//     // 예: 백엔드 서버가 꺼져 있거나, 주소가 잘못된 경우 등
//     .catch(error => {
//       console.error('게시글 불러오기 오류:', error);
//     });
//     // useEffect 두 번째 인자가 []이면, 이 효과는 컴포넌트가 처음 렌더링될 때 한 번만 실행된다.
//     // 게시글을 단 한 번만에 불러온다는 의미이다.
//   }, []); 
  
//   // 컴포넌트가 렌더링할 JSX이다.
//   // posts 배열을 .map()으로 순회하며 각각의 post를 <li> 태그로 출력한다.
//   // key={post.id}는 React가 각 항목을 고유하게 식별하도록 하기 위한 속성이다.
//   // <a href={/post/${post.id}}>는 글 제목을 누르면 상세 페이지(/post/숫자)로 이동하게 만든다.
//   // ->> <Link to={`/post/${post.id}`}> 로 변경, 더 자연스럽고 부드러운 연결
//   // 제목과 작성자(author)를 함께 표시한다.
//   return (
//     <div>
//       <h2>📃 게시글 목록</h2>
//       <ul>
//         {posts.map(post => (
//           <li key={post.id}>
//             <Link to={`/post/${post.id}`}>  
//               <strong>{post.title}</strong> - {post.author}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// // 이 컴포넌트를 다른 파일에서 불러올 수 있도록 내보낸다.
// export default PostList;

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
      <h2 style={{ color: 'skyblue', marginBottom: '30px' }}>게시글 목록</h2>
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
