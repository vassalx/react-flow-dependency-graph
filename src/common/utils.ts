/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position } from '@xyflow/react';
 
// returns the position (top,right,bottom or right) passed node compared to
function getParams(nodeA: any, nodeB: any) {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);
 
  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);
 
  let position;
 
  // when the horizontal difference between the nodes is bigger, we use Position.Left or Position.Right for the handle
  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }
 
  const [x, y] = getHandleCoordsByPosition(nodeA, position);
  return [x, y, position];
}
 
function getHandleCoordsByPosition(node: any, handlePosition: Position) {
  const x = node.internals.positionAbsolute.x;
  const y = node.internals.positionAbsolute.y;
  const width = node.measured.width;
  const height = node.measured.height;

  switch (handlePosition) {
    case Position.Left:
      return [x, y + height / 2];
    case Position.Right:
      return [x + width, y + height / 2];
    case Position.Top:
      return [x + width / 2, y];
    case Position.Bottom:
      return [x + width / 2, y + height];
    default:
      // fallback to center if unknown
      return [x + width / 2, y + height / 2];
  }
}
 
function getNodeCenter(node: any) {
  return {
    x: node.internals.positionAbsolute.x + node.measured.width / 2,
    y: node.internals.positionAbsolute.y + node.measured.height / 2,
  };
}
 
// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: any, target: any) {
  const [sx, sy, sourcePos] = getParams(source, target);
  const [tx, ty, targetPos] = getParams(target, source);
 
  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}