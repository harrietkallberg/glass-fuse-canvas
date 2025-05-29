
import React from "react";
import { Button } from "@/components/ui/button";

interface ProjectActionsProps {
  isNewCurve: boolean;
  hasChanges: boolean;
  projectTitle: string;
  onCreateProject: () => void;
  onUpdateProject: () => void;
}

const ProjectActions = ({
  isNewCurve,
  hasChanges,
  projectTitle,
  onCreateProject,
  onUpdateProject
}: ProjectActionsProps) => {
  return (
    <div className="flex justify-end">
      {isNewCurve ? (
        <Button 
          onClick={onCreateProject}
          className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-8 py-3 text-lg"
          disabled={!projectTitle.trim()}
        >
          Create Project
        </Button>
      ) : hasChanges && (
        <Button 
          onClick={onUpdateProject}
          className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-6 py-2"
        >
          Update Project Info
        </Button>
      )}
    </div>
  );
};

export default ProjectActions;
