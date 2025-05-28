
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Crown, ArrowRight } from "lucide-react";

interface Version {
  id: string;
  version_number: string;
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
  // Group versions by generation (horizontal position) and draft level (vertical position)
  const groupedVersions = versions.reduce((acc, version) => {
    const parts = version.version_number.split('.');
    const generation = parseInt(parts[0]) || 1; // Horizontal level
    const draft = parseInt(parts[1]) || 0; // Vertical level within generation
    
    if (!acc[generation]) {
      acc[generation] = {};
    }
    if (!acc[generation][draft]) {
      acc[generation][draft] = [];
    }
    acc[generation][draft].push(version);
    return acc;
  }, {} as Record<number, Record<number, Version[]>>);

  // Sort generations and drafts
  const sortedGenerations = Object.keys(groupedVersions).map(Number).sort((a, b) => a - b);
  
  // Generate positions for version nodes with vertical/horizontal layout
  const getNodePosition = (generation: number, draft: number, subIndex: number = 0) => {
    const generationSpacing = 250; // Horizontal spacing between generations
    const draftSpacing = 100; // Vertical spacing between drafts
    const subSpacing = 60; // Spacing for multiple versions in same generation.draft
    
    const baseX = 100 + (generation - 1) * generationSpacing;
    const baseY = 120 + draft * draftSpacing;
    
    return { 
      x: baseX + (subIndex * subSpacing), 
      y: baseY 
    };
  };

  // Generate colors for different generations
  const getGenerationColor = (generation: number, isSelected: boolean) => {
    const colors = ["#F97316", "#33C3F0", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
    return isSelected ? selectedVersionColor : colors[(generation - 1) % colors.length];
  };

  const renderVersionNode = (version: Version, generation: number, draft: number, subIndex: number) => {
    const position = getNodePosition(generation, draft, subIndex);
    const isSelected = version.id === currentVersionId;
    const isCurrent = version.is_current;
    const nodeColor = getGenerationColor(generation, isSelected);
    const isMainVersion = draft === 0; // Main versions are at draft level 0

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
          r={isMainVersion ? "28" : "20"}
          fill="rgba(0, 0, 0, 0.15)"
          className="blur-sm"
        />
        
        {/* Main node circle */}
        <circle
          cx="30"
          cy="30"
          r={isMainVersion ? "28" : "20"}
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
          r={isMainVersion ? "12" : "8"}
          fill="rgba(255, 255, 255, 0.4)"
          className="pointer-events-none"
        />
        
        {/* Version number */}
        <text
          x="30"
          y="36"
          textAnchor="middle"
          className={`${isMainVersion ? 'text-base' : 'text-xs'} font-bold cursor-pointer transition-colors duration-300 ${
            isSelected || isCurrent ? "fill-white" : "fill-gray-800"
          }`}
          onClick={() => onVersionSelect(version.id)}
        >
          {version.version_number}
        </text>
        
        {/* Crown for current version */}
        {isCurrent && (
          <Crown className="h-4 w-4 text-yellow-500" style={{ transform: 'translate(45px, 10px)' }} />
        )}
        
        {/* Version info card */}
        <foreignObject x="-60" y={isMainVersion ? "80" : "60"} width="180" height="120">
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
                    Move to Next Level
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

  if (versions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <p className="text-lg mb-4">No versions available</p>
        <Button onClick={onNewVersion} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Version
        </Button>
      </div>
    );
  }

  const maxGeneration = Math.max(...sortedGenerations);
  const maxDrafts = Math.max(...sortedGenerations.map(gen => Object.keys(groupedVersions[gen]).length));
  const chartWidth = Math.max(800, (maxGeneration * 250) + 300);
  const chartHeight = Math.max(300, (maxDrafts * 100) + 250);

  return (
    <div className="w-full">
      <div className="glass-card bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm rounded-3xl border border-white/40 p-6 shadow-2xl">
        {/* Header with Add New Version button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Version Progress</h3>
          <Button 
            onClick={onNewVersion}
            className="gap-2 bg-gradient-to-r from-[#F97316] to-[#33C3F0] hover:from-[#F97316]/90 hover:to-[#33C3F0]/90 text-white font-medium px-6"
          >
            <Plus className="h-4 w-4" />
            Add New Version
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
          {sortedGenerations.map((generation) => {
            const draftsInGeneration = Object.keys(groupedVersions[generation]).map(Number).sort((a, b) => a - b);
            
            return draftsInGeneration.map((draft) => 
              groupedVersions[generation][draft].map((version, subIndex) => 
                renderVersionNode(version, generation, draft, subIndex)
              )
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
          <Crown className="h-4 w-4 text-yellow-500" />
          <span className="text-gray-700 font-medium">Current Version</span>
        </div>
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          <ArrowRight className="h-4 w-4 text-[#33C3F0]" />
          <span className="text-gray-700 font-medium">Progress →</span>
        </div>
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FFB3D1] to-[#B3E5FF] shadow-md"></div>
          <span className="text-gray-700 font-medium">Draft Versions ↓</span>
        </div>
      </div>
    </div>
  );
};

export default CurveVersionChart;
