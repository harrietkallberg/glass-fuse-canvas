
import React from "react";
import { Button } from "@/components/ui/button";

interface ProjectActionsProps {
  isNewCurve: boolean;
  hasChanges: boolean;
  projectTitle: string;
  onUpdateProject: () => void;
}

const ProjectActions = ({
  isNewCurve,
  hasChanges,
  projectTitle,
  onUpdateProject
}: ProjectActionsProps) => {
  // Only show update button for existing projects with changes
  if (isNewCurve || !hasChanges) {
    return null;
  }

  return (
    <div className="flex justify-end">
      <Button 
        onClick={onUpdateProject}
        className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-6 py-2"
      >
        Update Project Info
      </Button>
    </div>
  );
};

export default ProjectActions;
