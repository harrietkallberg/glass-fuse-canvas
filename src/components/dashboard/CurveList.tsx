
import React from "react";
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
}

const CurveList = ({ curves }: CurveListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {curves.length > 0 ? (
        curves.map(curve => (
          <div key={curve.id} className="transform transition-all hover:scale-[1.02] hover:-translate-y-1 duration-300">
            <CurveCard
              id={curve.id}
              title={curve.title}
              description={curve.description}
              lastUpdated={curve.lastUpdated}
              isPrivate={curve.isPrivate}
              glassType={curve.glassType}
              ovenType={curve.ovenType}
              thickness={curve.thickness}
              projectType={curve.projectType}
              isModified={curve.isModified}
              curveData={curve.curveData}
              colorClass={`enhanced-glass-card ${curve.colorClass || ''}`}
            />
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-foreground text-lg">No curves match your search. Try using different keywords.</p>
        </div>
      )}
    </div>
  );
};

export default CurveList;
