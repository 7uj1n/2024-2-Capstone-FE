import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import './header.css'; // 커스텀 CSS 파일 추가

function Header() {
    return (
        <Navbar fixed="top" expand="lg" className="navbar navbar-expand-lg bg-danger">
            <Container fluid>   {/*좌우 끝으로 가게*/}
                <Navbar.Brand href="/" className='ml-0 text-white' style={{ fontWeight: 'bold' }}>✈️ 인천공항 경로 찾기</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="mr-auto">
                        <Nav.Link as={NavLink} to="/road" className="custom-nav-link">경로 찾기</Nav.Link>
                    </Nav>
                    <NavDropdown title="로그인" id="basic-nav-dropdown" className="custom-dropdown">
                        <NavDropdown.Item as={NavLink} to="/mypage" className="custom-dropdown-item">마이페이지</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/logout" className="custom-dropdown-item">로그아웃</NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;