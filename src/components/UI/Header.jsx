import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';


function Header() {
    return (
        <Navbar fixed="top" expand="lg" className="navbar navbar-expand-lg bg-danger" >
            <Container fluid>   {/*좌우 끝으로 가게*/}
                <Navbar.Brand href="/" className='ml-0 text-white' style={{ fontWeight: 'bold' }}>✈️ 인천공항 경로 찾기</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                        <div style={{float: 'left'}}>
                            {/* <NavLink to="/" style={{ color: 'black' }}>로그아웃</NavLink> */}
                        </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;