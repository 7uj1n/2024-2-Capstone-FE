import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomModal from '../UI/CustomModal'; // CustomModal 컴포넌트 가져오기
import './SignUpPage.css';

function SignUpPage() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleSignup = async (event) => {
        event.preventDefault();

        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        const email = event.target.formBasicEmail.value;
        const username = event.target.formBasicName.value;
        const password = event.target.formBasicPassword.value;
        const passwordconfirm = event.target.formBasicConfirmPassword.value;

        // 비밀번호와 비밀번호 확인이 다를 경우 오류 메시지 표시
        if (password !== passwordconfirm) {
            setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            setSuccessMessage('');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/auth/signup`, {
                email,
                username,
                password,
                passwordconfirm
            });

            console.log('회원가입 성공:', response.data);

            if (response.status === 200) {    //회원가입 성공
                setSuccessMessage('회원가입이 성공적으로 완료되었습니다.');
                setErrorMessage('');
                setModalContent('회원가입이 성공적으로 완료되었습니다.');
                setShowModal(true);
            } else {    //회원가입 실패
                console.log('회원가입 실패:', response.data.message);
                setErrorMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
                setSuccessMessage('');
            }
        } catch (error) {   //서버 오류
            if (error.response && error.response.status === 400) {
                // 400 Bad Request 처리
                setErrorMessage(error.response.data.message);
            } else {
                console.error('회원가입 중 오류 발생:', error);
                setErrorMessage('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
            }
            setSuccessMessage('');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/login');
    };

    return (
        <div className="signup-container">
            <Container className="signup-form">
                <Row>
                    <Col md={12}>
                        <h3 className="signup-title">회원가입</h3>

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

                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            {successMessage && <p className="success-message">{successMessage}</p>}

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

            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleCloseModal}
                title="알림"
                body={modalContent}
                confirmText="확인"
                cancelText=""
            />
        </div>
    );
};

export default SignUpPage;