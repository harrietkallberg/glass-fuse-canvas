
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurveEditor from "@/components/curve-editor/CurveEditor";
import CurveChart from "@/components/curve-editor/CurveChart";
import CurveTableView from "@/components/curve-editor/CurveTableView";
import { Phase } from "@/utils/curveUtils";

interface ProjectInformationSectionProps {
  isNewCurve: boolean;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  projectDescription: string;
  setProjectDescription: (description: string) => void;
  templateCurveData: any;
  setTemplateCurveData: (data: any) => void;
  onCreateProject: (title: string, description: string, curveData: any) => void;
  onUpdateProject?: (title: string, description: string) => void;
}

// Default template phases
const defaultPhases: Phase[] = [
  { id: "1", targetTemp: 540, duration: 60, holdTime: 0 },
  { id: "2", targetTemp: 800, duration: 30, holdTime: 10 },
  { id: "3", targetTemp: 520, duration: 60, holdTime: 30 },
  { id: "4", targetTemp: 460, duration: 60, holdTime: 0 },
  { id: "5", targetTemp: 20, duration: 60, holdTime: 0 }
];

const ProjectInformationSection = ({
  isNewCurve,
  projectTitle,
  setProjectTitle,
  projectDescription,
  setProjectDescription,
  templateCurveData,
  setTemplateCurveData,
  onCreateProject,
  onUpdateProject
}: ProjectInformationSectionProps) => {
  const [localCurveData, setLocalCurveData] = useState(templateCurveData);
  const [hasChanges, setHasChanges] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const [activeTab, setActiveTab] = useState("curve");

  const handleSaveTemplate = (phases: Phase[]) => {
    const curveData = {
      phases,
      temperatureUnit,
    };
    setLocalCurveData(curveData);
    setTemplateCurveData(curveData);
  };

  const handleCreateProject = () => {
    if (!projectTitle.trim()) {
      return;
    }
    onCreateProject(projectTitle, projectDescription, { 
      ...localCurveData, 
      temperatureUnit
    });
  };

  const handleUpdateProject = () => {
    if (onUpdateProject) {
      onUpdateProject(projectTitle, projectDescription);
      setHasChanges(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setProjectTitle(value);
    if (!isNewCurve) setHasChanges(true);
  };

  const handleDescriptionChange = (value: string) => {
    setProjectDescription(value);
    if (!isNewCurve) setHasChanges(true);
  };

  const handleTemperatureUnitChange = (value: "celsius" | "fahrenheit") => {
    setTemperatureUnit(value);
    if (!isNewCurve) setHasChanges(true);
  };

  return (
    <div className="space-y-8">
      {/* Project Details */}
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <h3 className="text-xl font-semibold mb-4">Project Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectTitle">Project Name</Label>
            <Input
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter project name..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Describe your project..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="temperatureUnit">Temperature Unit</Label>
            <Select value={temperatureUnit} onValueChange={handleTemperatureUnitChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Template Curve Configuration */}
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Template Curve Configuration</h3>
          {!isNewCurve && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Project Template
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          {isNewCurve 
            ? "Configure your base firing curve template. This will serve as the starting point for all versions."
            : "This is your project's base template curve. Changes here affect the project identity."
          }
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 p-2 bg-white/50">
            <TabsTrigger value="curve" className="flex-1 text-lg py-3">Curve View</TabsTrigger>
            <TabsTrigger value="table" className="flex-1 text-lg py-3">Table View</TabsTrigger>
            <TabsTrigger value="editor" className="flex-1 text-lg py-3">Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curve" className="mt-6">
            <CurveChart 
              phases={templateCurveData?.phases || defaultPhases}
              roomTemp={20}
            />
          </TabsContent>
          
          <TabsContent value="table" className="mt-6">
            <CurveTableView 
              phases={templateCurveData?.phases || defaultPhases}
              isTemplateMode={true}
            />
          </TabsContent>
          
          <TabsContent value="editor" className="mt-6">
            <CurveEditor
              initialPhases={templateCurveData?.phases || defaultPhases}
              onSave={isNewCurve ? handleSaveTemplate : undefined}
              isTemplateMode={true}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        {isNewCurve ? (
          <Button 
            onClick={handleCreateProject}
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-8 py-3 text-lg"
            disabled={!projectTitle.trim()}
          >
            Create Project
          </Button>
        ) : hasChanges && (
          <Button 
            onClick={handleUpdateProject}
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-6 py-2"
          >
            Update Project Info
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectInformationSection;
