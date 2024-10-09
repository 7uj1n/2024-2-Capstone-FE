import ctp from '../data/ctprvn_WGS84.json';
import sig from '../data/sig_WGS84.json';
import emd from '../data/emd_WGS84.json';

import { useEffect, useState } from "react";

const { kakao } = window;

export default function Kakaomap() {

    useEffect(() => {   //한 번만 렌더링
        const data = ctp.features; // JSON 데이터
        const polygons = []; // 폴리곤 저장 배열

        const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
        const options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(37.458666, 126.4419679), //지도의 중심좌표. (인천공항)
            level: 12 //지도의 레벨(확대, 축소 정도)
        };

        const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴


        const displayArea = (geometry, name) => {   //폴리곤 생성
            const { type, coordinates } = geometry;

            if (type === "MultiPolygon") {
                // MultiPolygon 처리
                coordinates.forEach(polygon => { //(중첩 배열 처리)
                    const path = polygon[0].map(coordinate => new kakao.maps.LatLng(coordinate[1], coordinate[0]));
                    createPolygon(path, name);
                });
            } else if (type === "Polygon") {
                // Polygon 처리
                const path = coordinates[0].map(coordinate => new kakao.maps.LatLng(coordinate[1], coordinate[0]));
                createPolygon(path, name);
            }
        };

        const createPolygon = (path, name) => {
            const polygon = new kakao.maps.Polygon({    //폴리곤 설정
                map: map,
                path: path,
                strokeWeight: 2,
                strokeColor: '#004c80',
                strokeOpacity: 0.8,
                fillColor: '#fff',
                fillOpacity: 0.7,
            });

            polygons.push(polygon);


        };

        // 각 행정구역에 대해 폴리곤 생성
        data.forEach((val) => {
            if (val.geometry) { //geometry 값이 있을 경우만
                const geometry = val.geometry;
                const name = val.properties.CTP_KOR_NM;
                displayArea(geometry, name);
            }
        });

    }, []);

    return (
        <div id="map"></div>
    );
}