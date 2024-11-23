import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyCommentsPage.css'; // 커스텀 CSS 파일 추가
import useStore from '../../store/UserStore';
import moment from 'moment-timezone';

function CommentList() {
    const [comments, setComments] = useState([]);
    const [selectAll, setSelectAll] = useState(false);  // 전체 선택 체크박스 상태
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태
    const [pageGroup, setPageGroup] = useState(0);  // 페이지 그룹 상태
    const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수
    const pagesPerGroup = 5;  // 한 그룹당 페이지 수

    const token = useStore((state) => state.token);

    const fetchComments = async () => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        try {
            const response = await axios.get(`${apiUrl}/api/comments/user?page=${currentPage - 1}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('댓글 목록:', response.data);
            setComments(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('댓글을 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [currentPage, token]);

    const handleSelectAll = () => { // 전체 선택 체크박스 클릭 시
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setComments(comments.map(comment => ({ ...comment, checked: newSelectAll })));
    };

    const handleCheckboxChange = (id) => {  // 개별 체크박스 클릭 시
        setComments(comments.map(comment => comment.comment_id === id ? { ...comment, checked: !comment.checked } : comment));
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

    const handleDeleteSelected = async () => {  // 선택된 댓글 삭제
        const selectedCommentIds = comments.filter(comment => comment.checked).map(comment => comment.comment_id);
        if (selectedCommentIds.length === 0) {
            alert('삭제할 댓글을 선택해주세요.');
            return;
        }

        if (window.confirm("삭제하시겠습니까?")) {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            try {
                const response = await axios.delete(`${apiUrl}/api/comments/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        commentIdList: selectedCommentIds
                    }
                });
                console.log('선택된 댓글 ID 목록:', selectedCommentIds);
                console.log('댓글 삭제 결과:', response);

                if (response.status === 200) {
                    alert(response.data.messsage);
                    fetchComments(); // 댓글 목록을 다시 불러와서 리렌더링
                    setSelectAll(false); // 전체 선택 체크박스 해제
                } else {
                    alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
                }
            } catch (error) {
                console.error('댓글 삭제 중 오류 발생:', error);
                alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
            }
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
                        <Button variant="dark" onClick={handleDeleteSelected}>삭제</Button>
                    </div>
                    <hr />
                    {comments.length === 0 ? (
                        <div className="text-center text-muted">댓글이 존재하지 않습니다.</div>
                    ) : (
                        comments.map((comment, index) => (
                            <React.Fragment key={comment.comment_id}>
                                <Row className="comment-row mb-3">
                                    <Col xs={1}>
                                        <Form.Check type="checkbox" checked={comment.checked || false} onChange={() => handleCheckboxChange(comment.comment_id)} />
                                    </Col>
                                    <Col xs={9}>
                                        <div className="fw-bold comment-text">{comment.content}</div>
                                        <div className="comment-route">{comment.routeName}</div>
                                    </Col>
                                    <Col xs={2} className="text-end text-muted comment-date">
                                        {moment.utc(comment.updated_time).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')}
                                    </Col>
                                </Row>
                                {index < comments.length - 1 && <div className="comment-divider"></div>}
                            </React.Fragment>
                        ))
                    )}
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