import React, { useState } from 'react';
import pathData from '../data/path.json'; // 경로 데이터 가져오기
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기
import './pathResults.css';

const PathResults = ({ selectedRegion, onRouteClick }) => {
    const [selectedRoute, setSelectedRoute] = useState(null); // 선택된 경로 상태 관리

    const handleRouteClick = (routeId) => {
        setSelectedRoute(routeId);
        onRouteClick(routeId);
    };

    return (
        <div className="result-content">
            <h4>{selectedRegion} 경로 결과</h4>
            {pathData.path.map(route => (
                <Card
                    key={route.id}
                    className={`mb-3 ${selectedRoute === route.id ? 'selected' : ''}`}
                    onClick={() => handleRouteClick(route.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <Card.Header>
                        경로 {route.id} ({route.type === 'exist' ? '기존 경로' : '새로운 경로'})
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>소요 시간: {route.leadtime}</Card.Text>
                        <ListGroup variant="flush">
                            {route.station.map(station => (
                                <ListGroup.Item key={station.id}>{station.name}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default PathResults;