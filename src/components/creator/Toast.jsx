import { useEffect } from "react";
import "./toast.css";

export default function Toast({ open, message, type = "success", onClose }) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`creator-toast ${type}`}>
      <span>{message}</span>
    </div>
  );
}
