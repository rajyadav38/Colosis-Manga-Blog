import React, { useEffect, useRef, useState } from "react";
import useImage from "use-image";
import { Stage, Layer, Image, Transformer, Group } from "react-konva";
import SpeechBubble from "./SpeechBubble";
import CanvasText from "./CanvasText";
import CanvasStage from "./CanvasStage";

function PageImage({ url }) {
  const [image] = useImage(url);

  if (!image) return null;

  return <Image image={image} width={800} height={1100} />;
}

export default function CanvasEditor({
  page,
  chapterId,
  selectedTool,
  setSelectedTool,
  saveElements,
  selectedElement,
  setSelectedElement,
}) {
  const stageRef = useRef();
  const transformerRef = useRef();
  const textareaRef = useRef();

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [scale, setScale] = useState(1);
  const PAGE_WIDTH = 800;
  const PAGE_HEIGHT = 1100;

  const WORKSPACE_WIDTH = 1000;
  const WORKSPACE_HEIGHT = 1250;

  const defaultCanvasPosition = {
    x: (WORKSPACE_WIDTH - PAGE_WIDTH) / 2,
    y: (WORKSPACE_HEIGHT - PAGE_HEIGHT) / 2,
  };

  const [canvasPosition, setCanvasPosition] = useState(defaultCanvasPosition);

  const [isPanning, setIsPanning] = useState(false);

  const selectedNodeRef = useRef();

  useEffect(() => {
    if (page) {
      setElements(page.elements || []);
    }
  }, [page]);

  useEffect(() => {
    if (!selectedElement) return;

    setElements((prev) =>
      prev.map((el) => (el.id === selectedElement.id ? selectedElement : el)),
    );
  }, [selectedElement]);

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
      setSelectedElement(null);
    };

    window.addEventListener("keydown", deleteElement);

    return () => window.removeEventListener("keydown", deleteElement);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setSelectedElement(null);
      return;
    }

    const element = elements.find((el) => el.id === selectedId);

    if (element) {
      setSelectedElement(element);
    }
  }, [selectedId, elements, setSelectedElement]);

  useEffect(() => {
    window.creatorStudioDelete = () => {
      if (!selectedId) return;

      setElements((prev) => prev.filter((el) => el.id !== selectedId));

      setSelectedId(null);

      setSelectedElement(null);
    };

    return () => {
      delete window.creatorStudioDelete;
    };
  }, [selectedId]);

  useEffect(() => {
    const down = (e) => {
      if (e.code === "Space") {
        setIsPanning(true);
      }
    };

    const up = (e) => {
      if (e.code === "Space") {
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

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
    setElements((prev) => {
      const updated = prev.map((el) =>
        el.id === id
          ? {
              ...el,
              ...values,
            }
          : el,
      );

      const selected = updated.find((el) => el.id === id);

      if (selected) {
        setSelectedElement(selected);
      }

      return updated;
    });
  };

  const handleStageClick = (e) => {
    // Don't add new elements when editing text
    if (editingId) return;

    const clickedOnTransformer = e.target.getClassName() === "Transformer";

    if (clickedOnTransformer) return;

    const pointer = stageRef.current.getPointerPosition();

    if (!pointer) return;

    const pos = {
      x: (pointer.x - canvasPosition.x) / scale,
      y: (pointer.y - canvasPosition.y) / scale,
    };

    if (!pos) return;

    if (selectedTool === "bubble") {
      addBubble(pos.x, pos.y);
      return;
    }

    if (selectedTool === "text") {
      addText(pos.x, pos.y);
      return;
    }

    setSelectedId(null);
    setSelectedElement(null);
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
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;

    const oldScale = scale;

    const pointer = stageRef.current.getPointerPosition();

    if (!pointer) return;

    const mousePoint = {
      x: (pointer.x - canvasPosition.x) / oldScale,
      y: (pointer.y - canvasPosition.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    newScale = Math.max(0.3, Math.min(4, newScale));

    setScale(newScale);

    setCanvasPosition({
      x: pointer.x - mousePoint.x * newScale,
      y: pointer.y - mousePoint.y * newScale,
    });
  };
  const zoom = (direction) => {
    const oldScale = scale;

    const newScale = Math.max(0.3, Math.min(4, oldScale + direction * 0.1));

    const center = {
      x: WORKSPACE_WIDTH / 2,
      y: WORKSPACE_HEIGHT / 2,
    };

    const point = {
      x: (center.x - canvasPosition.x) / oldScale,
      y: (center.y - canvasPosition.y) / oldScale,
    };

    setScale(newScale);

    setCanvasPosition({
      x: center.x - point.x * newScale,
      y: center.y - point.y * newScale,
    });
  };
  const zoomIn = () => zoom(1);

  const zoomOut = () => zoom(-1);

  const fitScreen = () => {
    const padding = 80;

    const scaleX = (WORKSPACE_WIDTH - padding) / PAGE_WIDTH;

    const scaleY = (WORKSPACE_HEIGHT - padding) / PAGE_HEIGHT;

    const newScale = Math.min(scaleX, scaleY);

    setScale(newScale);

    setCanvasPosition({
      x: (WORKSPACE_WIDTH - PAGE_WIDTH * newScale) / 2,

      y: (WORKSPACE_HEIGHT - PAGE_HEIGHT * newScale) / 2,
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: "15px",
        }}
      >
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <button
              className={selectedTool === "select" ? "active" : ""}
              onClick={() => setSelectedTool("select")}
            >
              🖱 Select
            </button>

            <button
              className={selectedTool === "bubble" ? "active" : ""}
              onClick={() => setSelectedTool("bubble")}
            >
              💬 Bubble
            </button>

            <button
              className={selectedTool === "text" ? "active" : ""}
              onClick={() => setSelectedTool("text")}
            >
              📝 Text
            </button>
          </div>

          <div className="toolbar-divider"></div>

          <div className="toolbar-right">
            <button onClick={zoomOut}>➖</button>

            <span className="zoom-value">{Math.round(scale * 100)}%</span>

            <button onClick={zoomIn}>➕</button>

            <button onClick={fitScreen}>Fit</button>
          </div>
        </div>
        <div className={`canvas-paper ${isPanning ? "panning" : ""}`}>
          <CanvasStage
            page={page}
            elements={elements}
            stageRef={stageRef}
            transformerRef={transformerRef}
            selectedNodeRef={selectedNodeRef}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setSelectedElement={setSelectedElement}
            updateElement={updateElement}
            handleStageClick={handleStageClick}
            handleWheel={handleWheel}
            scale={scale}
            isPanning={isPanning}
            canvasPosition={canvasPosition}
            setCanvasPosition={setCanvasPosition}
          />
        </div>
      </div>
    </>
  );
}
