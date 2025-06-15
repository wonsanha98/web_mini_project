// src/pages/PostEdit.js

// React 훅 중 useState, useEffect를 불러온다. 각각 상태 관리 및 API 호출용이다.
import {useEffect, useState} from 'react';
// useNavigate: 페이지 이동에 사용, useParams: URL에서 게시글 ID 추출에 사용한다.
import {useNavigate, useParams} from 'react-router-dom';
// 백엔드 API 요청을 보내기 위해 axios 라이브러리를 import 한다.
import axios from 'axios';

// 게시글 수정 화면을 구성하는 React 컴포넌트(PostEdit)를 정의한다.
export default function PostEdit(){
    // 현재 URL에서 게시글의 고유 ID를 추출한다. 예: /edit/3 -> id는 3.
    const {id} = useParams();
    // 수정 후 /post/:id 페이지로 이동하기 위해 사용하는 라우터 함수이다.
    const navigate = useNavigate();

    // 수정 폼에 사용할 게시글 상태를 정의하고 초기값을 빈 값으로 설정한다.
    const [post, setPost] = useState({
        title: '',
        content: '',
        author:''
    });

    // 컴포넌트가 처음 렌더링 될 때 실행된다. (API 호출 시 사용)
    useEffect(() => {
        // FastAPI 백엔드에 GET 요청을 보내 해당 id의 게시글 정보를 가져온다.
        axios.get(`http://localhost:8000/posts/${id}`)
        // 응답 데이터(게시글 정보)를 post 상태에 저장한다.
        .then(response => setPost(response.data))
        // 오류가 발생하면 사용자에게 alert 창을 띄워 알린다.
        .catch(err => alert("게시글을 불러올 수 없습니다."));
        // 의존성 배열: id가 바뀔 때마다 이 effect가 재실행된다.
    }, [id]);

    // input 또는 textarea가 변경될 때 실행되는 함수이다.
    const handleChange = e => {
        // 이벤트 대상(input)의 name과 value를 추출한다. 예: name="title", value="새 제목"
        const {name, value} = e.target;
        // 기존 post 상태를 복사해서 해당 필드만 업데이트한다.
        setPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 폼 제출 시 실행되는 함수이다.
    const handleSubmit = e => {
        // HTML 기본 동작(페이지 새로고침)을 막는다.
        e.preventDefault();
        // FastAPI 백엔드에 PATCH 요청을 보내 게시글 내용을 수정한다.
        axios.patch(`http://localhost:8000/posts/${id}`, post)
        // 수정 성공 시 사용자에게 알리고, 해당 게시글의 상세 페이지로 이동시킨다.
        .then(() => {
            alert("게시글이 수정되었습니다.");
            navigate(`/post/${id}`);
        })
        // 오류가 나면 사용자에게 알린다.
        .catch(err => {
            alert("수정 중 오류가 발생했습니다.");
        });
    };

    // 화면에 표시할 내용을 반환하는 JSX 시작
    // 상단에 수정 페이지 제목을 보여준다.
    // 폼을 생성하고, 제출 시 위의 handleSubmit 함수가 실행되게 한다.
    return (
        <div>
            <h2>✏️ 게시글 수정</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                    placeholder="제목"
                /><br />
                <textarea 
                    name="content"
                    value={post.content}
                    onChange={handleChange}
                    placeholder="내용"
                /><br />
                <input 
                    type="text"
                    name="author"
                    value={post.author}
                    onChange={handleChange}
                    placeholder="작성자"
                /><br />
                <button type="submit">수정 완료</button>
            </form>
        </div>
    );
}