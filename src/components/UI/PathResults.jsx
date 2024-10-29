// import React, { useState } from 'react';
// import pathData from '../data/path.json'; // 경로 데이터 가져오기
// import Card from 'react-bootstrap/Card';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Button from 'react-bootstrap/Button';
// import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기
// import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
// import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기
// import './pathResults.css';

// export default function PathResults({ selectedRegion, onRouteClick }) {
//     const [selectedRoute, setSelectedRoute] = useState(null); // 선택된 경로 상태 관리
//     const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기
//     const selectedTime = useStore(state => state.selectedTime); // 선택한 시간 가져오기
//     const setSelectedDateTime = useStore(state => state.setSelectedDateTime); // 선택한 날짜와 시간 변경 함수 가져오기
//     const setSelectedRegion = useStore(state => state.setSelectedRegion); // 선택한 지역 변경 함수 가져오기
//     const navigate = useNavigate(); // useNavigate 훅 사용

//     const handleRouteClick = (routeId) => {
//         setSelectedRoute(routeId);
//         onRouteClick(routeId);
//     };

//     const handleReset = () => {
//         setSelectedDateTime(null, null); // 선택한 날짜와 시간 초기화
//         setSelectedRegion('', ''); // 선택한 지역 초기화
//         navigate('/path'); // 최적 경로 찾기 페이지로 이동
//     };

//     return (
//         <div className="result-content">
//             {selectedDate && selectedTime && (
//                 <h5>{selectedDate} {selectedTime}</h5>
//             )}
//             <div className="header-container">
//                 <h4>{selectedRegion} 경로 결과</h4>
//                 <Button variant="secondary" onClick={handleReset}>초기화</Button>
//             </div>
//             {pathData.path.map(route => (
//                 <Card
//                     key={route.id}
//                     className={`mb-3 ${selectedRoute === route.id ? 'selected' : ''}`}
//                     onClick={() => handleRouteClick(route.id)}
//                     style={{ cursor: 'pointer' }}
//                 >
//                     <Card.Header>
//                         경로 {route.id} ({route.type === 'exist' ? '기존 경로' : '새로운 경로'})
//                     </Card.Header>
//                     <Card.Body>
//                         <Card.Text>소요 시간: {route.leadtime}</Card.Text>
//                         <ListGroup variant="flush">
//                             {route.station.map(station => (
//                                 <ListGroup.Item key={station.id}>{station.name}</ListGroup.Item>
//                             ))}
//                         </ListGroup>
//                     </Card.Body>
//                 </Card>
//             ))}
//         </div>
//     );
// };

import React, { useState } from 'react';
import pathData from '../data/path.json'; // 경로 데이터 가져오기
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기
import './pathResults.css';

import busMarkerImage from '../page/images/marker/bus.png';
import trainMarkerImage from '../page/images/marker/train.png';

const routeColors = {
    new: '#FF6347', // 토마토색
    exist: '#4682B4' // 강철색
};

export default function PathResults({ selectedRegion, onRouteClick }) {
    const [selectedRoute, setSelectedRoute] = useState(null); // 선택된 경로 상태 관리
    const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기
    const selectedTime = useStore(state => state.selectedTime); // 선택한 시간 가져오기
    const setSelectedDateTime = useStore(state => state.setSelectedDateTime); // 선택한 날짜와 시간 변경 함수 가져오기
    const setSelectedRegion = useStore(state => state.setSelectedRegion); // 선택한 지역 변경 함수 가져오기
    const setSelectedRouteStore = useStore(state => state.setSelectedRoute); // 선택한 경로 변경 함수 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleRouteClick = (routeId) => {
        setSelectedRoute(routeId);
        setSelectedRouteStore(routeId); // 선택한 경로 상태 업데이트
        onRouteClick(routeId);
    };

    const handleReset = () => {
        setSelectedDateTime(null, null); // 선택한 날짜와 시간 초기화
        setSelectedRegion('', ''); // 선택한 지역 초기화
        setSelectedRouteStore(null); // 선택한 경로 초기화
        navigate('/path'); // 최적 경로 찾기 페이지로 이동
    };

    return (
        <div className="result-content">
            {/* {selectedDate && selectedTime && (
                <h5>{selectedDate} {selectedTime}</h5>
            )} */}
            <div className="header-container">
            {selectedDate && selectedTime && (
                <h5>{selectedDate} {selectedTime}</h5>
            )}
                <h4>{selectedRegion} 경로 결과</h4>
                <Button variant="secondary" onClick={handleReset}>초기화</Button>
            </div>
            {pathData.path.map(route => (
                <Card
                    key={route.id}
                    className={`card ${selectedRoute === route.id ? 'selected' : ''}`}
                    onClick={() => handleRouteClick(route.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <Card.Header>
                        <span
                            style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '12px',
                                backgroundColor: routeColors[route.type],
                                marginRight: '10px',
                                borderRadius: '50%'
                            }}
                        ></span>
                        경로 {route.id} ({route.type === 'exist' ? '기존 경로' : '새로운 경로'})
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>소요 시간: {route.leadtime}</Card.Text>
                        <ListGroup variant="flush">
                            {route.station.map(station => (
                                <ListGroup.Item key={station.id}>
                                    <img
                                        src={station.type === 'bus' ? busMarkerImage : trainMarkerImage}
                                        alt={station.type}
                                        style={{ width: '40px', marginRight: '10px' }}
                                    />
                                    {station.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            ))}
            <h5 className="small-text">marker designed by nawicon from Flaticon</h5>
        </div>
    );
};