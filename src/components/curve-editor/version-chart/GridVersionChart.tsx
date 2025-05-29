
import React from "react";
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
  const NODE_WIDTH = 140;
  const NODE_HEIGHT = 80;
  const GRID_PADDING = 60;

  // Calculate grid positions for versions
  const getGridPosition = (version: any) => {
    // Template is always at (1,1), versions start at (1, next row)
    if (version.version_number === "Template") {
      return { column: 1, row: 1 };
    }
    
    // For now, just place versions in column 1, incrementing rows
    // Later this will be user-configurable
    const versionIndex = versions.filter(v => v.version_number !== "Template").indexOf(version);
    return { column: 1, row: versionIndex + 2 };
  };

  // Convert grid position to pixel coordinates
  const gridToPixels = (column: number, row: number) => ({
    x: GRID_PADDING + (column - 1) * (NODE_WIDTH + GRID_SIZE),
    y: GRID_PADDING + (row - 1) * (NODE_HEIGHT + GRID_SIZE)
  });

  if (versions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 bg-white rounded-2xl border border-gray-200">
        <p className="text-lg mb-4">No versions available</p>
        <Button onClick={onNewVersion} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Version
        </Button>
      </div>
    );
  }

  // Calculate canvas dimensions
  const maxColumn = Math.max(...versions.map(v => getGridPosition(v).column));
  const maxRow = Math.max(...versions.map(v => getGridPosition(v).row));
  const canvasWidth = GRID_PADDING * 2 + maxColumn * (NODE_WIDTH + GRID_SIZE);
  const canvasHeight = GRID_PADDING * 2 + maxRow * (NODE_HEIGHT + GRID_SIZE);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Version Flow</h3>
          <Button 
            onClick={onNewVersion}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Create New Version
          </Button>
        </div>

        {/* Grid Canvas */}
        <div className="overflow-auto border border-gray-100 rounded-lg bg-gray-50/30">
          <svg
            width={Math.max(canvasWidth, 800)}
            height={Math.max(canvasHeight, 400)}
            className="min-w-full"
          >
            {/* Grid Pattern */}
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
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.5"
                />
              </pattern>
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
                  nodeWidth={NODE_WIDTH}
                  nodeHeight={NODE_HEIGHT}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GridVersionChart;
