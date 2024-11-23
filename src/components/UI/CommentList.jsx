import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment-timezone';
import useStore from '../../store/UserStore'; // Zustand 스토어 가져오기

const CommentList = ({ comments, fetchComments }) => {
    const [editingCommentIndex, setEditingCommentIndex] = useState(null);
    const [editingComment, setEditingComment] = useState('');
    const token = useStore(state => state.token);
    const username = useStore(state => state.username); // 현재 로그인한 사용자 이름

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
                fetchComments(); // 댓글 목록을 다시 불러와서 리렌더링
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
                fetchComments(); // 댓글 목록을 다시 불러와서 리렌더링
            } else {
                alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도하세요.');
        }
    };

    return (
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
    );
};

export default CommentList;