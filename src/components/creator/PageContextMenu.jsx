import { useEffect } from "react";
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
}) {
  useEffect(() => {
    const close = () => {};

    window.addEventListener("click", close);

    return () => window.removeEventListener("click", close);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="page-context-menu"
      style={{
        left: x,
        top: y,
      }}
    >
      <button onClick={onRename}>✏ Rename</button>

      <button onClick={onDuplicate}>📄 Duplicate</button>

      <div className="page-context-divider" />

      <button className="danger" onClick={onDelete}>
        🗑 Delete
      </button>

      <div className="page-context-divider" />

      <button onClick={onMoveUp}>⬆ Move Up</button>

      <button onClick={onMoveDown}>⬇ Move Down</button>
    </div>
  );
}
