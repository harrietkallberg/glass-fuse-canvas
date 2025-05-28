
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Version {
  id: string;
  version_number: string; // Changed to support semantic versioning like "2.1", "3.4.1"
  name: string;
  is_current: boolean;
  created_at: string;
}

interface CurveVersionChartProps {
  versions: Version[];
  currentVersionId: string | null;
  onVersionSelect: (versionId: string) => void;
  onNewVersion: () => void;
  selectedVersionColor?: string;
}

const CurveVersionChart = ({ 
  versions, 
  currentVersionId, 
  onVersionSelect, 
  onNewVersion,
  selectedVersionColor = "#F97316"
}: CurveVersionChartProps) => {
  // Sort versions by semantic version
  const sortedVersions = [...versions].sort((a, b) => {
    const aNum = parseFloat(a.version_number);
    const bNum = parseFloat(b.version_number);
    return aNum - bNum;
  });

  // Generate pastel colors for versions
  const getVersionColor = (index: number, isSelected: boolean, isCurrent: boolean) => {
    const pastelColors = [
      "#FFB3D1", // Pink
      "#B3E5FF", // Light Blue
      "#D1FFB3", // Light Green
      "#FFD1B3", // Peach
      "#E5B3FF", // Lavender
      "#B3FFE5", // Mint
      "#FFE5B3", // Light Orange
      "#D1B3FF", // Light Purple
    ];
    
    if (isSelected) return selectedVersionColor;
    if (isCurrent) return "#33C3F0";
    return pastelColors[index % pastelColors.length];
  };

  // Calculate positions for a more spread out layout
  const getNodePosition = (index: number, total: number) => {
    const chartWidth = Math.max(800, total * 180 + 200);
    const spacing = (chartWidth - 200) / Math.max(1, total - 1);
    const baseY = 120;
    const branchOffset = index % 2 === 0 ? 0 : 40;
    
    return {
      x: 100 + (index * spacing),
      y: baseY + branchOffset,
    };
  };

  // Create smooth orthogonal path between two points
  const createSmoothPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const radius = 12;
    
    if (y1 === y2) {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    } else {
      if (x2 > x1) {
        if (y2 > y1) {
          return `M ${x1} ${y1} 
                  L ${midX - radius} ${y1} 
                  Q ${midX} ${y1} ${midX} ${y1 + radius}
                  L ${midX} ${y2 - radius}
                  Q ${midX} ${y2} ${midX + radius} ${y2}
                  L ${x2} ${y2}`;
        } else {
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
        currentPos.x + 30, 
        currentPos.y + 30, 
        nextPos.x + 30, 
        nextPos.y + 30
      );
      
      return (
        <g key={`connection-${version.id}`}>
          <path
            d={pathData}
            stroke="rgba(249, 115, 22, 0.15)"
            strokeWidth="6"
            fill="none"
            transform="translate(2, 3)"
            className="blur-sm"
          />
          <path
            d={pathData}
            stroke="rgba(249, 115, 22, 0.4)"
            strokeWidth="3"
            fill="none"
            className="transition-all duration-300"
          />
          <path
            d={pathData}
            stroke="rgba(255, 255, 255, 0.6)"
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
    const nodeColor = getVersionColor(index, isSelected, isCurrent);

    return (
      <g key={version.id} transform={`translate(${position.x}, ${position.y})`}>
        {/* Node glow effect */}
        {(isSelected || isCurrent) && (
          <circle
            cx="30"
            cy="30"
            r="38"
            fill={`${nodeColor}20`}
            className="animate-pulse"
          />
        )}
        
        {/* Node shadow */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="rgba(0, 0, 0, 0.15)"
          className="blur-sm"
        />
        
        {/* Main node circle */}
        <circle
          cx="30"
          cy="30"
          r="28"
          fill={nodeColor}
          stroke={isSelected ? selectedVersionColor : nodeColor}
          strokeWidth={isSelected ? "4" : "2"}
          className="cursor-pointer transition-all duration-300 hover:stroke-4 filter drop-shadow-lg"
          onClick={() => onVersionSelect(version.id)}
        />
        
        {/* Glass highlight */}
        <circle
          cx="24"
          cy="24"
          r="12"
          fill="rgba(255, 255, 255, 0.4)"
          className="pointer-events-none"
        />
        
        {/* Version number */}
        <text
          x="30"
          y="36"
          textAnchor="middle"
          className={`text-base font-bold cursor-pointer transition-colors duration-300 ${
            isSelected || isCurrent ? "fill-white" : "fill-gray-800"
          }`}
          onClick={() => onVersionSelect(version.id)}
        >
          {version.version_number}
        </text>
        
        {/* Version info card */}
        <foreignObject x="-60" y="80" width="180" height="120">
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full h-auto p-4 text-sm backdrop-blur-sm transition-all duration-300 ${
                isSelected 
                  ? `bg-gradient-to-br from-[${selectedVersionColor}]/25 to-[${selectedVersionColor}]/15 border-2 border-[${selectedVersionColor}]/40 text-[${selectedVersionColor}] shadow-xl font-semibold` 
                  : 'bg-white/70 hover:bg-white/90 border border-white/50 shadow-lg hover:shadow-xl'
              }`}
              onClick={() => onVersionSelect(version.id)}
            >
              <div className="space-y-3">
                <div className="font-semibold text-base">
                  Version {version.version_number}
                  {isCurrent && (
                    <div className="text-xs bg-[#33C3F0]/25 text-[#33C3F0] px-3 py-1 rounded-full mt-2 backdrop-blur-sm font-medium">
                      Current
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-600 font-medium">
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
      <div className="text-center text-gray-500 py-8 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <p className="text-lg mb-4">No versions available</p>
        <Button onClick={onNewVersion} className="gap-2">
          <Plus className="h-4 w-4" />
          Create First Version
        </Button>
      </div>
    );
  }

  const chartWidth = Math.max(800, sortedVersions.length * 180 + 200);
  const chartHeight = 320;

  return (
    <div className="w-full">
      <div className="glass-card bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm rounded-3xl border border-white/40 p-6 shadow-2xl">
        {/* Header with New Version button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Version Timeline</h3>
          <Button 
            onClick={onNewVersion}
            className="gap-2 bg-gradient-to-r from-[#F97316] to-[#33C3F0] hover:from-[#F97316]/90 hover:to-[#33C3F0]/90 text-white font-medium px-6"
          >
            <Plus className="h-4 w-4" />
            New Version
          </Button>
        </div>

        <svg
          width={chartWidth}
          height={chartHeight}
          className="w-full"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Background gradient */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(249, 115, 22, 0.08)" />
              <stop offset="100%" stopColor="rgba(51, 195, 240, 0.08)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#bgGradient)" rx="16" />
          
          {/* Main timeline */}
          <line
            x1="100"
            y1="150"
            x2={chartWidth - 100}
            y2="150"
            stroke="rgba(249, 115, 22, 0.25)"
            strokeWidth="4"
            strokeDasharray="6,6"
          />
          
          {/* Connection lines */}
          {renderConnectionLines()}
          
          {/* Version nodes */}
          {sortedVersions.map((version, index) => renderVersionNode(version, index))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          <div className="w-5 h-5 rounded-full bg-[#F97316] shadow-md"></div>
          <span className="text-gray-700 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          <div className="w-5 h-5 rounded-full bg-[#33C3F0] shadow-md"></div>
          <span className="text-gray-700 font-medium">Current</span>
        </div>
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FFB3D1] to-[#B3E5FF] shadow-md"></div>
          <span className="text-gray-700 font-medium">Previous Versions</span>
        </div>
      </div>
    </div>
  );
};

export default CurveVersionChart;
