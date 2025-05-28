
import React from 'react';

interface VersionInfoDisplayProps {
  currentVersionName: string;
  selectedVersionColor: string;
}

const VersionInfoDisplay = ({
  currentVersionName,
  selectedVersionColor
}: VersionInfoDisplayProps) => {
  return (
    <div className="glass-card p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
      <div className="flex justify-between items-center">
        <div className="text-lg text-gray-700">
          Currently editing: <span className="font-bold text-2xl" style={{ color: selectedVersionColor }}>
            Version {currentVersionName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VersionInfoDisplay;
