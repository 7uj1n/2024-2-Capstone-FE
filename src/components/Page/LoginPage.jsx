import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import './LoginPage.css';

import { NavLink, useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        // 로그인 로직을 여기에 추가할 수 있습니다.
        navigate('/road');
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" className="form-control" required/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control type="password" placeholder="Password" className="form-control" required/>
                    </Form.Group>
                    <Button variant="danger" type="submit">
                        로그인
                    </Button>
                    <div className="login-links">
                        <NavLink to="/signup">회원가입</NavLink> | <NavLink to="/forgot-password">비밀번호 찾기</NavLink>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;