import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CurveVersionChartProps } from "./types";
import GridVersionNode from "./GridVersionNode";
import GridConnectionLines from "./GridConnectionLines";
import { useCurves } from "@/hooks/useCurves";

const GridVersionChart = ({ 
  versions, 
  currentVersionId, 
  onVersionSelect, 
  onNewVersion,
  onSetMainVersion,
  onEditVersion,
  onDuplicateVersion,
  onMoveForward,
  onDeleteVersion
}: CurveVersionChartProps) => {
  const { getCurveVersions } = useCurves();
  
  // Get curveId from the URL params or from a parent component
  // Since we need the curveId but it's not in the Version type, we'll need to pass it down
  // For now, let's remove the real-time fetching from this component and handle it in the parent
  
  // Grid configuration - reduced spacing
  const GRID_SIZE = 80; // Reduced from 120
  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 100;
  const GRID_PADDING = 60; // Reduced from 100

  // Calculate grid positions for versions based on template-root structure
  const getGridPosition = (version: any) => {
    // Template (ROOT) is always at (1,1)
    if (version.version_number === 0 || version.version_number === "Template") {
      return { column: 1, row: 1 };
    }
    
    // Parse version number to determine position
    const versionStr = String(version.version_number);
    const parts = versionStr.split('.');
    const major = parseInt(parts[0]) || 0;
    const minor = parseInt(parts[1]) || 0;
    
    // Major versions move horizontally (different columns)
    // Minor versions stack vertically within the same major version (same column, different rows)
    return { 
      column: major + 1, // Start from column 2 (template is column 1)
      row: minor + 1     // Minor versions stack vertically: 0.1 = row 1, 0.2 = row 2, etc.
    };
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
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-100 to-teal-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-orange-500" />
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
  const canvasWidth = GRID_PADDING * 2 + maxColumn * (NODE_WIDTH + GRID_SIZE);
  const canvasHeight = Math.max(GRID_PADDING * 2 + maxRow * (NODE_HEIGHT + GRID_SIZE), 400);

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

        {/* Grid Canvas - aligned with title */}
        <div className="overflow-auto border border-gray-100 rounded-xl bg-gradient-to-br from-orange-50/30 to-teal-50/30 shadow-inner">
          <svg
            width={canvasWidth}
            height={canvasHeight}
            className="w-full"
            style={{ minWidth: canvasWidth }}
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
                  strokeDasharray="5,5"
                  opacity="0.3"
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
                  onEditVersion={onEditVersion}
                  onDuplicateVersion={onDuplicateVersion}
                  onMoveForward={onMoveForward}
                  onDeleteVersion={onDeleteVersion}
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
            <span>Click nodes to view options • Template is the root of all versions</span>
          ) : (
            <span>Complete your project template to start creating versions</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridVersionChart;
