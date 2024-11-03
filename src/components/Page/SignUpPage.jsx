import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUpPage.css';

function SignUpPage() {
    const handleSignup = (event) => {
        event.preventDefault();
        // axios.post로 회원가입 요청 보내기. Api 구현 후 수정예정
    };

    return (
        <div className="signup-container">
            <Container className="signup-form">
                <Row>
                    <Col md={12}>
                        <h2 className="signup-title">회원가입</h2>

                        <Form onSubmit={handleSignup}>
                            <div className="floating-label-group">
                                <Form.Control type="text" id="formBasicName" placeholder=" " required />
                                <Form.Label htmlFor="formBasicName">이름</Form.Label>
                            </div>

                            <div className="floating-label-group">
                                <Form.Control type="email" id="formBasicEmail" placeholder=" " required />
                                <Form.Label htmlFor="formBasicEmail">이메일 주소</Form.Label>
                            </div>

                            <div className="floating-label-group">
                                <Form.Control type="password" id="formBasicPassword" placeholder=" " required />
                                <Form.Label htmlFor="formBasicPassword">비밀번호</Form.Label>
                            </div>

                            <div className="floating-label-group">
                                <Form.Control type="password" id="formBasicConfirmPassword" placeholder=" " required />
                                <Form.Label htmlFor="formBasicConfirmPassword">비밀번호 확인</Form.Label>
                            </div>

                            <Button className="btn" variant="danger" type="submit">
                                회원가입
                            </Button>

                            <div className="signup-links">
                                <NavLink to="/login">로그인</NavLink>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SignUpPage;