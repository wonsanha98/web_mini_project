// src/components/PrivateRoute.js

// 사용자가 인증되지 않았을 때 로그인 페이지로 리디렉션할 수 있도록 Navigate 컴포턴트를 가져온다.
import {Navigate} from 'react-router-dom';
// 인증 확인 함수 isAutheticated를 import한다.
import {isAutheticated} from '../utils/auth';

// PrivateRoute 컴포넌트는 인증된 사용자만 자식 컴포넌트를 볼 수 있도록 제한하는 역할을 한다.
export default function PrivateRoute({children}){
    // 사용자가 인증되었으면 원래 자식 컴포넌트를 보여주고, 아니면 /login으로 리디렉션한다.
    return isAutheticated() ? children : <Navigate to="/login" replace />;
}
