import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './PasswordChangeModal.css'; // 커스텀 CSS 파일 추가

function PasswordChangeModal({ show, handleClose }) {
    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>비밀번호 바꾸기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formCurrentPassword">
                        <Form.Label className="form-label">현재 비밀번호</Form.Label>
                        <Form.Control type="password" placeholder="현재 비밀번호를 입력하세요" />
                    </Form.Group>
                    <Form.Group controlId="formNewPassword">
                        <Form.Label className="form-label">새 비밀번호</Form.Label>
                        <Form.Control type="password" placeholder="새 비밀번호를 입력하세요" />
                    </Form.Group>
                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label className="form-label">새 비밀번호 확인</Form.Label>
                        <Form.Control type="password" placeholder="새 비밀번호를 다시 입력하세요" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    저장
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PasswordChangeModal;