import React, { useState } from "react";
import "../../styles/components/hotelpage/ReviewModal.scss";

const ReviewModal = ({ closeModal, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async () => {
        if (rating === 0) return alert("별점을 선택해주세요!");
        if (comment.trim().length < 5) return alert("내용을 5자 이상 작성해주세요!");

        setIsSubmitting(true);
        try {
            await onSubmit({ rating, comment });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="review-modal-backdrop" onClick={closeModal}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                <h2>리뷰 작성하기</h2>
                <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <span
                            key={num}
                            className={`star ${num <= rating ? "active" : ""}`}
                            onClick={() => !isSubmitting && setRating(num)}
                        >★</span>
                    ))}
                </div>
                <textarea
                    className="review-textarea"
                    placeholder="숙소 이용 경험을 5자 이상 들려주세요."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                />
                <div className="modal-buttons">
                    <button onClick={closeModal} disabled={isSubmitting}>취소</button>
                    <button
                        className="submit-btn"
                        onClick={handleFormSubmit}
                        disabled={isSubmitting || rating === 0 || comment.trim().length < 5}
                    >
                        {isSubmitting ? "등록 중..." : "리뷰 등록"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;