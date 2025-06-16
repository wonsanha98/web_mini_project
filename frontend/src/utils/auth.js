// src/utils/auth.js

// inAutheticated라는 함수 정의를 export하여 외부 파일에서 불러올 수 있게 한다.
export function isAutheticated(){
    // 브라우저의 localStorage에서 로그인 후 저장된 JWT 토큰을 가져온다.
    const token = sessionStorage.getItem('access_token');
    // 토큰이 존재하면 true, 없으면 false를 반환한다. (!!는 truthy/falsy를 명확한 bool으로 변환)
    return !!token;
}

// 로그아웃 함수 만들기
export function logout(){
    sessionStorage.removeItem('access_token');
}