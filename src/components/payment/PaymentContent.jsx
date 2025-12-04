import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import "../../styles/components/payment/PaymentContent.scss";
const PaymentContent = ({
    cards,
    handleAddCard,
    handleDeleteCard,
    addCard,
    handleBackdropClick,
}) => {
    //  const [addCard, setAddCard] = useState(false);

    return (
        <div className="payment-content">
            <div className="payment-header">
                <h2 className="payment-title">결제수단</h2>
                <div className="filter-dropdown">
                    <select>
                        <option value="upcoming">Upcoming</option>
                    </select>
                </div>
            </div>

            <div className="cards-container">
                {cards.map((card) => (
                    <div key={card.id} className="card-item">
                        <div className="card-visual">
                            <div className="card-number">**** **** ****</div>
                            <div className="card-last4">{card.last4}</div>
                            <div className="card-footer">
                                <div className="card-expiry">
                                    <div className="expiry-label">Valid Thru</div>
                                    <div className="expiry-date">{card.expiry}</div>
                                </div>
                                <div className="card-logo">{card.type.toUpperCase()}</div>
                            </div>
                        </div>
                        <button
                            className="delete-button"
                            onClick={() => handleDeleteCard(card.id)}
                        >
                            🗑️
                        </button>
                    </div>
                ))}

                <div className="add-card-item" onClick={handleAddCard}>
                    <div className="add-card-circle">
                        <span className="add-icon">+</span>
                    </div>
                    <div className="add-card-text">Add a new card</div>
                </div>
                {addCard && (
                    <div className="add-card-modal" onClick={handleBackdropClick}>
                        <PaymentForm />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentContent;