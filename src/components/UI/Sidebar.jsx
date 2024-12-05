// import { NavLink, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react'; // useState와 useEffect를 가져옵니다.
// import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
// import useTimeStore from '../../store/TimeStore'; // Zustand 스토어 가져오기
// import { useNavigate } from "react-router-dom"; // useNavigate 훅 가져오기

// import DateTime from './DateTime';
// import PathResults from './PathResults'; // PathResults 컴포넌트 가져오기

// import Nav from 'react-bootstrap/Nav';
// import CustomModal from './CustomModal'; // CustomModal 컴포넌트 가져오기
// import './sidebar.css';

// function Sidebar() {
//     const location = useLocation();
//     const [activeLink, setActiveLink] = useState(null); // 현재 활성화된 링크 상태 관리
//     const selectedRegion = useStore((state) => state.selectedRegion); // Zustand 스토어에서 상태 가져오기
//     const navigate = useNavigate(); // useNavigate 훅 사용
//     const [showModal, setShowModal] = useState(false);
//     const [modalContent, setModalContent] = useState('');
//     const [currentTime, setCurrentTime] = useState(''); // 현재 시간을 관리하는 상태

//     useEffect(() => {
//         // 현재 경로에 따라 초기 활성화된 링크 설정
//         if (location.pathname === '/path') {
//             setActiveLink('path');
//         } else if (location.pathname === '/road' || location.pathname === '/road-result') {
//             setActiveLink('road');
//         } else if (location.pathname === '/path-result') {
//             setActiveLink('path-result');
//         } else if (location.pathname === '/airport-congestion') {
//             setActiveLink('airport');
//         }
//     }, [location.pathname]);

//     useEffect(() => {
//         if (activeLink === 'airport') {
//             // 현재 시간을 업데이트
//             const now = new Date();
//             const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
//             const hours = String(koreaTime.getHours()).padStart(2, '0');
//             const minutes = String(koreaTime.getMinutes()).padStart(2, '0');
//             setCurrentTime(`${hours}:${minutes}`);
//         }
//     }, [activeLink]);

//     function handleLinkClick(link) {
//         setActiveLink(link); // 클릭한 링크를 상태로 설정
//     };

//     const handlePathSearch = (startDate) => {
//         if (!selectedRegion) {
//             setModalContent("지역을 선택해 주세요."); // 선택한 지역이 없을 경우 모달 내용 설정
//             setShowModal(true); // 모달 표시
//         } else {
//             navigate("/path-result"); // PathResultPage로 이동
//         }
//     };

//     const handleRoadSearch = (startDate) => {
//         navigate("/road-result"); // RoadResultPage로 이동
//     };

