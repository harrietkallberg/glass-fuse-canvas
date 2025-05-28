
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Plus, Minus } from "lucide-react";
import { Phase } from "@/utils/curveUtils";

interface CurveStaticDisplayProps {
  templatePhases: Phase[];
  currentPhases: Phase[];
  versionName: string;
}

const CurveStaticDisplay = ({
  templatePhases,
  currentPhases,
  versionName
}: CurveStaticDisplayProps) => {
  
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
          Version {versionName} Curve
        </h3>
        <p className="text-gray-600 mt-2">
          Differences from template are marked
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phase</TableHead>
            <TableHead>Temperature (°C)</TableHead>
            <TableHead>Duration (min)</TableHead>
            <TableHead>Hold Time (min)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparison.map((item, index) => (
            <TableRow key={index} className={getRowStyle(item.status)}>
              <TableCell className="flex items-center gap-2">
                <span>Phase {index + 1}</span>
                {getStatusIcon(item.status)}
              </TableCell>
              
              <TableCell className={item.status === 'removed' ? 'text-gray-400 line-through' : ''}>
                {item.current ? `${item.current.targetTemp}°C` : '—'}
              </TableCell>
              
              <TableCell className={item.status === 'removed' ? 'text-gray-400 line-through' : ''}>
                {item.current ? `${item.current.duration} min` : '—'}
              </TableCell>
              
              <TableCell className={item.status === 'removed' ? 'text-gray-400 line-through' : ''}>
                {item.current ? `${item.current.holdTime} min` : '—'}
              </TableCell>
              
              <TableCell>
                {getStatusBadge(item.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
};

export default CurveStaticDisplay;
