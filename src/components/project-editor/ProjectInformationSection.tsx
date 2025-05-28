
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
  onCreateProject
}: ProjectInformationSectionProps) => {
  const [localCurveData, setLocalCurveData] = useState(templateCurveData);

  const handleSaveTemplate = (phases: Phase[]) => {
    const curveData = {
      phases,
      // Add other curve settings as needed
    };
    setLocalCurveData(curveData);
    setTemplateCurveData(curveData);
  };

  const handleCreateProject = () => {
    if (!projectTitle.trim()) {
      return;
    }
    onCreateProject(projectTitle, projectDescription, localCurveData);
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
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter project name..."
              disabled={!isNewCurve}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project..."
              disabled={!isNewCurve}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Template Curve Configuration */}
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Template Curve Configuration</h3>
          {!isNewCurve && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Read Only - Project Template
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          {isNewCurve 
            ? "Configure your base firing curve template. This will serve as the starting point for all versions."
            : "This is your project's base template curve. All versions are modifications of this template."
          }
        </div>
        
        <CurveEditor
          initialPhases={templateCurveData?.phases || defaultPhases}
          onSave={isNewCurve ? handleSaveTemplate : undefined}
        />
      </div>

      {/* Action Buttons */}
      {isNewCurve && (
        <div className="flex justify-end">
          <Button 
            onClick={handleCreateProject}
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-8 py-3 text-lg"
            disabled={!projectTitle.trim()}
          >
            Create Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectInformationSection;
