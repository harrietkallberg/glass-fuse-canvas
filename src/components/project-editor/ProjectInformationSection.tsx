
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import TemplateCurveEditor from "./TemplateCurveEditor";
import { Phase } from "@/utils/curveUtils";
import { useTemplateState, TemplateSettings } from "@/hooks/useTemplateState";

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

// Default template phases - these represent the "master recipe"
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
  const [hasChanges, setHasChanges] = useState(false);
  const [templateUnsavedChanges, setTemplateUnsavedChanges] = useState(false);
  
  const temperatureUnit = "celsius"; // Fixed to celsius only

  // Initialize template state
  const templateState = useTemplateState({
    curveId,
    initialTemplate: templateCurveData ? {
      phases: templateCurveData.phases || defaultPhases,
      settings: templateCurveData.settings || {}
    } : undefined
  });

  const handleSaveTemplate = async (phases: Phase[], settings: TemplateSettings) => {
    if (isNewCurve) {
      // For new curves, just store locally until project is created
      const curveData = {
        phases,
        settings,
        temperatureUnit,
      };
      setTemplateCurveData(curveData);
      setTemplateUnsavedChanges(false);
      
      toast({
        title: "Template configured!",
        description: "Your base firing curve template has been set up. Create the project to save it permanently.",
      });
    } else {
      // For existing curves, save to database
      const success = await templateState.saveTemplate(phases, settings);
      if (success) {
        const curveData = {
          phases,
          settings,
          temperatureUnit,
        };
        setTemplateCurveData(curveData);
        setTemplateUnsavedChanges(false);
        
        toast({
          title: "Template saved!",
          description: "Your project's base template has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save template changes",
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateProject = () => {
    if (!projectTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a project name",
        variant: "destructive"
      });
      return;
    }
    onCreateProject(projectTitle, projectDescription, { 
      phases: templateState.templatePhases,
      settings: templateState.templateSettings,
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

  const handleTemplateChange = () => {
    setTemplateUnsavedChanges(true);
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
          <div>
            <h3 className="text-xl font-semibold">Master Template Curve</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isNewCurve 
                ? "Configure your base firing curve template. This will serve as the starting point for all versions."
                : "This is your project's master template curve. This defines the project's core identity."
              }
            </p>
          </div>
          {!isNewCurve && (
            <div className="text-right">
              <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                Master Template
              </span>
              {templateUnsavedChanges && (
                <div className="text-xs text-orange-600 mt-1">Unsaved changes</div>
              )}
            </div>
          )}
        </div>
        
        <TemplateCurveEditor
          initialPhases={templateState.templatePhases}
          initialSettings={templateState.templateSettings}
          onSave={handleSaveTemplate}
          onChange={handleTemplateChange}
          isLoading={templateState.isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {isNewCurve ? (
          <Button 
            onClick={handleCreateProject}
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-8 py-3 text-lg"
            disabled={!projectTitle.trim()}
          >
            Create Project
          </Button>
        ) : (
          <>
            {hasChanges && (
              <Button 
                onClick={handleUpdateProject}
                variant="outline"
                className="px-6 py-2"
              >
                Update Project Info
              </Button>
            )}
            {templateUnsavedChanges && (
              <Button 
                onClick={() => handleSaveTemplate(templateState.templatePhases, templateState.templateSettings)}
                className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-6 py-2"
                disabled={templateState.isLoading}
              >
                {templateState.isLoading ? "Saving..." : "Save Template"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectInformationSection;
