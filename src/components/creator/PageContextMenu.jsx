import React, { useEffect, useRef } from "react";
import "./pagesSidebar.css";

export default function PageContextMenu({
  visible,
  x,
  y,
  onRename,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onClose,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="page-context-menu"
      style={{
        top: y,
        left: x,
      }}
    >
      <button onClick={onRename}>✏ Rename</button>

      <button onClick={onDuplicate}>📄 Duplicate</button>

      <div className="page-context-divider" />

      <button className="danger" onClick={onDelete}>
        🗑 Delete
      </button>
    </div>
  );
}
