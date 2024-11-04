import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import './MyPage.css'; // 커스텀 CSS 파일 추가
import PasswordChangeModal from '../UI/PasswordChangeModal'; // 비밀번호 변경 모달 컴포넌트 추가

function MyPage() {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleCommentsClick = () => {
        navigate('/my-comments'); // MyCommentsPage로 이동
    };

    return (
        <Container fluid className="mypage-container">
            {/* Title */}
            <Row className="justify-content-center my-4">
                <Col xs={10} md={8} className="mypage-content">
                    <h2 className="mypage-title">마이페이지</h2>
                </Col>
            </Row>

            {/* Cards */}
            <Row className="justify-content-center">
                <Col xs={10} md={8} className="mypage-content">
                    <div className="card-container">
                        <Card className="mypage-card" onClick={handleShow} style={{ cursor: 'pointer' }}>
                            <Card.Body className="mypage-text">
                                <Card.Title>비밀번호 바꾸기</Card.Title>
                            </Card.Body>
                        </Card>
                        <Card className="mypage-card" onClick={handleCommentsClick} style={{ cursor: 'pointer' }}>
                            <Card.Body className="mypage-text">
                                <Card.Title>작성한 댓글</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* Password Change Modal */}
            <PasswordChangeModal show={showModal} handleClose={handleClose} />
        </Container>
    );
}

export default MyPage;