
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CurveVersionChartProps } from "./types";
import GridVersionNode from "./GridVersionNode";
import GridConnectionLines from "./GridConnectionLines";

const GridVersionChart = ({ 
  versions, 
  currentVersionId, 
  onVersionSelect, 
  onNewVersion,
  onSetMainVersion
}: CurveVersionChartProps) => {
  // Grid configuration
  const GRID_SIZE = 120;
  const NODE_WIDTH = 160;
  const NODE_HEIGHT = 90;
  const GRID_PADDING = 80;

  // Calculate grid positions for versions
  const getGridPosition = (version: any) => {
    // Template is always at (1,1)
    if (version.version_number === 0 || version.version_number === "Template") {
      return { column: 1, row: 1 };
    }
    
    // For now, versions start at column 1, incrementing rows
    // Later this will be user-configurable for horizontal movement
    const versionIndex = versions.filter(v => v.version_number !== 0 && v.version_number !== "Template").indexOf(version);
    return { column: 1, row: versionIndex + 2 };
  };

  // Convert grid position to pixel coordinates
  const gridToPixels = (column: number, row: number) => ({
    x: GRID_PADDING + (column - 1) * (NODE_WIDTH + GRID_SIZE),
    y: GRID_PADDING + (row - 1) * (NODE_HEIGHT + GRID_SIZE)
  });

  // Check if we have a template version
  const templateVersion = versions.find(v => v.version_number === 0 || v.version_number === "Template");
  const hasTemplate = !!templateVersion;

  // If no versions at all, show create template state
  if (versions.length === 0) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="text-center text-gray-500 py-12">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Template Created</h3>
            <p className="text-sm text-gray-500 mb-6">
              Create your project template first in the Project Information section.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate canvas dimensions
  const maxColumn = Math.max(...versions.map(v => getGridPosition(v).column));
  const maxRow = Math.max(...versions.map(v => getGridPosition(v).row));
  const canvasWidth = Math.max(GRID_PADDING * 2 + maxColumn * (NODE_WIDTH + GRID_SIZE), 1000);
  const canvasHeight = Math.max(GRID_PADDING * 2 + maxRow * (NODE_HEIGHT + GRID_SIZE), 600);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Version Flow</h3>
            <p className="text-sm text-gray-500 mt-1">
              Track your project versions and progression
            </p>
          </div>
        </div>

        {/* Grid Canvas */}
        <div className="overflow-auto border border-gray-100 rounded-xl bg-gradient-to-br from-gray-50/50 to-blue-50/30 shadow-inner">
          <svg
            width={canvasWidth}
            height={canvasHeight}
            className="min-w-full"
          >
            {/* Enhanced Grid Pattern */}
            <defs>
              <pattern
                id="grid"
                width={GRID_SIZE}
                height={GRID_SIZE}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.4"
                />
              </pattern>
              
              {/* Arrow marker for connections */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="12"
                  markerHeight="8"
                  refX="10"
                  refY="4"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 12 4, 0 8"
                    fill="#374151"
                    stroke="#374151"
                    strokeWidth="1"
                  />
                </marker>
              </defs>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Connection Lines */}
            <GridConnectionLines 
              versions={versions}
              getGridPosition={getGridPosition}
              gridToPixels={gridToPixels}
              nodeWidth={NODE_WIDTH}
              nodeHeight={NODE_HEIGHT}
            />
            
            {/* Version Nodes */}
            {versions.map((version) => {
              const gridPos = getGridPosition(version);
              const pixelPos = gridToPixels(gridPos.column, gridPos.row);
              
              return (
                <GridVersionNode
                  key={version.id}
                  version={version}
                  position={pixelPos}
                  isSelected={version.id === currentVersionId}
                  onVersionSelect={onVersionSelect}
                  onSetMainVersion={onSetMainVersion}
                  onNewVersion={onNewVersion}
                  nodeWidth={NODE_WIDTH}
                  nodeHeight={NODE_HEIGHT}
                />
              );
            })}
          </svg>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          {hasTemplate ? (
            <span>Click nodes to view options • Template is the starting point for all versions</span>
          ) : (
            <span>Complete your project template to start creating versions</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridVersionChart;
