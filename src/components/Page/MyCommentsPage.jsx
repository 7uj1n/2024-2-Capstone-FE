import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyCommentsPage.css'; // 커스텀 CSS 파일 추가

function CommentList() {
    const [comments, setComments] = useState([
        { id: 1, text: "이 경로 엄청 빨라요~~", date: "2024-10-08 14:43", route: "2024-08-22 오후 1시 중앙동 경로 1 (기존 경로)", checked: false },
        { id: 2, text: "좋을 것 같네요 더 빨리 갈듯ㅋㅋ", date: "2024-10-07 14:43", route: "2024-08-22 오후 1시 중앙동 경로 3 (새로운 경로)", checked: false },
        { id: 3, text: "이 경로 엄청 빨라요~~", date: "2024-10-01 14:43", route: "2024-08-22 오후 1시 중앙동 경로 1 (기존 경로)", checked: false },
        { id: 4, text: "제가 이렇게 다니는데 차 막혀요", date: "2024-10-01 14:03", route: "2024-08-25 오후 4시 군자동 경로 2 (기존 경로)", checked: false },
        { id: 5, text: "제가 이렇게 다니는데 차 막혀요", date: "2024-10-01 14:02", route: "2024-08-25 오후 4시 군자동 경로 2 (기존 경로)", checked: false },
    ]);

    const [selectAll, setSelectAll] = useState(false);  // 전체 선택 체크박스 상태
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태
    const [pageGroup, setPageGroup] = useState(0);  // 페이지 그룹 상태

    const totalPages = 8;  // 총 페이지 수
    const pagesPerGroup = 5;  // 한 그룹당 페이지 수

    const handleSelectAll = () => { // 전체 선택 체크박스 클릭 시
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setComments(comments.map(comment => ({ ...comment, checked: newSelectAll })));
    };

    const handleCheckboxChange = (id) => {  // 개별 체크박스 클릭 시
        setComments(comments.map(comment => comment.id === id ? { ...comment, checked: !comment.checked } : comment));
    };

    const handlePageChange = (page) => {  // 페이지 변경 시
        setCurrentPage(page);
    };

    const handleNextGroup = () => {  // 다음 그룹 버튼 클릭 시
        if ((pageGroup + 1) * pagesPerGroup < totalPages) {
            setPageGroup(pageGroup + 1);
            setCurrentPage((pageGroup + 1) * pagesPerGroup + 1);
        }
    };

    const handlePrevGroup = () => {  // 이전 그룹 버튼 클릭 시
        if (pageGroup > 0) {
            setPageGroup(pageGroup - 1);
            setCurrentPage(pageGroup * pagesPerGroup);
        }
    };

    const renderPaginationItems = () => {
        const startPage = pageGroup * pagesPerGroup + 1;
        const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
        const items = [];
        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                    {page}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <Container className="comments-container">
            <h3 className="comments-title mb-3">작성한 댓글</h3>
            <Card className="comments-card p-3">
                <Form>
                    <div className="form-header">
                        <div className="form-check">
                            <Form.Check type="checkbox" label="전체 선택" checked={selectAll} onChange={handleSelectAll} />
                        </div>
                        <Button variant="dark">삭제</Button>
                    </div>
                    <hr />
                    {comments.map((comment, index) => (
                        <React.Fragment key={comment.id}>
                            <Row className="comment-row mb-3">
                                <Col xs={1}>
                                    <Form.Check type="checkbox" checked={comment.checked} onChange={() => handleCheckboxChange(comment.id)} />
                                </Col>
                                <Col xs={9}>
                                    <div className="fw-bold comment-text">{comment.text}</div>
                                    <div className="comment-route">{comment.route}</div>
                                </Col>
                                <Col xs={2} className="text-end text-muted comment-date">
                                    {comment.date}
                                </Col>
                            </Row>
                            {index < comments.length - 1 && <div className="comment-divider"></div>}
                        </React.Fragment>
                    ))}
                </Form>
            </Card>

            <div className="pagination-container">
                <Pagination className="justify-content-center" style={{ margin: 0 }}>
                    <Pagination.Prev onClick={handlePrevGroup} disabled={pageGroup === 0} />
                    {renderPaginationItems()}
                    <Pagination.Next onClick={handleNextGroup} disabled={(pageGroup + 1) * pagesPerGroup >= totalPages} />
                </Pagination>
            </div>
        </Container>
    );
}

export default CommentList;