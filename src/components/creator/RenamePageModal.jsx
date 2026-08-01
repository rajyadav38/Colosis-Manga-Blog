import { useEffect, useState } from "react";
import Modal from "./Modal";
import "./modal.css";
export default function RenamePageModal({ open, page, onClose, onSave }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (page) {
      setName(page.name || `Page ${page.pageNumber}`);
    }
  }, [page]);

  const handleSave = () => {
    const trimmed = name.trim();

    if (!trimmed) return;

    onSave(trimmed);
  };

  return (
    <Modal
      open={open}
      title="Rename Page"
      onClose={onClose}
      footer={
        <>
          <button className="modal-btn secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="modal-btn primary" onClick={handleSave}>
            Save
          </button>
        </>
      }
    >
      <div className="modal-form">
        <label>Page Name</label>

        <input
          autoFocus
          type="text"
          value={name}
          placeholder="Enter page name..."
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
        />
      </div>
    </Modal>
  );
}
