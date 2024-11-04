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
                    <div className="floating-label-group">
                        <Form.Control type="password" id="formCurrentPassword" placeholder=" " required />
                        <Form.Label htmlFor="formCurrentPassword">현재 비밀번호</Form.Label>
                    </div>
                    <div className="floating-label-group">
                        <Form.Control type="password" id="formNewPassword" placeholder=" " required />
                        <Form.Label htmlFor="formNewPassword">새 비밀번호</Form.Label>
                    </div>
                    <div className="floating-label-group">
                        <Form.Control type="password" id="formConfirmPassword" placeholder=" " required />
                        <Form.Label htmlFor="formConfirmPassword">새 비밀번호 확인</Form.Label>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    취소
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    변경
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PasswordChangeModal;