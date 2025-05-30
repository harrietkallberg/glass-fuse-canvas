
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
  const templateVersion = versions.find(v => v.version_number === 0 || String(v.version_number) === "Template");
  const otherVersions = versions.filter(v => v.version_number !== 0 && String(v.version_number) !== "Template");

  if (!templateVersion || otherVersions.length === 0) return null;

  const templatePos = getGridPosition(templateVersion);
  const templatePixels = gridToPixels(templatePos.column, templatePos.row);

  // Template center point (right side for outgoing connections)
  const templateRightX = templatePixels.x + nodeWidth;
  const templateCenterY = templatePixels.y + nodeHeight / 2;

  return (
    <g>
      {otherVersions.map((version) => {
        const versionPos = getGridPosition(version);
        const versionPixels = gridToPixels(versionPos.column, versionPos.row);
        
        // Version center point (left side for incoming connections)
        const versionLeftX = versionPixels.x;
        const versionCenterY = versionPixels.y + nodeHeight / 2;

        // Direct horizontal connection from template to version
        return (
          <g key={`connection-${version.id}`}>
            {/* Main connection line - dashed orange to teal gradient */}
            <line
              x1={templateRightX}
              y1={templateCenterY}
              x2={versionLeftX}
              y2={versionCenterY}
              stroke="#f97316"
              strokeWidth="3"
              strokeDasharray="8,4"
              strokeOpacity="0.8"
              className="transition-all duration-300"
            />
            
            {/* Connection points */}
            <circle
              cx={templateRightX}
              cy={templateCenterY}
              r="6"
              fill="#f97316"
              stroke="white"
              strokeWidth="2"
            />
            
            <circle
              cx={versionLeftX}
              cy={versionCenterY}
              r="6"
              fill="#14b8a6"
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
