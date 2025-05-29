
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CurveList from "@/components/dashboard/CurveList";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateChartData } from "@/utils/curveUtils";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCurves, setFilteredCurves] = useState<any[]>([]);
  const [curves, setCurves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch all projects that have confirmed templates
  const fetchProjectsWithTemplates = async () => {
    if (!user) {
      setCurves([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching projects with confirmed templates for user:', user.id);
      
      // Get all curves that have a template version (version 0)
      const { data: curvesWithTemplates, error } = await supabase
        .from('curves')
        .select(`
          *,
          curve_versions!inner (
            id,
            selected_glass,
            oven_type,
            glass_layers,
            firing_type,
            room_temp,
            curve_phases (
              target_temp,
              duration,
              hold_time,
              phase_order
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('curve_versions.version_number', 0)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects with templates:', error);
        setCurves([]);
        setLoading(false);
        return;
      }

      console.log('Found projects with templates:', curvesWithTemplates);

      // Transform the data for display
      const transformedCurves = curvesWithTemplates.map(curve => {
        const templateVersion = curve.curve_versions[0];
        
        // Create real curve data from template phases
        let curveData = [];
        if (templateVersion?.curve_phases && templateVersion.curve_phases.length > 0) {
          // Sort phases by order and convert to Phase objects
          const sortedPhases = templateVersion.curve_phases
            .sort((a, b) => a.phase_order - b.phase_order)
            .map(phase => ({
              id: phase.phase_order.toString(),
              targetTemp: phase.target_temp,
              duration: phase.duration,
              holdTime: phase.hold_time
            }));

          // Generate real chart data using the curve utils
          const roomTemp = templateVersion.room_temp || 20;
          curveData = generateChartData(sortedPhases, roomTemp);
        } else {
          // Fallback to simple mock data if no phases
          curveData = [
            { time: 0, temperature: 20 },
            { time: 60, temperature: 540 },
            { time: 90, temperature: 800 },
            { time: 150, temperature: 520 },
            { time: 210, temperature: 460 },
            { time: 270, temperature: 20 }
          ];
        }

        return {
          id: curve.id,
          title: curve.title,
          description: curve.description,
          created_at: curve.created_at,
          updated_at: curve.updated_at,
          is_private: curve.is_private,
          glass_type: templateVersion?.selected_glass || 'Standard',
          oven_type: templateVersion?.oven_type === 't' ? 'Top Heated' : 
                    templateVersion?.oven_type === 's' ? 'Side Heated' : 'Electric',
          thickness: templateVersion?.glass_layers ? `${templateVersion.glass_layers} layers` : '6mm',
          project_type: templateVersion?.firing_type === 'f' ? 'Full Fuse' : 
                       templateVersion?.firing_type === 't' ? 'Tack Fuse' : 
                       templateVersion?.firing_type === 's' ? 'Slumping' : 'Full Fuse',
          curveData,
          colorClass: 'enhanced-glass-card'
        };
      });

      console.log('Transformed curves for dashboard:', transformedCurves);
      setCurves(transformedCurves);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setCurves([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchProjectsWithTemplates();
    } else {
      setCurves([]);
      setLoading(false);
    }
  }, [user]);

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
      curve.oven_type?.toLowerCase().includes(query) ||
      curve.thickness?.toLowerCase().includes(query) ||
      curve.project_type?.toLowerCase().includes(query)
    );
    
    setFilteredCurves(filtered);
  }, [searchQuery, curves]);

  const handleDeleteCurve = async (curveId: string) => {
    try {
      // Delete the curve and all its versions and phases (cascading)
      const { error } = await supabase
        .from('curves')
        .delete()
        .eq('id', curveId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting project:', error);
        toast({
          title: "Error",
          description: "Failed to delete the project. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Refresh the projects list
      await fetchProjectsWithTemplates();
      
      toast({
        title: "Project deleted",
        description: "The project has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (authLoading || loading) {
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
        
        <CurveList 
          curves={filteredCurves} 
          onDeleteCurve={handleDeleteCurve}
        />
      </div>
    </div>
  );
};

export default Dashboard;
