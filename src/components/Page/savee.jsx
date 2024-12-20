//세부 주요 도로 나누기 완료 (심플하게 하는거 추가)

import { useEffect, useState } from "react";
import SearchBar from "../MapFunction/SearchBar";
import useTrafficStore from '../../store/TrafficStore'; // 도로용 Zustand 스토어 가져오기
import useStore from '../../store/UserStore'; // 사용자 상태 관리용 Zustand 스토어 가져오기
import axios from 'axios';
import LoadingSpinner from '../UI/LoadingSpinner'; // LoadingSpinner 컴포넌트 가져오기

const { kakao } = window;

function RoadResultPage() {
    const [map, setMap] = useState(null); // map 상태 관리
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const [polylines, setPolylines] = useState([]); // 폴리라인 상태 관리
    const [detailMode, setDetailMode] = useState(false); // 디테일 모드 기본 값 false
    const [trafficData, setTrafficData] = useState([]); // 도로 혼잡도 데이터 상태 관리
    const selectedDateTime = useTrafficStore(state => state.selectedDateTime); // 선택한 날짜와 시간 가져오기
    const token = useStore(state => state.token); // 사용자 토큰 가져오기

    // 지도 초기화 (최초 한 번만 실행)
    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
            center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
            level: 10 // 지도의 레벨(확대, 축소 정도)
        };

        const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
        setMap(kakaoMap); // map 상태 설정

    }, []); // 빈 배열로 설정하여 최초 렌더링 시 한 번만 실행

    // 줌 변경에 따른 디테일 모드 상태 업데이트
    useEffect(() => {
        if (map) {
            const handleZoomChanged = () => {
                const zoomLevel = map.getLevel();
                setDetailMode(zoomLevel < 7); // 줌 레벨에 따라 디테일 모드 변경
            };

            // 줌 레벨이 변경될 때마다 실행되는 이벤트 리스너 등록
            kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChanged);

            // 컴포넌트 언마운트 시 이벤트 리스너 정리
            return () => {
                kakao.maps.event.removeListener(map, 'zoom_changed', handleZoomChanged);
            };
        }
    }, [map]); // map 객체가 변경될 때마다 실행

    // 선택한 날짜와 시간에 따라 도로 데이터를 가져오기
    useEffect(() => {
        const fetchTrafficData = async () => {
            if (selectedDateTime && token) {
                const { date, time } = selectedDateTime;
                const apiUrl = import.meta.env.VITE_API_BASE_URL;
                setLoading(true); // 로딩 상태 시작
                try {
                    const response = await axios.get(`${apiUrl}/api/gcs/traffic/all`, {
                        params: { date, hour: time },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setTrafficData(response.data); // 데이터 업데이트
                } catch (error) {
                    console.error("Error fetching traffic data:", error);
                } finally {
                    setLoading(false); // 로딩 상태 종료
                }
            }
        };

        fetchTrafficData();
    }, [selectedDateTime, token, setTrafficData]); // selectedDateTime, token, setTrafficData가 변경될 때마다 실행

    // 디테일 모드에 따른 폴리라인 업데이트 (디테일 모드가 변경될 때마다 실행)
    useEffect(() => {
        if (map && trafficData.length > 0) {
            updatePolylinesByDetailMode(); // 디테일 모드에 맞는 폴리라인 업데이트
        }
    }, [map, trafficData, detailMode]); // map, trafficData, detailMode가 변경될 때마다 실행

    // 디테일 모드에 맞게 폴리라인 업데이트
    const updatePolylinesByDetailMode = () => {
        // 디테일 모드에 따라 도로 데이터를 필터링
        const filteredData = detailMode
            ? trafficData // 디테일 모드일 때는 모든 도로 데이터를 표시
            : trafficData.filter(road => road.roadType === '국가차도'); // 국가차도만 표시

        // 새 폴리라인 생성
        const newPolylines = filteredData.map(road => createPolyline(road));

        // 기존 폴리라인 제거
        polylines.forEach(polyline => polyline.setMap(null));

        // 새 폴리라인 지도에 추가
        newPolylines.forEach(polyline => polyline.setMap(map));

        // 상태 업데이트
        setPolylines(newPolylines);
    };

    // 도로 데이터를 기반으로 폴리라인 생성
    const createPolyline = (road) => {
        const path = road.coordinates.map(coord => new kakao.maps.LatLng(coord[1], coord[0]));
        return new kakao.maps.Polyline({
            path: path,
            strokeWeight: 5,
            strokeColor: getTrafficColor(road.trafficStatus),
            strokeOpacity: 0.7,
            strokeStyle: 'solid'
        });
    };

    // 교통 상태에 따른 색상 반환
    const getTrafficColor = (status) => {
        switch (status) {
            case '원활':
                return '#00FF00'; // Green
            case '서행':
                return '#FFFF00'; // Yellow
            case '정체':
                return '#FF0000'; // Red
            default:
                return '#000000'; // Black
        }
    };

    return (
        <div>
            {loading && <LoadingSpinner message="도로 혼잡도 데이터를 불러오는 중입니다..." />}
            {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
            <div id="map" style={{
                width: '100%',
                height: '100vh'
            }}></div>
        </div>
    );
}

export default RoadResultPage;







//mapbox로 변경 + 모든 데이터 나타냄

// import { useEffect, useRef } from "react";
// import { useQuery } from "react-query";
// import { Deck } from "@deck.gl/core";
// import { PathLayer } from "@deck.gl/layers";
// import mapboxgl from "mapbox-gl"; // Mapbox GL JS
// import useTrafficStore from "../../store/TrafficStore";
// import useStore from "../../store/UserStore";
// import axios from "axios";
// import LoadingSpinner from "../UI/LoadingSpinner";

// mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// function RoadResultPage() {
//     const mapContainerRef = useRef(null); // Mapbox 지도 컨테이너 참조
//     const deckRef = useRef(null); // Deck.gl 참조
//     const mapRef = useRef(null); // Mapbox 지도 인스턴스 참조
//     const selectedDateTime = useTrafficStore((state) => state.selectedDateTime);
//     const token = useStore((state) => state.token);

//     const fetchTrafficData = async () => {
//         if (selectedDateTime && token) {
//             const { date, time } = selectedDateTime;
//             const apiUrl = import.meta.env.VITE_API_BASE_URL;
//             const regions = [
//                 { num: 1, ranks: [101, 102, 103, 104, 105, 106, 107] },
//                 { num: 2, ranks: [101, 102, 103, 104, 105, 106] },
//                 { num: 3, ranks: [101,102,103,104] },
//             ];
//             const requests = regions.flatMap((region) =>
//                 region.ranks.map((rank) =>
//                     axios.get(`${apiUrl}/api/gcs/traffic/${region.num}/all/${rank}`, {
//                         params: { date, hour: time },
//                         headers: { Authorization: `Bearer ${token}` },
//                     })
//                 )
//             );
//             const responses = await Promise.all(requests);
//             return responses.flatMap((response) => response.data);
//         }
//         return [];
//     };

//     const { data: trafficData = [], isLoading } = useQuery(["trafficData", selectedDateTime, token], fetchTrafficData, {
//         enabled: !!selectedDateTime && !!token,
//     });

//     useEffect(() => {
//         // Mapbox 지도 생성
//         const map = new mapboxgl.Map({
//             container: mapContainerRef.current,
//             style: "mapbox://styles/7uj1n/cm46vvjgs002601st8s5v06js",
//             center: [126.4419679, 37.458666], // 초기 중심 좌표(인천공항)
//             zoom: 11,
//         });
//         mapRef.current = map;

//         // Deck.gl 초기화
//         const deck = new Deck({
//             canvas: "deck-canvas",
//             initialViewState: {
//                 longitude: 126.4419679,
//                 latitude: 37.458666,
//                 zoom: 12,
//                 pitch: 0,
//                 bearing: 0,
//             },
//             controller: true,
//             layers: [],
//             onViewStateChange: ({ viewState }) => {
//                 map.jumpTo({
//                     center: [viewState.longitude, viewState.latitude],
//                     zoom: viewState.zoom,
//                     bearing: viewState.bearing,
//                     pitch: viewState.pitch,
//                 });
//             },
//         });
//         deckRef.current = deck;

//         // Mapbox와 Deck.gl의 캔버스 연결
//         map.on("move", () => {
//             const center = map.getCenter();
//             deck.setProps({
//                 viewState: {
//                     longitude: center.lng,
//                     latitude: center.lat,
//                     zoom: map.getZoom(),
//                     bearing: map.getBearing(),
//                     pitch: map.getPitch(),
//                 },
//             });
//         });

//         return () => {
//             map.remove(); // Mapbox 메모리 해제
//             deck.finalize(); // Deck.gl 메모리 해제
//         };
//     }, []);

//     useEffect(() => {
//         if (deckRef.current && trafficData.length > 0) {
//             const layers = [
//                 new PathLayer({
//                     id: "traffic-path-layer",
//                     data: trafficData,
//                     getPath: (road) => road.coordinates.map((coord) => [coord[0], coord[1]]),
//                     getColor: (road) => {
//                         switch (road.trafficStatus) {
//                             case "원활":
//                                 return [0, 204, 0]; // Green
//                             case "서행":
//                                 return [255, 255, 0]; // Yellow
//                             case "정체":
//                                 return [255, 0, 0]; // Red
//                             default:
//                                 return [0, 0, 0]; // Black
//                         }
//                     },
//                     widthMinPixels: 3,
//                 }),
//             ];
//             deckRef.current.setProps({ layers });
//         }
//     }, [trafficData]);

//     return (
//         <div>
//             {isLoading && <LoadingSpinner message="도로 혼잡도 데이터를 불러오는 중입니다..." />}
//             <div ref={mapContainerRef} id="map" style={{ width: "100%", height: "100vh", position: "relative" }} />
//             <canvas id="deck-canvas" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
//         </div>
//     );
// }

// export default RoadResultPage;






// import { useEffect, useState, useRef } from "react";
// import SearchBar from "../MapFunction/SearchBar";
// import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
// import useUserStore from '../../store/UserStore'; // 사용자 상태 관리용 Zustand 스토어 가져오기
// import axios from 'axios';
// import './pathResultPage.css';
// import PopulationChart from "../UI/PopulationChart";
// import PopulationPieChart from "../UI/PopulationPieChart";
// import PathLeadTimeChart from "../UI/PathLeadTimeChart"; // PathLeadTimeChart 컴포넌트 가져오기
// import LoadingSpinner from '../UI/LoadingSpinner'; // LoadingSpinner 컴포넌트 가져오기
// import CustomModal from '../UI/CustomModal'; // CustomModal 컴포넌트 가져오기

// import busMarkerImage from './images/marker/bus.png';
// import trainMarkerImage from './images/marker/train.png';
// import placeMarkerImage from './images/marker/place.png';
// import carMarkerImage from './images/marker/car.png';
// import airportMarkerImage from './images/marker/airport.png';

// const { kakao } = window;

// function ResultPage() {
//     const [map, setMap] = useState(null); // map 상태 관리
//     const [polylines, setPolylines] = useState([]); // 폴리라인 상태 관리
//     const [markers, setMarkers] = useState([]); // 마커 상태 관리
//     const [overlays, setOverlays] = useState([]); // 커스텀 오버레이 상태 관리
//     const [loading, setLoading] = useState(false); // 로딩 상태 관리
//     const [routes, setRoutes] = useState([]); // 경로 데이터 상태 관리
//     const [totalPopulation, setTotalPopulation] = useState(0); // 총 유동인구 수 상태 관리
//     const [showModal, setShowModal] = useState(false); // 모달 상태 관리
//     const [modalContent, setModalContent] = useState(''); // 모달 내용 상태 관리
//     const infoWindowRef = useRef(null); // 현재 열려 있는 인포윈도우 참조 관리
//     const selectedRegion = useStore((state) => state.selectedRegion); // Zustand 스토어에서 상태 가져오기
//     const selectedRegionCD = useStore((state) => state.selectedRegionCD); // 선택한 지역 코드 가져오기
//     const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기
//     const selectedRoute = useStore(state => state.selectedRoute); // 선택한 경로 가져오기
//     const setSelectedRoute = useStore(state => state.setSelectedRoute); // 선택한 경로 설정 함수 가져오기
//     const token = useUserStore(state => state.token); // 사용자 토큰 가져오기

//     useEffect(() => {
//         const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
//         const options = {
//             center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
//             level: 10 // 지도의 레벨(확대, 축소 정도)
//         };

//         const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
//         setMap(kakaoMap); // map 상태 설정

//         return () => {
//             // 컴포넌트 언마운트 시 기존 폴리라인과 마커 제거
//             polylines.forEach(polyline => polyline.setMap(null));
//             markers.forEach(marker => marker.setMap(null));
//             overlays.forEach(overlay => overlay.setMap(null));
//         };
//     }, []);

//     useEffect(() => {
//         const fetchRoutes = async () => {
//             if (!selectedRegionCD || !token) return;

//             const apiUrl = import.meta.env.VITE_API_BASE_URL;
//             setLoading(true); // 로딩 상태 시작
//             try {
//                 const response = await axios.get(`${apiUrl}/api/gcs/routes/all/${selectedRegionCD}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setRoutes(response.data.routes);
//                 setTotalPopulation(response.data.totalPopulation);
//                 if (response.data.routes.length > 0) {
//                     setSelectedRoute(response.data.routes[0].routeId); // 첫 번째 경로를 선택된 경로로 설정
//                 } else {
//                     setModalContent(response.data.message || '경로 데이터를 불러올 수 없습니다.');
//                     setShowModal(true);
//                 }
//                 console.log("Routes data fetched:", response.data);
//             } catch (error) {
//                 console.error("Error fetching routes data:", error);
//                 setModalContent('경로 데이터를 불러오는 중 오류가 발생했습니다.');
//                 setShowModal(true);
//             } finally {
//                 setLoading(false); // 로딩 상태 종료
//             }
//         };

//         fetchRoutes();
//     }, [selectedRegionCD, token]);

//     useEffect(() => {
//         if (!map || routes.length === 0) return;

//         // 기존 폴리라인과 마커 제거
//         polylines.forEach(polyline => polyline.setMap(null));
//         markers.forEach(marker => marker.setMap(null));
//         overlays.forEach(overlay => overlay.setMap(null));

//         const newPolylines = [];
//         const newMarkers = [];
//         const newOverlays = [];

//         // 경로 데이터를 사용하여 폴리라인 및 마커 생성
//         routes.forEach((route, index) => {
//             if (route.routeId !== selectedRoute) return; // 선택한 경로만 표시

//             route.segments.forEach(segment => {
//                 const path = segment.coordinates.map(coord => new kakao.maps.LatLng(coord[1], coord[0])); // 좌표 순서 변경

//                 console.log("Creating polyline for segment:", segment);

//                 // 테두리 폴리라인 생성
//                 const borderPolyline = new kakao.maps.Polyline({
//                     path: path,
//                     strokeWeight: 8, // 테두리 두께
//                     strokeColor: '#000000', // 테두리 색상 (검정색)
//                     strokeOpacity: 0.6, // 테두리 불투명도
//                     strokeStyle: 'solid' // 테두리 스타일
//                 });

//                 // 메인 폴리라인 생성
//                 const polyline = new kakao.maps.Polyline({
//                     path: path,
//                     strokeWeight: 6,
//                     strokeColor: getSegmentColor(segment.type), // 경로 색상
//                     strokeOpacity: 0.9,
//                     strokeStyle: 'solid'
//                 });

//                 // 패턴 폴리라인 생성
//                 const patternPolyline = new kakao.maps.Polyline({
//                     path: path,
//                     strokeWeight: 1, // 패턴 두께
//                     strokeColor: '#FFFFFF', // 패턴 색상 (흰색)
//                     strokeOpacity: 1, // 패턴 불투명도
//                     strokeStyle: 'shortdashdot' // 패턴 스타일
//                 });

//                 // 테두리 폴리라인을 먼저 지도에 추가
//                 borderPolyline.setMap(map);
//                 // 메인 폴리라인을 지도에 추가
//                 polyline.setMap(map);
//                 // 패턴 폴리라인을 지도에 추가
//                 patternPolyline.setMap(map);

//                 newPolylines.push(borderPolyline, polyline, patternPolyline);
//             });

//             // 마커 이미지 크기 설정
//             const markerSize = new kakao.maps.Size(40, 40); // 원하는 크기로 설정

//             // 시작 지점 마커 생성
//             const startMarker = new kakao.maps.Marker({
//                 position: new kakao.maps.LatLng(route.segments[0].coordinates[0][1], route.segments[0].coordinates[0][0]), // 좌표 순서 변경
//                 map: map,
//                 title: `${route.routeId} 시작 지점`,
//                 image: new kakao.maps.MarkerImage(placeMarkerImage, markerSize)
//             });

//             // 끝 지점 마커 생성
//             const lastSegment = route.segments[route.segments.length - 1];
//             const endMarker = new kakao.maps.Marker({
//                 position: new kakao.maps.LatLng(lastSegment.coordinates[lastSegment.coordinates.length - 1][1], lastSegment.coordinates[lastSegment.coordinates.length - 1][0]), // 좌표 순서 변경
//                 map: map,
//                 title: `${route.routeId} 끝 지점`,
//                 image: new kakao.maps.MarkerImage(airportMarkerImage, markerSize)
//             });

//             newMarkers.push(startMarker, endMarker);

//             // 역과 정류장 마커 생성
//             route.segments.forEach(segment => {
//                 let markerImage;
//                 if (segment.type === '버스') {
//                     markerImage = busMarkerImage;
//                 } else if (segment.type === '지하철') {
//                     markerImage = trainMarkerImage;
//                 } else if (segment.type === '자동차') {
//                     markerImage = carMarkerImage;
//                 }

//                 if (markerImage) {
//                     const stationMarker = new kakao.maps.Marker({
//                         position: new kakao.maps.LatLng(segment.coordinates[0][1], segment.coordinates[0][0]), // 좌표 순서 변경
//                         map: map,
//                         title: segment.Station,
//                         image: new kakao.maps.MarkerImage(markerImage, markerSize)
//                     });

//                     // 커스텀 오버레이 생성
//                     const overlayContent = document.createElement('div');
//                     overlayContent.className = 'custom-infowindow';

//                     if (segment.type === '도보' || segment.type === '자동차') {
//                         const hours = Math.floor(segment.duration / 60);
//                         const minutes = segment.duration % 60;
//                         const durationText = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;

//                         overlayContent.innerHTML = `
//                             <div class="infowindow-content">${segment.type}</div>
//                             <div class="pathStation-duration">${durationText}</div>
//                             <button class="infowindow-close">X</button>
//                         `;
//                     } else {
//                         overlayContent.innerHTML = `
//                             <div class="infowindow-content">${segment.Station}</div>
//                             <div class="pathStation-direction">${segment.type}</div>
//                             <div class="station-congestion" style="color: ${getCongestionColor(segment.congestion)};">
//                                 ${segment.congestion}
//                             </div>
//                             <button class="infowindow-close">X</button>
//                         `;
//                     }

//                     const customOverlay = new kakao.maps.CustomOverlay({
//                         position: new kakao.maps.LatLng(segment.coordinates[0][1], segment.coordinates[0][0]), // 좌표 순서 변경
//                         content: overlayContent,
//                         yAnchor: 1.5
//                     });

//                     // 닫기 버튼 이벤트 추가
//                     overlayContent.querySelector('.infowindow-close').addEventListener('click', () => {
//                         customOverlay.setMap(null);
//                     });

//                     // 마커 클릭 이벤트에 커스텀 오버레이 연결
//                     kakao.maps.event.addListener(stationMarker, 'click', () => {
//                         // 기존에 열려 있는 커스텀 오버레이가 있으면 닫기
//                         if (infoWindowRef.current) {
//                             infoWindowRef.current.setMap(null);
//                         }
//                         // 새로운 커스텀 오버레이 열기
//                         customOverlay.setMap(map);
//                         // 현재 열려 있는 커스텀 오버레이 참조 업데이트
//                         infoWindowRef.current = customOverlay;
//                     });

//                     newMarkers.push(stationMarker);
//                     newOverlays.push(customOverlay);
//                 }
//             });
//         });

//         // 새로운 폴리라인과 마커 상태 업데이트
//         setPolylines(newPolylines);
//         setMarkers(newMarkers);
//         setOverlays(newOverlays);
//     }, [map, routes, selectedRoute]);

//     const getSegmentColor = (type) => {
//         switch (type) {
//             case '도보':
//                 return '#808080'; // 걷는 경로 색상 (회색)
//             case '버스':
//                 return '#48b751'; // 버스 경로 색상 (연두색)
//             case '지하철':
//                 return '#00BFFF'; // 지하철 경로 색상 (하늘색)
//             case '자동차':
//                 return '#4169E1'; // 자동차 경로 색상 (파란색)
//             default:
//                 return '#000000'; // 기본 색상 (검정색)
//         }
//     };

//     const getCongestionColor = (congestion) => {
//         switch (congestion) {
//             case '여유':
//                 return 'green';
//             case '보통':
//                 return 'orange';
//             case '혼잡':
//                 return 'red';
//             default:
//                 return 'black';
//         }
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     return (
//         <div className="result-page">
//             {loading && <LoadingSpinner message="경로 데이터를 불러오는 중입니다..." />}
//             <div className="map-container">
//                 {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
//                 <div id="map" style={{
//                     width: '100%',
//                     height: '100vh'
//                 }}>
//                 </div>
//             </div>
//             <div className="dashboard-container">
//                 <div className="chart-container">
//                     <h4>{selectedDate} {selectedRegion}→인천공항 유동인구 수</h4>
//                     <PopulationChart />
//                 </div>
//                 <div className="chart-container">
//                     <h4>경로별 유동인구 수 비율</h4>
//                     <PopulationPieChart />
//                 </div>
//                 <div className="chart-container">
//                     <h4>경로별 예상 시간 비교</h4>
//                     <PathLeadTimeChart />
//                 </div>
//             </div>
//             <CustomModal
//                 show={showModal}
//                 handleClose={handleCloseModal}
//                 handleConfirm={handleCloseModal}
//                 title="알림"
//                 body={modalContent}
//                 confirmText="확인"
//                 cancelText=""
//             />
//         </div>
//     );
// }

// export default ResultPage;






//기본 코드



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
import trainMarkerImage from './images/marker/train.png';
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
                const response = await axios.get(`${apiUrl}/api/gcs/routes/all/${selectedRegionCD}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRoutes(response.data.routes);
                setRoutesStore(response.data.routes); // Zustand 스토어에 경로 데이터 설정
                setTotalPopulation(response.data.totalPopulation);
                if (response.data.routes.length > 0) {
                    setSelectedRoute(response.data.routes[0].routeId); // 첫 번째 경로를 선택된 경로로 설정
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

            route.segments.forEach(segment => {
                const path = segment.coordinates.map(coord => new kakao.maps.LatLng(coord[1], coord[0])); // 좌표 순서 변경

                console.log("Creating polyline for segment:", segment);

                // 테두리 폴리라인 생성
                const borderPolyline = new kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 8, // 테두리 두께
                    strokeColor: '#000000', // 테두리 색상 (검정색)
                    strokeOpacity: 0.6, // 테두리 불투명도
                    strokeStyle: 'solid' // 테두리 스타일
                });

                // 메인 폴리라인 생성
                const polyline = new kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 6,
                    strokeColor: getSegmentColor(segment.type), // 경로 색상
                    strokeOpacity: 0.9,
                    strokeStyle: 'solid'
                });

                // 패턴 폴리라인 생성
                const patternPolyline = new kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 1, // 패턴 두께
                    strokeColor: '#FFFFFF', // 패턴 색상 (흰색)
                    strokeOpacity: 1, // 패턴 불투명도
                    strokeStyle: 'shortdashdot' // 패턴 스타일
                });

                // 테두리 폴리라인을 먼저 지도에 추가
                borderPolyline.setMap(map);
                // 메인 폴리라인을 지도에 추가
                polyline.setMap(map);
                // 패턴 폴리라인을 지도에 추가
                patternPolyline.setMap(map);

                newPolylines.push(borderPolyline, polyline, patternPolyline);
            });

            // 마커 이미지 크기 설정
            const markerSize = new kakao.maps.Size(40, 40); // 원하는 크기로 설정

            // 시작 지점 마커 생성
            const startMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(route.segments[0].coordinates[0][1], route.segments[0].coordinates[0][0]), // 좌표 순서 변경
                map: map,
                title: `${route.routeId} 시작 지점`,
                image: new kakao.maps.MarkerImage(placeMarkerImage, markerSize)
            });

            // 끝 지점 마커 생성
            const lastSegment = route.segments[route.segments.length - 1];
            const endMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lastSegment.coordinates[lastSegment.coordinates.length - 1][1], lastSegment.coordinates[lastSegment.coordinates.length - 1][0]), // 좌표 순서 변경
                map: map,
                title: `${route.routeId} 끝 지점`,
                image: new kakao.maps.MarkerImage(airportMarkerImage, markerSize)
            });

            newMarkers.push(startMarker, endMarker);

            // 역과 정류장 마커 생성
            route.segments.forEach(segment => {
                let markerImage;
                if (segment.type === '버스') {
                    markerImage = busMarkerImage;
                } else if (segment.type === '지하철') {
                    markerImage = trainMarkerImage;
                } else if (segment.type === '자동차') {
                    markerImage = carMarkerImage;
                }

                if (markerImage) {
                    const stationMarker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(segment.coordinates[0][1], segment.coordinates[0][0]), // 좌표 순서 변경
                        map: map,
                        title: segment.Station,
                        image: new kakao.maps.MarkerImage(markerImage, markerSize)
                    });

                    // 커스텀 오버레이 생성
                    const overlayContent = document.createElement('div');
                    overlayContent.className = 'custom-infowindow';

                    const hours = Math.floor(segment.duration / 60);
                    const minutes = segment.duration % 60;
                    const durationText = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;

                    if (segment.type === '도보' || segment.type === '자동차') {
                        overlayContent.innerHTML = `
                            <div class="infowindow-content">${segment.type}</div>
                            <div class="pathStation-duration">${durationText}</div>
                            <button class="infowindow-close">X</button>
                        `;
                    } else {    // 버스, 지하철
                        overlayContent.innerHTML = `
                            <div class="pathStation-direction">${segment.Station}</div>
                            <div class="infowindow-content">${segment.vehicleId}</div>
                            <div class="pathStation-duration">${durationText}</div>
                            <button class="infowindow-close">X</button>
                        `;
                    }

                    //내부 쾌적도 추가하면 오버레이에 추가...^^
                    // <div class="station-congestion" style="color: ${getCongestionColor(segment.congestion)};">
                    //             ${segment.congestion}
                    //         </div>

                    const customOverlay = new kakao.maps.CustomOverlay({
                        position: new kakao.maps.LatLng(segment.coordinates[0][1], segment.coordinates[0][0]), // 좌표 순서 변경
                        content: overlayContent,
                        yAnchor: 1.5
                    });

                    // 닫기 버튼 이벤트 추가
                    overlayContent.querySelector('.infowindow-close').addEventListener('click', () => {
                        customOverlay.setMap(null);
                    });

                    // 마커 클릭 이벤트에 커스텀 오버레이 연결
                    kakao.maps.event.addListener(stationMarker, 'click', () => {
                        // 기존에 열려 있는 커스텀 오버레이가 있으면 닫기
                        if (infoWindowRef.current) {
                            infoWindowRef.current.setMap(null);
                        }
                        // 새로운 커스텀 오버레이 열기
                        customOverlay.setMap(map);
                        // 현재 열려 있는 커스텀 오버레이 참조 업데이트
                        infoWindowRef.current = customOverlay;
                    });

                    newMarkers.push(stationMarker);
                    newOverlays.push(customOverlay);
                }
            });
        });

        // 새로운 폴리라인과 마커 상태 업데이트
        setPolylines(newPolylines);
        setMarkers(newMarkers);
        setOverlays(newOverlays);
    }, [map, routes, selectedRoute]);

    const getSegmentColor = (type) => {
        switch (type) {
            case '도보':
                return '#808080'; // 걷는 경로 색상 (회색)
            case '버스':
                return '#48b751'; // 버스 경로 색상 (연두색)
            case '지하철':
                return '#00BFFF'; // 지하철 경로 색상 (하늘색)
            case '자동차':
                return '#4169E1'; // 자동차 경로 색상 (파란색)
            default:
                return '#000000'; // 기본 색상 (검정색)
        }
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












//버스, 지하철, 걷기 구분


// import { useEffect, useState, useRef } from "react";
// import SearchBar from "../MapFunction/SearchBar";
// import pathData from '../data/path2.json'; // 경로 데이터 가져오기
// import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
// import './pathResultPage.css';
// import PopulationChart from "../UI/PopulationChart";
// import PopulationPieChart from "../UI/PopulationPieChart";
// import PathLeadTimeChart from "../UI/PathLeadTimeChart"; // PathLeadTimeChart 컴포넌트 가져오기

// import busMarkerImage from './images/marker/bus.png';
// import trainMarkerImage from './images/marker/train.png';
// import placeMarkerImage from './images/marker/place.png';

// const { kakao } = window;

// function ResultPage() {
//     const [map, setMap] = useState(null); // map 상태 관리
//     const [polylines, setPolylines] = useState([]); // 폴리라인 상태 관리
//     const [markers, setMarkers] = useState([]); // 마커 상태 관리
//     const [overlays, setOverlays] = useState([]); // 커스텀 오버레이 상태 관리
//     const infoWindowRef = useRef(null); // 현재 열려 있는 인포윈도우 참조 관리
//     const selectedRegion = useStore((state) => state.selectedRegion); // Zustand 스토어에서 상태 가져오기
//     const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기
//     const selectedRoute = useStore(state => state.selectedRoute); // 선택한 경로 가져오기

//     useEffect(() => {
//         const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
//         const options = {
//             center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
//             level: 10 // 지도의 레벨(확대, 축소 정도)
//         };

//         const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
//         setMap(kakaoMap); // map 상태 설정

//         return () => {
//             // 컴포넌트 언마운트 시 기존 폴리라인과 마커 제거
//             polylines.forEach(polyline => polyline.setMap(null));
//             markers.forEach(marker => marker.setMap(null));
//             overlays.forEach(overlay => overlay.setMap(null));
//         };
//     }, []);

//     useEffect(() => {
//         if (!map) return;

//         // 기존 폴리라인과 마커 제거
//         polylines.forEach(polyline => polyline.setMap(null));
//         markers.forEach(marker => marker.setMap(null));
//         overlays.forEach(overlay => overlay.setMap(null));

//         const newPolylines = [];
//         const newMarkers = [];
//         const newOverlays = [];

//         // 경로 데이터를 사용하여 폴리라인 및 마커 생성
//         pathData.path.forEach((route, index) => {
//             if (route.id !== selectedRoute) return; // 선택한 경로만 표시

//             // 걷는 경로 폴리라인 생성
//             if (route.coordinate.walk) {
//                 route.coordinate.walk.forEach(walkSegment => {
//                     const walkPath = walkSegment.map(coord => new kakao.maps.LatLng(coord[0], coord[1]));

//                     // 테두리 폴리라인 생성
//                     const walkBorderPolyline = new kakao.maps.Polyline({
//                         path: walkPath,
//                         strokeWeight: 8, // 테두리 두께
//                         strokeColor: '#000000', // 테두리 색상 (검정색)
//                         strokeOpacity: 0.6, // 테두리 불투명도
//                         strokeStyle: 'solid' // 테두리 스타일
//                     });

//                     // 메인 폴리라인 생성
//                     const walkPolyline = new kakao.maps.Polyline({
//                         path: walkPath,
//                         strokeWeight: 6,
//                         strokeColor: '#808080', // 걷는 경로 색상 (회색)
//                         strokeOpacity: 0.9,
//                         strokeStyle: 'solid'
//                     });

//                     //패턴 폴리라인 생성
//                     const patternPolyline = new kakao.maps.Polyline({
//                         path: walkPath,
//                         strokeWeight: 1, // 패턴 두께
//                         strokeColor: '#FFFFFF', // 패턴 색상 (흰색)
//                         strokeOpacity: 1, // 패턴 불투명도
//                         strokeStyle: 'shortdashdot' // 패턴 스타일
//                     });

//                     // 테두리 폴리라인을 먼저 지도에 추가
//                     walkBorderPolyline.setMap(map);
//                     // 메인 폴리라인을 지도에 추가
//                     walkPolyline.setMap(map);
//                     // 패턴 폴리라인을 지도에 추가
//                     patternPolyline.setMap(map);

//                     newPolylines.push(walkBorderPolyline, walkPolyline, patternPolyline);
//                 });
//             }

//             // 버스 경로 폴리라인 생성
//             if (route.coordinate.bus) {
//                 route.coordinate.bus.forEach(busSegment => {
//                     const busPath = busSegment.map(coord => new kakao.maps.LatLng(coord[0], coord[1]));

//                     // 테두리 폴리라인 생성
//                     const busBorderPolyline = new kakao.maps.Polyline({
//                         path: busPath,
//                         strokeWeight: 8, // 테두리 두께
//                         strokeColor: '#000000', // 테두리 색상 (검정색)
//                         strokeOpacity: 0.6, // 테두리 불투명도
//                         strokeStyle: 'solid' // 테두리 스타일
//                     });

//                     // 메인 폴리라인 생성
//                     const busPolyline = new kakao.maps.Polyline({
//                         path: busPath,
//                         strokeWeight: 6,
//                         strokeColor: '#48b751', // 버스 경로 색상 (연두색)
//                         strokeOpacity: 0.9,
//                         strokeStyle: 'solid'
//                     });

//                     //패턴 폴리라인 생성
//                     const patternPolyline = new kakao.maps.Polyline({
//                         path: busPath,
//                         strokeWeight: 1, // 패턴 두께
//                         strokeColor: '#FFFFFF', // 패턴 색상 (흰색)
//                         strokeOpacity: 1, // 패턴 불투명도
//                         strokeStyle: 'shortdashdot' // 패턴 스타일
//                     });

//                     // 테두리 폴리라인을 먼저 지도에 추가
//                     busBorderPolyline.setMap(map);
//                     // 메인 폴리라인을 지도에 추가
//                     busPolyline.setMap(map);
//                     // 패턴 폴리라인을 지도에 추가
//                     patternPolyline.setMap(map);

//                     newPolylines.push(busBorderPolyline, busPolyline, patternPolyline);
//                 });
//             }

//             // 지하철 경로 폴리라인 생성
//             if (route.coordinate.subway) {
//                 route.coordinate.subway.forEach(subwaySegment => {
//                     const subwayPath = subwaySegment.map(coord => new kakao.maps.LatLng(coord[0], coord[1]));

//                     // 테두리 폴리라인 생성
//                     const subwayBorderPolyline = new kakao.maps.Polyline({
//                         path: subwayPath,
//                         strokeWeight: 8, // 테두리 두께
//                         strokeColor: '#000000', // 테두리 색상 (검정색)
//                         strokeOpacity: 0.6, // 테두리 불투명도
//                         strokeStyle: 'solid' // 테두리 스타일
//                     });

//                     // 메인 폴리라인 생성
//                     const subwayPolyline = new kakao.maps.Polyline({
//                         path: subwayPath,
//                         strokeWeight: 6,
//                         strokeColor: '#00BFFF', // 지하철 경로 색상 (하늘색)
//                         strokeOpacity: 0.9,
//                         strokeStyle: 'solid'
//                     });

//                     //패턴 폴리라인 생성
//                     const patternPolyline = new kakao.maps.Polyline({
//                         path: subwayPath,
//                         strokeWeight: 1, // 패턴 두께
//                         strokeColor: '#FFFFFF', // 패턴 색상 (흰색)
//                         strokeOpacity: 1, // 패턴 불투명도
//                         strokeStyle: 'shortdashdot' // 패턴 스타일
//                     });

//                     // 테두리 폴리라인을 먼저 지도에 추가
//                     subwayBorderPolyline.setMap(map);
//                     // 메인 폴리라인을 지도에 추가
//                     subwayPolyline.setMap(map);
//                     // 패턴 폴리라인을 지도에 추가
//                     patternPolyline.setMap(map);

//                     newPolylines.push(subwayBorderPolyline, subwayPolyline, patternPolyline);
//                 });
//             }

//             // 마커 이미지 크기 설정
//             const markerSize = new kakao.maps.Size(40, 40); // 원하는 크기로 설정

//             // 시작 지점 마커 생성
//             const startMarker = new kakao.maps.Marker({
//                 position: new kakao.maps.LatLng(route.coordinate.walk[0][0][0], route.coordinate.walk[0][0][1]),
//                 map: map,
//                 title: `${route.routeName} 시작 지점`,
//                 image: new kakao.maps.MarkerImage(placeMarkerImage, markerSize)
//             });

//             // 끝 지점 마커 생성
//             const endMarker = new kakao.maps.Marker({
//                 position: new kakao.maps.LatLng(route.coordinate.walk[route.coordinate.walk.length - 1][1][0], route.coordinate.walk[route.coordinate.walk.length - 1][1][1]),
//                 map: map,
//                 title: `${route.routeName} 끝 지점`,
//                 image: new kakao.maps.MarkerImage(placeMarkerImage, markerSize)
//             });

//             newMarkers.push(startMarker, endMarker);

//             // 역과 정류장 마커 생성
//             route.station.forEach(station => {
//                 const markerImage = station.type === 'bus' ? busMarkerImage : trainMarkerImage;
//                 const stationMarker = new kakao.maps.Marker({
//                     position: new kakao.maps.LatLng(station.lat, station.lng),
//                     map: map,
//                     title: station.name,
//                     image: new kakao.maps.MarkerImage(markerImage, markerSize)
//                 });

//                 // 커스텀 오버레이 생성
//                 const overlayContent = document.createElement('div');
//                 overlayContent.className = 'custom-infowindow';
//                 overlayContent.innerHTML = `
//                     <div class="infowindow-content">${station.name}</div>
//                     <div class="pathStation-direction">${station.direction}</div>
//                     <div class="station-congestion" style="color: ${getCongestionColor(station.congestion)};">
//                         ${station.congestion}
//                     </div>
//                     <button class="infowindow-close">X</button>
//                 `;

//                 const customOverlay = new kakao.maps.CustomOverlay({
//                     position: new kakao.maps.LatLng(station.lat, station.lng),
//                     content: overlayContent,
//                     yAnchor: 1.5
//                 });

//                 // 닫기 버튼 이벤트 추가
//                 overlayContent.querySelector('.infowindow-close').addEventListener('click', () => {
//                     customOverlay.setMap(null);
//                 });

//                 // 마커 클릭 이벤트에 커스텀 오버레이 연결
//                 kakao.maps.event.addListener(stationMarker, 'click', () => {
//                     // 기존에 열려 있는 커스텀 오버레이가 있으면 닫기
//                     if (infoWindowRef.current) {
//                         infoWindowRef.current.setMap(null);
//                     }
//                     // 새로운 커스텀 오버레이 열기
//                     customOverlay.setMap(map);
//                     // 현재 열려 있는 커스텀 오버레이 참조 업데이트
//                     infoWindowRef.current = customOverlay;
//                 });

//                 newMarkers.push(stationMarker);
//                 newOverlays.push(customOverlay);
//             });
//         });

//         // 새로운 폴리라인과 마커 상태 업데이트
//         setPolylines(newPolylines);
//         setMarkers(newMarkers);
//         setOverlays(newOverlays);
//     }, [map, selectedRoute]);

//     const getCongestionColor = (congestion) => {
//         switch (congestion) {
//             case '여유':
//                 return 'green';
//             case '보통':
//                 return 'orange';
//             case '혼잡':
//                 return 'red';
//             default:
//                 return 'black';
//         }
//     };

//     return (
//         <div className="result-page">
//             <div className="map-container">
//                 {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
//                 <div id="map" style={{
//                     width: '100%',
//                     height: '100vh'
//                 }}>
//                 </div>
//             </div>
//             <div className="dashboard-container">
//                 <div className="chart-container">
//                     <h4>{selectedDate} {selectedRegion}→인천공항 유동인구 수</h4>
//                     <PopulationChart />
//                 </div>
//                 <div className="chart-container">
//                     <h4>경로별 유동인구 수 비율</h4>
//                     <PopulationPieChart />
//                 </div>
//                 <div className="chart-container">
//                     <h4>경로별 예상 시간 비교</h4>
//                     <PathLeadTimeChart />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ResultPage;



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
                    routeId: `route-${index + 1}`,
                    type: pattern.type,
                    totalTime: pattern.total_time,
                    users: pattern.users,
                    coordinates: pattern.coordinates,
                    segments: pattern.bus_segments || []
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
    
            const path = route.coordinates.map(coord => new kakao.maps.LatLng(coord[1], coord[0])); // 좌표 순서 변경
    
            console.log("Creating polyline for route:", route);
    
            // 경로를 분할하여 각 분할된 경로에 대해 폴리라인 생성
            let segmentStartIndex = 0;
            route.segments.forEach(segment => {
                const boardIndex = route.coordinates.findIndex(coord => coord[0] === segment.board_coordinates[0] && coord[1] === segment.board_coordinates[1]);
                const alightIndex = route.coordinates.findIndex(coord => coord[0] === segment.alight_coordinates[0] && coord[1] === segment.alight_coordinates[1]);
    
                if (boardIndex !== -1 && alightIndex !== -1) {
                    const segmentPath = route.coordinates.slice(segmentStartIndex, alightIndex + 1).map(coord => new kakao.maps.LatLng(coord[1], coord[0]));
    
                    // 테두리 폴리라인 생성
                    const borderPolyline = new kakao.maps.Polyline({
                        path: segmentPath,
                        strokeWeight: 8, // 테두리 두께
                        strokeColor: '#000000', // 테두리 색상 (검정색)
                        strokeOpacity: 0.6, // 테두리 불투명도
                        strokeStyle: 'solid' // 테두리 스타일
                    });
    
                    // 메인 폴리라인 생성
                    const polyline = new kakao.maps.Polyline({
                        path: segmentPath,
                        strokeWeight: 6,
                        strokeColor: getSegmentColor(route.type), // 경로 색상
                        strokeOpacity: 0.9,
                        strokeStyle: 'solid'
                    });
    
                    // 패턴 폴리라인 생성
                    const patternPolyline = new kakao.maps.Polyline({
                        path: segmentPath,
                        strokeWeight: 1, // 패턴 두께
                        strokeColor: '#FFFFFF', // 패턴 색상 (흰색)
                        strokeOpacity: 1, // 패턴 불투명도
                        strokeStyle: 'shortdashdot' // 패턴 스타일
                    });
    
                    // 테두리 폴리라인을 먼저 지도에 추가
                    borderPolyline.setMap(map);
                    // 메인 폴리라인을 지도에 추가
                    polyline.setMap(map);
                    // 패턴 폴리라인을 지도에 추가
                    patternPolyline.setMap(map);
    
                    newPolylines.push(borderPolyline, polyline, patternPolyline);
    
                    segmentStartIndex = alightIndex + 1;
                }
            });
    
            // 마커 이미지 크기 설정
            const markerSize = new kakao.maps.Size(40, 40); // 원하는 크기로 설정
    
            // 시작 지점 마커 생성
            const startMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(route.coordinates[0][1], route.coordinates[0][0]), // 좌표 순서 변경
                map: map,
                title: `${route.routeId} 시작 지점`,
                image: new kakao.maps.MarkerImage(placeMarkerImage, markerSize)
            });
    
            // 끝 지점 마커 생성
            const endMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(route.coordinates[route.coordinates.length - 1][1], route.coordinates[route.coordinates.length - 1][0]), // 좌표 순서 변경
                map: map,
                title: `${route.routeId} 끝 지점`,
                image: new kakao.maps.MarkerImage(airportMarkerImage, markerSize)
            });
    
            newMarkers.push(startMarker, endMarker);
    
            // 버스 환승 정보 마커 생성
            route.segments.forEach(segment => {
                const boardMarker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(segment.board_coordinates[1], segment.board_coordinates[0]), // 좌표 순서 변경
                    map: map,
                    title: `${segment.bus_id} 탑승 지점`,
                    image: new kakao.maps.MarkerImage(busMarkerImage, markerSize)
                });
    
                newMarkers.push(boardMarker);
    
                // 커스텀 오버레이 생성
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
                    position: new kakao.maps.LatLng(segment.board_coordinates[1], segment.board_coordinates[0]), // 좌표 순서 변경
                    content: overlayContent,
                    yAnchor: 1.5
                });
    
                // 닫기 버튼 이벤트 추가
                overlayContent.querySelector('.infowindow-close').addEventListener('click', () => {
                    customOverlay.setMap(null);
                });
    
                // 마커 클릭 이벤트에 커스텀 오버레이 연결
                kakao.maps.event.addListener(boardMarker, 'click', () => {
                    // 기존에 열려 있는 커스텀 오버레이가 있으면 닫기
                    if (infoWindowRef.current) {
                        infoWindowRef.current.setMap(null);
                    }
                    // 새로운 커스텀 오버레이 열기
                    customOverlay.setMap(map);
                    // 현재 열려 있는 커스텀 오버레이 참조 업데이트
                    infoWindowRef.current = customOverlay;
                });
    
                newOverlays.push(customOverlay);
            });
        });
    
        // 새로운 폴리라인과 마커 상태 업데이트
        setPolylines(newPolylines);
        setMarkers(newMarkers);
        setOverlays(newOverlays);
    }, [map, routes, selectedRoute]);

    const getSegmentColor = (type) => {
        switch (type) {
            case '도보':
                return '#808080'; // 걷는 경로 색상 (회색)
            case 'bus':
                return '#48b751'; // 버스 경로 색상 (연두색)
            // case '지하철':
            //     return '#00BFFF'; // 지하철 경로 색상 (하늘색)
            case 'car':
                return '#4169E1'; // 자동차 경로 색상 (파란색)
            default:
                return '#808080'; // 기본 색상 (검정색)
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


// const alightMarker = new kakao.maps.Marker({
                //     position: new kakao.maps.LatLng(segment.alight_coordinates[1], segment.alight_coordinates[0]), // 좌표 순서 변경
                //     map: map,
                //     title: `${segment.bus_id} 하차 지점`,
                //     image: new kakao.maps.MarkerImage(busMarkerImage, markerSize)
                // });


//새로운 api로 수정

