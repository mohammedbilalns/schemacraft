import React from 'react';
import { ErdTable, ErdRelation } from '../types/erd';
import { computeOrthogonalRoute } from '../erd/orthogonalRouter';

interface RelationEdgeProps {
  relation: ErdRelation;
  srcTable: ErdTable;
  tgtTable: ErdTable;
  isHighlighted: boolean;
}

export const RelationEdge: React.FC<RelationEdgeProps> = ({
  relation,
  srcTable,
  tgtTable,
  isHighlighted,
}) => {
  const srcFieldIdx = srcTable.fields.findIndex(
    (f) => f.name.toLowerCase() === relation.sourceField.toLowerCase()
  );
  const tgtFieldIdx = tgtTable.fields.findIndex(
    (f) => f.name.toLowerCase() === relation.targetField.toLowerCase()
  );

  const route = computeOrthogonalRoute(srcTable, srcFieldIdx, tgtTable, tgtFieldIdx);

  return (
    <g className="relation-group pointer-events-none">
      <path
        d={route.pathD}
        fill="none"
        stroke={isHighlighted ? '#60a5fa' : 'rgba(255, 255, 255, 0.65)'}
        strokeWidth={isHighlighted ? 2 : 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx={route.sourceAnchor.x}
        cy={route.sourceAnchor.y}
        r={3.5}
        fill="#ffffff"
        stroke="#121316"
        strokeWidth={1}
      />
      <circle
        cx={route.targetAnchor.x}
        cy={route.targetAnchor.y}
        r={3.5}
        fill="#ffffff"
        stroke="#121316"
        strokeWidth={1}
      />

      <text
        x={route.sourceCardPoint.x}
        y={route.sourceCardPoint.y}
        fill="#d1d5db"
        fontSize="11"
        fontFamily="monospace"
        fontWeight="600"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {relation.sourceCardinality}
      </text>

      <text
        x={route.targetCardPoint.x}
        y={route.targetCardPoint.y}
        fill="#d1d5db"
        fontSize="11"
        fontFamily="monospace"
        fontWeight="600"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {relation.targetCardinality}
      </text>
    </g>
  );
};
