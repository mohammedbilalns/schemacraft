import { ErdTable } from '../types/erd';
import {
  HEADER_HEIGHT,
  ROW_HEIGHT,
  BASE_WIDTH,
  RoutePoint,
  OrthogonalPathResult,
} from './layoutConstants';

export function computeOrthogonalRoute(
  sourceTable: ErdTable,
  sourceFieldIdx: number,
  targetTable: ErdTable,
  targetFieldIdx: number
): OrthogonalPathResult {
  const sWidth = sourceTable.width || BASE_WIDTH;
  const tWidth = targetTable.width || BASE_WIDTH;

  const sY = (sourceTable.y || 0) + HEADER_HEIGHT + Math.max(0, sourceFieldIdx) * ROW_HEIGHT + ROW_HEIGHT / 2;
  const tY = (targetTable.y || 0) + HEADER_HEIGHT + Math.max(0, targetFieldIdx) * ROW_HEIGHT + ROW_HEIGHT / 2;

  const sLeft = sourceTable.x || 0;
  const sRight = sLeft + sWidth;
  const tLeft = targetTable.x || 0;
  const tRight = tLeft + tWidth;

  let sourceSide: 'left' | 'right' = 'right';
  let targetSide: 'left' | 'right' = 'left';

  if (sRight < tLeft) {
    sourceSide = 'right';
    targetSide = 'left';
  } else if (tRight < sLeft) {
    sourceSide = 'left';
    targetSide = 'right';
  } else {
    const sCenterX = sLeft + sWidth / 2;
    const tCenterX = tLeft + tWidth / 2;
    if (sCenterX < tCenterX) {
      sourceSide = 'right';
      targetSide = 'right';
    } else {
      sourceSide = 'left';
      targetSide = 'left';
    }
  }

  const p0: RoutePoint = { x: sourceSide === 'right' ? sRight : sLeft, y: sY };
  const pEnd: RoutePoint = { x: targetSide === 'right' ? tRight : tLeft, y: tY };

  const offset = 28;
  const points: RoutePoint[] = [p0];
  const p1: RoutePoint = {
    x: sourceSide === 'right' ? p0.x + offset : p0.x - offset,
    y: p0.y,
  };
  points.push(p1);

  if (sourceSide === 'right' && targetSide === 'left') {
    const midX = (p1.x + (pEnd.x - offset)) / 2;
    if (p1.x < pEnd.x - offset) {
      points.push({ x: midX, y: p0.y });
      points.push({ x: midX, y: pEnd.y });
    } else {
      const midY = (p0.y + pEnd.y) / 2;
      points.push({ x: p1.x, y: midY });
      points.push({ x: pEnd.x - offset, y: midY });
    }
  } else if (sourceSide === 'left' && targetSide === 'right') {
    const midX = (p1.x + (pEnd.x + offset)) / 2;
    if (p1.x > pEnd.x + offset) {
      points.push({ x: midX, y: p0.y });
      points.push({ x: midX, y: pEnd.y });
    } else {
      const midY = (p0.y + pEnd.y) / 2;
      points.push({ x: p1.x, y: midY });
      points.push({ x: pEnd.x + offset, y: midY });
    }
  } else if (sourceSide === 'right' && targetSide === 'right') {
    const maxX = Math.max(p0.x, pEnd.x) + offset * 1.5;
    points.push({ x: maxX, y: p0.y });
    points.push({ x: maxX, y: pEnd.y });
  } else {
    const minX = Math.min(p0.x, pEnd.x) - offset * 1.5;
    points.push({ x: minX, y: p0.y });
    points.push({ x: minX, y: pEnd.y });
  }

  points.push({
    x: targetSide === 'right' ? pEnd.x + offset : pEnd.x - offset,
    y: pEnd.y,
  });
  points.push(pEnd);

  const pathD = buildRoundedPath(points, 8);

  return {
    pathD,
    sourceAnchor: p0,
    targetAnchor: pEnd,
    sourceSide,
    targetSide,
    sourceCardPoint: {
      x: sourceSide === 'right' ? p0.x + 12 : p0.x - 14,
      y: p0.y - 6,
    },
    targetCardPoint: {
      x: targetSide === 'right' ? pEnd.x + 12 : pEnd.x - 14,
      y: pEnd.y - 6,
    },
  };
}

export function buildRoundedPath(points: RoutePoint[], radius: number): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const d1 = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    const d2 = Math.hypot(next.x - curr.x, next.y - curr.y);
    const r = Math.min(radius, d1 / 2, d2 / 2);

    if (r <= 0) {
      d += ` L ${curr.x} ${curr.y}`;
      continue;
    }

    const startX = curr.x - (r * (curr.x - prev.x)) / d1;
    const startY = curr.y - (r * (curr.y - prev.y)) / d1;
    const endX = curr.x + (r * (next.x - curr.x)) / d2;
    const endY = curr.y + (r * (next.y - curr.y)) / d2;

    d += ` L ${startX} ${startY}`;
    d += ` Q ${curr.x} ${curr.y} ${endX} ${endY}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}
