import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css'; // 로그인 페이지와 동일한 스타일 적용

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        console.log('요청 데이터:', { email, username: name });

        try {
            const response = await axios.post(`${apiUrl}/api/auth/findpassword`, {
                email,
                username: name
            });

            console.log('성공', response.data);

            if (response.status === 200) {
                alert(response.data.message);
                navigate('/login');
            } else {
                setMessage('비밀번호 찾기에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            if (error.response) {
                console.error('서버 응답 오류:', error.response);
                setMessage(error.response.data.message);
            } else {
                console.error('서버 오류:', error);
                setMessage('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h3 className="login-title">비밀번호 찾기</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formEmail" className="floating-label-group">
                        <Form.Control
                            type="email"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Form.Label>이메일</Form.Label>
                    </Form.Group>

                    <Form.Group controlId="formName" className="floating-label-group">
                        <Form.Control
                            type="text"
                            placeholder=" "
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Form.Label>이름</Form.Label>
                    </Form.Group>

                    <Button variant="danger" type="submit" className="mt-4 btn">
                        비밀번호 찾기
                    </Button>
                    <div className="login-links">
                        <NavLink to="/signup">회원가입</NavLink> | <NavLink to="/login">로그인</NavLink>
                    </div>
                </Form>
                {message && <p className="mt-3">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;