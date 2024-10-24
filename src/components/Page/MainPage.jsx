import { useNavigate } from "react-router-dom";
import './mainPage.css';
import Button from 'react-bootstrap/Button';
import backgroundImage from './images/airplane2.jpg';

function MainPage() {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };

    return (
        <div className="main-page-container">
            <div className="background-image-container">
                <img src={backgroundImage} alt="Background" className="background-image" />
                <div className="content-overlay">
                    <h1>인천공항 경로 찾기 서비스</h1>
                    {/* <p>
                        인천공항 경로 찾기 서비스에 오신 것을 환영합니다! <br /> 이 서비스는 수도권 내에서 인천공항까지의 최적 경로를 찾아드립니다.
                            출발지를 선택하시면, 가장 빠르고 편리한 경로를 안내해드립니다.
                    </p> */}
                    <Button className="start-button" variant="danger" type="submit" onClick={handleStartClick}>시작하기</Button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;