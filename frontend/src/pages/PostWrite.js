// src/pages/PostWrite.js
/* 1차 시작 코드
// React에서 상태를 관리하기 위한 useState 훅을 가져온다.
// 사용자의 입력값을 저장하기 위해 필요하다.
import {useState} from 'react';

// PostWrite라는 함수형 컴포넌트를 정의한다.
// 글쓰기 화면 전체를 담당한다.=
function PostWrite(){
  // title은 제목 입력값을 저장하는 상태 변수이다.
  // setTitle()은 이 값을 바꿔주는 함수이다.
  // useState('')는 기본값을 빈 문자열로 설정한다.
  const [title, setTitle] = useState('');
  // content는 글의 내용 입력값을 저장하는 상태 변수이다.
  // SetContent()는 상태를 업데이트한다.
  const [content, setContent] = useState('');

  // 폼이 제출될 때 호출되는 함수를 정의한다.
  // e는 이벤트 객체이다.
  const handleSubmit = (e) => {

    // 기본 동작인 '페이지 새로고침(submit 시)을 막는다.'
    // React에서 폼 제출을 제어할 때 항상 필요하다.
    e.preventDefault();

    // 현재 사용자가 입력한 제목과 내용을 콘솔에 출력한다.
    // 아직 백엔드가 없으므로 일단 로그로 확인하는 단계이다.
    console.log('제목:', title);
    console.log('내용:', content);
    
    // 사용자가 작성 완료를 누르면 팝업(alert)으로 피드백을 준다.
    alert('글이 제출되었습니다! (현재는 저장되지 않음)');

    // 입력한 제목과 내용을 다시 빈 칸으로 초기화한다.
    // 새 글을 작성할 수 있도록 입력 폼을 비운다.
    setTitle('');
    setContent('');
  };

  // 이 컴포넌트가 브라우저에서 렌더링할 HTML을 정의한다.
  // 제목(헤더)을 표시한다. 글쓰기 화면임을 나타낸다.
  // HTML <from> 요소이다.
  // 제출할 때 handleSubmit() 함수가 실행되도록 설정한다.

  // 제목 입력창
  // value={title}: 입력창에 보여질 값은 title 상태값이다.
  // onChange: 입력값이 바뀔 때마다 setTitle()을 호출해 상태를 갱신한다.
  // style: CSS 인라인 스타일로 가로 너비와 여백을 설정한다.

  // 본문 내용을 입력하는 <textarea>이다.
  // value={content}: 현재 입력된 내용을 보여준다.
  // onChange: 사용자가 입력할 때 setContent()로 상태 업데이트
  // 스타일로 너비와 높이를 설정한다.

  // 폼 제출 버튼
  // type="submit": 클릭 시 form이 제출된다.
  // 버튼에 약간의 마진을 줘서 여백을 확보한다.
  return(
    <div>
      <h2>✏️ 게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{width: '400px', padding: '8px', marginBottom: '10px'}}
          />
        </div>
        <div>
          <textarea
            placeholder='내용'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{width: '400px', height: '200px', padding: '8px'}}
          />
        </div>
        <div>
          <button type="submit" style={{marginTop: '10px'}}>작성 완료</button>
        </div>
      </form>
    </div>
  );
}

// 이 컴포넌트를 외부에서도 사용할 수 있도록 내보낸다.
// App.js 에서 <Route path="/write" element={<PostWrite />} />로 연결했기 때문에 
// 페이지로 동작한다.
export default PostWrite;
*/

import {useState} from 'react';
import axios from 'axios';

function PostWrite(){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const response = await axios.post('http://localhost:8000/posts/', {
        title: title,
        content: content,
        author: '익명',
      });

      console.log('작성 성공:', response.data);
      alert('글이 성공적으로 등록되었습니다!');
      setContent('');
    } catch (error) {
      console.error('작성 실패:', error);
      alert('글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>✏️ 게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{width: '400px', padding: '8px', marginBottom: '10px'}}
          />
        </div>
        <div>
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{width: '400px', height: '200px', padding: '8px'}}
          />
        </div>
        <div>
          <button type="submit" style={{marginTop:'10px'}}>작성 완료</button>
        </div>
      </form>
    </div>
  )
}

export default PostWrite;