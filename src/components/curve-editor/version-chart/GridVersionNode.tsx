
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Copy, MoveRight } from "lucide-react";
import { Version } from './types';

interface GridVersionNodeProps {
  version: Version;
  position: { x: number; y: number };
  isSelected: boolean;
  onVersionSelect: (versionId: string) => void;
  onSetMainVersion?: (versionId: string) => void;
  onEditVersion?: (versionId: string) => void;
  onDuplicateVersion?: () => void;
  onMoveForward?: () => void;
  nodeWidth: number;
  nodeHeight: number;
}

const GridVersionNode = ({
  version,
  position,
  isSelected,
  onVersionSelect,
  onSetMainVersion,
  onEditVersion,
  onDuplicateVersion,
  onMoveForward,
  nodeWidth,
  nodeHeight
}: GridVersionNodeProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const isTemplate = version.version_number === 0 || String(version.version_number) === "Template";
  const isCurrent = version.is_current;

  // Orange/Teal color scheme
  const templateColor = "#f97316"; // Orange-500 for template (ROOT)
  const versionColor = "#14b8a6"; // Teal-500 for versions
  const selectedColor = "#0ea5e9"; // Sky-500 for selected

  const nodeColor = isTemplate ? templateColor : versionColor;
  const strokeColor = isSelected ? selectedColor : nodeColor;

  const handleNodeClick = () => {
    onVersionSelect(version.id);
    setShowOptions(!showOptions);
  };

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      {/* Selection highlight */}
      {isSelected && (
        <rect
          x="-3"
          y="-3"
          width={nodeWidth + 6}
          height={nodeHeight + 6}
          rx="12"
          fill="none"
          stroke={selectedColor}
          strokeWidth="2"
          className="animate-pulse"
        />
      )}
      
      {/* Main node rectangle */}
      <rect
        x="0"
        y="0"
        width={nodeWidth}
        height={nodeHeight}
        rx="12"
        fill="white"
        stroke={strokeColor}
        strokeWidth={isSelected ? "3" : "2"}
        className="cursor-pointer transition-all duration-200 hover:stroke-3 drop-shadow-lg"
        onClick={handleNodeClick}
      />
      
      {/* Node content */}
      <foreignObject x="12" y="12" width={nodeWidth - 24} height={nodeHeight - 24}>
        <div className="h-full flex flex-col justify-center items-center text-center">
          {/* Version label */}
          <div className={`font-bold text-base ${isSelected ? 'text-sky-600' : isTemplate ? 'text-orange-600' : 'text-teal-600'}`}>
            {isTemplate ? "ROOT" : `v${version.version_number}`}
          </div>
          
          {/* Template subtitle */}
          {isTemplate && (
            <div className="text-xs text-orange-500 font-medium">
              Template
            </div>
          )}
          
          {/* Date */}
          <div className="text-xs text-gray-500 mt-2">
            {new Date(version.created_at).toLocaleDateString()}
          </div>
          
          {/* Current badge */}
          {isCurrent && !isTemplate && (
            <div className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full mt-2 font-medium">
              Current
            </div>
          )}
        </div>
      </foreignObject>
      
      {/* Action buttons when selected */}
      {isSelected && showOptions && (
        <foreignObject x="0" y={nodeHeight + 16} width={nodeWidth} height="140">
          <div className="flex flex-col gap-2 bg-white border border-gray-200 rounded-lg p-3 shadow-xl">
            {/* Edit This Version */}
            {onEditVersion && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditVersion(version.id);
                  setShowOptions(false);
                }}
                className="text-xs gap-2 h-8 justify-start"
              >
                <Edit className="h-3 w-3" />
                Edit This Version
              </Button>
            )}
            
            {/* Duplicate to New Version */}
            {onDuplicateVersion && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateVersion();
                  setShowOptions(false);
                }}
                className="text-xs gap-2 h-8 justify-start"
              >
                <Copy className="h-3 w-3" />
                Duplicate to New Version
              </Button>
            )}
            
            {/* Move Forward - only for non-template versions */}
            {!isTemplate && onMoveForward && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveForward();
                  setShowOptions(false);
                }}
                className="text-xs gap-2 h-8 justify-start"
              >
                <MoveRight className="h-3 w-3" />
                Move Forward
              </Button>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default GridVersionNode;
