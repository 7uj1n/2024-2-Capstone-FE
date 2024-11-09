//경로 다같이 보여주는 경로

// import React, { useState } from 'react';
// import pathData from '../data/path2.json'; // 경로 데이터 가져오기
// import Card from 'react-bootstrap/Card';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Button from 'react-bootstrap/Button';
// import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기
// import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
// import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기
// import './pathResults.css';
// import CommentForm from './CommentForm'; // CommentForm 컴포넌트 가져오기

// import busMarkerImage from '../page/images/marker/bus.png';
// import trainMarkerImage from '../page/images/marker/train.png';

// const routeColors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF69B4', '#8A2BE2']; // 경로 색상 배열

// export default function PathResults({ selectedRegion, onRouteClick }) {
//     const [selectedRoute, setSelectedRoute] = useState(null); // 선택된 경로 상태 관리
//     const [currentRoute, setCurrentRoute] = useState(null); // 현재 선택된 경로 상태 관리
//     const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기
//     const selectedTime = useStore(state => state.selectedTime); // 선택한 시간 가져오기
//     const setSelectedDateTime = useStore(state => state.setSelectedDateTime); // 선택한 날짜와 시간 변경 함수 가져오기
//     const setSelectedRegion = useStore(state => state.setSelectedRegion); // 선택한 지역 변경 함수 가져오기
//     const setSelectedRouteStore = useStore(state => state.setSelectedRoute); // 선택한 경로 변경 함수 가져오기
//     const navigate = useNavigate(); // useNavigate 훅 사용

//     const handleRouteClick = (routeId) => {
//         setSelectedRoute(routeId);
//         setSelectedRouteStore(routeId); // 선택한 경로 상태 업데이트
//         onRouteClick(routeId);
//     };

//     const handleReset = () => {
//         setSelectedDateTime(null, null); // 선택한 날짜와 시간 초기화
//         setSelectedRegion('', ''); // 선택한 지역 초기화
//         setSelectedRouteStore(null); // 선택한 경로 초기화
//         navigate('/path'); // 최적 경로 찾기 페이지로 이동
//     };

//     const handleCommentClick = (route) => {
//         setCurrentRoute(route);
//     };

//     const handleCloseCommentForm = () => {
//         setCurrentRoute(null);
//     };

//     return (
//         <div className="result-content">
//             <div className="result-header">
//                 <div className="header-container">
//                     {selectedDate && selectedTime && (
//                         <h5>{selectedDate} {selectedTime}</h5>
//                     )}
//                     <h4>{selectedRegion} 경로 결과</h4>
//                 </div>
//                 <Button variant="secondary" className="reset-button" onClick={handleReset}>초기화</Button>
//             </div>
//             {pathData.path.map((route, index) => (
//                 <React.Fragment key={route.id}>
//                     {route.type === 'new' && index !== 0 && (
//                         <hr className="route-divider" style={{ marginBottom: 20 }} />
//                     )}
//                     <Card
//                         className={`card ${selectedRoute === route.id ? 'selected' : ''}`}
//                         onClick={() => handleRouteClick(route.id)}
//                         style={{ cursor: 'pointer' }}
//                     >
//                         <Card.Header>
//                             <span
//                                 style={{
//                                     display: 'inline-block',
//                                     width: '12px',
//                                     height: '12px',
//                                     backgroundColor: routeColors[index % routeColors.length],
//                                     marginRight: '5px', // 공백을 줄이기 위해 margin-right를 5px로 설정
//                                     borderRadius: '50%'
//                                 }}
//                             ></span>
//                             <span className="route-title">
//                                 경로 {route.id} ({route.type === 'exist' ? '기존 경로' : '새로운 경로'})
//                             </span>
//                             <div className="route-feedback">
//                                 <span className="like">👍 {route.like}</span>
//                                 <span className="dislike">👎 {route.dislike}</span>
//                                 <Button variant="outline-dark" size="sm" onClick={() => handleCommentClick(route)}>의견 달기</Button>
//                             </div>
//                         </Card.Header>
//                         <Card.Body>
//                             <Card.Text>소요 시간: {route.leadtime}</Card.Text>
//                             <ListGroup variant="flush">
//                                 {route.station.map(station => (
//                                     <ListGroup.Item key={station.id}>
//                                         <img
//                                             src={station.type === 'bus' ? busMarkerImage : trainMarkerImage}
//                                             alt={station.type}
//                                             style={{ width: '40px', marginRight: '10px' }}
//                                         />
//                                         <div>
//                                             <div>{station.name}</div>
//                                             <div className="station-direction">{station.direction}</div>
//                                         </div>
//                                     </ListGroup.Item>
//                                 ))}
//                             </ListGroup>
//                         </Card.Body>
//                     </Card>
//                 </React.Fragment>
//             ))}
//             <h5 className="small-text">marker designed by nawicon from Flaticon</h5>

