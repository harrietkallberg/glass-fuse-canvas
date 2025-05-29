
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoveRight, Settings, Copy, Trash2 } from "lucide-react";
import { Version } from './types';

interface GridVersionNodeProps {
  version: Version;
  position: { x: number; y: number };
  isSelected: boolean;
  onVersionSelect: (versionId: string) => void;
  onSetMainVersion?: (versionId: string) => void;
  onNewVersion?: () => void;
  nodeWidth: number;
  nodeHeight: number;
}

const GridVersionNode = ({
  version,
  position,
  isSelected,
  onVersionSelect,
  onSetMainVersion,
  onNewVersion,
  nodeWidth,
  nodeHeight
}: GridVersionNodeProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const isTemplate = version.version_number === 0 || version.version_number === "Template";
  const isCurrent = version.is_current;

  // Colors
  const templateColor = "#8B5CF6"; // Purple for template
  const versionColor = "#6B7280"; // Gray for versions
  const selectedColor = "#3B82F6"; // Blue for selected

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
          rx="8"
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
        rx="8"
        fill="white"
        stroke={strokeColor}
        strokeWidth={isSelected ? "2" : "1"}
        className="cursor-pointer transition-all duration-200 hover:stroke-2 drop-shadow-sm"
        onClick={handleNodeClick}
      />
      
      {/* Node content */}
      <foreignObject x="8" y="8" width={nodeWidth - 16} height={nodeHeight - 16}>
        <div className="h-full flex flex-col justify-center items-center text-center">
          {/* Version label */}
          <div className={`font-semibold text-sm ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
            {isTemplate ? "Template" : `v${version.version_number}`}
          </div>
          
          {/* Date */}
          <div className="text-xs text-gray-500 mt-1">
            {new Date(version.created_at).toLocaleDateString()}
          </div>
          
          {/* Current badge */}
          {isCurrent && !isTemplate && (
            <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-2">
              Current
            </div>
          )}
        </div>
      </foreignObject>
      
      {/* Action buttons when selected */}
      {isSelected && showOptions && (
        <foreignObject x="0" y={nodeHeight + 12} width={nodeWidth} height="120">
          <div className="flex flex-col gap-1 bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
            {/* Template options */}
            {isTemplate && onNewVersion && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onNewVersion();
                  setShowOptions(false);
                }}
                className="text-xs gap-1 h-7"
              >
                <Plus className="h-3 w-3" />
                Create New Version
              </Button>
            )}
            
            {/* Version options */}
            {!isTemplate && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement move forward
                    setShowOptions(false);
                  }}
                  className="text-xs gap-1 h-7"
                >
                  <MoveRight className="h-3 w-3" />
                  Move Forward
                </Button>
                
                {onNewVersion && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewVersion();
                      setShowOptions(false);
                    }}
                    className="text-xs gap-1 h-7"
                  >
                    <Plus className="h-3 w-3" />
                    Create Branch
                  </Button>
                )}
                
                {!isCurrent && onSetMainVersion && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetMainVersion(version.id);
                      setShowOptions(false);
                    }}
                    className="text-xs gap-1 h-7"
                  >
                    <Settings className="h-3 w-3" />
                    Set as Current
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement duplicate
                    setShowOptions(false);
                  }}
                  className="text-xs gap-1 h-7"
                >
                  <Copy className="h-3 w-3" />
                  Duplicate
                </Button>
              </>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default GridVersionNode;
