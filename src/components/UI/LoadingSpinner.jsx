import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './LoadingSpinner.css'; // 커스텀 스타일을 위한 CSS 파일

const LoadingSpinner = ({ message }) => {
    return (
        <div className="loading-spinner-container">
            <Spinner animation="border" role="status" className="loading-spinner">
                {/* <span className="sr-only">Loading...</span> */}
            </Spinner>
            {message && <div className="loading-message">{message}</div>}
        </div>
    );
};

export default LoadingSpinner;