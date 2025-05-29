
import React from "react";

interface ProjectHeaderProps {
  projectTitle: string;
  projectDescription: string;
}

const ProjectHeader = ({ projectTitle, projectDescription }: ProjectHeaderProps) => {
  return (
    <div className="glass-card p-8 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl mb-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          {projectTitle || "New Project"}
        </h1>
        {projectDescription && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{projectDescription}</p>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
