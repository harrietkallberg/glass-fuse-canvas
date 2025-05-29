
import React from "react";
import { ArrowRight } from "lucide-react";
import { getNodePosition } from './utils';

interface ConnectionLinesProps {
  groupedVersions: Record<number, Record<number, any[]>>;
  sortedGenerations: number[];
}

const ConnectionLines = ({ groupedVersions, sortedGenerations }: ConnectionLinesProps) => {
  const renderConnectionLines = () => {
    const lines: JSX.Element[] = [];
    
    sortedGenerations.forEach((generation, genIndex) => {
      const draftsInGeneration = Object.keys(groupedVersions[generation]).map(Number).sort((a, b) => a - b);
      
      // Connect drafts vertically within same generation
      draftsInGeneration.forEach((draft, draftIndex) => {
        if (draftIndex > 0) {
          const parentPos = getNodePosition(generation, draftsInGeneration[draftIndex - 1]);
          const currentPos = getNodePosition(generation, draft);
          
          // Vertical line connecting drafts
          lines.push(
            <line
              key={`vertical-${generation}-${draft}`}
              x1={parentPos.x + 60}
              y1={parentPos.y + 60}
              x2={parentPos.x + 60}
              y2={currentPos.y}
              stroke="rgba(156, 163, 175, 0.6)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          );
          
          // Horizontal connector to current position
          lines.push(
            <line
              key={`horizontal-connector-${generation}-${draft}`}
              x1={parentPos.x + 60}
              y1={currentPos.y}
              x2={currentPos.x + 60}
              y2={currentPos.y}
              stroke="rgba(156, 163, 175, 0.6)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          );
        }
      });
      
      // Connect main versions horizontally between generations
      if (genIndex < sortedGenerations.length - 1) {
        const currentMainPos = getNodePosition(generation, 0);
        const nextMainPos = getNodePosition(sortedGenerations[genIndex + 1], 0);
        
        // Main progression line
        lines.push(
          <line
            key={`main-progression-${generation}`}
            x1={currentMainPos.x + 120}
            y1={currentMainPos.y + 30}
            x2={nextMainPos.x}
            y2={nextMainPos.y + 30}
            stroke="rgba(51, 195, 240, 0.8)"
            strokeWidth="3"
          />
        );
        
        // Add arrow marker for progression
        const midX = (currentMainPos.x + 120 + nextMainPos.x) / 2;
        const midY = currentMainPos.y + 30;
        
        lines.push(
          <ArrowRight 
            key={`arrow-${generation}`}
            className="h-4 w-4 text-[#33C3F0]" 
            style={{ 
              transform: `translate(${midX - 8}px, ${midY - 8}px)`,
              position: 'absolute'
            }} 
          />
        );
      }
    });
    
    return lines;
  };

  return <>{renderConnectionLines()}</>;
};

export default ConnectionLines;
