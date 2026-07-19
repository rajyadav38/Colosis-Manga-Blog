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
  const width = element.width;
  const height = element.height;

  return (
    <Group
      ref={selected ? nodeRef : null}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      draggable
      onClick={onClick}
      onTap={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      onDblClick={onDblClick}
    >
      {/* Bubble */}
      <Ellipse
        x={width / 2}
        y={height / 2}
        radiusX={width / 2}
        radiusY={height / 2}
        fill="white"
        stroke={selected ? "#ff4d6d" : "black"}
        strokeWidth={selected ? 4 : 2}
      />

      {/* Tail */}
      <Line
        points={[
          width * 0.42,
          height,

          width * 0.5,
          height + 28,

          width * 0.58,
          height,
        ]}
        closed
        fill="white"
        stroke="black"
        strokeWidth={2}
      />

      {/* Text */}
      <Text
        x={15}
        y={15}
        width={width - 30}
        height={height - 30}
        text={element.text}
        fontSize={element.fontSize}
        fontFamily="Anime Ace"
        fill="black"
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    </Group>
  );
}
