
import React from 'react';
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
import { calculateVelocities } from "@/utils/phaseCalculations";
import glassData from '../../tables.json';

interface CurveTableViewProps {
  phases: Phase[];
  templatePhases?: Phase[];
  versionName?: string;
  isTemplateMode?: boolean;
  roomTemp?: number;
}

const CurveTableView = ({
  phases,
  templatePhases = [],
  versionName,
  isTemplateMode = false,
  roomTemp = 20
}: CurveTableViewProps) => {
  
  // Calculate the actual velocities used to create the phases (matching Python logic)
  const getActualVelocities = () => {
    // For glass template phases, we need to calculate the velocities that were used
    // This assumes the phases follow the standard glass template pattern
    if (phases.length === 5) {
      // Try to reverse-engineer the glass settings from the phases
      const inledandeSmaltpunkt = glassData["Inledande_smaltpunkt"];
      const toppTemp = phases[1]?.targetTemp || 800;
      const oAstemp = phases[2]?.targetTemp || 520;
      const nAstemp = phases[3]?.targetTemp || 460;
      
      // Estimate the times from the durations (this is approximate)
      const uppvarmningTime = phases[0]?.duration || 60;
      const halltiderTime = phases[2]?.duration || 60;
      const avspanningTime = phases[3]?.duration || 60;
      
      const velocities = calculateVelocities(
        inledandeSmaltpunkt,
        roomTemp,
        uppvarmningTime,
        oAstemp,
        toppTemp,
        halltiderTime,
        nAstemp,
        avspanningTime
      );
      
      return [
        velocities.firstHeatingVelocity,
        velocities.secondHeatingVelocity,
        Math.abs(velocities.firstCoolingVelocity),
        Math.abs(velocities.secondCoolingVelocity),
        Math.abs(velocities.lastCoolingVelocity)
      ];
    }
    
    // Fallback: calculate from temperature differences and durations
    return phases.map((phase, index) => {
      const startTemp = index === 0 ? roomTemp : phases[index - 1]?.targetTemp || roomTemp;
      const tempDifference = phase.targetTemp - startTemp;
      return phase.duration > 0 ? Math.round(Math.abs(tempDifference / phase.duration) * 60) : 0;
    });
  };

  const actualVelocities = getActualVelocities();

  // Compare phases to determine modifications (only for version mode)
  const getPhaseComparison = () => {
    if (isTemplateMode || templatePhases.length === 0) {
      return phases.map((phase, index) => ({
        index,
        current: phase,
        status: 'current' as const
      }));
    }

    const comparison: Array<{
      index: number;
      template?: Phase;
      current?: Phase;
      status: 'unchanged' | 'modified' | 'added' | 'removed' | 'current';
    }> = [];

    const maxLength = Math.max(templatePhases.length, phases.length);
    
    for (let i = 0; i < maxLength; i++) {
      const templatePhase = templatePhases[i];
      const currentPhase = phases[i];
      
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

  const formatValueWithTemplate = (currentValue: number, templateValue?: number, status?: string) => {
    if (status === 'added' || isTemplateMode) {
      return currentValue.toString();
    }
    if (status === 'modified' && templateValue !== undefined) {
      return `${currentValue} (${templateValue})`;
    }
    return currentValue.toString();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {isTemplateMode ? 'Template Curve' : `Version ${versionName} Curve`}
        </h3>
        {!isTemplateMode && (
          <p className="text-gray-600 mt-2">
            Modifications from template shown with original values in parentheses
          </p>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phase</TableHead>
            <TableHead>Temperature (°C)</TableHead>
            <TableHead>Duration (min)</TableHead>
            <TableHead>Velocity (°C/h)</TableHead>
            <TableHead>Hold Time (min)</TableHead>
            {!isTemplateMode && <TableHead>Status</TableHead>}
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
                {item.current ? (
                  <>
                    {formatValueWithTemplate(item.current.targetTemp, item.template?.targetTemp, item.status)}°C
                  </>
                ) : '—'}
              </TableCell>
              
              <TableCell className={item.status === 'removed' ? 'text-gray-400 line-through' : ''}>
                {item.current ? (
                  <>
                    {formatValueWithTemplate(item.current.duration, item.template?.duration, item.status)} min
                  </>
                ) : '—'}
              </TableCell>
              
              <TableCell className={item.status === 'removed' ? 'text-gray-400 line-through' : ''}>
                {item.current ? (
                  <>
                    {actualVelocities[index] || 0}°C/h
                  </>
                ) : '—'}
              </TableCell>
              
              <TableCell className={item.status === 'removed' ? 'text-gray-400 line-through' : ''}>
                {item.current ? (
                  <>
                    {formatValueWithTemplate(item.current.holdTime, item.template?.holdTime, item.status)} min
                  </>
                ) : '—'}
              </TableCell>
              
              {!isTemplateMode && (
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!isTemplateMode && (
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
      )}
    </div>
  );
};

export default CurveTableView;
