import React from "react";
import "../../styles/auth/PolicyModal.scss";

const PolicyModal = ({ title, content, onClose }) => {
  return (
    <div className="policy-modal-backdrop" onClick={onClose}>
      <div className="policy-modal" onClick={e => e.stopPropagation()}>
        <div className="policy-modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="policy-modal-content">
          {content}
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
