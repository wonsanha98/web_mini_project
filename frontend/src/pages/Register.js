// src/pages/Register.js

/* 1차
// React의 useState라는 훅(hook)을 가져온다.
// 사용자 입력값(이메일, 닉네임, 비밀번호 등)을 저장하는 데 사용한다.
import {useState} from 'react';

// Register이라는 이름의 함수형 컴포넌트를 선언한다.
// 이 컴포넌트는 회원가입 화면을 구성하는 역할을 한다.
function Register(){
  // email이라는 상태 변수를 선언한다. 초깃값은 빈 문자열 ''이다.
  // setEmail()을 사용하면 사용자가 입력한 이메일을 저장할 수 있다.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  // 회원가입 폼을 제출할 때 실행되는 함수이다.
  // e는 이벤트 객체로, 브라우저에서 발생한 이벤트(이 경우엔 제출 이벤트)에 대한 정보를 담고있다.
  const handleSubmit = (e) => {
    // 폼이 제출되었을 때 페이지가 새로고침되는 기본 동작을 막는다.
    // Single Page Application(SPA)에서는 새로고침 없이 화면만 바뀌는 것이 일반적이다.
    e.preventDefault();
    console.log('회원가입 시도:', email, password, nickname);
    // 사용자가 회원가입 버튼을 눌렀을 때 알림창을 띄워준다.
    alert('회원가입 완료 버튼 클릭됨 (아직 실제 등록 기능 없음)');
  };

  // 이 컴포넌트가 브라우저에 어떤 내용을 보여줄지 JSX로 반환한다.
  // onSubmit={handleSubmit}사용자가 제출 버튼을 클릭하면 handleSubmi()함수가 실행된다.
  // type="email": 이메일 입력 전용 필드
  // placeholder: 입력 전에 보이는 회색 안내 문구
  // value={email}: 입력 필드의 값은 상태 변수 email로 설정된다.
  // onChange: 입력값이 바뀔 때마다 setEmail로 상태를 업데이트한다.
  // style: 입력 필드의 너비와 여백을 인라인 스타일로 지정한다.
  return(
    <div>
      <h2>📝 회원가입</h2>
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
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{width: '300px', padding: '8px', marginBottom: '10px'}}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{width: '300px',padding: '8px', marginBottom: '10px'}}
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  )
}
  
export default Register;
*/
// 2차
// React의 useState 훅을 import하여 컴포넌트 내에서 상태(state)를 관리할 수 있게 한다.
import {useState} from 'react';
// HTTP 요청을 위해 axios 라이브러리를 import한다.
import axios from 'axios';
// 페이지 이동(리디렉션)을 위한 React Router의 훅 useNavigate를 import한다.
import {useNavigate} from 'react-router-dom';

// Register라는 이름의 함수형 컴포넌트를 정의하며, 다른 컴포넌트에서도 사용할 수 있도록 export한다.
export default function Register(){
  // 사용자 이름 입력값을 저장하는 username 상태를 선언한다.
  const [username, setUsername] = useState('');
  // 비밀번호 입력값을 저장하는 password 상태를 선언한다.
  const [password, setPassword] = useState('');
  // 회원가입 실패 등의 에러 메시지를 담는 error 상태를 선언한다.
  const [error, setError] = useState('');
  // 페이지 이동을 위한 navigate 함수를 초기화한다.
  const navigate = useNavigate();

  // 회원가입 버튼 클릭 시 실행되는 비동기 함수이다.
  const handleRegister = async() => {
    // 예외 처리를 위한 try-catch 블록 시작.
    try {
      // POST 방식으로 /register API에 요청을 보낸다. 입력한 username과 password를 함께 전송한다.
      await axios.post('http://localhost:8000/register', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // 사용자에게 회원가입 성공 메시지를 띄운다.
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      // 회원가입 완료 후 로그인 페이지로 리디렉션한다.
      navigate('/login');
      // 요청 중 오류가 발생했을 때 실행되는 코드 블록이다.
    } catch(err){
      // 콘솔에 오류 로그를 출력한다.
      console.error(err);
      // 화면에 표시할 에러 메시지를 상태로 설정한다.
      setError('회원가입 실패: 이미 존재하는 사용자일 수 있습니다.');
    }
  };
  // 화면 렌더링 (JSX)
  // 컴포넌트가 브라우저에 렌더링할 UI 요소를 반환한다.
  return (
    <div>
      <h2>📝 회원가입</h2>
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
      <button onClick={handleRegister}>회원가입</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}