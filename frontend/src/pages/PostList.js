// src/pages/PostList.js
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
