
import React from "react";
import { getNodePosition } from "./utils";

interface ConnectionLinesProps {
  groupedVersions: Record<number, Record<number, any[]>>;
  sortedGenerations: number[];
  hasTemplate?: boolean;
}

const ConnectionLines = ({ groupedVersions, sortedGenerations, hasTemplate = false }: ConnectionLinesProps) => {
  const templatePosition = { x: 80, y: 180 }; // Template node center position
  
  return (
    <g className="connection-lines">
      {/* Template to first generation connections */}
      {hasTemplate && sortedGenerations.length > 0 && (
        <>
          {Object.keys(groupedVersions[sortedGenerations[0]]).map(draft => {
            const draftNum = parseInt(draft);
            const firstVersionPosition = getNodePosition(sortedGenerations[0], draftNum, 0, true);
            const startX = templatePosition.x + 30;
            const startY = templatePosition.y;
            const endX = firstVersionPosition.x;
            const endY = firstVersionPosition.y + 30;
            
            return (
              <path
                key={`template-to-${sortedGenerations[0]}-${draft}`}
                d={`M ${startX} ${startY} L ${startX + 50} ${startY} L ${startX + 50} ${endY} L ${endX} ${endY}`}
                stroke="#9CA3AF"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                className="opacity-60"
              />
            );
          })}
        </>
      )}
      
      {/* Generation to generation connections (horizontal) */}
      {sortedGenerations.slice(0, -1).map((generation, index) => {
        const nextGeneration = sortedGenerations[index + 1];
        const currentDrafts = Object.keys(groupedVersions[generation]);
        const nextDrafts = Object.keys(groupedVersions[nextGeneration]);
        
        return currentDrafts.map(draft => {
          const draftNum = parseInt(draft);
          const currentPos = getNodePosition(generation, draftNum, 0, hasTemplate);
          
          return nextDrafts.map(nextDraft => {
            const nextDraftNum = parseInt(nextDraft);
            const nextPos = getNodePosition(nextGeneration, nextDraftNum, 0, hasTemplate);
            
            const startX = currentPos.x + 30;
            const startY = currentPos.y + 30;
            const endX = nextPos.x;
            const endY = nextPos.y + 30;
            const midX = (startX + endX) / 2;
            
            return (
              <path
                key={`${generation}-${draft}-to-${nextGeneration}-${nextDraft}`}
                d={`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`}
                stroke="#33C3F0"
                strokeWidth="2"
                fill="none"
                className="opacity-70"
              />
            );
          });
        });
      })}
      
      {/* Draft connections within same generation (vertical) */}
      {sortedGenerations.map(generation => {
        const drafts = Object.keys(groupedVersions[generation]).map(Number).sort((a, b) => a - b);
        
        return drafts.slice(0, -1).map(draft => {
          const currentPos = getNodePosition(generation, draft, 0, hasTemplate);
          const nextPos = getNodePosition(generation, draft + 1, 0, hasTemplate);
          
          const startX = currentPos.x + 30;
          const startY = currentPos.y + 60;
          const endX = nextPos.x + 30;
          const endY = nextPos.y;
          
          return (
            <path
              key={`${generation}-${draft}-to-${generation}-${draft + 1}`}
              d={`M ${startX} ${startY} L ${startX} ${endY}`}
              stroke="#F97316"
              strokeWidth="2"
              fill="none"
              className="opacity-70"
            />
          );
        });
      })}
    </g>
  );
};

export default ConnectionLines;
