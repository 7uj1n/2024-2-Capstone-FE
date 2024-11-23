import { useNavigate } from "react-router-dom";
import './mainPage.css';
import Button from 'react-bootstrap/Button';
import backgroundImage from './images/airplane2.jpg';
import useStore from '../../store/UserStore'; // Zustand 스토어 가져오기

function MainPage() {
    const navigate = useNavigate();
    const token = useStore((state) => state.token);

    const handleStartClick = () => {
        if (token) {
            navigate('/road');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="main-page-container">
            <div className="background-image-container">
                <img src={backgroundImage} alt="Background" className="background-image" />
                <div className="content-overlay">
                    <h1>인천공항 경로 찾기 서비스</h1>
                    <Button className="start-button" variant="danger" type="submit" onClick={handleStartClick}>시작하기</Button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;