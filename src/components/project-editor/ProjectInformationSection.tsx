
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CurveEditor from "@/components/curve-editor/CurveEditor";
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
  curveId?: string;
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
  onUpdateProject,
  curveId
}: ProjectInformationSectionProps) => {
  const [localCurveData, setLocalCurveData] = useState(templateCurveData);
  const [hasChanges, setHasChanges] = useState(false);
  const temperatureUnit = "celsius"; // Fixed to celsius only

  const handleSaveTemplate = async (phases: Phase[]) => {
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
            <div className="mt-1 p-2 bg-gray-50 rounded-md border">
              <span className="text-sm text-gray-600">Celsius (°C)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Template Curve Configuration */}
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Project Template Configuration</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Project Template
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-6">
          {isNewCurve 
            ? "Configure your base project template. This will serve as the starting point for all versions and defines your project's identity."
            : "This is your project's template curve. Changes here affect the project template and will be reflected in the version chart."
          }
        </div>
        
        <CurveEditor
          initialPhases={templateCurveData?.phases || defaultPhases}
          onSave={handleSaveTemplate}
          isTemplateMode={true}
        />
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
