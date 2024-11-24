import ctp from '../data/ctprvn_WGS84.json';
import sig from '../data/sig_WGS84.json';
import emd from '../data/emd_WGS84.json';

import './customoverlay.css';
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import { useRef, useState, useEffect } from 'react';
import CustomModal from '../UI/CustomModal'; // CustomModal 컴포넌트 가져오기

const { kakao } = window;

function Polygon({ map }) {
    let data = ctp.features; // 초기 데이터
    let detailMode = false;
    let sebuDetail = false;
    let polygons = []; // 폴리곤 저장 배열

    const customOverlay = new kakao.maps.CustomOverlay({}); //지역명 오버레이 생성
    const infoWindowRef = useRef(null); // 현재 열려 있는 커스텀 오버레이 참조 관리

    const setSelectedRegion = useStore((state) => state.setSelectedRegion); // Zustand 스토어에서 상태 업데이트 함수 가져오기

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        init(); // 초기 폴리곤 생성

        kakao.maps.event.addListener(map, 'zoom_changed', function () {
            const level = map.getLevel();

            if (!detailMode && !sebuDetail && level <= 10) {    //시구->시군구
                if (level <= 7) {
                    detailMode = true;
                    sebuDetail = true;
                    removePolygon();
                    data = emd.features; // 법정동 행정구역 데이터
                    init();
                } else {
                    detailMode = true;
                    sebuDetail = false;
                    removePolygon();
                    data = sig.features; // 시군구 데이터
                    init();
                }
            } else if (detailMode && !sebuDetail && level > 10) {  //시군구->시구
                detailMode = false;
                sebuDetail = false;
                removePolygon();
                data = ctp.features; //시구 행정구역 데이터
                init();
            }
            else if (detailMode && !sebuDetail && level <= 7) { //시군구->법정동
                sebuDetail = true;
                removePolygon();
                data = emd.features; // 시군구 데이터
                init();
            }
            else if (detailMode && sebuDetail && level > 7) {    //법정동->시군구
                if (level > 10) {
                    detailMode = false;
                    sebuDetail = false;
                    removePolygon();
                    data = ctp.features; // 시구 행정구역 데이터
                    init();
                } else {
                    sebuDetail = false;
                    removePolygon();
                    data = sig.features; // 기본 행정구역 데이터
                    init();
                }
            }
        });

        // 전역 함수로 setSelectedRegion 설정
        window.setSelectedRegion = setSelectedRegion;
        window.showRegionSelectedModal = (name) => {
            setModalContent(`선택한 지역: ${name}`);
            setShowModal(true);
        };

        return () => {
            kakao.maps.event.removeListener(map, 'zoom_changed');
            removePolygon();
        };
    }, [map]);

    function createPolygon(path, name, cd) {
        const polygon = new kakao.maps.Polygon({
            map: map,
            path: path,
            strokeWeight: 2,
            strokeColor: '#004c80', //파란색
            strokeOpacity: 0.8,
            fillColor: '#fff',
            fillOpacity: 0.5,   //불투명도
        });

        polygons.push(polygon);

        // 마우스 이벤트 등록
        kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
            polygon.setOptions({ fillColor: '#09f' });
            customOverlay.setContent('<div class="area">' + name + '</div>');
            customOverlay.setPosition(mouseEvent.latLng);
            customOverlay.setMap(map);
        });

        kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
            customOverlay.setPosition(mouseEvent.latLng);
        });

        kakao.maps.event.addListener(polygon, 'mouseout', function () {
            polygon.setOptions({ fillColor: '#fff' });
            customOverlay.setMap(null);
        });

        kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
            let latlng = mouseEvent.latLng;
            if (!detailMode && !sebuDetail) {   //시구 폴리곤
                map.setLevel(9); // 클릭 시 레벨 변경
                latlng = mouseEvent.latLng;
                // 지도의 중심을 클릭한 위치로 이동
                map.panTo(latlng);
            } else if (detailMode && !sebuDetail) { //시군구 폴리곤
                map.setLevel(6);
                latlng = mouseEvent.latLng;
                // 지도의 중심을 클릭한 위치로 이동
                map.panTo(latlng);
            }
            else if (detailMode && sebuDetail) {    //법정동 폴리곤
                // 클릭 시 커스텀 오버레이 띄우고 선택 버튼 만들기. 
                if (infoWindowRef.current) {
                    infoWindowRef.current.setMap(null);
                }

                const overlayContent = document.createElement('div');
                overlayContent.className = 'custom-infowindow';
                overlayContent.innerHTML = `
                    <div class="infowindow-content">
                        <strong>${name}</strong>
                        <br />
                        <button class="infowindow-select" onclick="window.setSelectedRegion('${name}', '${cd}'); window.showRegionSelectedModal('${name}');">선택하기</button>
                    </div>
                    <button class="infowindow-close">X</button>
                `;

                const customOverlay = new kakao.maps.CustomOverlay({
                    position: latlng,
                    content: overlayContent,
                    yAnchor: 1.5
                });

                // 닫기 버튼 이벤트 추가
                overlayContent.querySelector('.infowindow-close').addEventListener('click', () => {
                    customOverlay.setMap(null);
                });

                customOverlay.setMap(map);
                infoWindowRef.current = customOverlay;
            }
        });
    };

    function displayArea(geometry, name, cd) {
        const { type, coordinates } = geometry;

        if (type === "MultiPolygon") {
            coordinates.forEach(polygon => {
                const path = polygon[0].map(coordinate => new kakao.maps.LatLng(coordinate[1], coordinate[0]));
                createPolygon(path, name, cd);
            });
        } else if (type === "Polygon") {
            const path = coordinates[0].map(coordinate => new kakao.maps.LatLng(coordinate[1], coordinate[0]));
            createPolygon(path, name, cd);
        }
    };

    function init() {
        data.forEach((val) => {
            if (val.geometry) {
                const geometry = val.geometry;
                const name = val.properties.CTP_KOR_NM || val.properties.SIG_KOR_NM || val.properties.EMD_KOR_NM;

                let cd = val.properties.CTP_CD || val.properties.SIG_CD || val.properties.EMD_CD;   //법정동 코드
                displayArea(geometry, name, cd);
            }
        });
    };

    function removePolygon() {
        polygons.forEach(polygon => {
            polygon.setMap(null);
        });
        polygons = []; // 폴리곤 배열 초기화
    };

    return (
        <>
            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmModal}
                title="알림"
                body={modalContent}
                confirmText="확인"
                cancelText=""
            />
        </>
    );
}

export default Polygon;