export const HEADER_HEIGHT = 44;
export const ROW_HEIGHT = 28;
export const BASE_WIDTH = 270;

export interface LayoutOptions {
  rankdir?: 'TB' | 'LR';
  nodeWidth?: number;
  rowHeight?: number;
  headerHeight?: number;
}

export interface RoutePoint {
  x: number;
  y: number;
}

export interface OrthogonalPathResult {
  pathD: string;
  sourceAnchor: RoutePoint;
  targetAnchor: RoutePoint;
  sourceSide: 'left' | 'right';
  targetSide: 'left' | 'right';
  sourceCardPoint: RoutePoint;
  targetCardPoint: RoutePoint;
}
