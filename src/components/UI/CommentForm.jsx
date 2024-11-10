import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 가져오기
import './commentForm.css';
import commentsData from '../data/comments.json'; // 댓글 데이터 가져오기
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기

const CommentForm = ({ route, onClose }) => {
    const [likeCount, setLikeCount] = useState(route.like);
    const [dislikeCount, setDislikeCount] = useState(route.dislike);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [comments, setComments] = useState(commentsData);
    const [newComment, setNewComment] = useState('');
    const [editingCommentIndex, setEditingCommentIndex] = useState(null);
    const [editingComment, setEditingComment] = useState('');
    const updateRouteLikes = useStore(state => state.updateRouteLikes);
    const updateRouteDislikes = useStore(state => state.updateRouteDislikes);

    useEffect(() => {
        setLikeCount(route.like);
        setDislikeCount(route.dislike);
        setLiked(false);
        setDisliked(false);
    }, [route]);

    const handleLikeClick = () => {
        if (liked) {
            setLikeCount(likeCount - 1);
            setLiked(false);
            updateRouteLikes(route.id, likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
            setLiked(true);
            updateRouteLikes(route.id, likeCount + 1);
            if (disliked) {
                setDislikeCount(dislikeCount - 1);
                setDisliked(false);
                updateRouteDislikes(route.id, dislikeCount - 1);
            }
        }
    };

    const handleDislikeClick = () => {
        if (disliked) {
            setDislikeCount(dislikeCount - 1);
            setDisliked(false);
            updateRouteDislikes(route.id, dislikeCount - 1);
        } else {
            setDislikeCount(dislikeCount + 1);
            setDisliked(true);
            updateRouteDislikes(route.id, dislikeCount + 1);
            if (liked) {
                setLikeCount(likeCount - 1);
                setLiked(false);
                updateRouteLikes(route.id, likeCount - 1);
            }
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newCommentData = {
            author: '홍길동',
            date: formattedDate,
            content: newComment
        };

        setComments([newCommentData, ...comments]);
        setNewComment('');
    };

    const handleEditComment = (index) => {
        setEditingCommentIndex(index);
        setEditingComment(comments[index].content);
    };

    const handleUpdateComment = (index) => {
        const updatedComments = comments.map((comment, i) =>
            i === index ? { ...comment, content: editingComment } : comment
        );
        setComments(updatedComments);
        setEditingCommentIndex(null);
        setEditingComment('');
    };

    const handleDeleteComment = (index) => {
        const updatedComments = comments.filter((_, i) => i !== index);
        setComments(updatedComments);
    };

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
                        <Button
                            variant="light"
                            className={liked ? 'active' : ''}
                            onClick={handleLikeClick}
                        >
                            <span role="img" aria-label="thumbs up">👍</span>
                        </Button>
                        <span>{likeCount}</span>
                    </div>
                    <div className="thumb-button">
                        <Button
                            variant="light"
                            className={disliked ? 'active' : ''}
                            onClick={handleDislikeClick}
                        >
                            <span role="img" aria-label="thumbs down">👎</span>
                        </Button>
                        <span>{dislikeCount}</span>
                    </div>
                </div>
            </div>

            <Form className="comment-form-body" onSubmit={handleCommentSubmit}>
                <Form.Group controlId="comment">
                    <Form.Label style={{ display: 'flex' }}>댓글 등록</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                </Form.Group>
                <div className="form-actions">
                    <Button variant="dark" type="submit" style={{ margin: 0, width: '90px' }}>
                        등록하기
                    </Button>
                </div>
            </Form>

            {/* 샘플 댓글 목록 */}
            <div className="comment-list">
                {comments.map((comment, index) => (
                    <div className="comment" key={index}>
                        <div className="comment-header">
                            <span className="comment-author">{comment.author}</span>
                            <span className="comment-date">{comment.date}</span>
                            {comment.author === '홍길동' && (
                                <>
                                    {editingCommentIndex === index ? (
                                        <>
                                            <Button variant="outline-dark" style={{ margin: '3px', height: '35px', marginLeft: 'auto'}} onClick={() => handleUpdateComment(index)}>저장</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline-secondary" className="comment-edit" onClick={() => handleEditComment(index)}>수정</Button>
                                            <Button variant="outline-danger" className="comment-delete" onClick={() => handleDeleteComment(index)}>삭제</Button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        {editingCommentIndex === index ? (
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={editingComment}
                                onChange={(e) => setEditingComment(e.target.value)}
                            />
                        ) : (
                            <p>{comment.content}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentForm;