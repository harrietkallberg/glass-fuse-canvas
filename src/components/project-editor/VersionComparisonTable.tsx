
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Minus } from "lucide-react";
import { Phase } from "@/utils/curveUtils";

interface VersionComparisonTableProps {
  templatePhases: Phase[];
  currentPhases: Phase[];
  versionName: string;
}

const VersionComparisonTable = ({
  templatePhases,
  currentPhases,
  versionName
}: VersionComparisonTableProps) => {
  
  // Compare phases to determine modifications
  const getPhaseComparison = () => {
    const comparison: Array<{
      index: number;
      template?: Phase;
      current?: Phase;
      status: 'unchanged' | 'modified' | 'added' | 'removed';
    }> = [];

    const maxLength = Math.max(templatePhases.length, currentPhases.length);
    
    for (let i = 0; i < maxLength; i++) {
      const templatePhase = templatePhases[i];
      const currentPhase = currentPhases[i];
      
      if (!templatePhase && currentPhase) {
        comparison.push({ index: i, current: currentPhase, status: 'added' });
      } else if (templatePhase && !currentPhase) {
        comparison.push({ index: i, template: templatePhase, status: 'removed' });
      } else if (templatePhase && currentPhase) {
        const isModified = 
          templatePhase.targetTemp !== currentPhase.targetTemp ||
          templatePhase.duration !== currentPhase.duration ||
          templatePhase.holdTime !== currentPhase.holdTime;
        
        comparison.push({
          index: i,
          template: templatePhase,
          current: currentPhase,
          status: isModified ? 'modified' : 'unchanged'
        });
      }
    }
    
    return comparison;
  };

  const comparison = getPhaseComparison();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'added':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'modified':
        return <Edit className="h-4 w-4 text-orange-600" />;
      case 'removed':
        return <Minus className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'added':
        return <Badge variant="default" className="bg-green-100 text-green-800">Added</Badge>;
      case 'modified':
        return <Badge variant="default" className="bg-orange-100 text-orange-800">Modified</Badge>;
      case 'removed':
        return <Badge variant="default" className="bg-red-100 text-red-800">Removed</Badge>;
      case 'unchanged':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600">Unchanged</Badge>;
      default:
        return null;
    }
  };

  const getRowStyle = (status: string) => {
    switch (status) {
      case 'added':
        return 'bg-green-50/50 border-l-4 border-green-500';
      case 'modified':
        return 'bg-orange-50/50 border-l-4 border-orange-500';
      case 'removed':
        return 'bg-red-50/50 border-l-4 border-red-500';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800">
          Template vs Version {versionName} Comparison
        </h3>
        <p className="text-gray-600 mt-2">
          See what has changed from your original template curve
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="grid grid-cols-8 gap-4 px-4 py-3 bg-gray-50 font-medium text-sm">
          <div>Phase</div>
          <div>Status</div>
          <div>Template Temp (°C)</div>
          <div>Current Temp (°C)</div>
          <div>Template Duration (min)</div>
          <div>Current Duration (min)</div>
          <div>Template Hold (min)</div>
          <div>Current Hold (min)</div>
        </div>
        
        {comparison.map((item, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-8 gap-4 px-4 py-3 border-t border-gray-200 ${getRowStyle(item.status)}`}
          >
            <div className="flex items-center gap-2">
              <span>Phase {index + 1}</span>
              {getStatusIcon(item.status)}
            </div>
            
            <div>
              {getStatusBadge(item.status)}
            </div>
            
            <div className={item.status === 'added' ? 'text-gray-400' : ''}>
              {item.template ? `${item.template.targetTemp}°C` : '—'}
            </div>
            
            <div className={item.status === 'removed' ? 'text-gray-400' : ''}>
              {item.current ? `${item.current.targetTemp}°C` : '—'}
            </div>
            
            <div className={item.status === 'added' ? 'text-gray-400' : ''}>
              {item.template ? `${item.template.duration} min` : '—'}
            </div>
            
            <div className={item.status === 'removed' ? 'text-gray-400' : ''}>
              {item.current ? `${item.current.duration} min` : '—'}
            </div>
            
            <div className={item.status === 'added' ? 'text-gray-400' : ''}>
              {item.template ? `${item.template.holdTime} min` : '—'}
            </div>
            
            <div className={item.status === 'removed' ? 'text-gray-400' : ''}>
              {item.current ? `${item.current.holdTime} min` : '—'}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {comparison.filter(item => item.status === 'unchanged').length}
          </div>
          <div className="text-sm text-gray-600">Unchanged</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {comparison.filter(item => item.status === 'modified').length}
          </div>
          <div className="text-sm text-orange-600">Modified</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {comparison.filter(item => item.status === 'added').length}
          </div>
          <div className="text-sm text-green-600">Added</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {comparison.filter(item => item.status === 'removed').length}
          </div>
          <div className="text-sm text-red-600">Removed</div>
        </div>
      </div>
    </div>
  );
};

export default VersionComparisonTable;
