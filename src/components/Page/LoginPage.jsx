import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useStore from '../../store/UserStore';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const setToken = useStore((state) => state.setToken);
    const setExpiresIn = useStore((state) => state.setExpiresIn);
    const setUsername = useStore((state) => state.setUsername);
    const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);

    const handleLogin = async (event) => {
        event.preventDefault();
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        const email = event.target.formBasicEmail.value;
        const password = event.target.formBasicPassword.value;

        try {
            const response = await axios.post(`${apiUrl}/api/auth/login`, {    //로그인 요청
                email,
                password
            });

            console.log('로그인 성공:', response.data);

            if (response.status === 200) {    //로그인 성공
                const { jwt, expiresIn, username } = response.data;

                // JWT 토큰과 만료 시간을 로컬 스토리지에 저장
                localStorage.setItem('token', jwt);
                // 현재 시간 + 만료 시간 계산 후 저장
                const expirationTime = new Date().getTime() + expiresIn * 1000;
                localStorage.setItem('expiresIn', expirationTime);

                // Zustand 스토어에 사용자 정보 저장
                setToken(jwt);
                setExpiresIn(expiresIn);
                setUsername(username);
                setIsAuthenticated(true);

                navigate('/road');
            } else {    //로그인 실패
                setErrorMessage('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
            }
        } catch (error) {
            // 401 오류와 기타 서버 오류 구분
            if (error.response) {
                if (error.response.status === 401) {
                    // 401 Unauthorized 처리
                    setErrorMessage('이메일 또는 비밀번호가 잘못되었습니다.');
                } else {
                    // 다른 서버 오류 처리
                    console.error('서버 오류 상태 코드:', error.response.status);
                    setErrorMessage('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
                }
            } else {
                // 네트워크 오류 또는 기타 오류 처리
                console.error('네트워크 오류 또는 알 수 없는 오류:', error.message);
                setErrorMessage('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h3 className="login-title">로그인</h3>
                <Form onSubmit={handleLogin}>
                    <div className="floating-label-group">
                        <Form.Control type="email" id="formBasicEmail" placeholder=" " required />
                        <Form.Label htmlFor="formBasicEmail">이메일</Form.Label>
                    </div>

                    <div className="floating-label-group">
                        <Form.Control type="password" id="formBasicPassword" placeholder=" " required />
                        <Form.Label htmlFor="formBasicPassword">비밀번호</Form.Label>
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <Button className="btn" variant="danger" type="submit">
                        로그인
                    </Button>
                    <div className="login-links">
                        <NavLink to="/signup">회원가입</NavLink> | <NavLink to="/forgot-password">비밀번호 찾기</NavLink>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;