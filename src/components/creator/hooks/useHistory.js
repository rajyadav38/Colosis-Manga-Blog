import { useState } from "react";

export default function useHistory(initialState = []) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initialState);
  const [future, setFuture] = useState([]);

  const set = (newPresent) => {
    setPresent((current) => {
      const next =
        typeof newPresent === "function" ? newPresent(current) : newPresent;

      setPast((prev) => [...prev, current]);
      setFuture([]);

      return next;
    });
  };

  const undo = () => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];

    setPast((prev) => prev.slice(0, -1));

    setFuture((prev) => [present, ...prev]);

    setPresent(previous);
  };

  const redo = () => {
    if (future.length === 0) return;

    const next = future[0];

    setFuture((prev) => prev.slice(1));

    setPast((prev) => [...prev, present]);

    setPresent(next);
  };

  return {
    state: present,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