//     const handleRouteClick = (routeId) => {
//         // 해당 경로만 보이게 하기
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     return (
//         <>
//             <Nav defaultActiveKey="/home" className="flex-column sidebar">
//                 <h3 className='menu-title'>메뉴</h3>
//                 <hr />

//                 <NavLink
//                     to="/road"
//                     className={({ isActive }) =>
//                         isActive || location.pathname.startsWith('/road') ? 'nav-link active' : 'nav-link'
//                     }
//                     onClick={() => handleLinkClick('road')}
//                 >
//                     도로 혼잡도
//                 </NavLink>
//                 <hr />
//                 <div className={`content ${activeLink === 'road' ? 'open' : ''}`}>
//                     {activeLink === 'road' && <DateTime onSearch={handleRoadSearch} showTimeSelect={true} type="traffic" />} {/* 활성화된 링크에 따라 텍스트 표시 */}
//                 </div>

//                 <hr />
//                 <NavLink
//                     to="/airport-congestion"
//                     className={({ isActive }) =>
//                         isActive || location.pathname.startsWith('/airport') ? 'nav-link active' : 'nav-link'
//                     }
//                     onClick={() => handleLinkClick('airport')}
//                 >
//                     공항 예상 혼잡도
//                 </NavLink>
//                 <hr />
//                 <div className={`content ${activeLink === 'airport' ? 'open' : ''}`}>
//                     {activeLink === 'airport' && (
//                         <div>
//                             <h5 style={{
//                                 border: '1px solid #ccc', // 얇은 테두리
//                                 borderRadius: '8px', // 모서리를 둥글게
//                                 backgroundColor: '#fff', // 배경색 흰색
//                                 padding: '1.1rem', // 내부 여백
//                                 display: 'inline-block' // 인라인 블록 요소로 설정
//                             }}>
//                                 현재 시간: 2024-08-17 {currentTime}</h5> {/* 날짜는 고정, 시간은 현재 한국 시간 */}
//                         </div>
//                     )}
//                 </div>
//                 <hr />


//                 <NavLink
//                     to='/path'
//                     className={({ isActive }) => isActive || location.pathname.startsWith('/path') ? 'nav-link active' : 'nav-link'}   //클릭시 색 변경
//                     onClick={() => handleLinkClick('path')} // 클릭 시 상태 업데이트
//                 >
//                     경로 찾기
//                 </NavLink>
//                 <hr />
//                 <div className={`content ${activeLink === 'path' || activeLink === 'path-result' ? 'open' : ''}`}>  {/*클릭된 상태면 내용 보여줌 */}
//                     {activeLink === 'path' && (
//                         <div>
//                             <p>{selectedRegion ? `선택한 지역: ${selectedRegion}` : '지역을 선택해주세요!'}</p>
//                             <DateTime onSearch={handlePathSearch} showTimeSelect={false} type="region" />
//                         </div>
//                     )}  {/*활성화된 링크에 따라 텍스트 표시*/}

//                     {activeLink === 'path-result' && selectedRegion && (
//                         <PathResults selectedRegion={selectedRegion} onRouteClick={handleRouteClick} />
//                     )}
//                 </div>
//                 <hr />
//             </Nav>

//             <CustomModal
//                 show={showModal}
//                 handleClose={handleCloseModal}
//                 handleConfirm={handleCloseModal}
//                 title="알림"
//                 body={modalContent}
//                 confirmText="확인"
//                 cancelText=""
//             />
//         </>
//     );
// }

// export default Sidebar;

import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'; // useState와 useEffect를 가져옵니다.
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import useTimeStore from '../../store/TimeStore'; // 새로운 Zustand 스토어 가져오기
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
    const setCurrentTime = useTimeStore((state) => state.setCurrentTime); // 새로운 Zustand 스토어에서 상태 업데이트 함수 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [currentTime, setLocalCurrentTime] = useState(''); // 현재 시간을 관리하는 상태

    useEffect(() => {
        // 현재 경로에 따라 초기 활성화된 링크 설정
        if (location.pathname === '/path') {
            setActiveLink('path');
        } else if (location.pathname === '/road' || location.pathname === '/road-result') {
            setActiveLink('road');
        } else if (location.pathname === '/path-result') {
            setActiveLink('path-result');
        } else if (location.pathname === '/airport-congestion') {
            setActiveLink('airport');
        }
    }, [location.pathname]);

    useEffect(() => {
        if (activeLink === 'airport') {
            // 현재 시간을 업데이트
            const now = new Date();
            const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
            const hours = String(koreaTime.getHours()).padStart(2, '0');
            const minutes = String(koreaTime.getMinutes()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            setLocalCurrentTime(formattedTime);
            setCurrentTime(formattedTime); // 새로운 Zustand 스토어에 현재 시간 설정
        }
    }, [activeLink, setCurrentTime]);

    function handleLinkClick(link) {
        setActiveLink(link); // 클릭한 링크를 상태로 설정
    };

    const handlePathSearch = (startDate) => {
        if (!selectedRegion) {
            setModalContent("지역을 선택해 주세요."); // 선택한 지역이 없을 경우 모달 내용 설정
            setShowModal(true); // 모달 표시
        } else {
            navigate("/path-result"); // PathResultPage로 이동
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
                    className={({ isActive }) =>
                        isActive || location.pathname.startsWith('/road') ? 'nav-link active' : 'nav-link'
                    }
                    onClick={() => handleLinkClick('road')}
                >
                    도로 혼잡도
                </NavLink>
                <hr />
                <div className={`content ${activeLink === 'road' ? 'open' : ''}`}>
                    {activeLink === 'road' && <DateTime onSearch={handleRoadSearch} showTimeSelect={true} type="traffic" />} {/* 활성화된 링크에 따라 텍스트 표시 */}
                </div>

                <hr />
                <NavLink
                    to="/airport-congestion"
                    className={({ isActive }) =>
                        isActive || location.pathname.startsWith('/airport') ? 'nav-link active' : 'nav-link'
                    }
                    onClick={() => handleLinkClick('airport')}
                >
                    공항 예상 혼잡도
                </NavLink>
                <hr />
                <div className={`content ${activeLink === 'airport' ? 'open' : ''}`}>
                    {activeLink === 'airport' && (
                        <div>
                            <h5 style={{
                                border: '1px solid #ccc', // 얇은 테두리
                                borderRadius: '8px', // 모서리를 둥글게
                                backgroundColor: '#fff', // 배경색 흰색
                                padding: '1.1rem', // 내부 여백
                                display: 'inline-block' // 인라인 블록 요소로 설정
                            }}>
                                현재 시간: 2024-08-17 {currentTime}</h5> {/* 날짜는 고정, 시간은 현재 한국 시간 */}
                        </div>
                    )}
                </div>
                <hr />

                
                <hr />
                <NavLink
                    to='/path'
                    className={({ isActive }) => isActive || location.pathname.startsWith('/path') ? 'nav-link active' : 'nav-link'}   //클릭시 색 변경
                    onClick={() => handleLinkClick('path')} // 클릭 시 상태 업데이트
                >
                    경로 찾기
                </NavLink>
                <hr />
                <div className={`content ${activeLink === 'path' || activeLink === 'path-result' ? 'open' : ''}`}>  {/*클릭된 상태면 내용 보여줌 */}
                    {activeLink === 'path' && (
                        <div>
                            <p>{selectedRegion ? `선택한 지역: ${selectedRegion}` : '지역을 선택해주세요!'}</p>
                            <DateTime onSearch={handlePathSearch} showTimeSelect={false} type="region" />
                        </div>
                    )}  {/*활성화된 링크에 따라 텍스트 표시*/}

                    {activeLink === 'path-result' && selectedRegion && (
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