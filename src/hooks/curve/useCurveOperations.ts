
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { CurveData } from '@/types/curve';

export const useCurveOperations = () => {
  const { user } = useAuth();

  const createCurve = async (title: string, description: string = '') => {
    if (!user) return null;

    const { data: curveData, error: curveError } = await supabase
      .from('curves')
      .insert({
        user_id: user.id,
        title,
        description,
      })
      .select()
      .single();

    if (curveError) {
      console.error('Error creating curve:', curveError);
      return null;
    }

    // Create initial version with numeric versioning
    const { data: versionData, error: versionError } = await supabase
      .from('curve_versions')
      .insert({
        curve_id: curveData.id,
        version_number: 10000, // 1.0 in numeric format
        name: 'Version 1.0',
        is_current: true,
      })
      .select()
      .single();

    if (versionError) {
      console.error('Error creating initial version:', versionError);
      return null;
    }

    return curveData;
  };

  const deleteCurve = async (curveId: string) => {
    if (!user) return false;

    try {
      // First delete all curve phases for this curve's versions
      const { data: versions } = await supabase
        .from('curve_versions')
        .select('id')
        .eq('curve_id', curveId);

      if (versions && versions.length > 0) {
        const versionIds = versions.map(v => v.id);
        
        // Delete all phases for these versions
        const { error: phasesError } = await supabase
          .from('curve_phases')
          .delete()
          .in('version_id', versionIds);

        if (phasesError) {
          console.error('Error deleting curve phases:', phasesError);
          return false;
        }
      }

      // Delete all versions for this curve
      const { error: versionsError } = await supabase
        .from('curve_versions')
        .delete()
        .eq('curve_id', curveId);

      if (versionsError) {
        console.error('Error deleting curve versions:', versionsError);
        return false;
      }

      // Finally delete the curve itself
      const { error: curveError } = await supabase
        .from('curves')
        .delete()
        .eq('id', curveId)
        .eq('user_id', user.id); // Ensure user can only delete their own curves

      if (curveError) {
        console.error('Error deleting curve:', curveError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCurve:', error);
      return false;
    }
  };

  const fetchCurves = async (): Promise<CurveData[]> => {
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('curves')
      .select('*')
      .eq('user_id', user.id) // Only fetch curves for the current user
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching curves:', error);
      return [];
    }

    return data || [];
  };

  return {
    createCurve,
    deleteCurve,
    fetchCurves,
  };
};
