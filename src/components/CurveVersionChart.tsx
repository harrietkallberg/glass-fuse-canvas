
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Crown } from "lucide-react";

interface Version {
  id: string;
  version_number: string; // Now expecting semantic version string for display
  name: string;
  is_current: boolean;
  created_at: string;
}

interface CurveVersionChartProps {
  versions: Version[];
  currentVersionId: string | null;
  onVersionSelect: (versionId: string) => void;
  onNewVersion: () => void;
  onSetMainVersion?: (versionId: string) => void;
  selectedVersionColor?: string;
}

const CurveVersionChart = ({ 
  versions, 
  currentVersionId, 
  onVersionSelect, 
  onNewVersion,
  onSetMainVersion,
  selectedVersionColor = "#F97316"
}: CurveVersionChartProps) => {
  // Group versions by main version (major.minor)
  const groupedVersions = versions.reduce((acc, version) => {
    const parts = version.version_number.split('.');
    const mainVersion = `${parts[0]}.${parts[1] || '0'}`;
    if (!acc[mainVersion]) {
      acc[mainVersion] = [];
    }
    acc[mainVersion].push(version);
    return acc;
  }, {} as Record<string, Version[]>);

  // Sort main versions
  const sortedMainVersions = Object.keys(groupedVersions).sort((a, b) => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    return aNum - bNum;
  });

  // Generate colors for main version branches
  const getMainVersionColor = (mainVersion: string, isSelected: boolean) => {
    const colors = ["#F97316", "#33C3F0", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
    const index = sortedMainVersions.indexOf(mainVersion);
    return isSelected ? selectedVersionColor : colors[index % colors.length];
  };

  // Generate positions for version nodes
  const getNodePosition = (mainVersionIndex: number, patchIndex: number, totalMainVersions: number) => {
    const chartWidth = Math.max(1000, totalMainVersions * 300 + 200);
    const mainSpacing = (chartWidth - 200) / Math.max(1, totalMainVersions - 1);
    const baseX = 100 + (mainVersionIndex * mainSpacing);
    const baseY = 120;
    
    if (patchIndex === 0) {
      // Main version node
      return { x: baseX, y: baseY };
    } else {
      // Patch version nodes branch off
      return { x: baseX + (patchIndex * 80), y: baseY + 80 };
    }
  };

  const renderVersionNode = (version: Version, mainVersionIndex: number, patchIndex: number, isMainVersion: boolean) => {
    const position = getNodePosition(mainVersionIndex, patchIndex, sortedMainVersions.length);
    const isSelected = version.id === currentVersionId;
    const isCurrent = version.is_current;
    const mainVersion = `${version.version_number.split('.')[0]}.${version.version_number.split('.')[1] || '0'}`;
    const nodeColor = getMainVersionColor(mainVersion, isSelected);
    const isPatchVersion = version.version_number.split('.').length > 2;

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
          r={isPatchVersion ? "20" : "28"}
          fill="rgba(0, 0, 0, 0.15)"
          className="blur-sm"
        />
        
        {/* Main node circle */}
        <circle
          cx="30"
          cy="30"
          r={isPatchVersion ? "20" : "28"}
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
          r={isPatchVersion ? "8" : "12"}
          fill="rgba(255, 255, 255, 0.4)"
          className="pointer-events-none"
        />
        
        {/* Version number */}
        <text
          x="30"
          y="36"
          textAnchor="middle"
          className={`${isPatchVersion ? 'text-xs' : 'text-base'} font-bold cursor-pointer transition-colors duration-300 ${
            isSelected || isCurrent ? "fill-white" : "fill-gray-800"
          }`}
          onClick={() => onVersionSelect(version.id)}
        >
          {isPatchVersion ? version.version_number.split('.')[2] : version.version_number}
        </text>
        
        {/* Crown for current version */}
        {isCurrent && (
          <Crown className="h-4 w-4 text-yellow-500 absolute -top-2 -right-2" style={{ transform: 'translate(45px, 10px)' }} />
        )}
        
        {/* Version info card */}
        <foreignObject x="-60" y={isPatchVersion ? "60" : "80"} width="180" height="120">
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
                {onSetMainVersion && !isCurrent && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetMainVersion(version.id);
                    }}
                    className="text-xs mt-2"
                  >
                    Set as Main
                  </Button>
                )}
              </div>
            </Button>
          </div>
        </foreignObject>
      </g>
    );
  };

  const renderConnectionLines = () => {
    const lines: JSX.Element[] = [];
    
    sortedMainVersions.forEach((mainVersion, mainIndex) => {
      const versionsInGroup = groupedVersions[mainVersion].sort((a, b) => {
        const aNum = parseFloat(a.version_number);
        const bNum = parseFloat(b.version_number);
        return aNum - bNum;
      });
      
      // Connect patch versions to main version
      versionsInGroup.forEach((version, patchIndex) => {
        if (patchIndex > 0) {
          const mainPos = getNodePosition(mainIndex, 0, sortedMainVersions.length);
          const patchPos = getNodePosition(mainIndex, patchIndex, sortedMainVersions.length);
          
          lines.push(
            <path
              key={`patch-connection-${version.id}`}
              d={`M ${mainPos.x + 30} ${mainPos.y + 30} L ${patchPos.x + 30} ${patchPos.y + 30}`}
              stroke="rgba(249, 115, 22, 0.3)"
              strokeWidth="2"
              strokeDasharray="4,4"
              fill="none"
            />
          );
        }
      });
      
      // Connect main versions
      if (mainIndex < sortedMainVersions.length - 1) {
        const currentPos = getNodePosition(mainIndex, 0, sortedMainVersions.length);
        const nextPos = getNodePosition(mainIndex + 1, 0, sortedMainVersions.length);
        
        lines.push(
          <path
            key={`main-connection-${mainIndex}`}
            d={`M ${currentPos.x + 30} ${currentPos.y + 30} L ${nextPos.x + 30} ${nextPos.y + 30}`}
            stroke="rgba(249, 115, 22, 0.4)"
            strokeWidth="3"
            fill="none"
          />
        );
      }
    });
    
    return lines;
  };

  if (versions.length === 0) {
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

  const chartWidth = Math.max(1000, sortedMainVersions.length * 300 + 200);
  const chartHeight = 350;

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
            New Main Version
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
          </defs>
          
          <rect width="100%" height="100%" fill="url(#bgGradient)" rx="16" />
          
          {/* Connection lines */}
          {renderConnectionLines()}
          
          {/* Version nodes */}
          {sortedMainVersions.map((mainVersion, mainIndex) => {
            const versionsInGroup = groupedVersions[mainVersion].sort((a, b) => {
              const aNum = parseFloat(a.version_number);
              const bNum = parseFloat(b.version_number);
              return aNum - bNum;
            });
            
            return versionsInGroup.map((version, patchIndex) => 
              renderVersionNode(version, mainIndex, patchIndex, patchIndex === 0)
            );
          })}
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
          <Crown className="h-4 w-4 text-yellow-500" />
          <span className="text-gray-700 font-medium">Main Version</span>
        </div>
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FFB3D1] to-[#B3E5FF] shadow-md"></div>
          <span className="text-gray-700 font-medium">Patch Versions</span>
        </div>
      </div>
    </div>
  );
};

export default CurveVersionChart;
