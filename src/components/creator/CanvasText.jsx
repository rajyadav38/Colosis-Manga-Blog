import React from "react";
import { Text } from "react-konva";

export default function CanvasText({
  element,
  selected,
  nodeRef,
  onClick,
  onDragEnd,
  onTransformEnd,
  onDblClick,
}) {
  return (
    <Text
      ref={selected ? nodeRef : null}
      x={element.x}
      y={element.y}
      draggable
      rotation={element.rotation}
      text={element.text}
      fontSize={element.fontSize}
      fill="white"
      onClick={onClick}
      onTap={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      onDblClick={onDblClick}
    />
  );
}
