// import { useEffect, useState, useRef } from "react";
// import SearchBar from "../MapFunction/SearchBar";
// import pathData from '../data/path.json'; // 경로 데이터 가져오기
// import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
// import './ResultPage.css';
// import PopulationChart from "../UI/PopulationChart";
// import PathLeadTimeChart from "../UI/PathLeadTimeChart"; // PathLeadTimeChart 컴포넌트 가져오기

// const { kakao } = window;

// function ResultPage() {
//     const [map, setMap] = useState(null); // map 상태 관리
//     const infoWindowRef = useRef(null); // 현재 열려 있는 인포윈도우 참조 관리
//     const selectedRegion = useStore((state) => state.selectedRegion); // Zustand 스토어에서 상태 가져오기
//     const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기

//     useEffect(() => {
//         const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
//         const options = {
//             center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
//             level: 10 // 지도의 레벨(확대, 축소 정도)
//         };

//         const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
//         setMap(kakaoMap); // map 상태 설정

//         // 경로 데이터를 사용하여 폴리라인 및 마커 생성
//         pathData.path.forEach(route => {
//             const linePath = route.coordinate.map(coord => new kakao.maps.LatLng(coord[0], coord[1]));

//             const polyline = new kakao.maps.Polyline({
//                 path: linePath,
//                 strokeWeight: 5,
//                 strokeColor: route.type === 'exist' ? '#FF0000' : '#0000FF', // 기존 경로는 빨간색, 새로운 경로는 파란색
//                 strokeOpacity: 0.7,
//                 strokeStyle: 'solid'
//             });

//             polyline.setMap(kakaoMap); // 지도에 폴리라인 추가

//             // 시작 지점 마커 생성
//             const startMarker = new kakao.maps.Marker({
//                 position: linePath[0],
//                 map: kakaoMap,
//                 title: `${route.routeName} 시작 지점`
//             });

//             // 끝 지점 마커 생성
//             const endMarker = new kakao.maps.Marker({
//                 position: linePath[linePath.length - 1],
//                 map: kakaoMap,
//                 title: `${route.routeName} 끝 지점`
//             });

//             // 역과 정류장 마커 생성
//             route.station.forEach(station => {
//                 const stationMarker = new kakao.maps.Marker({
//                     position: new kakao.maps.LatLng(station.lat, station.lng),
//                     map: kakaoMap,
//                     title: station.name
//                 });

//                 // 인포윈도우 생성
//                 const infowindow = new kakao.maps.InfoWindow({
//                     content: `<div style="padding:5px;">${station.name}</div>`,
//                     removable: true // 인포윈도우를 닫을 수 있도록 설정
//                 });

//                 // 마커 클릭 이벤트에 인포윈도우 연결
//                 kakao.maps.event.addListener(stationMarker, 'click', () => {
//                     // 기존에 열려 있는 인포윈도우가 있으면 닫기
//                     if (infoWindowRef.current) {
//                         infoWindowRef.current.close();
//                     }
//                     // 새로운 인포윈도우 열기
//                     infowindow.open(kakaoMap, stationMarker);
//                     // 현재 열려 있는 인포윈도우 참조 업데이트
//                     infoWindowRef.current = infowindow;
//                 });
//             });
//         });
//     }, []);

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
//                 <h4>{selectedDate} {selectedRegion}→인천공항 유동인구 수</h4>
//                 <PopulationChart />
//                 <h4>경로별 예상 시간 비교</h4>
//                 <PathLeadTimeChart />
//             </div>
//         </div>
//     );
// }

// export default ResultPage;

import { useEffect, useState, useRef } from "react";
import SearchBar from "../MapFunction/SearchBar";
import pathData from '../data/path.json'; // 경로 데이터 가져오기
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import './ResultPage.css';
import PopulationChart from "../UI/PopulationChart";
import PathLeadTimeChart from "../UI/PathLeadTimeChart"; // PathLeadTimeChart 컴포넌트 가져오기

import busMarkerImage from './images/marker/bus.png';
import trainMarkerImage from './images/marker/train.png';
import placeMarkerImage from './images/marker/place.png';

const { kakao } = window;

