import React from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 가져오기
import './commentForm.css';
import commentsData from '../data/comments.json'; // 댓글 데이터 가져오기

const CommentForm = ({ route, onClose }) => {
    return (
        <div className="comment-form">
            <div className="comment-form-header">
                <h5>경로 {route.id} ({route.type === 'exist' ? '기존 경로' : '새로운 경로'})</h5>
                <Button variant="light" onClick={onClose} style={{
                    backgroundColor: 'transparent', border: 'none', fontSize: '1.5rem', margin: '0px', marginRight: '-20px', marginTop: '-5px'
                }}>X</Button>
            </div>

            <div className="comment-card">
                {route.type === 'exist' ? (
                    <p>📑 이 경로로 인천공항까지 <br />
                        이동한 경험이 있으신가요? <br />
                        편리했던 점, 소요 시간, 꿀팁 등을 <br />
                        자유롭게 공유해주세요!</p>
                ) : (
                    <p>🚌새로운 경로를 통해 <br />
                        인천공항으로 가는 방법을 살펴보세요. <br />
                        이동 소요 시간, 교통수단 등 주요 정보를 확인하고
                        여러분의 경험과 팁을 댓글로 남겨보세요!</p>
                )}
                <div className="thumbs">
                    <div className="thumb-button">
                        <Button variant="light" style={{ backgroundColor: 'transparent', border: 'none', borderRadius: '50%', padding: '10px' }}>
                            <span role="img" aria-label="thumbs up">👍</span>
                        </Button>
                        <span>{route.like}</span>
                    </div>
                    <div className="thumb-button">
                        <Button variant="light" style={{ backgroundColor: 'transparent', border: 'none', borderRadius: '50%', padding: '10px' }}>
                            <span role="img" aria-label="thumbs down">👎</span>
                        </Button>
                        <span>{route.dislike}</span>
                    </div>
                </div>
            </div>

            <Form className="comment-form-body">
                <Form.Group controlId="comment">
                    <Form.Label style={{ display: 'flex' }}>댓글 등록</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                </Form.Group>
                <div className="form-actions">
                    <Button variant="dark" type="submit" style={{ margin: 0, width: '90px' }}>
                        등록하기
                    </Button>
                </div>
            </Form>

            {/* 샘플 댓글 목록 */}
            <div className="comment-list">
                {commentsData.map((comment, index) => (
                    <div className="comment" key={index}>
                        <div className="comment-header">
                            <span className="comment-author">{comment.author}</span>
                            <span className="comment-date">{comment.date}</span>
                            <Button variant="outline-secondary" className="comment-edit">수정</Button>
                            <Button variant="outline-danger" className="comment-delete">삭제</Button>
                        </div>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentForm;