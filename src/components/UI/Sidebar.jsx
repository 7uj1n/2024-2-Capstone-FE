import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'; // useState와 useEffect를 가져옵니다.
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import { useNavigate } from "react-router-dom"; // useNavigate 훅 가져오기

import DateTime from './DateTime';
import PathResults from './PathResults'; // PathResults 컴포넌트 가져오기

import Nav from 'react-bootstrap/Nav';
import CustomModal from './CustomModal'; // CustomModal 컴포넌트 가져오기
import './sidebar.css';

function Sidebar() {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(null); // 현재 활성화된 링크 상태 관리
    const selectedRegion = useStore((state) => state.selectedRegion); // Zustand 스토어에서 상태 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        // 현재 경로에 따라 초기 활성화된 링크 설정
        if (location.pathname === '/path') {
            setActiveLink('path');
        } else if (location.pathname === '/road') {
            setActiveLink('road');
        } else if (location.pathname === '/result') {
            setActiveLink('result');
        }
    }, [location.pathname]);

    function handleLinkClick(link) {
        setActiveLink(link); // 클릭한 링크를 상태로 설정
    };

    const handlePathSearch = (startDate) => {
        if (!selectedRegion) {
            setModalContent("지역을 선택해 주세요."); // 선택한 지역이 없을 경우 모달 내용 설정
            setShowModal(true); // 모달 표시
        } else {
            navigate("/result"); // ResultPage로 이동
        }
    };

    const handleRoadSearch = (startDate) => {
        navigate("/road-result"); // RoadResultPage로 이동
    };

    const handleRouteClick = (routeId) => {
        // 해당 경로만 보이게 하기
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Nav defaultActiveKey="/home" className="flex-column sidebar">
                <h3 className='menu-title'>메뉴</h3>
                <hr />

                <NavLink
                    to="/road"
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}   //클릭시 색 변경
                    onClick={() => handleLinkClick('road')} // 클릭 시 상태 업데이트
                >
                    도로 혼잡도
                </NavLink>
                <div className={`content ${activeLink === 'road' ? 'open' : ''}`}>
                    {activeLink === 'road' && <DateTime onSearch={handleRoadSearch} />} {/* 활성화된 링크에 따라 텍스트 표시 */}
                </div>
                <hr />

                <NavLink
                    to='/path'
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}   //클릭시 색 변경
                    onClick={() => handleLinkClick('path')} // 클릭 시 상태 업데이트
                >
                    경로 찾기
                </NavLink>
                <hr />
                <div className={`content ${activeLink === 'path' || activeLink === 'result' ? 'open' : ''}`}>  {/*클릭된 상태면 내용 보여줌 */}
                    {activeLink === 'path' && (
                        <div>
                            <p>{selectedRegion ? `선택한 지역: ${selectedRegion}` : '지역을 선택해주세요!'}</p>
                            <DateTime onSearch={handlePathSearch} />
                        </div>
                    )}  {/*활성화된 링크에 따라 텍스트 표시*/}

                    {activeLink === 'result' && selectedRegion && (
                        <PathResults selectedRegion={selectedRegion} onRouteClick={handleRouteClick} />
                    )}
                </div>
                <hr />
            </Nav>

            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleCloseModal}
                title="알림"
                body={modalContent}
                confirmText="확인"
                cancelText=""
            />
        </>
    );
}

export default Sidebar;