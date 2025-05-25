
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CurveList from "@/components/dashboard/CurveList";
import { useAuth } from "@/hooks/useAuth";
import { useCurves } from "@/hooks/useCurves";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { curves, loading: curvesLoading } = useCurves();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCurves, setFilteredCurves] = useState<any[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Filter curves based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCurves(curves);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = curves.filter(curve => 
      curve.title.toLowerCase().includes(query) ||
      curve.description?.toLowerCase().includes(query) ||
      curve.glass_type?.toLowerCase().includes(query) ||
      (typeof curve.oven_type === 'string' && 
        (curve.oven_type.toLowerCase().includes(query) || 
         (curve.oven_type === 't' && 'top heated'.includes(query)) ||
         (curve.oven_type === 's' && 'side heated'.includes(query)))) ||
      curve.thickness?.toLowerCase().includes(query) ||
      curve.project_type?.toLowerCase().includes(query)
    );
    
    setFilteredCurves(filtered);
  }, [searchQuery, curves]);

  if (authLoading || curvesLoading) {
    return (
      <div className="min-h-screen bg-[#d1c0b3] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d1c0b3] overflow-hidden">
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
