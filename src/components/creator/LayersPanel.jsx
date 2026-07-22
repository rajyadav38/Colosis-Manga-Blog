import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import ContextMenu from "./ContextMenu";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
function SortableLayer({ element, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: element.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return children({
    setNodeRef,
    style,
    attributes,
    listeners,
  });
}
function LayersPanel({
  elements = [],
  selectedId,
  toggleVisibility,
  toggleLock,
  renameLayer,
  reorderLayers,
  duplicateLayer,
  moveLayer,
  deleteLayer,
  onLayerSelect,
}) {
  const [editingId, setEditingId] = useState(null);
  const [layerName, setLayerName] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [menuLayer, setMenuLayer] = useState(null);
  useEffect(() => {
    const closeMenu = () => {
      setMenuVisible(false);
    };

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <>
      <div className="layers-panel">
        <h3>Layers</h3>

        {elements.length === 0 ? (
          <div
            className="text-muted"
            style={{
              fontSize: "14px",
              padding: "12px",
            }}
          >
            No layers yet
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) return;

              reorderLayers?.(active.id, over.id);
            }}
          >
            <SortableContext
              items={[...elements].reverse().map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {[...elements].reverse().map((element, index) => (
                <SortableLayer key={element.id} element={element}>
                  {({ setNodeRef, style, attributes, listeners }) => (
                    <div
                      ref={setNodeRef}
                      style={style}
                      className={`layer ${
                        selectedId === element.id ? "active" : ""
                      }`}
                      onClick={() => onLayerSelect?.(element.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        setMenuLayer(element);

                        setMenuPosition({
                          x: e.clientX,
                          y: e.clientY,
                        });

                        setMenuVisible(true);
                      }}
                    >
                      {/* Drag Handle */}
                      <span
                        {...attributes}
                        {...listeners}
                        style={{
                          cursor: "grab",
                          marginRight: 10,
                          fontSize: 18,
                          userSelect: "none",
                          flexShrink: 0,
                        }}
                      >
                        ☰
                      </span>

                      {/* Layer Type */}
                      <span
                        style={{
                          marginRight: 8,
                          flexShrink: 0,
                        }}
                      >
                        {element.type === "bubble"
                          ? "💬"
                          : element.type === "text"
                            ? "📝"
                            : "📦"}
                      </span>

                      {/* Layer Name */}
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          marginLeft: 6,
                        }}
                      >
                        {editingId === element.id ? (
                          <input
                            autoFocus
                            value={layerName}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setLayerName(e.target.value)}
                            onBlur={() => {
                              renameLayer?.(element.id, layerName.trim());
                              setEditingId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                renameLayer?.(element.id, layerName.trim());
                                setEditingId(null);
                              }

                              if (e.key === "Escape") {
                                setEditingId(null);
                              }
                            }}
                            style={{
                              width: "100%",
                              background: "#2c2c2c",
                              border: "1px solid #555",
                              color: "#fff",
                              borderRadius: 4,
                              padding: "3px 6px",
                              fontSize: 14,
                            }}
                          />
                        ) : (
                          <span
                            onDoubleClick={(e) => {
                              e.stopPropagation();

                              setEditingId(element.id);

                              setLayerName(
                                element.name ||
                                  element.text ||
                                  `${element.type} ${elements.length - index}`,
                              );
                            }}
                            style={{
                              display: "block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "text",
                            }}
                          >
                            {element.name ||
                              element.text ||
                              `${element.type} ${elements.length - index}`}
                          </span>
                        )}
                      </div>

                      {/* Visibility */}
                      <button
                        className="layer-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisibility?.(element.id);
                        }}
                      >
                        {element.visible === false ? "🚫" : "👁"}
                      </button>

                      {/* Lock */}
                      <button
                        className="layer-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLock?.(element.id);
                        }}
                      >
                        {element.locked ? "🔒" : "🔓"}
                      </button>
                    </div>
                  )}
                </SortableLayer>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <ContextMenu
        visible={menuVisible}
        x={menuPosition.x}
        y={menuPosition.y}
        onRename={() => {
          if (!menuLayer) return;

          setEditingId(menuLayer.id);
          setLayerName(menuLayer.name || menuLayer.text || "");
          setMenuVisible(false);
        }}
        onDuplicate={() => {
          if (!menuLayer) return;

          duplicateLayer?.(menuLayer.id);

          setMenuVisible(false);
        }}
        onDelete={() => {
          if (!menuLayer) return;

          deleteLayer?.(menuLayer.id);

          setMenuVisible(false);
        }}
        onBringForward={() => {
          if (!menuLayer) return;

          moveLayer?.(menuLayer.id, "forward");

          setMenuVisible(false);
        }}
        onSendBackward={() => {
          if (!menuLayer) return;

          moveLayer?.(menuLayer.id, "backward");

          setMenuVisible(false);
        }}
        onBringToFront={() => {
          if (!menuLayer) return;

          moveLayer?.(menuLayer.id, "front");

          setMenuVisible(false);
        }}
        onSendToBack={() => {
          if (!menuLayer) return;

          moveLayer?.(menuLayer.id, "back");

          setMenuVisible(false);
        }}
      />
    </>
  );
}

export default LayersPanel;
