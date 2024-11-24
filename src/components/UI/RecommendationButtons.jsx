import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import useStore from '../../store/UserStore'; // Zustand 스토어 가져오기
import CustomModal from '../UI/CustomModal'; // CustomModal 컴포넌트 가져오기

const RecommendationButtons = ({ route, likeStatus, likeCount, dislikeCount, setLikeCount, setDislikeCount, setLikeStatus }) => {
    const token = useStore(state => state.token);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: '' });

    useEffect(() => {
        if (likeStatus === 'positive') {
            setLiked(true);
            setDisliked(false);
        } else if (likeStatus === 'negative') {
            setLiked(false);
            setDisliked(true);
        } else {
            setLiked(false);
            setDisliked(false);
        }
    }, [likeStatus]);

    const handleLikeClick = async () => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        try {
            const response = await axios.get(`${apiUrl}/api/comments/${route.id}/recommend`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response.data);

            if (response.status === 200) {
                setLikeCount(response.data.positive);
                setDislikeCount(response.data.negative);
                setLikeStatus(likeStatus === 'positive' ? 'none' : 'positive');
            } else {
                setModalContent({ title: 'Error', body: '추천에 실패했습니다. 다시 시도해주세요.' });
                setShowModal(true);
            }
        } catch (error) {
            console.error('추천 중 오류 발생:', error);
            setModalContent({ title: 'Server Error', body: '서버 오류가 발생했습니다. 나중에 다시 시도하세요.' });
            setShowModal(true);
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

            console.log(response.data);
            if (response.status === 200) {
                setLikeCount(response.data.positive);
                setDislikeCount(response.data.negative);
                setLikeStatus(likeStatus === 'negative' ? 'none' : 'negative');
            } else {
                setModalContent({ title: 'Error', body: '비추천에 실패했습니다. 다시 시도해주세요.' });
                setShowModal(true);
            }
        } catch (error) {
            console.error('비추천 중 오류 발생:', error);
            setModalContent({ title: 'Server Error', body: '서버 오류가 발생했습니다. 나중에 다시 시도하세요.' });
            setShowModal(true);
        }
    };

    return (
        <div className="thumbs">
            <div className="thumb-button">
                <Button
                    variant="light"
                    className={likeStatus === 'positive' ? 'active' : ''}
                    onClick={handleLikeClick}
                    style={{ backgroundColor: likeStatus === 'positive' ? '#d3d3d3' : 'white' }}
                >
                    <span role="img" aria-label="thumbs up">👍</span>
                </Button>
                <span>{likeCount}</span>
            </div>
            <div className="thumb-button">
                <Button
                    variant="light"
                    className={likeStatus === 'negative' ? 'active' : ''}
                    onClick={handleDislikeClick}
                    style={{ backgroundColor: likeStatus === 'negative' ? '#d3d3d3' : 'white' }}
                >
                    <span role="img" aria-label="thumbs down">👎</span>
                </Button>
                <span>{dislikeCount}</span>
            </div>
            <CustomModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                title={modalContent.title}
                body={modalContent.body}
                confirmText="확인"
                handleConfirm={() => setShowModal(false)}
            />
        </div>
    );
};

export default RecommendationButtons;