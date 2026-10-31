import { describe, it, expect } from 'vitest';
import { calculateLayout } from '../dagreLayout';
import { computeOrthogonalRoute, buildRoundedPath } from '../orthogonalRouter';
import { ErdSchema, ErdTable } from '../../types/erd';

describe('ERD Layout & Router', () => {
  const mockTableA: ErdTable = {
    name: 'users',
    color: 'blue',
    fields: [
      { name: 'id', type: 'string', isPk: true, isFk: false, isNullable: false, isUnique: false, modifiers: ['pk'], rawLine: '', lineNumber: 1 },
      { name: 'email', type: 'string', isPk: false, isFk: false, isNullable: false, isUnique: false, modifiers: [], rawLine: '', lineNumber: 2 },
    ],
    lineNumber: 1,
  };

  const mockTableB: ErdTable = {
    name: 'orders',
    color: 'orange',
    fields: [
      { name: 'id', type: 'string', isPk: true, isFk: false, isNullable: false, isUnique: false, modifiers: ['pk'], rawLine: '', lineNumber: 4 },
      { name: 'userId', type: 'string', isPk: false, isFk: true, isNullable: false, isUnique: false, modifiers: ['fk'], rawLine: '', lineNumber: 5 },
    ],
    lineNumber: 4,
  };

  it('calculates table positions with dagre layout', () => {
    const schema: ErdSchema = {
      tables: [mockTableA, mockTableB],
      relations: [
        {
          sourceTable: 'users',
          sourceField: 'id',
          targetTable: 'orders',
          targetField: 'userId',
          operator: '<',
          sourceCardinality: '1',
          targetCardinality: '*',
          rawLine: '',
          lineNumber: 7,
        },
      ],
    };

    const laidOut = calculateLayout(schema);
    expect(laidOut).toHaveLength(2);
    expect(laidOut[0].x).toBeDefined();
    expect(laidOut[0].y).toBeDefined();
    expect(laidOut[0].width).toBeGreaterThan(200);
    expect(laidOut[0].height).toBeGreaterThan(50);
  });

  it('computes orthogonal route between fields with cardinalities', () => {
    const tA = { ...mockTableA, x: 100, y: 100, width: 250, height: 120 };
    const tB = { ...mockTableB, x: 500, y: 100, width: 250, height: 120 };

    const route = computeOrthogonalRoute(tA, 0, tB, 1);
    expect(route.pathD).toContain('M');
    expect(route.sourceAnchor.x).toBe(350); // right side of tA
    expect(route.targetAnchor.x).toBe(500); // left side of tB
    expect(route.sourceSide).toBe('right');
    expect(route.targetSide).toBe('left');
    expect(route.sourceCardPoint).toBeDefined();
    expect(route.targetCardPoint).toBeDefined();
  });

  it('builds smooth rounded paths', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
    ];
    const path = buildRoundedPath(points, 8);
    expect(path).toContain('M 0 0');
    expect(path).toContain('Q');
    expect(path).toContain('L 50 50');
  });
});
