import "./ContextMenu.css";

export default function ContextMenu({
  x,
  y,
  visible,
  onRename,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
}) {
  if (!visible) return null;

  return (
    <div
      className="context-menu"
      style={{
        top: y,
        left: x,
      }}
    >
      <button onClick={onRename}>✏ Rename</button>

      <button onClick={onDuplicate}>📄 Duplicate</button>

      <button onClick={onDelete}>🗑 Delete</button>

      <hr />

      <button onClick={onBringForward}>⬆ Bring Forward</button>

      <button onClick={onSendBackward}>⬇ Send Backward</button>

      <button onClick={onBringToFront}>⏫ Bring To Front</button>

      <button onClick={onSendToBack}>⏬ Send To Back</button>
    </div>
  );
}
