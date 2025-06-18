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
    <div className="retro-container">
      <h2>✎ 회원가입</h2>
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
      <button className="retro-button" onClick={handleRegister}>회원가입</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}