import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCurves } from "@/hooks/useCurves";
import { toast } from "@/components/ui/use-toast";

interface UseProjectLoaderProps {
  id: string | undefined;
  isNewCurve: boolean;
  currentCurveId: string | null;
  setCurrentCurveId: (id: string | null) => void;
  setProjectTitle: (title: string) => void;
  setProjectDescription: (description: string) => void;
  setTemplateCurveData: (data: any) => void;
  setVersions: (versions: any[]) => void;
  setCurrentVersionId: (id: string) => void;
  setCurrentVersionData: (data: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectLoader = ({
  id,
  isNewCurve,
  currentCurveId,
  setCurrentCurveId,
  setProjectTitle,
  setProjectDescription,
  setTemplateCurveData,
  setVersions,
  setCurrentVersionId,
  setCurrentVersionData,
  setLoading
}: UseProjectLoaderProps) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { createCurve, loadCurveVersion, getCurveVersions } = useCurves();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Create project immediately for new curves
  useEffect(() => {
    const createProjectForNewCurve = async () => {
      if (isNewCurve && user && !currentCurveId) {
        try {
          const newCurve = await createCurve("New Project", "");
          if (newCurve) {
            setCurrentCurveId(newCurve.id);
            setProjectTitle("New Project");
            setProjectDescription("");
            
            // Update the URL without triggering a page reload
            window.history.replaceState({}, '', `/edit/${newCurve.id}`);
          }
        } catch (error) {
          console.error('Error creating project:', error);
        }
      }
    };

    createProjectForNewCurve();
  }, [isNewCurve, user, currentCurveId, createCurve]);

  // Load template data for existing project
  const loadTemplateData = async (curveId: string) => {
    try {
      console.log('Loading template data for curve:', curveId);
      
      // Try to get the template version (version 0.0)
      const { data: templateVersion, error } = await supabase
        .from('curve_versions')
        .select('*')
        .eq('curve_id', curveId)
        .eq('version_number', 0)
        .maybeSingle();

      if (error) {
        console.error('Error fetching template version:', error);
        setTemplateCurveData(null);
        return;
      }

      if (templateVersion) {
        console.log('Found template version:', templateVersion);
        
        // Get template phases
        const { data: phases, error: phasesError } = await supabase
          .from('curve_phases')
          .select('*')
          .eq('version_id', templateVersion.id)
          .order('phase_order');

        if (phasesError) {
          console.error('Error fetching template phases:', phasesError);
          setTemplateCurveData(null);
          return;
        }

        // Convert database phases to our format
        const templatePhases = phases?.map(phase => ({
          id: phase.id,
          targetTemp: phase.target_temp,
          duration: phase.duration,
          holdTime: phase.hold_time
        })) || [];

        // Create complete template data with settings
        const completeTemplateData = {
          phases: templatePhases,
          settings: {
            selectedGlass: templateVersion.selected_glass || '',
            roomTemp: templateVersion.room_temp || 20,
            glassLayers: templateVersion.glass_layers || '1',
            glassRadius: templateVersion.glass_radius || '10',
            firingType: templateVersion.firing_type || 'f',
            topTempMinutes: templateVersion.top_temp_minutes || '10',
            ovenType: templateVersion.oven_type || 't',
          }
        };

        console.log('Loaded complete template data:', completeTemplateData);
        setTemplateCurveData(completeTemplateData);
      } else {
        console.log('No template version found');
        // No template exists, set to null to show default state
        setTemplateCurveData(null);
      }
    } catch (error) {
      console.error('Error loading template data:', error);
      setTemplateCurveData(null);
    }
  };

  // Load existing curve if editing
  useEffect(() => {
    const loadCurve = async () => {
      if (!isNewCurve && id && user) {
        console.log('Loading existing curve:', id);
        setLoading(true);
        
        try {
          // First get the curve info to get the project title and description
          const { data: curveInfo, error: curveError } = await supabase
            .from('curves')
            .select('title, description')
            .eq('id', id)
            .single();

          if (curveError) {
            console.error('Error fetching curve info:', curveError);
            setLoading(false);
            return;
          }

          if (curveInfo) {
            setProjectTitle(curveInfo.title);
            setProjectDescription(curveInfo.description || '');
            setCurrentCurveId(id);
          }

          // Load template data first
          await loadTemplateData(id);
          
          // Then load versions and current version data
          const versionsList = await getCurveVersions(id);
          const currentVersion = versionsList.find(v => v.is_current) || versionsList[0];
          
          if (currentVersion) {
            const curveData = await loadCurveVersion(currentVersion.id);
            if (curveData) {
              setCurrentVersionId(currentVersion.id);
              setVersions(versionsList);
              setCurrentVersionData(curveData);
            }
          }
        } catch (error) {
          console.error('Error loading curve:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCurve();
  }, [id, isNewCurve, user]);

  const handleUpdateProject = async (title: string, description: string) => {
    if (!currentCurveId || !user) return;

    try {
      const { error } = await supabase
        .from('curves')
        .update({ 
          title, 
          description,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCurveId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating project:', error);
        toast({
          title: "Error",
          description: "Failed to update project information",
          variant: "destructive"
        });
        return;
      }

      setProjectTitle(title);
      setProjectDescription(description);
      
      toast({
        title: "Project updated!",
        description: "Project information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project information",
        variant: "destructive"
      });
    }
  };

  return {
    authLoading,
    handleUpdateProject
  };
};
