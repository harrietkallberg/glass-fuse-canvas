
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhasesTable from './PhasesTable';
import CurveChart from './CurveChart';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Phase } from '@/utils/curveUtils';

interface CurveEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedGlassInfo: any;
  phases: Phase[];
  updatePhase: (id: string, field: keyof Phase, value: number) => void;
  addPhase: () => void;
  removePhase: (id: string) => void;
  handleSave: () => void;
  ovenType?: string;
  setOvenType?: (type: string) => void;
  roomTemp?: number;
  templatePhases?: Phase[];
  isTemplateMode?: boolean;
}

const CurveEditorTabs = ({
  activeTab,
  setActiveTab,
  selectedGlassInfo,
  phases,
  updatePhase,
  addPhase,
  removePhase,
  handleSave,
  ovenType,
  setOvenType,
  roomTemp = 20,
  templatePhases = [],
  isTemplateMode = false
}: CurveEditorTabsProps) => {
  return (
    <div>
      <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="chart">Visual Curve</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="mt-0">
          <CurveChart 
            phases={phases}
            roomTemp={roomTemp}
            templatePhases={isTemplateMode ? [] : templatePhases}
          />
        </TabsContent>
        
        <TabsContent value="table" className="mt-0">
          <PhasesTable 
            phases={phases}
            updatePhase={updatePhase}
            addPhase={addPhase}
            removePhase={removePhase}
            handleSave={handleSave}
            ovenType={ovenType}
            setOvenType={setOvenType}
            selectedGlassInfo={selectedGlassInfo}
          />
        </TabsContent>
      </Tabs>

      {/* Save Changes Button */}
      <div className="mt-4">
        <Button 
          variant="default" 
          onClick={handleSave} 
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {isTemplateMode ? "Save Template Curve" : "Save Current Curve"}
        </Button>
      </div>
    </div>
  );
};

export default CurveEditorTabs;
