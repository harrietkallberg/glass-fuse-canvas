
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
  const templateVersion = versions.find(v => v.version_number === "Template");
  const otherVersions = versions.filter(v => v.version_number !== "Template");

  if (!templateVersion) return null;

  const templatePos = getGridPosition(templateVersion);
  const templatePixels = gridToPixels(templatePos.column, templatePos.row);

  // Template center point (bottom center for outgoing connections)
  const templateCenterX = templatePixels.x + nodeWidth / 2;
  const templateBottomY = templatePixels.y + nodeHeight;

  return (
    <g>
      {otherVersions.map((version) => {
        const versionPos = getGridPosition(version);
        const versionPixels = gridToPixels(versionPos.column, versionPos.row);
        
        // Version center point (top center for incoming connections)
        const versionCenterX = versionPixels.x + nodeWidth / 2;
        const versionTopY = versionPixels.y;

        // Create path: vertical down from template, then horizontal to version
        const path = `
          M ${templateCenterX} ${templateBottomY}
          L ${templateCenterX} ${templateBottomY + 20}
          Q ${templateCenterX} ${templateBottomY + 30} ${templateCenterX + (versionCenterX > templateCenterX ? 10 : -10)} ${templateBottomY + 30}
          L ${versionCenterX + (versionCenterX > templateCenterX ? -10 : 10)} ${templateBottomY + 30}
          Q ${versionCenterX} ${templateBottomY + 30} ${versionCenterX} ${templateBottomY + 40}
          L ${versionCenterX} ${versionTopY - 10}
          Q ${versionCenterX} ${versionTopY} ${versionCenterX} ${versionTopY}
        `;

        return (
          <path
            key={`connection-${version.id}`}
            d={path}
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeDasharray="none"
            className="transition-all duration-200"
          />
        );
      })}
    </g>
  );
};

export default GridConnectionLines;
