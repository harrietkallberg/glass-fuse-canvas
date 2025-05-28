
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
  selectedVersionColor = "#F97316",
  templateData
}: CurveVersionChartProps) => {
  // Create template node
  const templateNode = {
    id: 'template',
    version_number: 'Template',
    name: 'Project Template',
    is_current: false,
    created_at: new Date().toISOString(),
    is_template: true
  };

  // Combine template with versions for display
  const allNodes = [templateNode, ...versions];
  const groupedVersions = groupVersionsByGeneration(versions);
  const sortedGenerations = Object.keys(groupedVersions).map(Number).sort((a, b) => a - b);

  if (allNodes.length === 1) {
    // Only template exists
    return (
      <div className="w-full">
        <div className="glass-card bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm rounded-3xl border border-white/40 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-gray-800">Version Progress</h3>
            <Button 
              onClick={onNewVersion}
              className="gap-2 bg-gradient-to-r from-[#F97316] to-[#33C3F0] hover:from-[#F97316]/90 hover:to-[#33C3F0]/90 text-white font-medium px-6"
            >
              <Plus className="h-4 w-4" />
              Add New Version
            </Button>
          </div>

          <div className="flex justify-center items-center py-12">
            <svg width="200" height="150" className="min-w-full">
              <defs>
                <linearGradient id="templateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(156, 163, 175, 0.3)" />
                  <stop offset="100%" stopColor="rgba(107, 114, 128, 0.3)" />
                </linearGradient>
              </defs>
              
              <VersionNode
                key="template"
                version={templateNode}
                generation={0}
                draft={0}
                subIndex={0}
                position={{ x: 70, y: 50 }}
                isSelected={currentVersionId === 'template'}
                selectedVersionColor="#6B7280"
                onVersionSelect={onVersionSelect}
                onSetMainVersion={onSetMainVersion}
                isTemplate={true}
              />
            </svg>
          </div>
          
          <div className="text-center text-gray-600 mt-4">
            <p className="text-lg mb-2">Project Template Ready</p>
            <p className="text-sm">Click "Add New Version" to start creating versions based on your template.</p>
          </div>
        </div>
        
        <VersionLegend />
      </div>
    );
  }

  const maxGeneration = Math.max(...sortedGenerations);
  const maxDrafts = Math.max(...sortedGenerations.map(gen => Object.keys(groupedVersions[gen]).length));
  const chartWidth = Math.max(1200, (maxGeneration * 350) + 600); // Extra space for template
  const chartHeight = Math.max(500, (maxDrafts * 150) + 350);

  return (
    <div className="w-full">
      <div className="glass-card bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm rounded-3xl border border-white/40 p-8 shadow-2xl">
        {/* Header with Add New Version button */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-gray-800">Version Progress</h3>
          <Button 
            onClick={onNewVersion}
            className="gap-2 bg-gradient-to-r from-[#F97316] to-[#33C3F0] hover:from-[#F97316]/90 hover:to-[#33C3F0]/90 text-white font-medium px-6"
          >
            <Plus className="h-4 w-4" />
            Add New Version
          </Button>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <svg
            width={chartWidth}
            height={chartHeight}
            className="min-w-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {/* Background gradient */}
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.08)" />
                <stop offset="100%" stopColor="rgba(51, 195, 240, 0.08)" />
              </linearGradient>
              <linearGradient id="templateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(156, 163, 175, 0.4)" />
                <stop offset="100%" stopColor="rgba(107, 114, 128, 0.4)" />
              </linearGradient>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#bgGradient)" rx="16" />
            
            {/* Template node */}
            <VersionNode
              key="template"
              version={templateNode}
              generation={0}
              draft={0}
              subIndex={0}
              position={{ x: 50, y: 150 }}
              isSelected={currentVersionId === 'template'}
              selectedVersionColor="#6B7280"
              onVersionSelect={onVersionSelect}
              onSetMainVersion={onSetMainVersion}
              isTemplate={true}
            />
            
            {/* Connection lines */}
            <ConnectionLines 
              groupedVersions={groupedVersions} 
              sortedGenerations={sortedGenerations}
              hasTemplate={true}
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
                    position={getNodePosition(generation, draft, subIndex, true)}
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
      </div>
      
      {/* Legend */}
      <VersionLegend />
    </div>
  );
};

export default CurveVersionChart;
