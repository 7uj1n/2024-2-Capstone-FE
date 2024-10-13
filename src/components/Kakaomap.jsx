import { useState, useEffect } from "react";
import Polygon from "./Polygon";

const { kakao } = window;

export default function KakaoMap() {
    const [map, setMap] = useState(null); // map 상태 관리

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
        <div id="map" style={{
            width: '100%',
            height: '100vh'
        }}>
            {map && <Polygon map={map} />} {/* map이 존재할 때만 Polygon 컴포넌트 렌더링 */}
        </div>
    );
}

// // 중심을 계산하는 함수(지역명 가운데 둘때 사용)
// function findCentroid(points) {
//     let i, j, len, p1, p2, f, area, x, y;
//     area = x = y = 0;

//     for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
//         p1 = points[i];
//         p2 = points[j];

//         f = p1.getLat() * p2.getLng() - p2.getLat() * p1.getLng();
//         x += (p1.getLng() + p2.getLng()) * f;
//         y += (p1.getLat() + p2.getLat()) * f;
//         area += f * 3;
//     }

//     return [x / area, y / area];
// }

// 폴리곤의 중앙을 계산
// const centroid = findCentroid(path);
// const position = new kakao.maps.LatLng(centroid[1], centroid[0]); // 중앙 위치 설정

// const content = `<div class="label" style="color:black; font-weight:bold;">${name}</div>`;
// const customOverlay = new kakao.maps.CustomOverlay({
//     position: position,
//     content: content,
//     zIndex: 1
// });
// customOverlay.setMap(map); // 중앙에 이름 표시

// const content = '<div class ="label" style ="color:black; font-weight:bold";><span class="left" ></span><span class="center">' + name + '</span><span class="right"></span></div>';
// //const position = polygon.getPath()[0];
// const customOverlay = new kakao.maps.CustomOverlay({
//     position: position,
//     cotent: content
// }); //이름 생성