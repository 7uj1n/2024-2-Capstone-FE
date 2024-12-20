import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyCommentsPage.css'; // 커스텀 CSS 파일 추가
import useStore from '../../store/UserStore';
import moment from 'moment-timezone';
import CustomModal from '../UI/CustomModal'; // CustomModal 컴포넌트 가져오기
import LoadingSpinner from '../UI/LoadingSpinner'; // LoadingSpinner 컴포넌트 가져오기

function CommentList() {
    const [comments, setComments] = useState([]);
    const [selectAll, setSelectAll] = useState(false);  // 전체 선택 체크박스 상태
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태
    const [pageGroup, setPageGroup] = useState(0);  // 페이지 그룹 상태
    const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수
    const [initialLoading, setInitialLoading] = useState(true); // 초기 로딩 상태 추가
    const pagesPerGroup = 5;  // 한 그룹당 페이지 수

    const token = useStore((state) => state.token);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

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
        } finally {
            setInitialLoading(false); // 데이터 가져오기 완료 후 초기 로딩 상태 해제
        }
    };

    useEffect(() => {
        fetchComments();
    }, [token]);

    useEffect(() => {
        if (!initialLoading) {
            fetchComments();
        }
    }, [currentPage]);

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
            setModalContent('삭제할 댓글을 선택해주세요.');
            setShowModal(true);
            return;
        }

        setModalContent('정말 삭제하시겠습니까?');
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        const selectedCommentIds = comments.filter(comment => comment.checked).map(comment => comment.comment_id);
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
                setModalContent(response.data.messsage);    //댓글 삭제 완료!
                fetchComments(); // 댓글 목록을 다시 불러와서 리렌더링
                setSelectAll(false); // 전체 선택 체크박스 해제
            } else {
                setModalContent('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
            setModalContent('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
                    {initialLoading ? (
                        <LoadingSpinner message="댓글을 불러오는 중입니다..." />
                    ) : comments.length === 0 ? (
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

            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={modalContent === '정말 삭제하시겠습니까?' ? handleConfirmDelete : handleCloseModal}
                title="알림"
                body={modalContent}
                confirmText="확인"
                cancelText={modalContent === '정말 삭제하시겠습니까?' ? "취소" : ""}
            />
        </Container>
    );
}

export default CommentList;