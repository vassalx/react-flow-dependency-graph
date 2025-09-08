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
 
  const [x, y] = getHandleCoordsByPosition(nodeA);
  return [x, y, position];
}
 
function getHandleCoordsByPosition(node: any) {
  console.log(node.internals)
 
  const x = node.internals.positionAbsolute.x + node.measured.width/2;
  const y = node.internals.positionAbsolute.y + node.measured.height/2;
 
  return [x, y];
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