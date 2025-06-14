// src/pages/PostList.js

/* 1차 시작 코드
// 이 파일을 React의 PostList 라는 컴포넌트를 정의하는 파일이다.
// src/pages 폴더 아래에 위치한 것으로, 하나의 "페이지 컴포넌트" 역할을 한다.

// PostList라는 함수형 컴포넌트를 정의한다.
// 이 함수는 React가 실행할 때 화면(UI)을 그리는 역할을 한다.
function PostList(){
  // posts 는 게시글 3개가 들어 있는 배열이다.
  // 각 게시글은 id, title, author 라는 속성을 가진 객체이다.
  // 현재는 백엔드와 연결되지 않기 때문에 더미 데이터로 초기화를 함
  const posts = [
    { id: 1, title: '첫 번째 게시글', author: '홍길동'},
    { id: 2, title: '두 번째 글입니다.', author: '이순신'},
    { id: 3, title: 'React 프로젝트 시작하기', author: '원산하'},
  ];
  // 이 컴포넌트가 화면에 무엇을 보여줄지 결정하는 JSX 반환 시작 부분이다.
  // 전체 게시글 목록을 감싸는 최상위 HTML 요소이다.
  // React 컴포넌트는 반드시 하나의 최상위 태그로 시작해야 한다.
  // 게시글들을 리스트 형태로 나열하기 위해 <ul>(unordered list)을 사용한다.
  // posts 배열을 .map() 함수로 반복한다. post는 배열의 각 게시글 객체이다. 
  // 이 반복 안에서 게시글 하나마다 <li>태그를 반환하게 된다.
  // 각각의 게시글을 <li>리스트 항목으로 표시한다.
  // key={post.id}는 React에서 리스트를 반복할 때 필수로 요구하는 고유한 식별자이다. {렌더링 최적화를 위해 필요}
  // 각 게시글 제목을 클릭하면 /post/1, /post/2 같은 상세 페이지 주소로 이동하도록 a 태그를 만든다.
  // ${post.id}는 문자열 보간법으로, 각 게시글의 id를 경로에 넣는다.
  // 게시글의 제목을 굵게 (<strong>) 표시하고, 작성자 이름도 함께 보여준다.
  return (
    <div>
      <h2>📃 게시글 목록</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={`/post/${post.id}`}>
              <strong>{post.title}</strong> - {post.author}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 이 파일에서 정의한 PostList 컴포넌트를 외부에서 사용할 수 있도록 내보낸다.
// 다른 파일에서 import PostList from './pages/PostList'; 로 사용할 수 있게 된다.
export default PostList;
*/

// React에서 제공하는 훅(hock)을 가져온다.
// - useState: 컴포넌트의 상태(데이터)를 관리하기 위한 훅
// - useEffct: 컴포넌트가 처음 렌더링되거나, 상태가 바뀌었을때 실행되는 부수 효과(예: API 호출)를 정의함
import {useEffect, useState} from 'react';
// HTTP 요청을 쉽게 보내기 위한 라이브러리 axios를 불러온다.
// 여기서는 백엔드 API로 데이터를 가져오기 위해 사용한다.
import axios from 'axios';


import {Link} from 'react-router-dom';    //추가 사항

// React의 함수형 컴포넌트 선언이다. PostList는 게시글 목록을 보여주는 UI를 정의한다.
function PostList(){
  // posts는 게시글 데이터를 저장하는 상태(state) 변수이다.
  // setPosts는 이 상태를 바꾸는 함수이다.
  // useState([])는 초기 값으로 빈 배열을 설정한다. -> 처음에는 게시글이 없다는 의미
  const [posts, setPosts] = useState([]);

  // 이 함수는 컴포넌트가 마운트(처음 화면에 나타날 때)되면 자동으로 실행된다.
  // 보통은 API 요청, 타이머 설정 등 부수 효과(side effect)를 여기에 작성한다.
  useEffect(() => {
    // Django 백엔드 서버로 GET 요청을 보낸다.
    // http://localhost:8000/api/post/는 게시글 목록을 불러오는 API 엔드포인트이다.
    // axios.get(...)은 비동기 함수이다. ->서버 응답을 기다린다.
    axios.get('http://localhost:8000/posts/')
    // 백엔드가 성공적으로 응답을 보내면, 그 결과(response.data)를 posts 상태에 저장한다.
    // 이렇게 하면 React가 자동으로 UI를 다시 렌더링하여 화면에 게시글 목록을 보여준다.
    .then(response => {
      setPosts(response.data);
    })
    // 요청 중 오류가 발생하면 콜솔에 에로 메시지를 출력한다.
    // 예: 백엔드 서버가 꺼져 있거나, 주소가 잘못된 경우 등
    .catch(error => {
      console.error('게시글 불러오기 오류:', error);
    });
    // useEffect 두 번째 인자가 []이면, 이 효과는 컴포넌트가 처음 렌더링될 때 한 번만 실행된다.
    // 게시글을 단 한 번만에 불러온다는 의미이다.
  }, []); 
  
  // 컴포넌트가 렌더링할 JSX이다.
  // posts 배열을 .map()으로 순회하며 각각의 post를 <li> 태그로 출력한다.
  // key={post.id}는 React가 각 항목을 고유하게 식별하도록 하기 위한 속성이다.
  // <a href={/post/${post.id}}>는 글 제목을 누르면 상세 페이지(/post/숫자)로 이동하게 만든다.
  // ->> <Link to={`/post/${post.id}`}> 로 변경, 더 자연스럽고 부드러운 연결
  // 제목과 작성자(author)를 함께 표시한다.
  return (
    <div>
      <h2>📃 게시글 목록</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`}>  
              <strong>{post.title}</strong> - {post.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 이 컴포넌트를 다른 파일에서 불러올 수 있도록 내보낸다.
export default PostList;