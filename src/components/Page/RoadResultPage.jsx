// import { useEffect, useState } from "react";
// import SearchBar from "../MapFunction/SearchBar";
// import useTrafficStore from '../../store/TrafficStore'; // 도로용 Zustand 스토어 가져오기
// import useStore from '../../store/UserStore'; // 사용자 상태 관리용 Zustand 스토어 가져오기
// import axios from 'axios';
// import LoadingSpinner from '../UI/LoadingSpinner'; // LoadingSpinner 컴포넌트 가져오기

// const { kakao } = window;

// function RoadResultPage() {
//     const [map, setMap] = useState(null); // map 상태 관리
//     const [trafficData, setTrafficData] = useState([]); // 도로 혼잡도 데이터 상태 관리
//     const [loading, setLoading] = useState(false); // 로딩 상태 관리
//     const selectedDateTime = useTrafficStore(state => state.selectedDateTime); // 선택한 날짜와 시간 가져오기
//     const token = useStore(state => state.token); // 사용자 토큰 가져오기

//     useEffect(() => {
//         const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
//         const options = {
//             center: new kakao.maps.LatLng(37.5665, 126.9780), // 지도의 중심좌표 (서울)
//             level: 6 // 지도의 레벨(확대, 축소 정도)
//         };

//         const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
//         setMap(kakaoMap); // map 상태 설정
//     }, []);

//     useEffect(() => {
//         const fetchTrafficData = async () => {
//             if (selectedDateTime && token) {
//                 const { date, time } = selectedDateTime;
//                 const apiUrl = import.meta.env.VITE_API_BASE_URL;
//                 setLoading(true); // 로딩 상태 시작
//                 try {
//                     const response = await axios.get(`${apiUrl}/api/gcs/traffic/all`, {
//                         params: {
//                             date: date,
//                             hour: time
//                         },
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     });
//                     setTrafficData(response.data);
//                     console.log("파라미터:", date, time);
//                     console.log("Traffic data fetched:", response.data);
//                 } catch (error) {
//                     console.error("Error fetching traffic data:", error);
//                 } finally {
//                     setLoading(false); // 로딩 상태 종료
//                 }
//             }
//         };

//         fetchTrafficData();
//     }, [selectedDateTime, token]);

//     useEffect(() => {
//         if (map && trafficData.length > 0) {
//             trafficData.forEach(road => {
//                 const simplifiedPath = simplifyPath(road.coordinates, 0.0001); // 단순화된 경로 생성
//                 const path = simplifiedPath.map(coord => new kakao.maps.LatLng(coord[1], coord[0]));
//                 const polyline = new kakao.maps.Polyline({
//                     path: path,
//                     strokeWeight: 5,
//                     strokeColor: getTrafficColor(road.trafficStatus),
//                     strokeOpacity: 0.7,
//                     strokeStyle: 'solid'
//                 });
//                 polyline.setMap(map);
//             });
//         }
//     }, [map, trafficData]);

//     const getTrafficColor = (status) => {
//         switch (status) {
//             case '원활':
//                 return '#00FF00'; // Green
//             case '서행':
//                 return '#FFFF00'; // Yellow
//             case '정체':
//                 return '#FF0000'; // Red
//             default:
//                 return '#000000'; // Black
//         }
//     };

//     // Douglas-Peucker 알고리즘을 사용하여 경로 단순화
//     const simplifyPath = (path, tolerance) => {
//         if (path.length < 3) return path;

//         const sqTolerance = tolerance * tolerance;

//         const simplifyDPStep = (points, first, last, sqTolerance, simplified) => {
//             let maxSqDist = sqTolerance;
//             let index = -1;

//             for (let i = first + 1; i < last; i++) {
//                 const sqDist = getSqSegDist(points[i], points[first], points[last]);

//                 if (sqDist > maxSqDist) {
//                     index = i;
//                     maxSqDist = sqDist;
//                 }
//             }

//             if (maxSqDist > sqTolerance) {
//                 if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
//                 simplified.push(points[index]);
//                 if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
//             }
//         };

//         const getSqSegDist = (p, p1, p2) => {
//             let x = p1[0];
//             let y = p1[1];
//             let dx = p2[0] - x;
//             let dy = p2[1] - y;

//             if (dx !== 0 || dy !== 0) {
//                 const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

//                 if (t > 1) {
//                     x = p2[0];
//                     y = p2[1];
//                 } else if (t > 0) {
//                     x += dx * t;
//                     y += dy * t;
//                 }
//             }

//             dx = p[0] - x;
//             dy = p[1] - y;

//             return dx * dx + dy * dy;
//         };

//         const last = path.length - 1;
//         const simplified = [path[0]];
//         simplifyDPStep(path, 0, last, sqTolerance, simplified);
//         simplified.push(path[last]);

//         return simplified;
//     };

//     return (
//         <div>
//             {loading && <LoadingSpinner message="도로 혼잡도 데이터를 불러오는 중입니다..." />}
//             {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
//             <div id="map" style={{
//                 width: '100%',
//                 height: '100vh'
//             }}>
//             </div>
//         </div>
//     );
// }

