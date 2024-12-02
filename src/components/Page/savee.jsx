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
