import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Deck } from "@deck.gl/core";
import { PathLayer } from "@deck.gl/layers";
import mapboxgl from "mapbox-gl"; // Mapbox GL JS
import MapboxLanguage from "@mapbox/mapbox-gl-language"; // MapboxLanguage 임포트
import useTrafficStore from "../../store/TrafficStore";
import useStore from "../../store/UserStore";
import axios from "axios";
import LoadingSpinner from "../UI/LoadingSpinner";

// Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function RoadResultPage() {
    const mapContainerRef = useRef(null); // Mapbox 지도 컨테이너 참조
    const deckRef = useRef(null); // Deck.gl 참조
    const mapRef = useRef(null); // Mapbox 지도 인스턴스 참조
    const [detailMode, setDetailMode] = useState(false); // 디테일 모드 기본 값 false
    const selectedDateTime = useTrafficStore((state) => state.selectedDateTime);
    const token = useStore((state) => state.token);

    const fetchTrafficData = async () => {
        if (selectedDateTime && token) {
            const { date, time } = selectedDateTime;
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            const regions = [
                { num: 1, ranks: [101, 102, 103, 104, 105, 106, 107] },
                { num: 2, ranks: [101, 102, 103, 104, 105, 106] },
                { num: 3, ranks: [101, 102, 103, 104] },
            ];
            const requests = regions.flatMap((region) =>
                region.ranks.map((rank) =>
                    axios.get(`${apiUrl}/api/gcs/traffic/${region.num}/all/${rank}`, {
                        params: { date, hour: time },
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );
            const responses = await Promise.all(requests);
            return responses.flatMap((response) => response.data);
        }
        return [];
    };

    // 필터링된 데이터를 가져오는 함수
    const fetchFilteredData = async () => {
        if (selectedDateTime && token) {
            const { date, time } = selectedDateTime;
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            const regions = [
                { num: 1, ranks: [102, 103] }, // 경기도
                { num: 2, ranks: [102, 103, 104, 105, 106] }, // 인천
                { num: 3, ranks: [104] }, // 서울
            ];
            const requests = regions.flatMap((region) =>
                region.ranks.map((rank) =>
                    axios.get(`${apiUrl}/api/gcs/traffic/${region.num}/all/${rank}`, {
                        params: { date, hour: time },
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );
            const responses = await Promise.all(requests);
            return responses.flatMap((response) => response.data);
        }
        return [];
    };

    const { data: trafficData = [], isLoading } = useQuery(
        ["trafficData", selectedDateTime, token],
        fetchTrafficData,
        { enabled: !!selectedDateTime && !!token }
    );

    const { data: filteredTrafficData = [] } = useQuery(
        ["filteredTrafficData", selectedDateTime, token],
        fetchFilteredData,
        { enabled: !!selectedDateTime && !!token }
    );

    useEffect(() => {
        // Mapbox 지도 생성
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12", // 기본 스타일 사용
            center: [126.4419679, 37.458666], // 초기 중심 좌표(인천공항)
            zoom: 11,
        });
        mapRef.current = map;

        // onRender 이벤트를 통해 MapboxLanguage 플러그인 추가
        map.on('render', function(e) { 
            e.target.addControl(new MapboxLanguage({ defaultLanguage: 'ko' })); 
        });

        // Deck.gl 초기화
        const deck = new Deck({
            canvas: "deck-canvas",
            initialViewState: {
                longitude: 126.4419679,
                latitude: 37.458666,
                zoom: 11,
                pitch: 0,
                bearing: 0,
            },
            controller: true,
            layers: [],
            onViewStateChange: ({ viewState }) => {
                map.jumpTo({
                    center: [viewState.longitude, viewState.latitude],
                    zoom: viewState.zoom,
                    bearing: viewState.bearing,
                    pitch: viewState.pitch,
                });
            },
        });
        deckRef.current = deck;

        // Mapbox와 Deck.gl의 캔버스 연결
        map.on("move", () => {
            const center = map.getCenter();
            deck.setProps({
                viewState: {
                    longitude: center.lng,
                    latitude: center.lat,
                    zoom: map.getZoom(),
                    bearing: map.getBearing(),
                    pitch: map.getPitch(),
                },
            });
        });

        // 줌 변경에 따른 디테일 모드 상태 업데이트
        map.on("zoom", () => {
            const zoomLevel = map.getZoom();
            setDetailMode(zoomLevel >= 12); // 줌 레벨에 따라 디테일 모드 변경
        });

        return () => {
            map.remove(); // Mapbox 메모리 해제
            deck.finalize(); // Deck.gl 메모리 해제
        };
    }, []); // onRender를 의존성에서 제외하여 처음 한 번만 실행

    useEffect(() => {
        if (deckRef.current && trafficData.length > 0) {
            const map = mapRef.current;

            if (map) {
                const zoom = map.getZoom();

                // 줌 레벨에 따라 데이터 필터링
                const filteredData = detailMode
                    ? trafficData // 디테일 모드일 때는 모든 도로 데이터를 표시
                    : filteredTrafficData; // 디테일 모드가 아니면 필터링된 데이터만 표시

                console.log('필터된 데이터: ', filteredData);
                console.log('모든 데이터 :', trafficData);

                // Deck.gl 레이어 업데이트
                const layers = [
                    new PathLayer({
                        id: "traffic-path-layer",
                        data: filteredData,
                        getPath: (road) => road.coordinates.map((coord) => [coord[0], coord[1]]),
                        getColor: (road) => {
                            switch (road.trafficStatus) {
                                case "원활":
                                    return [0, 204, 0]; // 연두에 투명도 추가
                                case "서행":
                                    return [255, 255, 0]; // Yellow with transparency
                                case "정체":
                                    return [255, 0, 0]; // Red with transparency
                                default:
                                    return [0, 0, 0]; // Black with transparency
                            }
                        },
                        widthMinPixels: 3,
                    }),
                ];

                // Deck.gl 레이어를 직접 업데이트
                deckRef.current.setProps({ layers });
            }
        }
    }, [trafficData, filteredTrafficData, detailMode]);

    return (
        <div
            style={{
                height: "100vh", // 페이지 높이를 100%로 설정
                margin: 0, // 기본 여백 제거
                padding: 0, // 기본 패딩 제거
                overflow: "hidden", // 페이지에 스크롤이 생기지 않도록 설정
            }}
        >
            {isLoading && <LoadingSpinner message="도로 혼잡도 데이터를 불러오는 중입니다..." />}
            <div
                ref={mapContainerRef}
                id="map"
                style={{
                    width: "100%",
                    height: "100%", // 지도 컨테이너가 전체 화면을 차지하도록 설정
                    position: "relative", // 상대 위치 설정
                    overflow: "hidden", // 지도 내부에서도 스크롤이 생기지 않도록 설정
                }}
            />
            <canvas
                id="deck-canvas"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
}

export default RoadResultPage;


// import { useEffect, useRef, useState } from "react";
// import { useQuery } from "react-query";
// import { Deck } from "@deck.gl/core";
// import { PathLayer } from "@deck.gl/layers";
// import mapboxgl from "mapbox-gl"; // Mapbox GL JS
// import MapboxLanguage from "@mapbox/mapbox-gl-language"; // MapboxLanguage 임포트
// import useTrafficStore from "../../store/TrafficStore";
// import useStore from "../../store/UserStore";
// import axios from "axios";
// import LoadingSpinner from "../UI/LoadingSpinner";

// // Mapbox access token
// mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// function RoadResultPage() {
//     const mapContainerRef = useRef(null); // Mapbox 지도 컨테이너 참조
//     const deckRef = useRef(null); // Deck.gl 참조
//     const mapRef = useRef(null); // Mapbox 지도 인스턴스 참조
//     const [detailMode, setDetailMode] = useState(false); // 디테일 모드 기본 값 false
//     const selectedDateTime = useTrafficStore((state) => state.selectedDateTime);
//     const token = useStore((state) => state.token);

//     const fetchTrafficData = async () => {
//         if (selectedDateTime && token) {
//             const { date, time } = selectedDateTime;
//             const apiUrl = import.meta.env.VITE_API_BASE_URL;
//             const regions = [
//                 { num: 1, ranks: [101, 102, 103, 104, 105, 106, 107] },
//                 { num: 2, ranks: [101, 102, 103, 104, 105, 106] },
//                 { num: 3, ranks: [101, 102, 103, 104] },
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

//     // 필터링된 데이터를 가져오는 함수
//     const fetchFilteredData = async () => {
//         if (selectedDateTime && token) {
//             const { date, time } = selectedDateTime;
//             const apiUrl = import.meta.env.VITE_API_BASE_URL;
//             const regions = [
//                 { num: 1, ranks: [102, 103] }, // 경기도
//                 { num: 2, ranks: [102, 103, 104, 105, 106] }, // 인천
//                 { num: 3, ranks: [104] }, // 서울
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

//     const { data: trafficData = [], isLoading } = useQuery(
//         ["trafficData", selectedDateTime, token],
//         fetchTrafficData,
//         {
//             enabled: !!selectedDateTime && !!token,
//             staleTime: 5 * 60 * 1000, // 5분 동안 캐싱
//         }
//     );

//     const { data: filteredTrafficData = [] } = useQuery(
//         ["filteredTrafficData", selectedDateTime, token],
//         fetchFilteredData,
//         { enabled: !!selectedDateTime && !!token }
//     );

//     useEffect(() => {
//         // Mapbox 지도 생성
//         const map = new mapboxgl.Map({
//             container: mapContainerRef.current,
//             style: "mapbox://styles/mapbox/streets-v12", // 기본 스타일 사용
//             center: [126.4419679, 37.458666], // 초기 중심 좌표(인천공항)
//             zoom: 11,
//         });
//         mapRef.current = map;

//         // onRender 이벤트를 통해 MapboxLanguage 플러그인 추가
//         map.on('render', function(e) { 
//             e.target.addControl(new MapboxLanguage({ defaultLanguage: 'ko' })); 
//         });

//         // Deck.gl 초기화
//         const deck = new Deck({
//             canvas: "deck-canvas",
//             initialViewState: {
//                 longitude: 126.4419679,
//                 latitude: 37.458666,
//                 zoom: 11,
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

//         // 줌 변경에 따른 디테일 모드 상태 업데이트
//         map.on("zoom", () => {
//             const zoomLevel = map.getZoom();
//             setDetailMode(zoomLevel >= 12); // 줌 레벨에 따라 디테일 모드 변경
//         });

//         return () => {
//             map.remove(); // Mapbox 메모리 해제
//             deck.finalize(); // Deck.gl 메모리 해제
//         };
//     }, []); // onRender를 의존성에서 제외하여 처음 한 번만 실행

//     useEffect(() => {
//         if (deckRef.current && trafficData.length > 0) {
//             const map = mapRef.current;

//             if (map) {
//                 const zoom = map.getZoom();

//                 // 줌 레벨에 따라 데이터 필터링
//                 const filteredData = detailMode
//                     ? trafficData // 디테일 모드일 때는 모든 도로 데이터를 표시
//                     : filteredTrafficData; // 디테일 모드가 아니면 필터링된 데이터만 표시

//                 console.log('필터된 데이터: ', filteredData);
//                 console.log('모든 데이터 :', trafficData);

//                 // Deck.gl 레이어 업데이트
//                 const layers = [
//                     new PathLayer({
//                         id: "traffic-path-layer",
//                         data: filteredData,
//                         getPath: (road) => road.coordinates.map((coord) => [coord[0], coord[1]]),
//                         getColor: (road) => {
//                             switch (road.trafficStatus) {
//                                 case "원활":
//                                     return [0, 204, 0]; // 연두에 투명도 추가
//                                 case "서행":
//                                     return [255, 255, 0]; // Yellow with transparency
//                                 case "정체":
//                                     return [255, 0, 0]; // Red with transparency
//                                 default:
//                                     return [0, 0, 0]; // Black with transparency
//                             }
//                         },
//                         widthMinPixels: 3,
//                     }),
//                 ];

//                 // Deck.gl 레이어를 직접 업데이트
//                 deckRef.current.setProps({ layers });
//             }
//         }
//     }, [trafficData, filteredTrafficData, detailMode]);

//     useEffect(() => {
//         const map = mapRef.current;
//         if (!map) return;
    
//         map.on("zoomend", () => {
//             const zoomLevel = map.getZoom();
//             setDetailMode(zoomLevel >= 12);
    
//             // 줌 레벨 변경 시 데이터 다시 로드
//             fetchTrafficData();
//         });
//     }, []);
    

//     return (
//         <div
//             style={{
//                 height: "100vh", // 페이지 높이를 100%로 설정
//                 margin: 0, // 기본 여백 제거
//                 padding: 0, // 기본 패딩 제거
//                 overflow: "hidden", // 페이지에 스크롤이 생기지 않도록 설정
//             }}
//         >
//             {isLoading && <LoadingSpinner message="도로 혼잡도 데이터를 불러오는 중입니다..." />}
//             <div
//                 ref={mapContainerRef}
//                 id="map"
//                 style={{
//                     width: "100%",
//                     height: "100%", // 지도 컨테이너가 전체 화면을 차지하도록 설정
//                     position: "relative", // 상대 위치 설정
//                     overflow: "hidden", // 지도 내부에서도 스크롤이 생기지 않도록 설정
//                 }}
//             />
//             <canvas
//                 id="deck-canvas"
//                 style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                 }}
//             />
//         </div>
//     );
// }

// export default RoadResultPage;