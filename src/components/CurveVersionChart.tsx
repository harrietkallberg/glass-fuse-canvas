
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CurveVersionChartProps } from "./curve-editor/version-chart/types";
import { groupVersionsByGeneration, getNodePosition } from "./curve-editor/version-chart/utils";
import VersionNode from "./curve-editor/version-chart/VersionNode";
import ConnectionLines from "./curve-editor/version-chart/ConnectionLines";
import VersionLegend from "./curve-editor/version-chart/VersionLegend";

const CurveVersionChart = ({ 
  versions, 
  currentVersionId, 
  onVersionSelect, 
  onNewVersion,
  onSetMainVersion,
  selectedVersionColor = "#F97316"
}: CurveVersionChartProps) => {
  const groupedVersions = groupVersionsByGeneration(versions);
  const sortedGenerations = Object.keys(groupedVersions).map(Number).sort((a, b) => a - b);

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
          <ConnectionLines 
            groupedVersions={groupedVersions} 
            sortedGenerations={sortedGenerations} 
          />
          
          {/* Version nodes */}
          {sortedGenerations.map((generation) => {
            const draftsInGeneration = Object.keys(groupedVersions[generation]).map(Number).sort((a, b) => a - b);
            
            return draftsInGeneration.map((draft) => 
              groupedVersions[generation][draft].map((version, subIndex) => (
                <VersionNode
                  key={version.id}
                  version={version}
                  generation={generation}
                  draft={draft}
                  subIndex={subIndex}
                  position={getNodePosition(generation, draft, subIndex)}
                  isSelected={version.id === currentVersionId}
                  selectedVersionColor={selectedVersionColor}
                  onVersionSelect={onVersionSelect}
                  onSetMainVersion={onSetMainVersion}
                />
              ))
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <VersionLegend />
    </div>
  );
};

export default CurveVersionChart;
