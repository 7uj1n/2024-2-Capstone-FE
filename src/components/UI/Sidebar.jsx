import Nav from 'react-bootstrap/Nav';
import './Sidebar.css';
import Menu from './Menu';

function Sidebar() {
    return (
        <Nav defaultActiveKey="/home" className="flex-column sidebar">
            <h3 className='menu-title'>메뉴</h3>
            <hr />
            <Menu />
            {/* <Nav.Link eventKey="link-1">도로 혼잡도</Nav.Link>
            <hr />
            <Nav.Link eventKey="link-2">최적 경로 찾기</Nav.Link>
            <hr /> */}
        </Nav>
    );
}

export default Sidebar;