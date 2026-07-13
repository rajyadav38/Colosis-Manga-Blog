import React, { useEffect, useRef, useState } from "react";
import useImage from "use-image";
import { Stage, Layer, Image, Transformer } from "react-konva";
import SpeechBubble from "./SpeechBubble";
import CanvasText from "./CanvasText";

function PageImage({ url }) {
  const [image] = useImage(url);

  if (!image) return null;

  return <Image image={image} width={800} height={1100} />;
}

export default function CanvasEditor({
  page,
  chapterId,
  selectedTool,
  saveElements,
}) {
  const stageRef = useRef();
  const transformerRef = useRef();
  const textareaRef = useRef();

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const selectedNodeRef = useRef();

  useEffect(() => {
    if (page) {
      setElements(page.elements || []);
    }
  }, [page]);

  // Register Save
  useEffect(() => {
    window.creatorStudioSave = () => {
      saveElements(elements);
    };

    return () => {
      delete window.creatorStudioSave;
    };
  }, [elements, saveElements]);

  // Attach Transformer
  useEffect(() => {
    if (transformerRef.current && selectedNodeRef.current) {
      transformerRef.current.nodes([selectedNodeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId, elements]);

  // Delete Key
  useEffect(() => {
    const deleteElement = (e) => {
      if (e.key !== "Delete") return;

      if (!selectedId) return;

      setElements((prev) => prev.filter((el) => el.id !== selectedId));

      setSelectedId(null);
    };

    window.addEventListener("keydown", deleteElement);

    return () => window.removeEventListener("keydown", deleteElement);
  }, [selectedId]);

  const addBubble = (x, y) => {
    setElements((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "bubble",
        x,
        y,
        width: 220,
        height: 120,
        rotation: 0,
        fontSize: 22,
        text: "Double click",
      },
    ]);
  };

  const addText = (x, y) => {
    setElements((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "text",
        x,
        y,
        rotation: 0,
        fontSize: 30,
        text: "Text",
      },
    ]);
  };

  const updateElement = (id, values) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...values } : el)),
    );
  };

  const handleStageClick = (e) => {
    if (e.target !== e.target.getStage()) return;

    const pos = stageRef.current.getPointerPosition();

    if (selectedTool === "bubble") {
      addBubble(pos.x, pos.y);
      return;
    }

    if (selectedTool === "text") {
      addText(pos.x, pos.y);
      return;
    }

    setSelectedId(null);
  };

  const currentElement = elements.find((el) => el.id === editingId);

  const updateEditingText = (text) => {
    updateElement(editingId, {
      text,
    });
  };

  const stopEditing = () => {
    setEditingId(null);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          position: "relative",
        }}
      >
        <Stage
          ref={stageRef}
          width={800}
          height={1100}
          style={{
            background: "#222",
            borderRadius: 12,
            border: "2px solid #444",
          }}
          onMouseDown={handleStageClick}
        >
          <Layer>
            {/* Manga Page */}
            <PageImage url={page.imageUrl} />

            {/* Elements */}
            {elements.map((element) => {
              if (element.type === "bubble") {
                return (
                  <SpeechBubble
                    key={element.id}
                    element={element}
                    selected={selectedId === element.id}
                    nodeRef={selectedNodeRef}
                    onClick={() => setSelectedId(element.id)}
                    onDblClick={() => setEditingId(element.id)}
                    onDragEnd={(e) =>
                      updateElement(element.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target;

                      updateElement(element.id, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(120, node.scaleX() * element.width),
                        height: Math.max(80, node.scaleY() * element.height),
                        rotation: node.rotation(),
                      });

                      node.scaleX(1);
                      node.scaleY(1);
                    }}
                  />
                );
              }

              if (element.type === "text") {
                return (
                  <CanvasText
                    key={element.id}
                    element={element}
                    selected={selectedId === element.id}
                    nodeRef={selectedNodeRef}
                    onClick={() => setSelectedId(element.id)}
                    onDblClick={() => setEditingId(element.id)}
                    onDragEnd={(e) =>
                      updateElement(element.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target;

                      updateElement(element.id, {
                        x: node.x(),
                        y: node.y(),
                        fontSize: element.fontSize * node.scaleX(),
                        rotation: node.rotation(),
                      });

                      node.scaleX(1);
                      node.scaleY(1);
                    }}
                  />
                );
              }

              return null;
            })}
            <Transformer
              ref={transformerRef}
              rotateEnabled
              keepRatio={false}
              enabledAnchors={[
                "top-left",
                "top-center",
                "top-right",
                "middle-left",
                "middle-right",
                "bottom-left",
                "bottom-center",
                "bottom-right",
              ]}
            />
          </Layer>
        </Stage>

        {/* TEXT EDITOR */}
        {editingId && currentElement && (
          <div
            style={{
              position: "fixed",
              top: 120,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              background: "#202020",
              padding: 20,
              borderRadius: 12,
              width: 420,
              boxShadow: "0 10px 30px rgba(0,0,0,.4)",
            }}
          >
            <h5
              style={{
                color: "white",
                marginBottom: 15,
              }}
            >
              Edit Dialogue
            </h5>

            <textarea
              ref={textareaRef}
              rows={5}
              value={currentElement.text}
              onChange={(e) => updateEditingText(e.target.value)}
              style={{
                width: "100%",
                resize: "none",
                borderRadius: 10,
                padding: 10,
                fontSize: 18,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 15,
              }}
            >
              <button className="btn btn-secondary" onClick={stopEditing}>
                Cancel
              </button>

              <button className="btn btn-success" onClick={stopEditing}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
