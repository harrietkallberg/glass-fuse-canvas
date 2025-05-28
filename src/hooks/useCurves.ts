import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Phase, calculateTotalTime } from '@/utils/curveUtils';

export interface CurveData {
  id: string;
  title: string;
  description: string;
  is_private: boolean;
  glass_type?: string;
  oven_type?: string;
  thickness?: string;
  project_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CurveVersion {
  id: string;
  curve_id: string;
  version_number: number;
  name: string;
  is_current: boolean;
  selected_glass?: string;
  room_temp?: number;
  glass_layers?: string;
  glass_radius?: string;
  firing_type?: string;
  top_temp_minutes?: string;
  oven_type?: string;
  total_time?: number;
  notes?: string;
  materials?: string;
  tags?: string;
  created_at: string;
}

export const useCurves = () => {
  const { user } = useAuth();
  const [curves, setCurves] = useState<CurveData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's curves
  const fetchCurves = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('curves')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching curves:', error);
    } else {
      setCurves(data || []);
    }
    setLoading(false);
  };

  // Create a new curve
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

    // Create initial version
    const { data: versionData, error: versionError } = await supabase
      .from('curve_versions')
      .insert({
        curve_id: curveData.id,
        version_number: 1,
        name: 'Version 1',
        is_current: true,
      })
      .select()
      .single();

    if (versionError) {
      console.error('Error creating initial version:', versionError);
      return null;
    }

    await fetchCurves();
    return curveData;
  };

  // Save curve version
  const saveCurveVersion = async (
    curveId: string,
    versionName: string,
    curveState: any,
    phases: Phase[]
  ) => {
    if (!user) return null;

    // Get next version number
    const { data: existingVersions } = await supabase
      .from('curve_versions')
      .select('version_number')
      .eq('curve_id', curveId)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersionNumber = existingVersions && existingVersions.length > 0 
      ? existingVersions[0].version_number + 1 
      : 1;

    // Create new version
    const { data: versionData, error: versionError } = await supabase
      .from('curve_versions')
      .insert({
        curve_id: curveId,
        version_number: nextVersionNumber,
        name: versionName,
        is_current: true,
        selected_glass: curveState.selectedGlass,
        room_temp: curveState.roomTemp,
        glass_layers: curveState.glassLayers,
        glass_radius: curveState.glassRadius,
        firing_type: curveState.firingType,
        top_temp_minutes: curveState.topTempMinutes,
        oven_type: curveState.ovenType,
        total_time: calculateTotalTime(phases),
        notes: curveState.notes || '',
        materials: curveState.materials || '',
        tags: curveState.tags || '',
      })
      .select()
      .single();

    if (versionError) {
      console.error('Error creating version:', versionError);
      return null;
    }

    // Save phases
    const phasesToInsert = phases.map((phase, index) => ({
      version_id: versionData.id,
      phase_order: index,
      target_temp: phase.targetTemp,
      duration: phase.duration,
      hold_time: phase.holdTime,
    }));

    const { error: phasesError } = await supabase
      .from('curve_phases')
      .insert(phasesToInsert);

    if (phasesError) {
      console.error('Error saving phases:', phasesError);
      return null;
    }

    return versionData;
  };

  // Load curve version with phases
  const loadCurveVersion = async (versionId: string) => {
    const { data: versionData, error: versionError } = await supabase
      .from('curve_versions')
      .select('*')
      .eq('id', versionId)
      .single();

    if (versionError) {
      console.error('Error loading version:', versionError);
      return null;
    }

    const { data: phasesData, error: phasesError } = await supabase
      .from('curve_phases')
      .select('*')
      .eq('version_id', versionId)
      .order('phase_order');

    if (phasesError) {
      console.error('Error loading phases:', phasesError);
      return null;
    }

    const phases: Phase[] = phasesData.map(phase => ({
      id: phase.id,
      targetTemp: phase.target_temp,
      duration: phase.duration,
      holdTime: phase.hold_time,
    }));

    return {
      version: versionData,
      phases,
    };
  };

  // Get versions for a curve
  const getCurveVersions = async (curveId: string) => {
    const { data, error } = await supabase
      .from('curve_versions')
      .select('*')
      .eq('curve_id', curveId)
      .order('version_number', { ascending: false });

    if (error) {
      console.error('Error fetching versions:', error);
      return [];
    }

    return data || [];
  };

  // Delete a curve and all its versions
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

      // Refresh the curves list
      await fetchCurves();
      return true;
    } catch (error) {
      console.error('Error in deleteCurve:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCurves();
    } else {
      setCurves([]);
      setLoading(false);
    }
  }, [user]);

  return {
    curves,
    loading,
    createCurve,
    deleteCurve,
    saveCurveVersion,
    loadCurveVersion,
    getCurveVersions,
    refetchCurves: fetchCurves,
  };
};
