import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomModal from '../UI/CustomModal'; // CustomModal 컴포넌트 가져오기
import LoadingSpinner from '../UI/LoadingSpinner'; // LoadingSpinner 컴포넌트 가져오기
import './LoginPage.css'; // 로그인 페이지와 동일한 스타일 적용

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        console.log('요청 데이터:', { email, username: name });

        setLoading(true); // API 요청 시작 시 로딩 상태 설정

        try {
            const response = await axios.post(`${apiUrl}/api/auth/findpassword`, {
                email,
                username: name
            });

            console.log('성공', response.data);

            if (response.status === 200) {
                setModalContent(response.data.message);
                setShowModal(true);
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
        } finally {
            setLoading(false); // API 요청 완료 후 로딩 상태 해제
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/login');
    };

    return (
        <>
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
                        {message && <p className="mt-3 text-danger">{message}</p>}
                        <Button variant="danger" type="submit" className="mt-4 btn" disabled={loading}>
                            비밀번호 찾기
                        </Button>
                        <div className="login-links">
                            <NavLink to="/signup">회원가입</NavLink> | <NavLink to="/login">로그인</NavLink>
                        </div>
                    </Form>
                </div>

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
            {loading && <LoadingSpinner message="요청을 처리 중입니다..." />}
        </>
    );
};

export default ForgotPassword;