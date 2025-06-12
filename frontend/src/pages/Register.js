// src/pages/Register.js
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