//             {/* 의견 달기 창 */}
//             {currentRoute && (
//                 <div className={`comment-form-container ${currentRoute ? 'show' : ''}`}>
//                     <CommentForm route={currentRoute} onClose={handleCloseCommentForm} />
//                 </div>
//             )}
//         </div>
//     );
// };


//경로 1개씩만, 버스 걷기 지하철 구분한 경로


import React, { useState } from 'react';
import pathData from '../data/path2.json'; // 경로 데이터 가져오기
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기
import './pathResults.css';
import CommentForm from './CommentForm'; // CommentForm 컴포넌트 가져오기

import busMarkerImage from '../page/images/marker/bus.png';
import trainMarkerImage from '../page/images/marker/train.png';

const routeColors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF69B4', '#8A2BE2']; // 경로 색상 배열

export default function PathResults({ selectedRegion, onRouteClick }) {
    const [selectedRoute, setSelectedRoute] = useState(pathData.path[0].id); // 초기 상태에서 첫 번째 경로 선택
    const [currentRoute, setCurrentRoute] = useState(null); // 현재 선택된 경로 상태 관리
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

    const handleCommentClick = (route) => {
        setCurrentRoute(route);
    };

    const handleCloseCommentForm = () => {
        setCurrentRoute(null);
    };

    const getCongestionColor = (congestion) => {
        switch (congestion) {
            case '여유':
                return 'green';
            case '보통':
                return 'orange';
            case '혼잡':
                return 'red';
            default:
                return 'black';
        }
    };

    return (
        <div className="result-content">
            <div className="result-header">
                <div className="header-container">
                    {selectedDate && selectedTime && (
                        <h5>{selectedDate} {selectedTime}</h5>
                    )}
                    <h4>{selectedRegion} 경로 결과</h4>
                </div>
                <Button variant="secondary" className="reset-button" onClick={handleReset}>초기화</Button>
            </div>
            {pathData.path.map((route, index) => (
                <React.Fragment key={route.id}>
                    {route.type === 'new' && index !== 0 && (
                        <hr className="route-divider" style={{ marginBottom: 20 }} />
                    )}
                    <Card
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
                                    backgroundColor: routeColors[index % routeColors.length],
                                    marginRight: '5px', // 공백을 줄이기 위해 margin-right를 5px로 설정
                                    borderRadius: '50%'
                                }}
                            ></span>
                            <span className="route-title">
                                경로 {route.id} ({route.type === 'exist' ? '기존 경로' : '새로운 경로'})
                            </span>
                            <div className="route-feedback">
                                <span className="like">👍 {route.like}</span>
                                <span className="dislike">👎 {route.dislike}</span>
                                <Button variant="outline-dark" size="sm" onClick={() => handleCommentClick(route)}>의견 달기</Button>
                            </div>
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
                                        <div>
                                            <div>{station.name}</div>
                                            <div className="station-direction">{station.direction}</div>
                                            <div style={{ color: getCongestionColor(station.congestion) }}>
                                                {station.congestion}
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </React.Fragment>
            ))}
            <h5 className="small-text">marker designed by nawicon from Flaticon</h5>

            {/* 의견 달기 창 */}
            {currentRoute && (
                <div className={`comment-form-container ${currentRoute ? 'show' : ''}`}>
                    <CommentForm route={currentRoute} onClose={handleCloseCommentForm} />
                </div>
            )}
        </div>
    );
};