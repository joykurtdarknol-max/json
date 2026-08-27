import React from 'react';
import { BaseEdge, type EdgeProps } from '@xyflow/react';

export const RedStringEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Exact gravitational sag based on span distance
  const sag = Math.min(45, Math.max(12, distance * 0.09));

  // Mathematically balanced Quadratic Control Point for pure downward gravitational droop
  const controlX = (sourceX + targetX) / 2;
  const controlY = (sourceY + targetY) / 2 + sag * 2;

  const edgePath = `M ${sourceX},${sourceY} Q ${controlX},${controlY} ${targetX},${targetY}`;

  return (
    <g className="pointer-events-auto cursor-pointer group">
      {/* Invisible broad hitbox for easy scissor cut & selection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={18}
      />

      {/* Realistic soft ambient shadow cast onto corkboard */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(0, 0, 0, 0.4)"
        strokeWidth={3.5}
        strokeLinecap="round"
        transform="translate(1, 3.5)"
      />

      {/* Primary Matte Crimson Woolen Thread */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: '#b91c1c',
          strokeWidth: 2.8,
          strokeLinecap: 'round',
        }}
      />
    </g>
  );
};
