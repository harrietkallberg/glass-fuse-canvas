
import React from "react";
import { Version } from './types';

interface GridConnectionLinesProps {
  versions: Version[];
  getGridPosition: (version: Version) => { column: number; row: number };
  gridToPixels: (column: number, row: number) => { x: number; y: number };
  nodeWidth: number;
  nodeHeight: number;
}

const GridConnectionLines = ({
  versions,
  getGridPosition,
  gridToPixels,
  nodeWidth,
  nodeHeight
}: GridConnectionLinesProps) => {
  const templateVersion = versions.find(v => v.version_number === 0 || v.version_number === "Template");
  const otherVersions = versions.filter(v => v.version_number !== 0 && v.version_number !== "Template");

  if (!templateVersion || otherVersions.length === 0) return null;

  const templatePos = getGridPosition(templateVersion);
  const templatePixels = gridToPixels(templatePos.column, templatePos.row);

  // Template center point (bottom center for outgoing connections)
  const templateCenterX = templatePixels.x + nodeWidth / 2;
  const templateBottomY = templatePixels.y + nodeHeight;

  return (
    <g>
      {/* Main vertical trunk from template */}
      {otherVersions.length > 0 && (
        <line
          x1={templateCenterX}
          y1={templateBottomY}
          x2={templateCenterX}
          y2={templateBottomY + 60}
          stroke="#4f46e5"
          strokeWidth="4"
          strokeOpacity="0.9"
          markerEnd="url(#arrowhead)"
        />
      )}

      {otherVersions.map((version, index) => {
        const versionPos = getGridPosition(version);
        const versionPixels = gridToPixels(versionPos.column, versionPos.row);
        
        // Version center point (top center for incoming connections)
        const versionCenterX = versionPixels.x + nodeWidth / 2;
        const versionTopY = versionPixels.y;

        // Connection path: vertical down from template trunk, then horizontal to version
        const trunkY = templateBottomY + 60;
        const branchStartY = trunkY;
        const branchEndY = versionTopY - 20;

        return (
          <g key={`connection-${version.id}`}>
            {/* Horizontal branch from trunk to version column */}
            <line
              x1={templateCenterX}
              y1={branchStartY}
              x2={versionCenterX}
              y2={branchStartY}
              stroke="#374151"
              strokeWidth="4"
              strokeOpacity="0.8"
            />
            
            {/* Vertical line down to version */}
            <line
              x1={versionCenterX}
              y1={branchStartY}
              x2={versionCenterX}
              y2={branchEndY}
              stroke="#374151"
              strokeWidth="4"
              strokeOpacity="0.8"
            />
            
            {/* Final connection to version node */}
            <line
              x1={versionCenterX}
              y1={branchEndY}
              x2={versionCenterX}
              y2={versionTopY}
              stroke="#374151"
              strokeWidth="4"
              strokeOpacity="0.8"
              markerEnd="url(#arrowhead)"
            />

            {/* Connection points (larger circles for visibility) */}
            <circle
              cx={templateCenterX}
              cy={branchStartY}
              r="4"
              fill="#4f46e5"
              stroke="white"
              strokeWidth="2"
            />
            
            <circle
              cx={versionCenterX}
              cy={branchStartY}
              r="4"
              fill="#374151"
              stroke="white"
              strokeWidth="2"
            />
          </g>
        );
      })}
    </g>
  );
};

export default GridConnectionLines;
