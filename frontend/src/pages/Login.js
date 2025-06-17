// // src/pages/Login.js

// // 2차
// // React의 훅(Hook)인 useState를 불러온다.
// // 컴포넌트 내에서 상태(state)를 관리하기 위해 사용한다.
// import {useState} from 'react';
// // HTTP 요청을 보내기 위한 라이브러리 axios를 불러온다.
// // 이 코드는 로그인 시 서버에 POST 요청을 보내는 데 사용된다.
// import axios from 'axios';

// // 이 파일에서 Login 컴포넌트를 기본 내보내기(export)한다.
// // 다른 컴포넌트나 라우터에서 import 해서 사용할 수 있다.
// export default function Login(){
//   // 상태 정의(입력값과 에러 메시지)
//   // 사용자 아이디 입력 값을 저장하는 상태이다.
//   // 기본값은 빈 문자열이고, 사용자의 입력에 따라 업데이트된다.
//   const [username, setUsername] = useState('');
//   // 사용자 비밀번호 입력 값을 저장한다.
//   const [password, setPassword] = useState('');
//   // 로그인 실패 시 화면에 표시할 에러 메시지를 위한 상태이다.
//   const [error, setError] = useState('');

//   // 로그인 요청 처리 함수
//   // 사용자가 로그인 버튼을 클릭했을 때 실행될 함수이다.
//   const handleLogin = async () => {
//     // FastAPI 서버에 로그인 정보를 POST 방식으로 보낸다.
//     // 서버 URL은 로컬 개발 환경 기준이다.
//     try {
//       // application/x-www-form-urlencoded 형식으로 데이터를 전송하기 위해 URLSearchParams를 사용한다.
//       // 이는 OAuth2{asswordRequestForm과 화환되도록 하기 위한 포맷이다.
//       const response = await axios.post('http://localhost:8000/login', new URLSearchParams({
//         username: username,
//         password: password
//       }), {
//         // 요청 헤더에서 명시적으로 Content-Type을 설정한다.
//         // FastAPI가 데이터를 올바르게 파싱할 수 있도록 돕는다.
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       });

//       // 로그인 성공 처리
//       // 응답 객체에서 JWT access_token을 구조분해 할당으로 추출한다.
//       const {access_token, user_id} = response.data;
//       // 브라우저의 localStorage에 토큰을 저장한다.
//       // 이 토큰은 이후 인증이 필요한 요청에 사용된다.
//       sessionStorage.setItem('access_token', access_token);
//       sessionStorage.setItem('user_id', user_id);  // 사용자 id 저장

//       // 사용자에게 성공 알림을 표시하고, 메인 페이지로 리디렉션한다.
//       alert('로그인 성공!');
//       window.location.href = '/';
//       // 오류 발생 시(잘못된 입력, 서버 응답 401 등) 에러 메시지를 상태에 저장한다.
//       // 이는 아래 JSX 렌더링에서 화면에 표시된다.
//     } catch (err) {
//       setError('로그인 실패: 아이디 또는 비밀번호를 확이하세요.');
//     }
//   };
  
//   // JSX - 화면 구성
//   // 페이지 제목과 기본 틀을 출력한다.
//   // 아이디 입력창, 입력 내용은 username 상태로 업데이트된다.
//   // 비밀번호 입력창, password 상태로 실시간 반영된다.
//   // 로그인 버튼을 클릭 시 handleLogin() 함수가 실행된다.
//   // 에러 메시지가 존재할 경우에만 붉은 글씨로 출력한다.
//   return (
//     <div>
//       <h2>🔐 로그인</h2>
//       <input
//         type="text"
//         placeholder="아이디"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       /><br />
//       <input
//         type="password"
//         placeholder="비밀번호"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       /><br />
//       <button onClick={handleLogin}>로그인</button>
//       {error && <p style={{color: 'red'}}>{error}</p>}
//     </div>
//   );
// }

// src/pages/Login.js
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', new URLSearchParams({
        username: username,
        password: password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, user_id } = response.data;
      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('user_id', user_id);
      alert('로그인 성공!');
      window.location.href = '/';
    } catch (err) {
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ color: 'skyblue', marginBottom: '30px' }}>로그인</h2>

      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: '300px',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '20px',
          borderRadius: '5px'
        }}
      /><br />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: '300px',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '20px',
          borderRadius: '5px'
        }}
      /><br />

      <button
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'skyblue',
          color: 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        로그인
      </button>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
}
