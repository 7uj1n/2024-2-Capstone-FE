const { kakao } = window;
import { useEffect } from "react";

function RoadPage() {

    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
            center: new kakao.maps.LatLng(37.458666, 126.4419679), // 지도의 중심좌표 (인천공항)
            level: 10 // 지도의 레벨(확대, 축소 정도)
        };

        const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
    }, []);

    return (
        <div id="map" style={{
            width: '100%',
            height: '100vh'
        }}>
        </div>
    );
}

export default RoadPage;