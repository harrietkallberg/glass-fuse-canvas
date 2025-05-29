
import React from "react";
import { ArrowRight } from "lucide-react";

const VersionLegend = () => {
  return (
    <div className="mt-6 flex justify-center gap-8 text-sm">
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <div className="w-5 h-5 rounded bg-[#F97316] shadow-md"></div>
        <span className="text-gray-700 font-medium">Selected Version</span>
      </div>
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <div className="w-5 h-5 rounded bg-[#9CA3AF] shadow-md"></div>
        <span className="text-gray-700 font-medium">Template</span>
      </div>
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <div className="w-3 h-3 rounded bg-[#10B981] shadow-md"></div>
        <span className="text-gray-700 font-medium">Current Version</span>
      </div>
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <ArrowRight className="h-4 w-4 text-[#33C3F0]" />
        <span className="text-gray-700 font-medium">Version Progress</span>
      </div>
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <div className="w-3 h-3 border-2 border-gray-400 border-dashed rounded"></div>
        <span className="text-gray-700 font-medium">Draft Versions</span>
      </div>
    </div>
  );
};

export default VersionLegend;
