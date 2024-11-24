import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useNavigate } from 'react-router-dom';
import useStore from '../../store/UserStore';
import useRegionStore from '../../store/RegionStore';
import CustomModal from './CustomModal';
import './header.css'; // 커스텀 CSS 파일 추가

function Header() {
    const navigate = useNavigate();
    const token = useStore((state) => state.token);
    const username = useStore((state) => state.username);
    const clearAuth = useStore((state) => state.clearAuth);
    const clearRegionSelection = useRegionStore((state) => state.clearRegionSelection);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        // 로컬 스토리지에서 토큰과 만료 시간 제거
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('username');

        // Zustand 스토어에서 사용자 정보 및 지역 선택 상태 제거
        clearAuth();
        clearRegionSelection();

        // 로그아웃 후 로그인 페이지로 이동
        navigate('/login');
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleCloseLogoutModal = () => {
        setShowLogoutModal(false);
    };

    const handleConfirmLogout = () => {
        handleLogout();
        setShowLogoutModal(false);
    };

    return (
        <>
            <Navbar fixed="top" expand="lg" className="navbar navbar-expand-lg bg-danger">
                <Container fluid>   {/*좌우 끝으로 가게*/}
                    <Navbar.Brand href="/" className='ml-0 text-white' style={{ fontWeight: 'bold' }}>✈️ 인천공항 경로 찾기</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav className="mr-auto">
                            <Nav.Link as={NavLink} to="/road" className="custom-nav-link">경로 찾기</Nav.Link>
                        </Nav>
                        {token ? (
                            <NavDropdown title={`${username}님`} id="basic-nav-dropdown" className="custom-dropdown">
                                <NavDropdown.Item as={NavLink} to="/mypage" className="custom-dropdown-item">마이페이지</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogoutClick} className="custom-dropdown-item">로그아웃</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link as={NavLink} to="/login" className="custom-nav-link" style={{padding: "8px"}}>로그인</Nav.Link>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <CustomModal
                show={showLogoutModal}
                handleClose={handleCloseLogoutModal}
                handleConfirm={handleConfirmLogout}
                title="로그아웃"
                body="정말 로그아웃 하시겠습니까?"
                confirmText="확인"
                cancelText="취소"
            />
        </>
    );
}

export default Header;