
import React from "react";
import { Button } from "@/components/ui/button";
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
}

const VersionNode = ({
  version,
  generation,
  draft,
  position,
  isSelected,
  selectedVersionColor,
  onVersionSelect,
  onSetMainVersion
}: VersionNodeProps) => {
  const isCurrent = version.is_current;
  const nodeColor = getGenerationColor(generation, isSelected, selectedVersionColor);
  const isMainVersion = draft === 0;
  const isTemplate = version.version_number === "Template";

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      {/* Selection glow effect */}
      {isSelected && (
        <rect
          x="-5"
          y="-5"
          width="130"
          height="70"
          rx="8"
          fill={`${selectedVersionColor}30`}
          className="animate-pulse"
        />
      )}
      
      {/* Main tile */}
      <rect
        x="0"
        y="0"
        width="120"
        height="60"
        rx="6"
        fill={isTemplate ? "#9CA3AF" : nodeColor}
        stroke={isSelected ? selectedVersionColor : (isTemplate ? "#6B7280" : nodeColor)}
        strokeWidth={isSelected ? "3" : "2"}
        className="cursor-pointer transition-all duration-300 hover:stroke-3 filter drop-shadow-lg"
        onClick={() => onVersionSelect(version.id)}
      />
      
      {/* Glass highlight */}
      <rect
        x="5"
        y="5"
        width="110"
        height="20"
        rx="3"
        fill="rgba(255, 255, 255, 0.3)"
        className="pointer-events-none"
      />
      
      {/* Version number */}
      <text
        x="60"
        y="35"
        textAnchor="middle"
        className={`text-sm font-bold cursor-pointer transition-colors duration-300 ${
          isSelected || isCurrent ? "fill-white" : "fill-gray-800"
        }`}
        onClick={() => onVersionSelect(version.id)}
      >
        {isTemplate ? "Template" : `v${version.version_number}`}
      </text>
      
      {/* Current version indicator */}
      {isCurrent && !isTemplate && (
        <rect
          x="85"
          y="45"
          width="30"
          height="12"
          rx="6"
          fill="#10B981"
          className="pointer-events-none"
        />
      )}
      
      {isCurrent && !isTemplate && (
        <text
          x="100"
          y="53"
          textAnchor="middle"
          className="text-xs font-medium fill-white pointer-events-none"
        >
          Current
        </text>
      )}
      
      {/* Version info card */}
      <foreignObject x="-30" y="80" width="180" height="120">
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
                {isTemplate ? "Template" : `Version ${version.version_number}`}
                {isCurrent && !isTemplate && (
                  <div className="text-xs bg-[#10B981]/25 text-[#10B981] px-3 py-1 rounded-full mt-2 backdrop-blur-sm font-medium">
                    Current
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {new Date(version.created_at).toLocaleDateString()}
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
                  Set as Current
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
