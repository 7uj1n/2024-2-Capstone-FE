import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment-timezone';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 가져오기
import './commentForm.css';
import useStore from '../../store/UserStore'; // Zustand 스토어 가져오기

const CommentForm = ({ route, onClose }) => {
    const [likeCount, setLikeCount] = useState(route.like);
    const [dislikeCount, setDislikeCount] = useState(route.dislike);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentIndex, setEditingCommentIndex] = useState(null);
    const [editingComment, setEditingComment] = useState('');
    const updateRouteLikes = useStore(state => state.updateRouteLikes);
    const updateRouteDislikes = useStore(state => state.updateRouteDislikes);
    const token = useStore(state => state.token);
    const username = useStore(state => state.username); // 현재 로그인한 사용자 이름

    useEffect(() => {
        const fetchComments = async () => {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            try {
                const response = await axios.get(`${apiUrl}/api/comments/${route.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('요청 데이터:', response.data);
                console.log('루트 id:', route.id);
                
                setLikeCount(response.data.positive);
                setDislikeCount(response.data.negative);
                setComments(response.data.comments);
            } catch (error) {
                console.error('댓글을 가져오는 중 오류 발생:', error);
            }
        };

        fetchComments();
    }, [route.id, token]);

    const handleLikeClick = async () => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        try {
            const response = await axios.get(`${apiUrl}/api/comments/${route.id}/recommend`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log('추천 결과:', response.data);
                setLikeCount(response.data.positive);
                setDislikeCount(response.data.negative);
                setLiked(!liked);
                setDisliked(false);
            } else {
                alert('추천에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('추천 중 오류 발생:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
        }
    };

    const handleDislikeClick = async () => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        try {
            const response = await axios.get(`${apiUrl}/api/comments/${route.id}/notrecommend`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log('비추천 결과:', response.data);
                setLikeCount(response.data.positive);
                setDislikeCount(response.data.negative);
                setLiked(false);
                setDisliked(!disliked);
            } else {
                alert('비추천에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('비추천 중 오류 발생:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        try {
            const response = await axios.post(`${apiUrl}/api/comments/${route.id}`, {
                content: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert(response.data.messsage);
                const now = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm');

                const newCommentData = {
                    comment_id: comments.length + 1, // 임시 ID
                    content: newComment,
                    username: username, // 현재 로그인한 사용자 이름
                    updated_time: now
                };

                console.log('생성 시간:', now);

                setComments([newCommentData, ...comments]);
                setNewComment('');
            } else {
                alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('댓글 작성 중 오류 발생:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
        }
    };

    const handleEditComment = (index) => {
        setEditingCommentIndex(index);
        setEditingComment(comments[index].content);
    };

    const handleUpdateComment = async (index) => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const commentId = comments[index].comment_id;

        try {
            const response = await axios.put(`${apiUrl}/api/comments/${commentId}`, {
                content: editingComment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert(response.data.messsage);
                const updatedComments = comments.map((comment, i) =>
                    i === index ? { ...comment, content: editingComment } : comment
                );
                setComments(updatedComments);
                setEditingCommentIndex(null);
                setEditingComment('');
            } else {
                alert('댓글 수정에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('댓글 수정 중 오류 발생:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
        }
    };

    const handleDeleteComment = async (index) => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const commentId = comments[index].comment_id;

        try {
            const response = await axios.delete(`${apiUrl}/api/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('정말 삭제하시겠습니까?');    //모달로 바꿔야함

            if (response.status === 200) {
                alert(response.data.messsage);
                const updatedComments = comments.filter((_, i) => i !== index);
                setComments(updatedComments);
            } else {
                alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
        }
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
                            style={{ backgroundColor: liked ? '#d3d3d3' : 'white' }}
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
                            style={{ backgroundColor: disliked ? '#d3d3d3' : 'white' }}
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

            {/* 댓글 목록 */}
            <div className="comment-list">
                {comments.length === 0 ? (
                    <div className="text-center text-muted">댓글이 존재하지 않습니다.</div>
                ) : (
                    comments.map((comment, index) => (
                        <div className="comment" key={comment.comment_id}>
                            <div className="comment-header">
                                <span className="comment-author">{comment.username}</span>
                                <span className="comment-date">{moment.utc(comment.updated_time).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')}</span>
                                {comment.username === username && (
                                    <>
                                        {editingCommentIndex === index ? (
                                            <>
                                                <Button variant="outline-dark" style={{ margin: '3px', height: '35px', marginLeft: 'auto' }} onClick={() => handleUpdateComment(index)}>저장</Button>
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
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentForm;