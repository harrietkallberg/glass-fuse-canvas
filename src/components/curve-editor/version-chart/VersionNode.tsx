
import React from "react";
import { Button } from "@/components/ui/button";
import { Crown, FileText } from "lucide-react";
import { Version } from './types';
import { getGenerationColor } from './utils';

interface VersionNodeProps {
  version: Version;
  generation: number;
  draft: number;
  subIndex: number;
  position: { x: number; y: number };
  isSelected: boolean;
  selectedVersionColor: string;
  onVersionSelect: (versionId: string) => void;
  onSetMainVersion?: (versionId: string) => void;
  isTemplate?: boolean;
}

const VersionNode = ({
  version,
  generation,
  draft,
  position,
  isSelected,
  selectedVersionColor,
  onVersionSelect,
  onSetMainVersion,
  isTemplate = false
}: VersionNodeProps) => {
  const isCurrent = version.is_current;
  const nodeColor = isTemplate ? "#6B7280" : getGenerationColor(generation, isSelected, selectedVersionColor);
  const isMainVersion = draft === 0 && !isTemplate;

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
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
        r={isMainVersion || isTemplate ? "28" : "20"}
        fill="rgba(0, 0, 0, 0.15)"
        className="blur-sm"
      />
      
      {/* Main node circle */}
      <circle
        cx="30"
        cy="30"
        r={isMainVersion || isTemplate ? "28" : "20"}
        fill={isTemplate ? "url(#templateGradient)" : nodeColor}
        stroke={isSelected ? selectedVersionColor : nodeColor}
        strokeWidth={isSelected ? "4" : "2"}
        strokeDasharray={isTemplate ? "5,5" : "none"}
        className="cursor-pointer transition-all duration-300 hover:stroke-4 filter drop-shadow-lg"
        onClick={() => onVersionSelect(version.id)}
      />
      
      {/* Glass highlight */}
      <circle
        cx="24"
        cy="24"
        r={isMainVersion || isTemplate ? "12" : "8"}
        fill="rgba(255, 255, 255, 0.4)"
        className="pointer-events-none"
      />
      
      {/* Version number/label */}
      <text
        x="30"
        y="36"
        textAnchor="middle"
        className={`${isMainVersion || isTemplate ? 'text-base' : 'text-xs'} font-bold cursor-pointer transition-colors duration-300 ${
          isSelected || isCurrent ? "fill-white" : isTemplate ? "fill-gray-600" : "fill-gray-800"
        }`}
        onClick={() => onVersionSelect(version.id)}
      >
        {isTemplate ? "T" : version.version_number}
      </text>
      
      {/* Crown for current version */}
      {isCurrent && !isTemplate && (
        <Crown className="h-4 w-4 text-yellow-500" style={{ transform: 'translate(45px, 10px)' }} />
      )}
      
      {/* Template icon */}
      {isTemplate && (
        <FileText className="h-4 w-4 text-gray-500" style={{ transform: 'translate(45px, 10px)' }} />
      )}
      
      {/* Version info card */}
      <foreignObject x="-60" y={isMainVersion || isTemplate ? "80" : "60"} width="180" height="120">
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className={`w-full h-auto p-4 text-sm backdrop-blur-sm transition-all duration-300 ${
              isTemplate
                ? 'bg-gray-100/70 hover:bg-gray-200/90 border border-gray-300/50 shadow-lg hover:shadow-xl text-gray-700'
                : isSelected 
                ? `bg-gradient-to-br from-[${selectedVersionColor}]/25 to-[${selectedVersionColor}]/15 border-2 border-[${selectedVersionColor}]/40 text-[${selectedVersionColor}] shadow-xl font-semibold` 
                : 'bg-white/70 hover:bg-white/90 border border-white/50 shadow-lg hover:shadow-xl'
            }`}
            onClick={() => onVersionSelect(version.id)}
          >
            <div className="space-y-3">
              <div className="font-semibold text-base">
                {isTemplate ? "Project Template" : `Version ${version.version_number}`}
                {isCurrent && !isTemplate && (
                  <div className="text-xs bg-[#33C3F0]/25 text-[#33C3F0] px-3 py-1 rounded-full mt-2 backdrop-blur-sm font-medium">
                    Current
                  </div>
                )}
                {isTemplate && (
                  <div className="text-xs bg-gray-200/50 text-gray-600 px-3 py-1 rounded-full mt-2 backdrop-blur-sm font-medium">
                    Template
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {isTemplate ? "Project Base" : new Date(version.created_at).toLocaleDateString()}
              </div>
              {onSetMainVersion && !isCurrent && !isTemplate && (
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

export default VersionNode;