function ResultPage() {
    const [map, setMap] = useState(null); // map 상태 관리
    const [polylines, setPolylines] = useState([]); // 폴리라인 상태 관리
    const [markers, setMarkers] = useState([]); // 마커 상태 관리
    const infoWindowRef = useRef(null); // 현재 열려 있는 인포윈도우 참조 관리
    const selectedRegion = useStore((state) => state.selectedRegion); // Zustand 스토어에서 상태 가져오기
    const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기
    const selectedRoute = useStore(state => state.selectedRoute); // 선택한 경로 가져오기

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
        };
    }, []);

    useEffect(() => {
        if (!map) return;

        // 기존 폴리라인과 마커 제거
        polylines.forEach(polyline => polyline.setMap(null));
        markers.forEach(marker => marker.setMap(null));

        const newPolylines = [];
        const newMarkers = [];

        // 경로 데이터를 사용하여 폴리라인 및 마커 생성
        pathData.path.forEach(route => {
            if (selectedRoute && route.id !== selectedRoute) return; // 선택한 경로만 표시

            const linePath = route.coordinate.map(coord => new kakao.maps.LatLng(coord[0], coord[1]));

            // 테두리 폴리라인 생성
            const borderPolyline = new kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 8, // 테두리 두께
                strokeColor: '#000000', // 테두리 색상 (검정색)
                strokeOpacity: 0.6, // 테두리 불투명도
                strokeStyle: 'solid' // 테두리 스타일
            });

            // 메인 폴리라인 생성
            const polyline = new kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 6, // 두께를 약간 더 두껍게 설정
                strokeColor: route.type === 'exist' ? '#4682B4' : '#FF6347', // 기존 경로는 강철색, 새로운 경로는 토마토색
                strokeOpacity: 0.9, // 불투명도를 약간 더 높게 설정
                strokeStyle: 'solid', // 선 스타일을 실선으로 설정
                // endArrow: true // 끝에 화살표 추가
            });

            // 테두리 폴리라인을 먼저 지도에 추가
            borderPolyline.setMap(map);
            // 메인 폴리라인을 지도에 추가
            polyline.setMap(map);

            newPolylines.push(borderPolyline, polyline);

            // 마커 이미지 크기 설정
            const markerSize = new kakao.maps.Size(40, 40); // 원하는 크기로 설정

            // 시작 지점 마커 생성
            const startMarker = new kakao.maps.Marker({
                position: linePath[0],
                map: map,
                title: `${route.routeName} 시작 지점`,
                image: new kakao.maps.MarkerImage(placeMarkerImage, markerSize)
            });

            // 끝 지점 마커 생성
            const endMarker = new kakao.maps.Marker({
                position: linePath[linePath.length - 1],
                map: map,
                title: `${route.routeName} 끝 지점`,
                image: new kakao.maps.MarkerImage(placeMarkerImage, markerSize)
            });

            newMarkers.push(startMarker, endMarker);

            // 역과 정류장 마커 생성
            route.station.forEach(station => {
                const markerImage = station.type === 'bus' ? busMarkerImage : trainMarkerImage;
                const stationMarker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(station.lat, station.lng),
                    map: map,
                    title: station.name,
                    image: new kakao.maps.MarkerImage(markerImage, markerSize)
                });

                // 인포윈도우 생성
                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;">${station.name}</div>`,
                    removable: true // 인포윈도우를 닫을 수 있도록 설정
                });

                // 마커 클릭 이벤트에 인포윈도우 연결
                kakao.maps.event.addListener(stationMarker, 'click', () => {
                    // 기존에 열려 있는 인포윈도우가 있으면 닫기
                    if (infoWindowRef.current) {
                        infoWindowRef.current.close();
                    }
                    // 새로운 인포윈도우 열기
                    infowindow.open(map, stationMarker);
                    // 현재 열려 있는 인포윈도우 참조 업데이트
                    infoWindowRef.current = infowindow;
                });

                newMarkers.push(stationMarker);
            });
        });

        // 새로운 폴리라인과 마커 상태 업데이트
        setPolylines(newPolylines);
        setMarkers(newMarkers);
    }, [map, selectedRoute]);

    return (
        <div className="result-page">
            <div className="map-container">
                {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
                <div id="map" style={{
                    width: '100%',
                    height: '100vh'
                }}>
                </div>
            </div>
            <div className="dashboard-container">
                <h4>{selectedDate} {selectedRegion}→인천공항 유동인구 수</h4>
                <div className="chart-container">
                    <PopulationChart />
                </div>
                <h4>경로별 예상 시간 비교</h4>
                <div className="chart-container">
                    <PathLeadTimeChart />
                </div>
            </div>
        </div>
    );
}

export default ResultPage;