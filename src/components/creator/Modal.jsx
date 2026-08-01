import { useEffect } from "react";
import "./modal.css";

export default function Modal({ open, title, children, footer, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="creator-modal-overlay" onClick={onClose}>
      <div className="creator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="creator-modal-header">
          <h3>{title}</h3>

          <button className="creator-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="creator-modal-body">{children}</div>

        {footer && <div className="creator-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
