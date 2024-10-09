import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


function Header() {
    return (
        <Navbar fixed="top" expand="lg" className="navbar navbar-expand-lg bg-danger" >
            <Container fluid>
                <Navbar.Brand href="/" className='ml-0 text-white' style={{ fontWeight: 'bold' }}>✈️ 인천공항 경로 찾기</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default Header;