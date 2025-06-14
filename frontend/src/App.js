// 라우팅 관련 import
// react-router-dom은 React 앱에서 화면 전환(라우팅)을 가능하게 해주는 라이브러리
// BrowerRouter 는 HTML5 히스토리 API를 기반으로 경로를 관리해주는 라우터이다.
// Router 라는 이름으로 사용하겠다고 as Router로 별칭을 붙인 것
// Routes는 여러 Route들을 묶는 용도, Route는 각 URL 경로에 해당 컴포넌트를 보여주는 역할
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'; 

// 만든 페이지 import
// 만든 각각의 페이지 컴포넌트들을 불러온다.
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostWrite from './pages/PostWrite';
import Login from './pages/Login';
import Register from './pages/Register';

import {Link} from 'react-router-dom';

// APP 함수형 컴포넌트이다.
// 이 컴포넌트는 React 앱의 루트 컴포넌트, 즉 가장 상위에 있는 컴포넌트이다.
function App(){
  return(
    //<Router>는 모든 라우팅 기능이 동작할 수 있도록 하는 라우팅 컨테이너이다.
    //이 안에 있어야 Route, Link, useParams 등이 정상적으로 작동한다.
    <Router>
      <div>
        {/* 임시 네비게이션? <nav>태그는 메뉴바 역할이다. 
            스타일로 아래쪽 여백(marginBottom)을 줘서 화면이 붙지 않게 함.
            각 <a href="">는 페이지 간 이동 링크이다.
            HTML 기본 방식으로 페이지를 이동시킨다.(새로고침 발생)
            추후에는 React 전용 <Link to="">를 사용하는 것이 더 좋다.(새로고침 없이 부드럽게 이동)*/}
        <nav style={{ marginBottom: '20px'}}>
          <Link to="/">목록</Link> |{' '}
          <Link to="/write">글쓰기</Link> |{' '}
          <Link to="/login">로그인</Link> |{' '}
          <Link to="/register">회원가입</Link>
          {/* <a href="/">목록</a> |{' '}
          <a href="/write">글쓰기</a> |{' '}
          <a href="/login">로그인</a> |{' '}
          <a href="/register">회원가입</a> */}
        </nav>
      </div>
      {/* 페이지 연결 
          Routes 컴포넌트는 여러 개의 Route를 감싸서 정의할 수 있게 해준다.
          / 경로(홈페이지)에 들어오면 PostList 컴포넌트를 보여준다.
          /post/1 , /post/2 등 숫자(id)를 포함하는 경로에 오면 PostDetail 컴포넌트를 보여준다.
          :id는 변수 형태의 경로를 의미하고, 내부에서 useParams()로 꺼낼 수 있다.
          /write, /login, /register 각각은 글쓰기, 로그인, 회원가입 페이지를 보여준다.*/}
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/write" element={<PostWrite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

// 이 파일에서 만든 APP 컴포넌트를 외부에서도 쓸 수 있도록 내보내는 코드이다.
// 실제로 index.js 에서 App을 불러와 앱을 실행한다.
export default App;
