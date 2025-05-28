
import React from "react";
import { Button } from "@/components/ui/button";

interface Version {
  id: string;
  version_number: number;
  name: string;
  is_current: boolean;
  created_at: string;
}

interface CurveVersionChartProps {
  versions: Version[];
  currentVersionId: string | null;
  onVersionSelect: (versionId: string) => void;
}

const CurveVersionChart = ({ versions, currentVersionId, onVersionSelect }: CurveVersionChartProps) => {
  // Sort versions by version number
  const sortedVersions = [...versions].sort((a, b) => a.version_number - b.version_number);

  // Calculate positions for the branching layout
  const getNodePosition = (index: number, total: number) => {
    const baseY = 60;
    const spacing = 120;
    return {
      x: 60 + (index * 180),
      y: baseY + (index % 2 === 0 ? 0 : 40), // Alternate heights for visual branching
    };
  };

  const renderConnectionLines = () => {
    if (sortedVersions.length <= 1) return null;

    return sortedVersions.slice(0, -1).map((version, index) => {
      const currentPos = getNodePosition(index, sortedVersions.length);
      const nextPos = getNodePosition(index + 1, sortedVersions.length);
      
      return (
        <line
          key={`line-${version.id}`}
          x1={currentPos.x + 50}
          y1={currentPos.y + 25}
          x2={nextPos.x}
          y2={nextPos.y + 25}
          stroke="#e5e7eb"
          strokeWidth="2"
          strokeDasharray={index % 2 === 0 ? "none" : "5,5"}
        />
      );
    });
  };

  const renderVersionNode = (version: Version, index: number) => {
    const position = getNodePosition(index, sortedVersions.length);
    const isSelected = version.id === currentVersionId;
    const isCurrent = version.is_current;

    return (
      <g key={version.id} transform={`translate(${position.x}, ${position.y})`}>
        {/* Node circle */}
        <circle
          cx="25"
          cy="25"
          r="20"
          fill={isSelected ? "#2A6B6B" : isCurrent ? "#3b82f6" : "#f3f4f6"}
          stroke={isSelected ? "#2A6B6B" : isCurrent ? "#3b82f6" : "#d1d5db"}
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200 hover:stroke-[#2A6B6B] hover:stroke-4"
          onClick={() => onVersionSelect(version.id)}
        />
        
        {/* Version number */}
        <text
          x="25"
          y="30"
          textAnchor="middle"
          className={`text-sm font-medium cursor-pointer ${
            isSelected || isCurrent ? "fill-white" : "fill-gray-600"
          }`}
          onClick={() => onVersionSelect(version.id)}
        >
          v{version.version_number}
        </text>
        
        {/* Version info card */}
        <foreignObject x="-40" y="55" width="130" height="80">
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full h-auto p-2 text-xs ${
                isSelected 
                  ? 'bg-[#2A6B6B]/10 border border-[#2A6B6B]/30 text-[#2A6B6B]' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onVersionSelect(version.id)}
            >
              <div className="space-y-1">
                <div className="font-medium">
                  Version {version.version_number}
                  {isCurrent && (
                    <div className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded mt-1">
                      Current
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(version.created_at).toLocaleDateString()}
                </div>
              </div>
            </Button>
          </div>
        </foreignObject>
      </g>
    );
  };

  if (sortedVersions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No versions available
      </div>
    );
  }

  const chartWidth = Math.max(400, sortedVersions.length * 180 + 120);
  const chartHeight = 200;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="border border-gray-200 rounded-lg bg-white"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Connection lines */}
          {renderConnectionLines()}
          
          {/* Version nodes */}
          {sortedVersions.map((version, index) => renderVersionNode(version, index))}
          
          {/* Main branch line */}
          <line
            x1="60"
            y1="85"
            x2={chartWidth - 60}
            y2="85"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#2A6B6B]"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300"></div>
          <span>Previous</span>
        </div>
      </div>
    </div>
  );
};

export default CurveVersionChart;
