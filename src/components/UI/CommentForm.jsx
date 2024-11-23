import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 가져오기
import './commentForm.css';
import useStore from '../../store/UserStore'; // Zustand 스토어 가져오기
import CommentList from './CommentList'; // 분리된 CommentList 컴포넌트 가져오기
import RecommendationButtons from './RecommendationButtons'; // 분리된 RecommendationButtons 컴포넌트 가져오기

const CommentForm = ({ route, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likeStatus, setLikeStatus] = useState('none');
    const [likeCount, setLikeCount] = useState(route.like);
    const [dislikeCount, setDislikeCount] = useState(route.dislike);
    const token = useStore(state => state.token);

    const fetchComments = async () => { // 댓글 목록을 가져오는 함수
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        try {
            const response = await axios.get(`${apiUrl}/api/comments/${route.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('요청 데이터:', response.data);
            console.log('루트 id:', route.id);
            
            setComments(response.data.comments);
            setLikeStatus(response.data.like_status);
            setLikeCount(response.data.positive);
            setDislikeCount(response.data.negative);
        } catch (error) {
            console.error('댓글을 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [route.id, token]);

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
                setNewComment('');
                fetchComments(); // 댓글 목록을 다시 불러와서 리렌더링
            } else {
                alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('댓글 작성 중 오류 발생:', error);
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
                <RecommendationButtons
                    route={route}
                    likeStatus={likeStatus}
                    likeCount={likeCount}
                    dislikeCount={dislikeCount}
                    setLikeCount={setLikeCount}
                    setDislikeCount={setDislikeCount}
                    setLikeStatus={setLikeStatus}
                />
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

            <CommentList comments={comments} fetchComments={fetchComments} />
        </div>
    );
};

export default CommentForm;