import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import CustomModal from '../UI/CustomModal';
import './searchPlaces.css';

const { kakao } = window;

function SearchBar({ map }) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {   //검색창 외부 클릭 시 포커스 해제
        const handleClickOutside = (event) => {
            const keywordInput = document.getElementById('keyword');
            if (keywordInput && !keywordInput.contains(event.target)) {
                keywordInput.blur();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const searchPlaces = () => {    //장소 검색 함수
        const keyword = document.getElementById('keyword').value;

        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            setModalContent('키워드를 입력해주세요!');
            setShowModal(true);
            return false;
        }

        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(keyword, placesSearchCB);
    };

    const placesSearchCB = (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
            const bounds = new kakao.maps.LatLngBounds();
            for (let i = 0; i < data.length; i++) {
                bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }
            map.setBounds(bounds);
            const keywordInput = document.getElementById('keyword');
            keywordInput.value = ''; // 검색 완료 후 입력 필드 초기화
            keywordInput.blur(); // 검색 완료 후 입력 필드 포커스 제거
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            setModalContent('검색 결과가 존재하지 않습니다.');
            setShowModal(true);
        } else if (status === kakao.maps.services.Status.ERROR) {
            setModalContent('검색 결과 중 오류가 발생했습니다.');
            setShowModal(true);
        }
    };

    const handleKeyPress = (event) => {  //엔터키 입력 시 검색
        if (event.key === 'Enter') {
            searchPlaces();
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="search-container">
            <input
                type="text"
                id="keyword"
                placeholder="행정구역을 입력하세요"
                onKeyPress={handleKeyPress} //엔터키 입력 시 검색
            />
            <Button style={{margin: 0}} variant="dark" onClick={searchPlaces}>검색</Button>

            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleCloseModal}
                title="알림"
                body={modalContent}
                confirmText="확인"
                cancelText=""
            />
        </div>
    );
};

export default SearchBar;