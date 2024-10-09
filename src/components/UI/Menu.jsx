import Accordion from 'react-bootstrap/Accordion';

function Menu() {
    return (
        <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header style={{ padding: '5px' }}>경로 찾기</Accordion.Header>
                <Accordion.Body>
                    달력(년/월/시간) 검색버튼
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header style={{ padding: '5px' }}>도로 혼잡도</Accordion.Header>
                <Accordion.Body>
                    달력(년/월/시간) 검색버튼
                    <li>1번 경로</li>
                    <li>2번 경로</li>
                    <li>3번 경로</li>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default Menu;