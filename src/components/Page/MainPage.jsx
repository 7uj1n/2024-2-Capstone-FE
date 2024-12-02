// import { useNavigate } from "react-router-dom";
// import './mainPage.css';
// import Button from 'react-bootstrap/Button';
// import backgroundImage from './images/airplane2.jpg';
// import useStore from '../../store/UserStore'; // Zustand 스토어 가져오기

// function MainPage() {
//     const navigate = useNavigate();
//     const token = useStore((state) => state.token);

//     const handleStartClick = () => {
//         if (token) {
//             navigate('/road');
//         } else {
//             navigate('/login');
//         }
//     };

//     return (
//         <div className="main-page-container">
//             <div className="background-image-container">
//                 <img src={backgroundImage} alt="Background" className="background-image" />
//                 <div className="content-overlay">
//                     <h1>✈️ AirportPreview에 오신걸 환영합니다</h1>
//                     <div className="centered-text">
//                         <h3>인천공항과 주변 도로의 혼잡도를 확인하고🛻</h3>
//                         <h3>인천공항으로 가는 경로를 확인해보세요!🧭</h3>
//                     </div>
//                     <Button className="start-button" variant="danger" type="submit" onClick={handleStartClick}>시작하기</Button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MainPage;


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
                    <h1>✈️ AirportPreview에 오신걸 환영합니다</h1>
                    <div className="centered-text">
                        <h3>인천공항과 주변 도로의 혼잡도를 확인하고🛻</h3>
                        <h3>인천공항으로 가는 경로를 확인해보세요!🧭</h3>
                    </div>
                    <Button className="start-button" variant="danger" type="submit" onClick={handleStartClick}>시작하기</Button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;