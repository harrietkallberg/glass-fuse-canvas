
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useCurveOperations } from './curve/useCurveOperations';
import { useVersionOperations } from './curve/useVersionOperations';
import { useVersionUtils } from './curve/useVersionUtils';
import { CurveData } from '@/types/curve';

export const useCurves = () => {
  const { user } = useAuth();
  const [curves, setCurves] = useState<CurveData[]>([]);
  const [loading, setLoading] = useState(true);

  const { createCurve, deleteCurve, fetchCurves } = useCurveOperations();
  const { 
    saveCurveVersion, 
    loadCurveVersion, 
    getCurveVersions, 
    deleteUnwantedVersions,
    numberToSemantic, 
    semanticToNumber 
  } = useVersionOperations();
  const { getNextVersionNumber } = useVersionUtils();

  // Fetch user's curves - only real data from database
  const refetchCurves = async () => {
    if (!user) {
      setCurves([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await fetchCurves();
      setCurves(data);
    } catch (error) {
      console.error('Error fetching curves:', error);
      setCurves([]);
    }
    setLoading(false);
  };

  // New function to refresh versions for a specific curve
  const refetchCurveVersions = async (curveId: string) => {
    return await getCurveVersions(curveId);
  };

  // Enhanced delete with refresh
  const handleDeleteCurve = async (curveId: string) => {
    const success = await deleteCurve(curveId);
    if (success) {
      await refetchCurves();
    }
    return success;
  };

  useEffect(() => {
    if (user) {
      refetchCurves();
    } else {
      setCurves([]);
      setLoading(false);
    }
  }, [user]);

  return {
    curves,
    loading,
    createCurve,
    deleteCurve: handleDeleteCurve,
    saveCurveVersion,
    loadCurveVersion,
    getCurveVersions,
    deleteUnwantedVersions,
    refetchCurveVersions,
    refetchCurves,
    numberToSemantic,
    getNextVersionNumber,
  };
};

// Re-export types for backward compatibility
export type { CurveData, CurveVersion } from '@/types/curve';
