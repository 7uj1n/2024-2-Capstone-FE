import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css'; // 로그인 페이지와 동일한 스타일 적용

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // 존재할 경우, 모달로 '임시 비밀번호가 이메일로 전송되었습니다.' 메시지 출력
        //-> 확인 버튼 클릭시 로그인 페이지로 이동.?
        setMessage('비밀번호 찾기 요청이 성공적으로 처리되었습니다.');  
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