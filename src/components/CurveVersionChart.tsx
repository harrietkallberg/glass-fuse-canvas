import React from "react";
import { Button } from "@/components/ui/button";
import { GitBranch, GitMerge } from "lucide-react";

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

  return (
    <div className="space-y-3">
      {sortedVersions.map((version, index) => {
        const isSelected = version.id === currentVersionId;
        const isCurrent = version.is_current;
        
        return (
          <div key={version.id} className="relative">
            {/* Connection line to next version */}
            {index < sortedVersions.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300"></div>
            )}
            
            {/* Version node */}
            <div className="flex items-center gap-3">
              {/* Branch icon/node */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 relative z-10 ${
                  isSelected 
                    ? 'bg-[#2A6B6B] border-[#2A6B6B] text-white' 
                    : isCurrent
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-600'
                }`}
              >
                {index === 0 ? (
                  <GitBranch className="h-4 w-4" />
                ) : (
                  <GitMerge className="h-4 w-4" />
                )}
              </div>
              
              {/* Version info */}
              <div className="flex-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start p-2 h-auto ${
                    isSelected ? 'bg-[#2A6B6B]/10 border border-[#2A6B6B]/30' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => onVersionSelect(version.id)}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      Version {version.version_number}
                      {isCurrent && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(version.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CurveVersionChart;
