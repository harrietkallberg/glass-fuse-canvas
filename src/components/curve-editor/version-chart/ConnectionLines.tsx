
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
          
          lines.push(
            <path
              key={`vertical-${generation}-${draft}`}
              d={`M ${parentPos.x + 30} ${parentPos.y + 30} L ${parentPos.x + 30} ${currentPos.y + 30} L ${currentPos.x + 30} ${currentPos.y + 30}`}
              stroke="rgba(249, 115, 22, 0.4)"
              strokeWidth="2"
              fill="none"
            />
          );
        }
      });
      
      // Connect main versions horizontally between generations
      if (genIndex < sortedGenerations.length - 1) {
        const currentMainPos = getNodePosition(generation, 0);
        const nextMainPos = getNodePosition(sortedGenerations[genIndex + 1], 0);
        
        lines.push(
          <path
            key={`horizontal-${generation}`}
            d={`M ${currentMainPos.x + 30} ${currentMainPos.y + 30} L ${nextMainPos.x + 30} ${nextMainPos.y + 30}`}
            stroke="rgba(51, 195, 240, 0.6)"
            strokeWidth="3"
            fill="none"
          />
        );
        
        // Add arrow marker for progression
        lines.push(
          <ArrowRight 
            key={`arrow-${generation}`}
            className="h-4 w-4 text-[#33C3F0]" 
            style={{ 
              transform: `translate(${(currentMainPos.x + nextMainPos.x) / 2 + 22}px, ${currentMainPos.y + 22}px)`,
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
