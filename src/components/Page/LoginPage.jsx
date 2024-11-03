import { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target.formBasicEmail.value;
        const password = event.target.formBasicPassword.value;

        try {   //원래 post로 받아야함. APi 구현 뒤 수정할 예정 + 로그인 유지 구현(JWT)
            const response = await axios.get('https://jsonplaceholder.typicode.com/users');
            const users = response.data;

            const user = users.find(user => user.email === email && user.username === password);

            if (user) {
                navigate('/road');
            } else {
                setErrorMessage('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
            }
        } catch (error) {
            setErrorMessage('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
        }

        //try {
        // const response = await axios.post('https://jsonplaceholder.typicode.com/users', {    //로그인 요청
        // email,
        // password
        // });

        // if (response.data.success) {    //로그인 성공
        // navigate('/road');
        // } else {    //로그인 실패
        // console.log(email, password);
        // setErrorMessage('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
        // }
        // } catch (error) {   //서버 오류
        // setErrorMessage('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
        // }

        // navigate('/road');
        // };
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">로그인</h2>
                <Form onSubmit={handleLogin}>
                    <div className="floating-label-group">
                        <Form.Control type="email" id="formBasicEmail" placeholder=" " required />
                        <Form.Label htmlFor="formBasicEmail">이메일</Form.Label>
                    </div>

                    <div className="floating-label-group">
                        <Form.Control type="password" id="formBasicPassword" placeholder=" " required />
                        <Form.Label htmlFor="formBasicPassword">비밀번호</Form.Label>
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <Button className="btn" variant="danger" type="submit">
                        로그인
                    </Button>
                    <div className="login-links">
                        <NavLink to="/signup">회원가입</NavLink>
                        {/* | <NavLink to="/forgot-password">비밀번호 찾기</NavLink> */}
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;