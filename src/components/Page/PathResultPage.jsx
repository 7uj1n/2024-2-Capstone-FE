import { useEffect, useState, useRef } from "react";
import SearchBar from "../MapFunction/SearchBar";
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import useUserStore from '../../store/UserStore'; // 사용자 상태 관리용 Zustand 스토어 가져오기
import axios from 'axios';
import './pathResultPage.css';
import PopulationChart from "../UI/PopulationChart";
import PopulationPieChart from "../UI/PopulationPieChart";
import PathLeadTimeChart from "../UI/PathLeadTimeChart"; // PathLeadTimeChart 컴포넌트 가져오기
import LoadingSpinner from '../UI/LoadingSpinner'; // LoadingSpinner 컴포넌트 가져오기
import CustomModal from '../UI/CustomModal'; // CustomModal 컴포넌트 가져오기

import busMarkerImage from './images/marker/bus.png';
import placeMarkerImage from './images/marker/place.png';
import carMarkerImage from './images/marker/car.png';
import airportMarkerImage from './images/marker/airport.png';

const { kakao } = window;

function ResultPage() {
    const [map, setMap] = useState(null); // map 상태 관리
    const [polylines, setPolylines] = useState([]); // 폴리라인 상태 관리
    const [markers, setMarkers] = useState([]); // 마커 상태 관리
    const [overlays, setOverlays] = useState([]); // 커스텀 오버레이 상태 관리
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const [routes, setRoutes] = useState([]); // 경로 데이터 상태 관리
    const [totalPopulation, setTotalPopulation] = useState(0); // 총 유동인구 수 상태 관리
    const [showModal, setShowModal] = useState(false); // 모달 상태 관리
    const [modalContent, setModalContent] = useState(''); // 모달 내용 상태 관리
    const infoWindowRef = useRef(null); // 현재 열려 있는 인포윈도우 참조 관리
    const selectedRegion = useStore((state) => state.selectedRegion); // Zustand 스토어에서 상태 가져오기
    const selectedRegionCD = useStore((state) => state.selectedRegionCD); // 선택한 지역 코드 가져오기
    const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기
    const selectedRoute = useStore(state => state.selectedRoute); // 선택한 경로 가져오기
    const setSelectedRoute = useStore(state => state.setSelectedRoute); // 선택한 경로 설정 함수 가져오기
    const setRoutesStore = useStore(state => state.setRoutes); // 경로 데이터 설정 함수 가져오기
    const token = useUserStore(state => state.token); // 사용자 토큰 가져오기

    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
            center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
            level: 10 // 지도의 레벨(확대, 축소 정도)
        };

        const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
        setMap(kakaoMap); // map 상태 설정

        return () => {
            // 컴포넌트 언마운트 시 기존 폴리라인과 마커 제거
            polylines.forEach(polyline => polyline.setMap(null));
            markers.forEach(marker => marker.setMap(null));
            overlays.forEach(overlay => overlay.setMap(null));
        };
    }, []);

    useEffect(() => {
        const fetchRoutes = async () => {
            if (!selectedRegionCD || !token) return;

            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            setLoading(true); // 로딩 상태 시작
            try {
                const response = await axios.get(`${apiUrl}/api/gcs/routes/${selectedRegionCD}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const routesData = response.data.patterns.map((pattern, index) => ({
                    // routeId: `route-${index + 1}`,
                    routeId: pattern.route_id,
                    negative: pattern.negative,
                    positive: pattern.positive,
                    type: pattern.type,
                    totalTime: pattern.total_time,
                    users: pattern.users,
                    coordinates: pattern.coordinates,
                    segments: pattern.bus_segments || []    // 버스 세그먼트 데이터가 없을 경우 빈 배열로 설정
                }));

                setRoutes(routesData);
                setRoutesStore(routesData); // Zustand 스토어에 경로 데이터 설정
                setTotalPopulation(response.data.total_departures);  // 총 유동인구 수 설정
                if (routesData.length > 0) {
                    setSelectedRoute(routesData[0].routeId); // 첫 번째 경로를 선택된 경로로 설정
                } else {
                    setModalContent(response.data.message || '경로 데이터를 불러올 수 없습니다.');
                    setShowModal(true);
                }
                console.log("Routes data fetched:", response.data);
                console.log("루트 데이터", routes);
            } catch (error) {
                console.error("Error fetching routes data:", error);
                setModalContent('경로 데이터를 불러오는 중 오류가 발생했습니다.');
                setShowModal(true);
            } finally {
                setLoading(false); // 로딩 상태 종료
            }
        };

        fetchRoutes();
    }, [selectedRegionCD, token]);

    useEffect(() => {
        if (!map || routes.length === 0) return;
    
        // 기존 폴리라인과 마커 제거
        polylines.forEach(polyline => polyline.setMap(null));
        markers.forEach(marker => marker.setMap(null));
        overlays.forEach(overlay => overlay.setMap(null));
    
        const newPolylines = [];
        const newMarkers = [];
        const newOverlays = [];
    
        // 경로 데이터를 사용하여 폴리라인 및 마커 생성
        routes.forEach((route, index) => {
            if (route.routeId !== selectedRoute) return; // 선택한 경로만 표시
        
            const coordinates = route.coordinates.map(coord => new kakao.maps.LatLng(coord[1], coord[0]));
        
            // 모든 경로를 해당 타입의 색상으로 설정
            addPolyline(map, coordinates, getSegmentColor(route.type), newPolylines);
        
            const markerSize = new kakao.maps.Size(40, 40);
        
            // 자동차 경로일 경우
            if (route.type === 'car') {
                const startMarker = new kakao.maps.Marker({
                    position: coordinates[0],
                    map: map,
                    title: `${route.routeId} 시작 지점`,
                    image: new kakao.maps.MarkerImage(carMarkerImage, markerSize)
                });
        
                const endMarker = new kakao.maps.Marker({
                    position: coordinates[coordinates.length - 1],
                    map: map,
                    title: `${route.routeId} 끝 지점`,
                    image: new kakao.maps.MarkerImage(airportMarkerImage, markerSize)
                });
        
                newMarkers.push(startMarker, endMarker);
        
                // 소요 시간 오버레이
                const overlayContent = document.createElement('div');
                overlayContent.className = 'custom-infowindow';
        
                const hours = Math.floor(route.totalTime / 60);
                const minutes = route.totalTime % 60;
                const durationText = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
        
                overlayContent.innerHTML = `
                    <div class="infowindow-content">자동차</div>
                    <div class="pathStation-duration">소요 시간: ${durationText}</div>
                    <button class="infowindow-close">X</button>
                `;
        
                const customOverlay = new kakao.maps.CustomOverlay({
                    position: coordinates[Math.floor(coordinates.length / 2)],
                    content: overlayContent,
                    yAnchor: 1.5
                });
        
                overlayContent.querySelector('.infowindow-close').addEventListener('click', () => {
                    customOverlay.setMap(null);
                });
        
                kakao.maps.event.addListener(startMarker, 'click', () => {
                    if (infoWindowRef.current) {
                        infoWindowRef.current.setMap(null);
                    }
                    customOverlay.setMap(map);
                    infoWindowRef.current = customOverlay;
                });
        
                newOverlays.push(customOverlay);
            } else {
                // 버스 경로 처리
                const startMarker = new kakao.maps.Marker({
                    position: coordinates[0],
                    map: map,
                    title: `${route.routeId} 시작 지점`,
                    image: new kakao.maps.MarkerImage(placeMarkerImage, markerSize)
                });
        
                const endMarker = new kakao.maps.Marker({
                    position: coordinates[coordinates.length - 1],
                    map: map,
                    title: `${route.routeId} 끝 지점`,
                    image: new kakao.maps.MarkerImage(airportMarkerImage, markerSize)
                });
        
                newMarkers.push(startMarker, endMarker);
        
                // 버스 정류장 마커 및 오버레이 처리
                route.segments.forEach(segment => {
                    const boardMarker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(segment.board_coordinates[1], segment.board_coordinates[0]),
                        map: map,
                        title: `${segment.bus_id} 탑승 지점`,
                        image: new kakao.maps.MarkerImage(busMarkerImage, markerSize)
                    });
        
                    newMarkers.push(boardMarker);
        
                    const overlayContent = document.createElement('div');
                    overlayContent.className = 'custom-infowindow';
        
                    const hours = Math.floor(segment.duration / 60);
                    const minutes = segment.duration % 60;
                    const durationText = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
        
                    overlayContent.innerHTML = `
                        <div class="infowindow-content">${segment.bus_id}</div>
                        <div class="pathStation-direction">${segment.board_station} → ${segment.alight_station}</div>
                        <div class="pathStation-duration">${durationText}</div>
                        <button class="infowindow-close">X</button>
                    `;
        
                    const customOverlay = new kakao.maps.CustomOverlay({
                        position: new kakao.maps.LatLng(segment.board_coordinates[1], segment.board_coordinates[0]),
                        content: overlayContent,
                        yAnchor: 1.5
                    });
        
                    overlayContent.querySelector('.infowindow-close').addEventListener('click', () => {
                        customOverlay.setMap(null);
                    });
        
                    kakao.maps.event.addListener(boardMarker, 'click', () => {
                        if (infoWindowRef.current) {
                            infoWindowRef.current.setMap(null);
                        }
                        customOverlay.setMap(map);
                        infoWindowRef.current = customOverlay;
                    });
        
                    newOverlays.push(customOverlay);
                });
            }
        });
        
    
        setPolylines(newPolylines);
        setMarkers(newMarkers);
        setOverlays(newOverlays);
    }, [map, routes, selectedRoute]);
    
    // 폴리라인 생성 함수
    const addPolyline = (map, path, color, collection) => {
        const borderPolyline = new kakao.maps.Polyline({
            path: path,
            strokeWeight: 8,
            strokeColor: '#000000',
            strokeOpacity: 0.6,
            strokeStyle: 'solid'
        });
    
        const mainPolyline = new kakao.maps.Polyline({
            path: path,
            strokeWeight: 6,
            strokeColor: color,
            strokeOpacity: 0.9,
            strokeStyle: 'solid'
        });
    
        const patternPolyline = new kakao.maps.Polyline({
            path: path,
            strokeWeight: 1,
            strokeColor: '#FFFFFF',
            strokeOpacity: 1,
            strokeStyle: 'shortdashdot'
        });
    
        borderPolyline.setMap(map);
        mainPolyline.setMap(map);
        patternPolyline.setMap(map);
    
        collection.push(borderPolyline, mainPolyline, patternPolyline);
    };
    

    const getSegmentColor = (type) => {
        switch (type) {
            case 'bus':
                return '#48b751'; // 버스 경로 색상 (연두색)
            case 'car':
                return '#4169E1'; // 자동차 경로 색상 (파란색)
            default:
                return '#808080'; // 기본 색상 (회색)
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="result-page">
            {loading && <LoadingSpinner message="경로 데이터를 불러오는 중입니다..." />}
            <div className="map-container">
                {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
                <div id="map" style={{
                    width: '100%',
                    height: '100vh'
                }}>
                </div>
            </div>
            <div className="dashboard-container">
                <div className="chart-container">
                    <h4>{selectedDate} {selectedRegion}→인천공항 유동인구 수</h4>
                    <PopulationChart />
                </div>
                <div className="chart-container">
                    <h4>경로별 유동인구 수 비율</h4>
                    <PopulationPieChart />
                </div>
                <div className="chart-container">
                    <h4>경로별 예상 시간 비교</h4>
                    <PathLeadTimeChart />
                </div>
            </div>
            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleCloseModal}
                title="알림"
                body={modalContent}
                confirmText="확인"
                cancelText=""
            />
        </div>
    );
}

export default ResultPage;