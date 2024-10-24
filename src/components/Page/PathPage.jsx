// import { useState, useEffect } from "react";
// import Polygon from "../MapFunction/Polygon.jsx"; // Polygon 컴포넌트 추가
// import SearchBar from "../MapFunction/SearchBar.jsx"; // SearchBar 컴포넌트 추가
// import useStore from "../../store/RegionStore.js";
// const { kakao } = window;

// export default function PathPage() {
//     const [map, setMap] = useState(null); // map 상태 관리


//     useEffect(() => {
//         const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
//         const options = {
//             center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
//             level: 10 // 지도의 레벨(확대, 축소 정도)
//         };

//         const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
//         setMap(kakaoMap);
//     }, []);

//     return (
//         <div>
//             {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
//             <div id="map" style={{
//                 width: '100%',
//                 height: '100vh'
//             }}>
//                 {map && <Polygon map={map} />} {/* map이 존재할 때만 Polygon 컴포넌트 렌더링 */}
//             </div>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import Polygon from "../MapFunction/Polygon.jsx"; // Polygon 컴포넌트 추가
import SearchBar from "../MapFunction/SearchBar.jsx"; // SearchBar 컴포넌트 추가
import useStore from "../../store/RegionStore.js";
const { kakao } = window;

export default function PathPage() {
    const [map, setMap] = useState(null); // map 상태 관리
    const isPolygon = useStore(state => state.isPolygon); // 폴리곤 표시 여부 상태 가져오기

    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스

        const options = {
            center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
            level: 10 // 지도의 레벨(확대, 축소 정도)
        };

        const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
        setMap(kakaoMap);
    }, []);

    return (
        <div>
            {map && <SearchBar map={map} />} {/* map이 존재할 때만 SearchBar 컴포넌트 렌더링 */}
            <div id="map" style={{
                width: '100%',
                height: '100vh'
            }}>
                {map && <Polygon map={map} />} {/* map이 존재하고 isPolygon이 true일 때만 Polygon 컴포넌트 렌더링 */}
            </div>
        </div>
    );
}