// src/pages/Login.js
// 1차
/*
// useState는 React에서 제공하는 특별한 함수(훅, hook)이다.
// 컴포넌트 안에서 값을 저장하고 관리하기 위해 사용한다.
// 사용자가 입력한 이메일과 비밀번호 상태를 기억하기 위해 사용한다.
import {useState} from 'react';

// Login이라는 이름의 함수형 컴포넌트를 선언
// React에서는 하나의 컴포넌트가 하나의 화면 조각(UI)을 담당한다.
function Login(){
  // email이라는 상태 변수를 만든다. 처음에는 빈 문자열 ''로 시작한다.
  // 사용자가 이메일 입력칸에 입력을 하면 setEmail로 그 값을 저장한다.
  // React에서 이 값을 계속 기억하고 화면에 반영한다.
  const [email, setEmail] = useState('');
  // password 상태도 위와 같은 방식이다.
  // 사용자가 비밀번호를 입력하면 setPassword로 저장한다.
  const [password, setPassword] = useState('');

  // 로그인 폼이 제출될 때 실행될 함수를 정의한다.
  // e는 이벤트 객체로 사용자의 이벤트(예: 버튼 클릭)에 대한 정보가 들어있다.
  const handleSubmit = (e) => {
    // 폼은 기본적으로 제출되면 페이지가 새로고침된다.
    // 그걸 막기 위해 이 함수를 호출한다.
    e.preventDefault();

    // 현재 입력된 email과 password를 브라우저 개발자 도구의 콘솔에 출력한다.
    // 실제로 서버에 로그인 요청을 보내지는 않고, 값이 잘들어오는지 확인하는 용도이다.
    console.log('로그인 시도:', email, password);
    // 브라우저에 팝업 창(alert)을 띄워서 사용자에게 메시지를 보여준다.
    alert('로그인 버튼 클릭됨 (아직 실제 로그인 기능 없음)');
  };
  // 이 컴포넌트가 브라우저에 어떤 화면을 보여줄지를 작성하는 부분이다.
  // form은 HTML에서 사용자 입력을 모아서 제출할 때 사용하는 요소이다.
  // onSubmit={handleSubmit}: 이 폼이 제출되면 handleSubmit 함수가 실행된다.
  // type="email"은 이메일 형식인지 자동으로 확인해주는 기능이다.
  // placeholder="이메일"은 입력칸에 획색 글씨로 힌트를 준다.
  // value={email} 이 입력칸의 현재 값은 email 상태값이다.
  // onChange={} 사용자가 타이핑할 때마다 setEmail()이 호출되어 입력값이 업데이트된다.
  // style={{}} 이 입력칸의 CSS 스타일을 인라인으로 지정한다.
  // type="password"는 입력값이 ***으로 가려진다.
  // 사용자가 비밀번호를 입력하면 password 상태에 저장된다.
  // <buttom>버튼을 누르면 form이 제출된다.
  // type="submit"이기 때문에 onSubmit이 실행된다. -> handleSubmit()이 호출된다.
  return(
    <div>
      <h2>🔐 로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{width: '300px', padding: '8px', marginBottom: '10px'}}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{width: '300px', padding: '8px', marginBottom: '10px'}}
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

// 이 컴포넌트를 다른 파일에서 사용할 수 있게 외부로 내보낸다.
// 보통 App.js에서 import Login from './pages/Login'; 처럼 가져온다.
export default Login;
*/

// 2차
// React의 훅(Hook)인 useState를 불러온다.
// 컴포넌트 내에서 상태(state)를 관리하기 위해 사용한다.
import {useState} from 'react';
// HTTP 요청을 보내기 위한 라이브러리 axios를 불러온다.
// 이 코드는 로그인 시 서버에 POST 요청을 보내는 데 사용된다.
import axios from 'axios';

// 이 파일에서 Login 컴포넌트를 기본 내보내기(export)한다.
// 다른 컴포넌트나 라우터에서 import 해서 사용할 수 있다.
export default function Login(){
  // 상태 정의(입력값과 에러 메시지)
  // 사용자 아이디 입력 값을 저장하는 상태이다.
  // 기본값은 빈 문자열이고, 사용자의 입력에 따라 업데이트된다.
  const [username, setUsername] = useState('');
  // 사용자 비밀번호 입력 값을 저장한다.
  const [password, setPassword] = useState('');
  // 로그인 실패 시 화면에 표시할 에러 메시지를 위한 상태이다.
  const [error, setError] = useState('');

  // 로그인 요청 처리 함수
  // 사용자가 로그인 버튼을 클릭했을 때 실행될 함수이다.
  const handleLogin = async () => {
    // FastAPI 서버에 로그인 정보를 POST 방식으로 보낸다.
    // 서버 URL은 로컬 개발 환경 기준이다.
    try {
      // application/x-www-form-urlencoded 형식으로 데이터를 전송하기 위해 URLSearchParams를 사용한다.
      // 이는 OAuth2{asswordRequestForm과 화환되도록 하기 위한 포맷이다.
      const response = await axios.post('http://localhost:8000/login', new URLSearchParams({
        username: username,
        password: password
      }), {
        // 요청 헤더에서 명시적으로 Content-Type을 설정한다.
        // FastAPI가 데이터를 올바르게 파싱할 수 있도록 돕는다.
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // 로그인 성공 처리
      // 응답 객체에서 JWT access_token을 구조분해 할당으로 추출한다.
      const {access_token} = response.data;
      // 브라우저의 localStorage에 토큰을 저장한다.
      // 이 토큰은 이후 인증이 필요한 요청에 사용된다.
      localStorage.setItem('access_token', access_token);
      // 사용자에게 성공 알림을 표시하고, 메인 페이지로 리디렉션한다.
      alert('로그인 성공!');
      window.location.href = '/';
      // 오류 발생 시(잘못된 입력, 서버 응답 401 등) 에러 메시지를 상태에 저장한다.
      // 이는 아래 JSX 렌더링에서 화면에 표시된다.
    } catch (err) {
      setError('로그인 실패: 아이디 또는 비밀번호를 확이하세요.');
    }
  };
  
  // JSX - 화면 구성
  // 페이지 제목과 기본 틀을 출력한다.
  // 아이디 입력창, 입력 내용은 username 상태로 업데이트된다.
  // 비밀번호 입력창, password 상태로 실시간 반영된다.
  // 로그인 버튼을 클릭 시 handleLogin() 함수가 실행된다.
  // 에러 메시지가 존재할 경우에만 붉은 글씨로 출력한다.
  return (
    <div>
      <h2>🔐 로그인</h2>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>로그인</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}