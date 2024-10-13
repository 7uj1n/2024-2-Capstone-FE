import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUpPage.css';

function SignUpPage() {
    const handleSignup = (event) => {
        event.preventDefault();
        // Handle signup logic here
    };

    return (
        <div className="signup-container">
            <Container className="signup-form">
                <Row>
                    <Col md={12}>
                        <h2 className="text-center">회원가입</h2>
                        <Form onSubmit={handleSignup}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>이메일 주소</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" required />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control type="password" placeholder="Password" required />
                            </Form.Group>

                            <Form.Group controlId="formBasicConfirmPassword">
                                <Form.Label>비밀번호 확인</Form.Label>
                                <Form.Control type="password" placeholder="Confirm Password" required />
                            </Form.Group>
                            <Button className="btn" variant="danger" type="submit">
                                회원가입
                            </Button>

                            <div className="signup-links">
                                <NavLink to="/">로그인</NavLink>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SignUpPage;