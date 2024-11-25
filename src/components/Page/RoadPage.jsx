// import { useEffect, useState, useRef } from "react";
// import SearchBar from "../MapFunction/SearchBar";
// import trafficData from '../data/traffic.json'; // 도로 혼잡도 데이터 가져오기

// const { kakao } = window;

// function RoadPage() {
//     const [map, setMap] = useState(null); // map 상태 관리
//     const polylinesRef = useRef([]); // 폴리라인 참조 관리

//     useEffect(() => {
//         const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
//         const options = {
//             center: new kakao.maps.LatLng(37.5665, 126.9780), // 지도의 중심좌표 (서울)
//             level: 6 // 지도의 레벨(확대, 축소 정도)
//         };

//         const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
//         setMap(kakaoMap); // map 상태 설정

//         const createPolyline = (route) => {
//             const linePath = route.coordinates.map(coord => new kakao.maps.LatLng(coord[0], coord[1]));

//             let color;
//             switch (route.roadType) {
//                 case '일반도로':
//                     color = route.speed >= 30 ? '#00FF00' : route.speed >= 15 ? '#FFA500' : '#FF0000';
//                     break;
//                 case '국도':
//                     color = route.speed >= 40 ? '#00FF00' : route.speed >= 20 ? '#FFA500' : '#FF0000';
//                     break;
//                 case '도시고속도로':
//                     color = route.speed >= 60 ? '#00FF00' : route.speed >= 30 ? '#FFA500' : '#FF0000';
//                     break;
//                 case '고속도로':
//                     color = route.speed >= 70 ? '#00FF00' : route.speed >= 40 ? '#FFA500' : '#FF0000';
//                     break;
//                 default:
//                     color = '#000000'; // 기본 색상 (예: 검정색)
//             }

//             return new kakao.maps.Polyline({
//                 path: linePath,
//                 strokeWeight: 5,
//                 strokeColor: color,
//                 strokeOpacity: 0.7,
//                 strokeStyle: 'solid'
//             });
//         };

//         const updatePolylines = () => {
//             const level = kakaoMap.getLevel();
//             const newPolylines = [];

//             trafficData.routes.forEach(route => {
//                 if (level <= 7 || (route.roadType === '국도' || route.roadType === '고속도로')) {
//                     const polyline = createPolyline(route); // 폴리라인 생성
//                     polyline.setMap(kakaoMap);  // 지도에 폴리라인 추가
//                     newPolylines.push(polyline);    // 새로운 폴리라인 배열에 추가
//                 }
//             });

//             // 기존 폴리라인 제거
//             polylinesRef.current.forEach(polyline => polyline.setMap(null));   
//             polylinesRef.current = newPolylines;    // 새로운 폴리라인 배열로 참조 업데이트
//         };

//         // 초기 폴리라인 설정
//         updatePolylines();

//         // 줌 레벨 변경 이벤트 리스너 추가
//         kakao.maps.event.addListener(kakaoMap, 'zoom_changed', updatePolylines);

//         return () => {
//             // 컴포넌트 언마운트 시 이벤트 리스너 제거
//             kakao.maps.event.removeListener(kakaoMap, 'zoom_changed', updatePolylines);
//         };
//     }, []);

//     return (
//         <div>
//             {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
//             <div id="map" style={{
//                 width: '100%',
//                 height: '100vh'
//             }}>
//             </div>
//         </div>
//     );
// }

// export default RoadPage;

import { useEffect, useState, useRef } from "react";
import SearchBar from "../MapFunction/SearchBar";

const { kakao } = window;

function RoadPage() {
    const [map, setMap] = useState(null); // map 상태 관리

    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780), // 지도의 중심좌표 (서울)
            level: 6 // 지도의 레벨(확대, 축소 정도)
        };

        const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
        setMap(kakaoMap); // map 상태 설정
    }, []);

    return (
        <div>
            {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
            <div id="map" style={{
                width: '100%',
                height: '100vh'
            }}>
            </div>
        </div>
    );
}

export default RoadPage;