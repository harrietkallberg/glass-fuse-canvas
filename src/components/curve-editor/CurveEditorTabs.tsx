
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhasesTable from './PhasesTable';
import CurveChart from './CurveChart';
import { Phase } from '@/utils/curveUtils';

interface CurveEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chartData: any[];
  selectedGlassInfo: any;
  phases: Phase[];
  updatePhase: (id: string, field: keyof Phase, value: number) => void;
  addPhase: () => void;
  removePhase: (id: string) => void;
  handleSave: () => void;
}

const CurveEditorTabs = ({
  activeTab,
  setActiveTab,
  chartData,
  selectedGlassInfo,
  phases,
  updatePhase,
  addPhase,
  removePhase,
  handleSave
}: CurveEditorTabsProps) => {
  return (
    <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="chart">Visual Curve</TabsTrigger>
        <TabsTrigger value="table">Table View</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart" className="mt-0">
        <CurveChart chartData={chartData} selectedGlassInfo={selectedGlassInfo} />
      </TabsContent>
      
      <TabsContent value="table" className="mt-0">
        <PhasesTable 
          phases={phases}
          updatePhase={updatePhase}
          addPhase={addPhase}
          removePhase={removePhase}
          handleSave={handleSave}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CurveEditorTabs;
