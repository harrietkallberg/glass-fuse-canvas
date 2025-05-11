
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CurveList from "@/components/dashboard/CurveList";
import { mockCurves, Curve } from "@/data/mockCurves";

const Dashboard = () => {
  // Add search state and filtered curves
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCurves, setFilteredCurves] = useState<Curve[]>(mockCurves);

  // Filter curves based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCurves(mockCurves);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = mockCurves.filter(curve => 
      curve.title.toLowerCase().includes(query) ||
      curve.description.toLowerCase().includes(query) ||
      curve.glassType?.toLowerCase().includes(query) ||
      (typeof curve.ovenType === 'string' && 
        (curve.ovenType.toLowerCase().includes(query) || 
         (curve.ovenType === 't' && 'top heated'.includes(query)) ||
         (curve.ovenType === 's' && 'side heated'.includes(query)))) ||
      curve.thickness?.toLowerCase().includes(query) ||
      curve.projectType?.toLowerCase().includes(query)
    );
    
    setFilteredCurves(filtered);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#e2d1c3] overflow-hidden">
      <Navigation />
      
      <div className="container mx-auto pt-24 px-4 relative z-10">
        <DashboardHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <CurveList curves={filteredCurves} />
      </div>
    </div>
  );
};

export default Dashboard;
