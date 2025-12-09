import React, { useState } from "react";
import "../../styles/components/hotelpage/ReviewModal.scss";

const ReviewModal = ({ closeModal, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const submitReview = () => {
        if (rating === 0) return alert("별점을 선택해주세요!");
        if (!comment.trim()) return alert("리뷰 내용을 입력해주세요!");

        onSubmit({
            rating,
            comment,
            createdAt: new Date().toISOString(),
        });
    };

    return (
        <div className="review-modal-backdrop" onClick={closeModal}>
            <div
                className="review-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="modal-title">리뷰 작성하기</h2>

                {/* ⭐ 별점 */}
                <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <span
                            key={num}
                            className={num <= rating ? "star active" : "star"}
                            onClick={() => setRating(num)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* 리뷰 내용 */}
                <textarea
                    className="review-textarea"
                    placeholder="숙소 이용 경험을 들려주세요!"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                {/* 버튼 영역 */}
                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={closeModal}>
                        취소
                    </button>
                    <button className="submit-btn" onClick={submitReview}>
                        리뷰 등록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
