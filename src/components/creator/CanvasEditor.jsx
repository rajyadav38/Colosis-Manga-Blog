import { useState } from "react";
import { Stage, Layer, Image, Ellipse, Text, Group } from "react-konva";
import useImage from "use-image";

export default function CanvasEditor({ page, selectedTool, setSelectedTool }) {
  const [image] = useImage(page?.imageUrl || "");

  const [bubbles, setBubbles] = useState([]);

  const stageWidth = 800;
  const stageHeight = 1100;

  if (!page) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          width: "100%",
          height: "100%",
          color: "#777",
        }}
      >
        Select a page
      </div>
    );
  }

  const handleStageClick = (e) => {
    if (selectedTool !== "bubble") return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();

    setBubbles((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: pointer.x,
        y: pointer.y,
        width: 180,
        height: 100,
        text: "Dialogue",
      },
    ]);

    // Exit tool after placing one bubble
    setSelectedTool(null);
  };

  const updateBubblePosition = (id, x, y) => {
    setBubbles((prev) =>
      prev.map((bubble) =>
        bubble.id === id
          ? {
              ...bubble,
              x,
              y,
            }
          : bubble,
      ),
    );
  };

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      onMouseDown={handleStageClick}
      style={{
        background: "#222",
        border: "2px dashed #555",
      }}
    >
      <Layer>
        {/* Manga Page */}
        {image && (
          <Image
            image={image}
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
          />
        )}

        {/* Speech Bubbles */}
        {bubbles.map((bubble) => (
          <Group
            key={bubble.id}
            draggable
            x={bubble.x}
            y={bubble.y}
            onDragEnd={(e) =>
              updateBubblePosition(bubble.id, e.target.x(), e.target.y())
            }
          >
            <Ellipse
              radiusX={bubble.width / 2}
              radiusY={bubble.height / 2}
              fill="white"
              stroke="black"
              strokeWidth={3}
            />

            <Text
              text={bubble.text}
              width={bubble.width - 30}
              x={-(bubble.width - 30) / 2}
              y={-10}
              align="center"
              fontSize={20}
              fill="black"
              listening={false}
            />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}
