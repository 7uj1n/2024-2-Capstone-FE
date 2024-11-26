import React, { useState, useEffect } from 'react';
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
import carMarkerImage from '../page/images/marker/car.png';
import placeMarkerImage from '../page/images/marker/place.png';

export default function PathResults({ selectedRegion, onRouteClick }) {
    const [currentRoute, setCurrentRoute] = useState(null); // 현재 선택된 경로 상태 관리
    const [currentRouteIndex, setCurrentRouteIndex] = useState(null); // 현재 선택된 경로 인덱스 상태 관리
    const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기
    const setSelectedDateTime = useStore(state => state.setSelectedDateTime); // 선택한 날짜와 시간 변경 함수 가져오기
    const setSelectedRegion = useStore(state => state.setSelectedRegion); // 선택한 지역 변경 함수 가져오기
    const setSelectedRouteStore = useStore(state => state.setSelectedRoute); // 선택한 경로 변경 함수 가져오기
    const routes = useStore(state => state.routes); // 경로 데이터 가져오기
    const selectedRoute = useStore(state => state.selectedRoute); // 선택한 경로 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        if (routes.length > 0 && !selectedRoute) {
            setSelectedRouteStore(routes[0].routeId); // 첫 번째 경로를 선택된 경로로 설정
        }
    }, [routes, selectedRoute, setSelectedRouteStore]);

    const handleRouteClick = (routeId) => {
        setSelectedRouteStore(routeId); // 선택한 경로 상태 업데이트
        onRouteClick(routeId);
    };

    const handleReset = () => {
        setSelectedDateTime(null); // 선택한 날짜 초기화
        setSelectedRegion('', ''); // 선택한 지역 초기화
        setSelectedRouteStore(null); // 선택한 경로 초기화
        navigate('/path'); // 최적 경로 찾기 페이지로 이동
    };

    const handleCommentClick = (route, index) => {
        setCurrentRoute(route);
        setCurrentRouteIndex(index);
    };

    const handleCloseCommentForm = () => {
        setCurrentRoute(null);
        setCurrentRouteIndex(null);
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

    const getMarkerImage = (type) => {
        switch (type) {
            case '버스':
                return busMarkerImage;
            case '지하철':
                return trainMarkerImage;
            case '자동차':
                return carMarkerImage;
            default:
                return placeMarkerImage;
        }
    };

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
    };

    return (
        <div className="result-content">
            <div className="result-header">
                <div className="header-container">
                    {selectedDate && (
                        <h5>{selectedDate}</h5>
                    )}
                    <h4>{selectedRegion} 경로 결과</h4>
                </div>
                <Button variant="secondary" className="reset-button" onClick={handleReset}>초기화</Button>
            </div>
            {routes.map((route, index) => (
                <React.Fragment key={route.routeId}>
                    {route.type === 'new' && index !== 0 && (
                        <hr className="route-divider" style={{ marginBottom: 20 }} />
                    )}
                    <Card
                        className={`card ${selectedRoute === route.routeId ? 'selected' : ''}`}
                        onClick={() => handleRouteClick(route.routeId)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card.Header>
                            <span className="route-title">
                                경로 {index + 1} ({route.type === 'new' ? '새로운 경로' : '기존 경로'})
                            </span>
                            <div className="route-feedback">
                                <span className="like">👍 {route.positive}</span>
                                <span className="dislike">👎 {route.negative}</span>
                                <Button variant="outline-dark" size="sm" onClick={() => handleCommentClick(route, index)}>의견 달기</Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>평균 소요 시간: {formatDuration(route.averageTime)}</Card.Text>
                            <ListGroup variant="flush">
                                {route.segments.map((segment, idx) => (
                                    <ListGroup.Item key={idx}>
                                        <img
                                            src={getMarkerImage(segment.type)}
                                            alt={segment.type}
                                            style={{ width: '40px', marginRight: '10px' }}
                                        />
                                        <div>
                                            <div>{segment.type === '버스' ? segment.vehicleId : segment.type}</div>
                                            {segment.Station && <div className="station-direction">{segment.Station}</div>}
                                            <div style={{ color: getCongestionColor(segment.congestion) }}>
                                                {segment.congestion}
                                            </div>
                                            <div className="pathStation-duration">소요 시간: {formatDuration(segment.duration)}</div>
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
                    <CommentForm route={currentRoute} routeIndex={currentRouteIndex} onClose={handleCloseCommentForm} />
                </div>
            )}
        </div>
    );
}