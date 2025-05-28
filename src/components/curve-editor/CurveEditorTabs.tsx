
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurveChart from './CurveChart';
import CurveTableView from './CurveTableView';
import PhaseControls from './PhaseControls';
import ProjectDetailsTab from '@/components/ProjectDetailsTab';
import { Phase } from '@/utils/curveUtils';

interface CurveEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  phases: Phase[];
  templatePhases: Phase[];
  roomTemp: number;
  currentVersionName: string;
  onUpdatePhase: (id: string, field: keyof Phase, value: number) => void;
  onAddPhase: () => void;
  onRemovePhase: (id: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  materials: string;
  setMaterials: (materials: string) => void;
  tags: string;
  setTags: (tags: string) => void;
}

const CurveEditorTabs = ({
  activeTab,
  setActiveTab,
  phases,
  templatePhases,
  roomTemp,
  currentVersionName,
  onUpdatePhase,
  onAddPhase,
  onRemovePhase,
  notes,
  setNotes,
  materials,
  setMaterials,
  tags,
  setTags
}: CurveEditorTabsProps) => {
  return (
    <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6 p-2 bg-white/50">
          <TabsTrigger value="curve" className="flex-1 text-lg py-3">Curve View</TabsTrigger>
          <TabsTrigger value="table" className="flex-1 text-lg py-3">Table View</TabsTrigger>
          <TabsTrigger value="notes" className="flex-1 text-lg py-3">Notes & Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="curve" className="mt-6 space-y-6">
          <CurveChart 
            phases={phases}
            roomTemp={roomTemp}
            templatePhases={templatePhases}
          />
          
          <PhaseControls 
            phases={phases}
            onUpdatePhase={onUpdatePhase}
            onAddPhase={onAddPhase}
            onRemovePhase={onRemovePhase}
          />
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <CurveTableView 
            phases={phases}
            templatePhases={templatePhases}
            versionName={currentVersionName}
            isTemplateMode={false}
          />
        </TabsContent>
        
        <TabsContent value="notes" className="mt-6">
          <ProjectDetailsTab 
            notes={notes} 
            setNotes={setNotes}
            materials={materials}
            setMaterials={setMaterials}
            tags={tags}
            setTags={setTags}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurveEditorTabs;
