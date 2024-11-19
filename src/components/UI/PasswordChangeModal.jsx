import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './PasswordChangeModal.css'; // 커스텀 CSS 파일 추가

function PasswordChangeModal({ show, handleClose }) {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async () => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        console.log('요청 데이터:', {
            email,
            password: currentPassword,
            newpassword: newPassword,
            newpasswordconfirm: confirmPassword
        });
        if (newPassword !== confirmPassword) {
            setMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/auth/update`, {    //403 에러남
                email,
                password: currentPassword,
                newpassword: newPassword,
                newpasswordconfirm: confirmPassword
            });

            if (response.status === 200) {
                alert(response.data.message);
                handleClose();
            } else {
                setMessage('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>비밀번호 바꾸기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="floating-label-group">
                        <Form.Control
                            type="email"
                            id="formEmail"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Form.Label htmlFor="formEmail">이메일</Form.Label>
                    </div>
                    <div className="floating-label-group">
                        <Form.Control
                            type="password"
                            id="formCurrentPassword"
                            placeholder=" "
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <Form.Label htmlFor="formCurrentPassword">현재 비밀번호</Form.Label>
                    </div>
                    <div className="floating-label-group">
                        <Form.Control
                            type="password"
                            id="formNewPassword"
                            placeholder=" "
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <Form.Label htmlFor="formNewPassword">새 비밀번호</Form.Label>
                    </div>
                    <div className="floating-label-group">
                        <Form.Control
                            type="password"
                            id="formConfirmPassword"
                            placeholder=" "
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Form.Label htmlFor="formConfirmPassword">새 비밀번호 확인</Form.Label>
                    </div>
                </Form>
                {message && <p className="mt-3">{message}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    취소
                </Button>
                <Button variant="primary" onClick={handleChangePassword}>
                    변경
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PasswordChangeModal;