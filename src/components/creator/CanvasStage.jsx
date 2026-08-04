import React from "react";
import useImage from "use-image";
import { useEffect } from "react";
import { Stage, Layer, Group, Transformer, Image } from "react-konva";
import SpeechBubble from "./SpeechBubble";
import CanvasText from "./CanvasText";
function PageImage({ url, onLoaded }) {
  const [image, status] = useImage(url, "anonymous");

  useEffect(() => {
    if (status === "loaded") {
      onLoaded?.();
    }
  }, [status, onLoaded]);

  if (!image) return null;

  return <Image image={image} width={800} height={1100} />;
}

const CANVAS_POSITION = {
  x: 90,
  y: 50,
};

export default function CanvasStage({
  page,

  elements,

  stageRef,

  transformerRef,

  selectedNodeRef,

  selectedId,

  previewMode,
  setSelectedId,

  setSelectedElement,
  onPageRendered,
  updateElement,

  handleStageClick,

  handleWheel,

  scale,

  isPanning,

  canvasPosition = CANVAS_POSITION,

  setCanvasPosition,
}) {
  return (
    <Stage
      ref={stageRef}
      width={1000}
      height={1250}
      style={{
        background: "#222",
        borderRadius: 12,
        border: "2px solid #444",
      }}
      onMouseDown={handleStageClick}
      onWheel={handleWheel}
    >
      <Layer>
        <Group
          x={canvasPosition.x}
          y={canvasPosition.y}
          scaleX={scale}
          scaleY={scale}
          draggable={isPanning}
          onDragEnd={(e) => {
            if (!setCanvasPosition) return;

            setCanvasPosition({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        >
          {/* Manga Page */}
          <PageImage url={page.imageUrl} onLoaded={onPageRendered} />
          {/* Elements */}
          {elements
            .filter((element) => element.visible !== false)
            .map((element) => {
              if (element.type === "bubble") {
                return (
                  <SpeechBubble
                    key={element.id}
                    element={element}
                    selected={selectedId === element.id}
                    nodeRef={selectedNodeRef}
                    draggable={!previewMode && !element.locked}
                    onClick={() => {
                      if (previewMode) return;
                      if (element.locked) return;

                      setSelectedId(element.id);
                      setSelectedElement(element);
                    }}
                    onDblClick={() => {
                      if (previewMode) return;
                      if (element.locked) return;

                      setSelectedId(element.id);
                    }}
                    onDragEnd={(e) => {
                      if (previewMode) return;
                      if (element.locked) return;

                      updateElement(element.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    onTransformEnd={(e) => {
                      if (previewMode) return;
                      if (element.locked) return;

                      const node = e.target;

                      updateElement(element.id, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(120, element.width * node.scaleX()),
                        height: Math.max(80, element.height * node.scaleY()),
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
                    draggable={!previewMode && !element.locked}
                    onClick={() => {
                      if (previewMode) return;
                      if (element.locked) return;

                      setSelectedId(element.id);
                      setSelectedElement(element);
                    }}
                    onDblClick={() => {
                      if (previewMode) return;
                      if (element.locked) return;

                      setSelectedId(element.id);
                    }}
                    onDragEnd={(e) => {
                      if (previewMode) return;
                      if (element.locked) return;

                      updateElement(element.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    onTransformEnd={(e) => {
                      if (previewMode) return;
                      if (element.locked) return;

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

          {!previewMode && (
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
          )}
        </Group>
      </Layer>
    </Stage>
  );
}
