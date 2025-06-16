// src/App.js

// 라우팅 관련 import
// react-router-dom은 React 앱에서 화면 전환(라우팅)을 가능하게 해주는 라이브러리
// BrowerRouter 는 HTML5 히스토리 API를 기반으로 경로를 관리해주는 라우터이다.
// Router 라는 이름으로 사용하겠다고 as Router로 별칭을 붙인 것
// Routes는 여러 Route들을 묶는 용도, Route는 각 URL 경로에 해당 컴포넌트를 보여주는 역할
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'; 

// 보호된 라우트를 설정하기 위해서 PrivateRoute를 import
import PrivateRoute from './components/PrivateRoute';

// 만든 페이지 import
// 만든 각각의 페이지 컴포넌트들을 불러온다.
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostWrite from './pages/PostWrite';
import Login from './pages/Login';
import Register from './pages/Register';

// 게시글 수정 컴포넌트(PostEdit)를 사용하기 위해 import 한다.
import PostEdit from './pages/PostEdit';

import {Link} from 'react-router-dom';

import NavBar from './components/NavBar';

// APP 함수형 컴포넌트이다.
// 이 컴포넌트는 React 앱의 루트 컴포넌트, 즉 가장 상위에 있는 컴포넌트이다.
function App(){
  return(
    //<Router>는 모든 라우팅 기능이 동작할 수 있도록 하는 라우팅 컨테이너이다.
    //이 안에 있어야 Route, Link, useParams 등이 정상적으로 작동한다.
    <Router>
      <div>
        <NavBar /> {/* 상단바 삽입 */}
      </div>
      {/* 페이지 연결 
          Routes 컴포넌트는 여러 개의 Route를 감싸서 정의할 수 있게 해준다.
          / 경로(홈페이지)에 들어오면 PostList 컴포넌트를 보여준다.
          /post/1 , /post/2 등 숫자(id)를 포함하는 경로에 오면 PostDetail 컴포넌트를 보여준다.
          :id는 변수 형태의 경로를 의미하고, 내부에서 useParams()로 꺼낼 수 있다.
          /write, /login, /register 각각은 글쓰기, 로그인, 회원가입 페이지를 보여준다.
          '/edit/:id 경로를 새로 추가하여 해당 ID를 가진 게시글을 수정하는 페이지로 라이팅도록 설정한다.'*/}
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/write" element={
          // PostWrite를 PrivateRoute로 감싸서 사용자 인증이 됐을 경우만 접근 가능
          <PrivateRoute>
            <PostWrite />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit/:id" element={<PostEdit />} />
      </Routes>
    </Router>
  );
}

// 이 파일에서 만든 APP 컴포넌트를 외부에서도 쓸 수 있도록 내보내는 코드이다.
// 실제로 index.js 에서 App을 불러와 앱을 실행한다.
export default App;
