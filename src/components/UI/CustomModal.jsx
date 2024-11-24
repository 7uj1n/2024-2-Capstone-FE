import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './customModal.css'; // 커스텀 모달 스타일 추가

const CustomModal = ({ show, handleClose, handleConfirm, title, body, confirmText, cancelText }) => {
    return (
        <Modal show={show} onHide={handleClose} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                {cancelText && (
                    <Button variant="outline-secondary" onClick={handleClose}>
                        {cancelText}
                    </Button>
                )}
                <Button variant="outline-danger" onClick={handleConfirm}>
                    {confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomModal;