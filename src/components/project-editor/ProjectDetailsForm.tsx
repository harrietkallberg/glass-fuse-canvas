
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProjectDetailsFormProps {
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  projectDescription: string;
  setProjectDescription: (description: string) => void;
  isNewCurve: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const ProjectDetailsForm = ({
  projectTitle,
  setProjectTitle,
  projectDescription,
  setProjectDescription,
  isNewCurve,
  onTitleChange,
  onDescriptionChange
}: ProjectDetailsFormProps) => {
  return (
    <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
      <h3 className="text-xl font-semibold mb-4">Project Details</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="projectTitle">Project Name</Label>
          <Input
            id="projectTitle"
            value={projectTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter project name..."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="projectDescription">Project Description</Label>
          <Textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
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
  );
};

export default ProjectDetailsForm;
