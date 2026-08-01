import Modal from "./Modal";
import "./modal.css";
export default function DeletePageModal({ open, page, onClose, onDelete }) {
  return (
    <Modal
      open={open}
      title="Delete Page"
      onClose={onClose}
      footer={
        <>
          <button className="modal-btn secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="modal-btn danger" onClick={onDelete}>
            Delete
          </button>
        </>
      }
    >
      <div className="delete-modal">
        <div className="delete-icon">🗑</div>

        <h4>Delete "{page?.name || `Page ${page?.pageNumber}`}"?</h4>

        <p>This action cannot be undone.</p>
      </div>
    </Modal>
  );
}
