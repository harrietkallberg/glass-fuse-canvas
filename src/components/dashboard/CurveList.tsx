import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CurveCard from "@/components/CurveCard";

interface CurveData {
  time: number;
  temperature: number;
}

interface Curve {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  isPrivate: boolean;
  glassType?: string;
  ovenType?: string;
  thickness?: string;
  projectType?: string;
  isModified?: boolean;
  curveData?: CurveData[];
  colorClass?: string;
}

interface CurveListProps {
  curves: Curve[];
  onDeleteCurve?: (id: string) => void;
}

const CurveList = ({ curves, onDeleteCurve }: CurveListProps) => {
  const navigate = useNavigate();

  const handleCreateCurve = () => {
    navigate("/create");
  };

  if (curves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#2A6B6B] to-[#4A9A9A] rounded-full flex items-center justify-center mb-4">
              <Plus className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#2A6B6B] mb-2">
              Welcome to GlassFuse Studio
            </h2>
            <p className="text-gray-600 mb-8">
              Start creating your first firing curve to begin your glass fusing journey.
            </p>
          </div>
          
          <Button 
            onClick={handleCreateCurve}
            size="lg"
            className="bg-[#2A6B6B] hover:bg-[#1F5555] text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Firing Curve
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            Design and save custom temperature curves for your glass projects
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {curves.map(curve => (
        <div key={curve.id} className="transform transition-all hover:scale-[1.02] hover:-translate-y-1 duration-300">
          <CurveCard
            id={curve.id}
            title={curve.title}
            description={curve.description}
            lastUpdated={curve.lastUpdated || new Date(curve.updated_at || curve.created_at).toLocaleDateString()}
            isPrivate={curve.isPrivate || curve.is_private}
            glassType={curve.glassType || curve.glass_type || "Standard"}
            ovenType={curve.ovenType || curve.oven_type || "Electric"}
            thickness={curve.thickness || "6mm"}
            projectType={curve.projectType || curve.project_type || "Full Fuse"}
            isModified={curve.isModified}
            curveData={curve.curveData}
            colorClass={`enhanced-glass-card ${curve.colorClass || ''}`}
            onDelete={onDeleteCurve}
          />
        </div>
      ))}
    </div>
  );
};

export default CurveList;
