import { useEffect, useState, useRef } from "react";
import SearchBar from "../MapFunction/SearchBar";
import pathData from '../data/path.json'; // 경로 데이터 가져오기
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import './ResultPage.css';
import PopulationChart from "../UI/PopulationChart";
import PathLeadTimeChart from "../UI/PathLeadTimeChart"; // PathLeadTimeChart 컴포넌트 가져오기

const { kakao } = window;

function ResultPage() {
    const [map, setMap] = useState(null); // map 상태 관리
    const infoWindowRef = useRef(null); // 현재 열려 있는 인포윈도우 참조 관리
    const selectedRegion = useStore((state) => state.selectedRegion); // Zustand 스토어에서 상태 가져오기

    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
            center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
            level: 10 // 지도의 레벨(확대, 축소 정도)
        };

        const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
        setMap(kakaoMap); // map 상태 설정

        // 경로 데이터를 사용하여 폴리라인 및 마커 생성
        pathData.path.forEach(route => {
            const linePath = route.coordinate.map(coord => new kakao.maps.LatLng(coord[0], coord[1]));

            const polyline = new kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 5,
                strokeColor: route.type === 'exist' ? '#FF0000' : '#0000FF', // 기존 경로는 빨간색, 새로운 경로는 파란색
                strokeOpacity: 0.7,
                strokeStyle: 'solid'
            });

            polyline.setMap(kakaoMap); // 지도에 폴리라인 추가

            // 시작 지점 마커 생성
            const startMarker = new kakao.maps.Marker({
                position: linePath[0],
                map: kakaoMap,
                title: `${route.routeName} 시작 지점`
            });

            // 끝 지점 마커 생성
            const endMarker = new kakao.maps.Marker({
                position: linePath[linePath.length - 1],
                map: kakaoMap,
                title: `${route.routeName} 끝 지점`
            });

            // 역과 정류장 마커 생성
            route.station.forEach(station => {
                const stationMarker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(station.lat, station.lng),
                    map: kakaoMap,
                    title: station.name
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
                    infowindow.open(kakaoMap, stationMarker);
                    // 현재 열려 있는 인포윈도우 참조 업데이트
                    infoWindowRef.current = infowindow;
                });
            });
        });
    }, []);

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
                <h4>{selectedRegion}→인천공항 유동인구 수</h4>
                <PopulationChart />
                <h4>경로별 예상 시간 비교</h4>
                <PathLeadTimeChart />
            </div>
        </div>
    );
}

export default ResultPage;