// export default RoadResultPage;

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
    const [polylines, setPolylines] = useState([]); // 폴리라인 상태 관리
    const selectedDateTime = useTrafficStore(state => state.selectedDateTime); // 선택한 날짜와 시간 가져오기
    const token = useStore(state => state.token); // 사용자 토큰 가져오기

    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
            center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
            level: 7 // 지도의 레벨(확대, 축소 정도)
        };

        const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
        setMap(kakaoMap); // map 상태 설정

        // 지도 이동 및 확대/축소 이벤트 리스너 추가
        kakao.maps.event.addListener(kakaoMap, 'bounds_changed', () => {
            updatePolylinesVisibility(kakaoMap); // 지도가 변경될 때 폴리라인 가시성 업데이트
        });
        kakao.maps.event.addListener(kakaoMap, 'zoom_changed', () => {
            updatePolylinesByZoomLevel(kakaoMap.getLevel()); // 줌 레벨 변경 시 폴리라인 업데이트
        });
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
            updatePolylinesByZoomLevel(map.getLevel()); // 초기 로딩 시 폴리라인 필터링
        }
    }, [map, trafficData]);

    // 줌 레벨에 따라 폴리라인을 필터링하는 함수
    const filterTrafficDataByZoomLevel = (zoomLevel) => {
        if (zoomLevel >= 11) {
            return trafficData.filter((_, index) => index % 11 === 0); // 11개마다 하나씩 표시
        } else if (zoomLevel >= 10) {
            return trafficData.filter((_, index) => index % 9 === 0); // 9개마다 하나씩 표시
        } else if (zoomLevel >= 9) {
            return trafficData.filter((_, index) => index % 7 === 0); // 7개마다 하나씩 표시
        } else {
            return trafficData;
        }
    };

    // 줌 레벨 변경 시 필터링된 폴리라인을 업데이트하는 함수
    const updatePolylinesByZoomLevel = (zoomLevel) => {
        const filteredData = filterTrafficDataByZoomLevel(zoomLevel);
        
        const newPolylines = filteredData.map(road => {
            const simplifiedPath = simplifyPath(road.coordinates, 0.0001); // 단순화된 경로 생성
            const path = simplifiedPath.map(coord => new kakao.maps.LatLng(coord[1], coord[0]));
            const polyline = new kakao.maps.Polyline({
                path: path,
                strokeWeight: 5,
                strokeColor: getTrafficColor(road.trafficStatus),
                strokeOpacity: 0.7,
                strokeStyle: 'solid'
            });
            const bounds = new kakao.maps.LatLngBounds();
            path.forEach(point => bounds.extend(point));

            // 지도에 폴리라인 추가
            polyline.setMap(map);

            return { polyline, bounds };
        });

        // 기존 폴리라인을 제거하고 새로운 필터된 폴리라인 설정
        polylines.forEach(({ polyline }) => polyline.setMap(null)); // 기존 폴리라인 삭제
        setPolylines(newPolylines); // 새로운 폴리라인 상태 업데이트
    };

    const updatePolylinesVisibility = (map) => {
        if (!map) return;

        const bounds = map.getBounds();

        // 화면 내에 있는 폴리라인만 필터링
        const visiblePolylines = polylines.filter(({ polyline, bounds: polylineBounds }) => {
            const isVisible = (
                bounds.contain(polylineBounds.getSouthWest()) ||
                bounds.contain(polylineBounds.getNorthEast())
            );

            return isVisible;
        });

        // 화면 내에 있는 폴리라인만 지도에 추가
        polylines.forEach(({ polyline }) => polyline.setMap(null)); // 모든 폴리라인 숨기기
        visiblePolylines.forEach(({ polyline }) => polyline.setMap(map)); // 화면 내에 있는 폴리라인만 지도에 추가
    };

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

    // Douglas-Peucker 알고리즘을 사용하여 경로 단순화
    const simplifyPath = (path, tolerance) => {
        if (path.length < 3) return path;

        const sqTolerance = tolerance * tolerance;

        const simplifyDPStep = (points, first, last, sqTolerance, simplified) => {
            let maxSqDist = sqTolerance;
            let index = -1;

            for (let i = first + 1; i < last; i++) {
                const sqDist = getSqSegDist(points[i], points[first], points[last]);

                if (sqDist > maxSqDist) {
                    index = i;
                    maxSqDist = sqDist;
                }
            }

            if (maxSqDist > sqTolerance) {
                if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
                simplified.push(points[index]);
                if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
            }
        };

        const getSqSegDist = (p, p1, p2) => {
            let x = p1[0];
            let y = p1[1];
            let dx = p2[0] - x;
            let dy = p2[1] - y;

            if (dx !== 0 || dy !== 0) {
                const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

                if (t > 1) {
                    x = p2[0];
                    y = p2[1];
                } else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }

            dx = p[0] - x;
            dy = p[1] - y;

            return dx * dx + dy * dy;
        };

        const last = path.length - 1;
        const simplified = [path[0]];
        simplifyDPStep(path, 0, last, sqTolerance, simplified);
        simplified.push(path[last]);

        return simplified;
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
