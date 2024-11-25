// import { useEffect, useState, useRef } from "react";
// import SearchBar from "../MapFunction/SearchBar";

// const { kakao } = window;

// function RoadPage() {
//     const [map, setMap] = useState(null); // map 상태 관리

//     useEffect(() => {
//         const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
//         const options = {
//             center: new kakao.maps.LatLng(37.5665, 126.9780), // 지도의 중심좌표 (서울)
//             level: 6 // 지도의 레벨(확대, 축소 정도)
//         };

//         const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
//         setMap(kakaoMap); // map 상태 설정
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

import { useEffect, useState } from "react";
import SearchBar from "../MapFunction/SearchBar";
import useTrafficStore from '../../store/TrafficStore'; // 도로용 Zustand 스토어 가져오기
import useStore from '../../store/UserStore'; // 사용자 상태 관리용 Zustand 스토어 가져오기
import axios from 'axios';
import LoadingSpinner from '../UI/LoadingSpinner'; // LoadingSpinner 컴포넌트 가져오기

const { kakao } = window;

function RoadResultPage() {
    const [map, setMap] = useState(null); // map 상태 관리
    const [trafficData, setTrafficData] = useState([]); // 도로 혼잡도 데이터 상태 관리
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const selectedDateTime = useTrafficStore(state => state.selectedDateTime); // 선택한 날짜와 시간 가져오기
    const token = useStore(state => state.token); // 사용자 토큰 가져오기

    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780), // 지도의 중심좌표 (서울)
            level: 6 // 지도의 레벨(확대, 축소 정도)
        };

        const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
        setMap(kakaoMap); // map 상태 설정
    }, []);

    useEffect(() => {
        const fetchTrafficData = async () => {
            if (selectedDateTime && token) {
                const { date, time } = selectedDateTime;
                const apiUrl = import.meta.env.VITE_API_BASE_URL;
                setLoading(true); // 로딩 상태 시작
                try {
                    const response = await axios.get(`${apiUrl}/api/gcs/traffic/all`, {
                        params: {
                            date: date,
                            hour: time
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setTrafficData(response.data);
                    console.log("파라미터:", date, time);
                    console.log("Traffic data fetched:", response.data);
                } catch (error) {
                    console.error("Error fetching traffic data:", error);
                } finally {
                    setLoading(false); // 로딩 상태 종료
                }
            }
        };

        fetchTrafficData();
    }, [selectedDateTime, token]);

    useEffect(() => {
        if (map && trafficData.length > 0) {
            trafficData.forEach(road => {
                const path = road.coordinates.map(coord => new kakao.maps.LatLng(coord[0], coord[1]));
                const polyline = new kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 5,
                    strokeColor: getTrafficColor(road.trafficStatus),
                    strokeOpacity: 0.7,
                    strokeStyle: 'solid'
                });
                polyline.setMap(map);
            });
        }
    }, [map, trafficData]);

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
            }}>
            </div>
        </div>
    );
}

export default RoadResultPage;