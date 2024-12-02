import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language"; // MapboxLanguage 임포트

function RoadPage() {
    const [map, setMap] = useState(null); // map 상태 관리
    const mapContainerRef = useRef(null); // Mapbox 지도 컨테이너

    useEffect(() => {
        // Mapbox Access Token 설정
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        // 지도 초기화
        const mapboxMap = new mapboxgl.Map({
            container: mapContainerRef.current, // 지도 컨테이너 요소
            style: "mapbox://styles/mapbox/streets-v11", // Mapbox 스타일 URL
            center: [126.9780, 37.5665], // 초기 중심 좌표 (서울)
            zoom: 11, // 초기 줌 레벨
        });

        // MapboxLanguage 객체를 map.addControl로 추가
        const language = new MapboxLanguage();
        mapboxMap.addControl(language); // MapboxLanguage 추가

        setMap(mapboxMap); // map 상태 설정

        return () => {
            mapboxMap.remove(); // 컴포넌트 언마운트 시 지도 제거
        };
    }, []);

    return (
        <div
            style={{
                height: "100vh", // 페이지 높이를 100%로 설정
                margin: 0, // 기본 여백 제거
                padding: 0, // 기본 패딩 제거
                overflow: "hidden", // 페이지에 스크롤이 생기지 않도록 설정
            }}
        >
            <div
                ref={mapContainerRef}
                style={{
                    width: "100%",
                    height: "100%", // 지도 컨테이너가 전체 화면을 차지하도록 설정
                    overflow: "hidden", // 지도 내부에서도 스크롤이 생기지 않도록 설정
                }}
            ></div>
        </div>
    );
}

export default RoadPage;
