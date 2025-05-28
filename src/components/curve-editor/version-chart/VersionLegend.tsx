
import React from "react";
import { Crown, ArrowRight } from "lucide-react";

const VersionLegend = () => {
  return (
    <div className="mt-6 flex justify-center gap-8 text-sm">
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <div className="w-5 h-5 rounded-full bg-[#F97316] shadow-md"></div>
        <span className="text-gray-700 font-medium">Selected</span>
      </div>
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <Crown className="h-4 w-4 text-yellow-500" />
        <span className="text-gray-700 font-medium">Current Version</span>
      </div>
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <ArrowRight className="h-4 w-4 text-[#33C3F0]" />
        <span className="text-gray-700 font-medium">Progress →</span>
      </div>
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FFB3D1] to-[#B3E5FF] shadow-md"></div>
        <span className="text-gray-700 font-medium">Draft Versions ↓</span>
      </div>
    </div>
  );
};

export default VersionLegend;
