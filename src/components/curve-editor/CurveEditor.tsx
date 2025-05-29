
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CurveEditorContent from './CurveEditorContent';
import { Phase } from '@/utils/curveUtils';
import { useGlassSettings } from '@/hooks/useGlassSettings';
import { usePhaseManagement } from '@/hooks/usePhaseManagement';

interface CurveEditorProps {
  initialPhases?: Phase[];
  onSave?: (phases: Phase[]) => void;
  isTemplateMode?: boolean;
  onApplyGlassTemplate?: () => void;
  savedSettings?: {
    selectedGlass?: string;
    roomTemp?: number;
    glassLayers?: string;
    glassRadius?: string;
    firingType?: string;
    topTempMinutes?: string;
    ovenType?: string;
  };
}

const CurveEditor = ({ 
  initialPhases = [], 
  onSave, 
  isTemplateMode = false, 
  onApplyGlassTemplate,
  savedSettings = {}
}: CurveEditorProps) => {
  const [glassData, setGlassData] = useState<any>(null);

  // Use custom hooks for state management
  const glassSettings = useGlassSettings({ savedSettings });
  const phaseManagement = usePhaseManagement({ initialPhases });

  // Load glass data
  useEffect(() => {
    fetch('/tables.json')
      .then(response => response.json())
      .then(data => {
        setGlassData(data);
      })
      .catch(error => {
        console.error('Error loading glass data:', error);
      });
  }, []);

  const handleSave = () => {
    if (onSave) {
      onSave(phaseManagement.phases);
    }
  };

  if (!glassData) {
    return <div>Loading glass data...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Curve Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <CurveEditorContent
          phases={phaseManagement.phases}
          onUpdatePhase={phaseManagement.updatePhase}
          onDeletePhase={phaseManagement.deletePhase}
          onAddPhase={phaseManagement.handleAddPhase}
          onSave={handleSave}
          isTemplateMode={isTemplateMode}
          glassData={glassData}
          onApplyGlassTemplate={onApplyGlassTemplate}
          onSetPhases={phaseManagement.setPhases}
          {...glassSettings}
        />
      </CardContent>
    </Card>
  );
};

export default CurveEditor;
