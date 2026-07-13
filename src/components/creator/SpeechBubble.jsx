import React from "react";
import { Group, Ellipse, Line, Text } from "react-konva";

export default function SpeechBubble({
  element,
  selected,
  nodeRef,
  onClick,
  onDragEnd,
  onTransformEnd,
  onDblClick,
}) {
  return (
    <Group
      ref={selected ? nodeRef : null}
      x={element.x}
      y={element.y}
      draggable
      rotation={element.rotation}
      onClick={onClick}
      onTap={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      onDblClick={onDblClick}
    >
      <Ellipse
        width={element.width}
        height={element.height}
        fill="white"
        stroke={selected ? "#ff4d6d" : "black"}
        strokeWidth={selected ? 4 : 2}
      />

      <Line
        points={[
          element.width * 0.35,
          element.height,

          element.width * 0.45,
          element.height + 28,

          element.width * 0.55,
          element.height,
        ]}
        closed
        fill="white"
        stroke="black"
        strokeWidth={2}
      />

      <Text
        text={element.text}
        width={element.width}
        height={element.height}
        align="center"
        verticalAlign="middle"
        fontSize={element.fontSize}
        fill="black"
        padding={15}
      />
    </Group>
  );
}
