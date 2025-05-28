
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
    const baseY = 80;
    const spacing = 140;
    const branchOffset = index % 2 === 0 ? 0 : 60; // Alternate branch heights
    return {
      x: 80 + (index * spacing),
      y: baseY + branchOffset,
    };
  };

  // Create smooth orthogonal path between two points
  const createSmoothPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const radius = 8;
    
    if (y1 === y2) {
      // Horizontal line
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    } else {
      // Curved connection with smooth corners
      if (x2 > x1) {
        if (y2 > y1) {
          // Going down and right
          return `M ${x1} ${y1} 
                  L ${midX - radius} ${y1} 
                  Q ${midX} ${y1} ${midX} ${y1 + radius}
                  L ${midX} ${y2 - radius}
                  Q ${midX} ${y2} ${midX + radius} ${y2}
                  L ${x2} ${y2}`;
        } else {
          // Going up and right
          return `M ${x1} ${y1} 
                  L ${midX - radius} ${y1} 
                  Q ${midX} ${y1} ${midX} ${y1 - radius}
                  L ${midX} ${y2 + radius}
                  Q ${midX} ${y2} ${midX + radius} ${y2}
                  L ${x2} ${y2}`;
        }
      }
    }
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  };

  const renderConnectionLines = () => {
    if (sortedVersions.length <= 1) return null;

    return sortedVersions.slice(0, -1).map((version, index) => {
      const currentPos = getNodePosition(index, sortedVersions.length);
      const nextPos = getNodePosition(index + 1, sortedVersions.length);
      
      const pathData = createSmoothPath(
        currentPos.x + 25, 
        currentPos.y + 25, 
        nextPos.x + 25, 
        nextPos.y + 25
      );
      
      return (
        <g key={`connection-${version.id}`}>
          {/* Glass-like shadow */}
          <path
            d={pathData}
            stroke="rgba(42, 107, 107, 0.1)"
            strokeWidth="4"
            fill="none"
            transform="translate(1, 2)"
          />
          {/* Main connection line */}
          <path
            d={pathData}
            stroke="rgba(42, 107, 107, 0.3)"
            strokeWidth="2"
            fill="none"
            className="transition-all duration-300"
          />
          {/* Glass highlight */}
          <path
            d={pathData}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
            fill="none"
            transform="translate(0, -0.5)"
          />
        </g>
      );
    });
  };

  const renderVersionNode = (version: Version, index: number) => {
    const position = getNodePosition(index, sortedVersions.length);
    const isSelected = version.id === currentVersionId;
    const isCurrent = version.is_current;

    return (
      <g key={version.id} transform={`translate(${position.x}, ${position.y})`}>
        {/* Node glow effect */}
        {(isSelected || isCurrent) && (
          <circle
            cx="25"
            cy="25"
            r="28"
            fill={isSelected ? "rgba(42, 107, 107, 0.15)" : "rgba(59, 130, 246, 0.15)"}
            className="animate-pulse-soft"
          />
        )}
        
        {/* Node shadow */}
        <circle
          cx="27"
          cy="27"
          r="22"
          fill="rgba(0, 0, 0, 0.1)"
          className="blur-sm"
        />
        
        {/* Main node circle with glass effect */}
        <circle
          cx="25"
          cy="25"
          r="22"
          fill={isSelected ? "#2A6B6B" : isCurrent ? "#3b82f6" : "rgba(255, 255, 255, 0.9)"}
          stroke={isSelected ? "#2A6B6B" : isCurrent ? "#3b82f6" : "rgba(42, 107, 107, 0.2)"}
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:stroke-[#2A6B6B] hover:stroke-[3px] filter drop-shadow-sm"
          onClick={() => onVersionSelect(version.id)}
        />
        
        {/* Glass highlight */}
        <circle
          cx="20"
          cy="20"
          r="8"
          fill="rgba(255, 255, 255, 0.3)"
          className="pointer-events-none"
        />
        
        {/* Version number */}
        <text
          x="25"
          y="31"
          textAnchor="middle"
          className={`text-sm font-semibold cursor-pointer transition-colors duration-300 ${
            isSelected || isCurrent ? "fill-white" : "fill-gray-700"
          }`}
          onClick={() => onVersionSelect(version.id)}
        >
          v{version.version_number}
        </text>
        
        {/* Version info card with glass styling */}
        <foreignObject x="-45" y="60" width="140" height="90">
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full h-auto p-3 text-xs backdrop-blur-sm transition-all duration-300 ${
                isSelected 
                  ? 'bg-gradient-to-br from-[#2A6B6B]/20 to-[#2A6B6B]/10 border border-[#2A6B6B]/30 text-[#2A6B6B] shadow-lg' 
                  : 'bg-white/60 hover:bg-white/80 border border-white/40 shadow-md hover:shadow-lg'
              }`}
              onClick={() => onVersionSelect(version.id)}
            >
              <div className="space-y-2">
                <div className="font-semibold">
                  Version {version.version_number}
                  {isCurrent && (
                    <div className="text-xs bg-blue-500/20 text-blue-700 px-2 py-1 rounded-full mt-1 backdrop-blur-sm">
                      Current
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-600">
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
      <div className="text-center text-gray-500 py-6 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
        No versions available
      </div>
    );
  }

  const chartWidth = Math.max(500, sortedVersions.length * 140 + 160);
  const chartHeight = 250;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="glass-card bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-4 shadow-xl">
          <svg
            width={chartWidth}
            height={chartHeight}
            className="w-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {/* Background gradient */}
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(42, 107, 107, 0.05)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#bgGradient)" rx="12" />
            
            {/* Main timeline */}
            <line
              x1="80"
              y1="105"
              x2={chartWidth - 80}
              y2="105"
              stroke="rgba(42, 107, 107, 0.2)"
              strokeWidth="3"
              strokeDasharray="4,4"
            />
            
            {/* Connection lines */}
            {renderConnectionLines()}
            
            {/* Version nodes */}
            {sortedVersions.map((version, index) => renderVersionNode(version, index))}
          </svg>
        </div>
      </div>
      
      {/* Legend with glass styling */}
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
          <div className="w-4 h-4 rounded-full bg-[#2A6B6B] shadow-sm"></div>
          <span className="text-gray-700 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
          <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm"></div>
          <span className="text-gray-700 font-medium">Current</span>
        </div>
        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 shadow-sm"></div>
          <span className="text-gray-700 font-medium">Previous</span>
        </div>
      </div>
    </div>
  );
};

export default CurveVersionChart;
