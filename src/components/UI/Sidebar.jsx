import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'; // useState와 useEffect를 가져옵니다.

import DateTime from './DateTime';

import Nav from 'react-bootstrap/Nav';
import './Sidebar.css';

function Sidebar() {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(null); // 현재 활성화된 링크 상태 관리

    useEffect(() => {
        // 현재 경로에 따라 초기 활성화된 링크 설정
        if (location.pathname === '/path') {
            setActiveLink('path');
        } else if (location.pathname === '/road') {
            setActiveLink('road');
        }
    }, [location.pathname]);    

    function handleLinkClick(link){
        setActiveLink(link); // 클릭한 링크를 상태로 설정
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
                    {activeLink === 'road' && <DateTime />} {/* 활성화된 링크에 따라 텍스트 표시 */}
                </div>
                <hr />

                <NavLink
                    to='/path'
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}   //클릭시 색 변경
                    onClick={() => handleLinkClick('path')} // 클릭 시 상태 업데이트
                >
                    최적 경로 찾기
                </NavLink>
                <div className={`content ${activeLink === 'path' ? 'open' : ''}`}>  {/*클릭된 상태면 내용 보여줌 */}
                    {activeLink === 'path' && <DateTime />}  {/*활성화된 링크에 따라 텍스트 표시*/}
                </div>
                <hr />
            </Nav>
        </>
    );
}

export default Sidebar;